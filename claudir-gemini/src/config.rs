use anyhow::{Context, Result};
use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub telegram_token: String,
    pub gemini_api_key: String,
    pub owner_ids: Vec<u64>,
    pub allowed_groups: Vec<i64>,
    pub db_path: String,
    pub bot_name: String,
    pub system_prompt: String,
    pub dm_rate_limit: u32,
    pub max_strikes: u32,
    pub memory_dir: String,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        Ok(Self {
            telegram_token: env::var("TELEGRAM_TOKEN")
                .context("TELEGRAM_TOKEN env o'rnatilmagan")?,

            gemini_api_key: env::var("GEMINI_API_KEY")
                .context("GEMINI_API_KEY env o'rnatilmagan")?,

            owner_ids: env::var("OWNER_IDS")
                .unwrap_or_default()
                .split(',')
                .filter_map(|s| s.trim().parse().ok())
                .collect(),

            allowed_groups: env::var("ALLOWED_GROUPS")
                .unwrap_or_default()
                .split(',')
                .filter_map(|s| s.trim().parse().ok())
                .collect(),

            db_path: env::var("DB_PATH")
                .unwrap_or_else(|_| "data/bot.db".to_string()),

            bot_name: env::var("BOT_NAME")
                .unwrap_or_else(|_| "Gemira".to_string()),

            system_prompt: env::var("SYSTEM_PROMPT").unwrap_or_else(|_|
                "Sen aqlli va do'stona Telegram botisan. \
                 O'zbek, Rus va Ingliz tillarini bilasan. \
                 Qisqa, aniq va foydali javob ber. \
                 Emoji ishlatishdan qo'rqma, lekin oshirib yuborma.".to_string()
            ),

            dm_rate_limit: env::var("DM_RATE_LIMIT")
                .unwrap_or_else(|_| "20".to_string())
                .parse()
                .unwrap_or(20),

            max_strikes: env::var("MAX_STRIKES")
                .unwrap_or_else(|_| "3".to_string())
                .parse()
                .unwrap_or(3),

            memory_dir: env::var("MEMORY_DIR")
                .unwrap_or_else(|_| "data/memories".to_string()),
        })
    }
}
