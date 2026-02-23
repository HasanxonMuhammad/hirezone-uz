mod gemini;
mod db;
mod memory;
mod spam;
mod config;

use anyhow::Result;
use std::sync::Arc;
use teloxide::{
    prelude::*,
    types::{Message, MediaKind, MessageKind},
};
use tracing::{info, error, warn};

use crate::config::Config;
use crate::db::Database;
use crate::gemini::GeminiClient;
use crate::memory::MemoryStore;
use crate::spam::SpamFilter;

#[derive(Clone)]
pub struct AppState {
    pub config: Arc<Config>,
    pub db: Arc<Database>,
    pub gemini: Arc<GeminiClient>,
    pub memory: Arc<MemoryStore>,
    pub spam: Arc<SpamFilter>,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Load .env
    dotenv::dotenv().ok();

    // Init logging
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env()
                .add_directive("claudir_gemini=info".parse()?)
        )
        .init();

    info!("🤖 Claudir-Gemini bot ishga tushmoqda...");

    let config = Arc::new(Config::from_env()?);
    let db = Arc::new(Database::new(&config.db_path).await?);
    let gemini = Arc::new(GeminiClient::new(config.gemini_api_key.clone()));
    let memory = Arc::new(MemoryStore::new(db.clone()));
    let spam = Arc::new(SpamFilter::new(gemini.clone(), config.clone()));

    let state = AppState { config: config.clone(), db, gemini, memory, spam };

    let bot = Bot::new(&config.telegram_token);

    info!("✅ Bot tayyor! Xabarlar kutilmoqda...");

    let handler = dptree::entry()
        .branch(Update::filter_message().endpoint(handle_message));

    Dispatcher::builder(bot, handler)
        .dependencies(dptree::deps![state])
        .enable_ctrlc_handler()
        .build()
        .dispatch()
        .await;

    Ok(())
}

async fn handle_message(
    bot: Bot,
    msg: Message,
    state: AppState,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let chat_id = msg.chat.id;
    let user = match msg.from() {
        Some(u) => u.clone(),
        None => return Ok(()),
    };

    let is_owner = state.config.owner_ids.contains(&user.id.0);
    let is_private = msg.chat.is_private();
    let is_group = msg.chat.is_group() || msg.chat.is_supergroup();

    // Owner commands
    if let Some(text) = msg.text() {
        if is_owner {
            match text {
                "/status" => {
                    let stats = state.db.get_stats().await?;
                    bot.send_message(chat_id, format!(
                        "📊 *Bot holati*\n\n\
                        💬 Jami xabarlar: {}\n\
                        👥 Foydalanuvchilar: {}\n\
                        🧠 Xotiralar: {}\n\
                        🚫 Spam bloklangan: {}",
                        stats.total_messages, stats.total_users,
                        stats.total_memories, stats.spam_blocked
                    )).parse_mode(teloxide::types::ParseMode::Markdown).await?;
                    return Ok(());
                }
                "/clear_memory" => {
                    state.memory.clear_all(chat_id.0).await?;
                    bot.send_message(chat_id, "🗑️ Xotira tozalandi.").await?;
                    return Ok(());
                }
                _ => {}
            }
        }
    }

    // Guruh uchun allowed_groups tekshiruvi
    if is_group {
        let allowed = state.config.allowed_groups.is_empty()
            || state.config.allowed_groups.contains(&chat_id.0);
        if !allowed {
            return Ok(());
        }
    }

    // DM uchun rate limit
    if is_private && !is_owner {
        let count = state.db.get_dm_count_this_hour(user.id.0).await?;
        if count >= state.config.dm_rate_limit {
            bot.send_message(chat_id,
                "⏳ Soatlik limit to'ldi. Keyinroq urinib ko'ring.").await?;
            return Ok(());
        }
    }

    // Rasm bilan xabar
    if let MessageKind::Common(ref common) = msg.kind {
        if let MediaKind::Photo(ref photos) = common.media_kind {
            return handle_photo(&bot, &msg, &state, photos).await;
        }
        if let MediaKind::Voice(ref voice) = common.media_kind {
            return handle_voice_note(&bot, &msg, &state, voice).await;
        }
    }

    // Matnli xabar
    let text = match msg.text() {
        Some(t) if !t.is_empty() => t.to_string(),
        _ => return Ok(()),
    };

    // Guruhda faqat mention yoki reply bo'lsa javob ber
    if is_group && !is_owner {
        let bot_info = bot.get_me().await?;
        let bot_username = bot_info.username();
        let mentioned = text.contains(&format!("@{}", bot_username));
        let replied_to_bot = msg.reply_to_message()
            .and_then(|r| r.from())
            .map(|u| u.is_bot && u.username.as_deref() == Some(bot_username))
            .unwrap_or(false);

        if !mentioned && !replied_to_bot {
            // Spam tekshiruvi (guruhda barcha xabarlar uchun)
            let spam_check = state.spam.check(&text, user.id.0).await?;
            if spam_check.is_spam {
                let strikes = state.db.add_strike(user.id.0).await?;
                bot.delete_message(chat_id, msg.id).await.ok();
                if strikes >= state.config.max_strikes {
                    bot.ban_chat_member(chat_id, user.id).await.ok();
                    info!("🚫 Foydalanuvchi ban qilindi: {}", user.id.0);
                }
                return Ok(());
            }
            return Ok(());
        }
    }

    // Guruhda spam tekshiruvi (bot uchun murojaat qilingan xabarlarda ham)
    if is_group && !is_owner {
        let spam_check = state.spam.check(&text, user.id.0).await?;
        if spam_check.is_spam {
            let strikes = state.db.add_strike(user.id.0).await?;
            bot.delete_message(chat_id, msg.id).await.ok();
            warn!("🚫 Spam aniqlandi (strike: {}): {}", strikes, user.id.0);
            if strikes >= state.config.max_strikes {
                bot.ban_chat_member(chat_id, user.id).await.ok();
            }
            return Ok(());
        }
    }

    // Xabarni DBga saqlash
    state.db.save_message(
        chat_id.0, msg.id.0, user.id.0,
        user.username.as_deref().unwrap_or(""),
        user.first_name.as_str(), &text
    ).await?;

    // Bot yozmoqda...
    bot.send_chat_action(chat_id, teloxide::types::ChatAction::Typing).await.ok();

    // Xotiradan kontekst olish
    let memories = state.memory.get_relevant(chat_id.0, user.id.0, &text).await?;
    let recent_history = state.db.get_recent_messages(chat_id.0, 10).await?;

    // Gemini'ga yuborish
    let user_name = user.first_name.clone();
    let response = state.gemini.chat(
        &text, &user_name, &memories, &recent_history, is_private
    ).await?;

    // Javobni saqlash
    state.db.save_message(
        chat_id.0, msg.id.0 + 1, 0, "bot", "Bot", &response
    ).await?;

    // Xotirani yangilash (muhim ma'lumotlarni avtomatik saqlash)
    state.memory.maybe_save(&text, &response, chat_id.0, user.id.0).await?;

    // DM hisoblagichini yangilash
    if is_private {
        state.db.increment_dm_count(user.id.0).await?;
    }

    // Javob yuborish
    bot.send_message(chat_id, &response)
        .reply_to_message_id(msg.id)
        .await?;

    Ok(())
}

async fn handle_photo(
    bot: &Bot,
    msg: &Message,
    state: &AppState,
    photos: &teloxide::types::MediaPhoto,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let chat_id = msg.chat.id;
    let user = match msg.from() {
        Some(u) => u.clone(),
        None => return Ok(()),
    };

    bot.send_chat_action(chat_id, teloxide::types::ChatAction::Typing).await.ok();

    // Eng katta rasmni olish
    let photo = match photos.photo.last() {
        Some(p) => p,
        None => return Ok(()),
    };

    // Faylni yuklab olish
    let file = bot.get_file(&photo.file.id).await?;
    let url = format!(
        "https://api.telegram.org/file/bot{}/{}",
        state.config.telegram_token, file.path
    );

    let image_data = reqwest::get(&url).await?.bytes().await?;
    let caption = msg.caption().unwrap_or("Bu rasmda nima bor?");

    let response = state.gemini.vision(
        &image_data,
        caption,
        &user.first_name
    ).await?;

    bot.send_message(chat_id, &response)
        .reply_to_message_id(msg.id)
        .await?;

    Ok(())
}

async fn handle_voice_note(
    bot: &Bot,
    msg: &Message,
    state: &AppState,
    voice: &teloxide::types::MediaVoice,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let chat_id = msg.chat.id;

    bot.send_chat_action(chat_id, teloxide::types::ChatAction::Typing).await.ok();

    // Ovozni yuklab olish
    let file = bot.get_file(&voice.voice.file.id).await?;
    let url = format!(
        "https://api.telegram.org/file/bot{}/{}",
        state.config.telegram_token, file.path
    );

    let audio_data = reqwest::get(&url).await?.bytes().await?;

    // Gemini bilan transcribe + javob
    let response = state.gemini.transcribe_and_respond(&audio_data).await?;

    bot.send_message(chat_id, &response)
        .reply_to_message_id(msg.id)
        .await?;

    Ok(())
}
