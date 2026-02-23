use anyhow::Result;
use std::sync::Arc;
use tokio_rusqlite::Connection;
use tracing::debug;

use crate::db::Database;

pub struct MemoryStore {
    db: Arc<Database>,
}

impl MemoryStore {
    pub fn new(db: Arc<Database>) -> Self {
        Self { db }
    }

    /// Foydalanuvchiga tegishli xotiralarni qaytarish
    pub async fn get_relevant(&self, chat_id: i64, user_id: u64, _query: &str) -> Result<Vec<String>> {
        let db = self.db.clone();
        let memories = db.conn.call(move |conn| {
            let mut stmt = conn.prepare(
                "SELECT key, value FROM memories
                 WHERE chat_id = ?1 AND (user_id = ?2 OR user_id = 0)
                 ORDER BY created_at DESC
                 LIMIT 10"
            )?;

            let rows: Vec<String> = stmt.query_map(
                rusqlite::params![chat_id, user_id as i64],
                |row| {
                    let key: String = row.get(0)?;
                    let val: String = row.get(1)?;
                    Ok(format!("{}: {}", key, val))
                },
            )?.filter_map(|r| r.ok()).collect();

            Ok(rows)
        }).await?;
        Ok(memories)
    }

    /// Xotira saqlash
    pub async fn save(&self, chat_id: i64, user_id: u64, key: &str, value: &str) -> Result<()> {
        let key = key.to_string();
        let value = value.to_string();
        self.db.conn.call(move |conn| {
            conn.execute(
                "INSERT INTO memories (chat_id, user_id, key, value)
                 VALUES (?1, ?2, ?3, ?4)
                 ON CONFLICT(chat_id, user_id, key) DO UPDATE SET
                   value = ?4,
                   created_at = datetime('now')",
                rusqlite::params![chat_id, user_id as i64, key, value],
            )?;
            Ok(())
        }).await?;
        Ok(())
    }

    /// Muhim ma'lumotlarni avtomatik saqlash (heuristic)
    pub async fn maybe_save(
        &self,
        user_msg: &str,
        _bot_reply: &str,
        chat_id: i64,
        user_id: u64,
    ) -> Result<()> {
        // Foydalanuvchi o'zini tanishtirsa
        let lower = user_msg.to_lowercase();

        if lower.contains("mening ismim") || lower.contains("men ") && lower.contains("man") {
            // Ismni olishga harakat qilish
            if let Some(name) = extract_name(user_msg) {
                self.save(chat_id, user_id, "ism", &name).await?;
                debug!("Xotira saqlandi: ism = {}", name);
            }
        }

        if lower.contains("menda") || lower.contains("menga") {
            if lower.contains("allergiya") {
                self.save(chat_id, user_id, "allergiya_eslatmasi",
                    &user_msg[..user_msg.len().min(200)]).await?;
            }
        }

        Ok(())
    }

    /// Barcha xotiralarni o'chirish
    pub async fn clear_all(&self, chat_id: i64) -> Result<()> {
        self.db.conn.call(move |conn| {
            conn.execute(
                "DELETE FROM memories WHERE chat_id = ?1",
                rusqlite::params![chat_id],
            )?;
            Ok(())
        }).await?;
        Ok(())
    }
}

fn extract_name(text: &str) -> Option<String> {
    let patterns = [
        "mening ismim ",
        "ismim ",
        "men ",
        "my name is ",
        "i am ",
        "i'm ",
        "меня зовут ",
        "я ",
    ];

    let lower = text.to_lowercase();
    for pat in &patterns {
        if let Some(pos) = lower.find(pat) {
            let rest = &text[pos + pat.len()..];
            let name: String = rest
                .split_whitespace()
                .next()
                .unwrap_or("")
                .trim_matches(|c: char| !c.is_alphabetic())
                .to_string();
            if name.len() > 1 {
                return Some(name);
            }
        }
    }
    None
}
