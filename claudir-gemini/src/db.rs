use anyhow::Result;
use std::sync::Arc;
use tokio_rusqlite::Connection;
use tracing::info;

use crate::gemini::HistoryMessage;

pub struct Stats {
    pub total_messages: u64,
    pub total_users: u64,
    pub total_memories: u64,
    pub spam_blocked: u64,
}

#[derive(Clone)]
pub struct Database {
    conn: Arc<Connection>,
}

impl Database {
    pub async fn new(path: &str) -> Result<Self> {
        // Data papkasini yaratish
        if let Some(parent) = std::path::Path::new(path).parent() {
            tokio::fs::create_dir_all(parent).await?;
        }

        let conn = Connection::open(path).await?;

        let db = Self { conn: Arc::new(conn) };
        db.init_schema().await?;

        info!("✅ Database tayyor: {}", path);
        Ok(db)
    }

    async fn init_schema(&self) -> Result<()> {
        self.conn.call(|conn| {
            conn.execute_batch("
                PRAGMA journal_mode=WAL;
                PRAGMA synchronous=NORMAL;

                CREATE TABLE IF NOT EXISTS messages (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    chat_id     INTEGER NOT NULL,
                    message_id  INTEGER NOT NULL,
                    user_id     INTEGER NOT NULL,
                    username    TEXT NOT NULL DEFAULT '',
                    first_name  TEXT NOT NULL DEFAULT '',
                    text        TEXT NOT NULL,
                    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
                );
                CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id, created_at);

                CREATE TABLE IF NOT EXISTS memories (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    chat_id     INTEGER NOT NULL,
                    user_id     INTEGER NOT NULL,
                    key         TEXT NOT NULL,
                    value       TEXT NOT NULL,
                    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
                    UNIQUE(chat_id, user_id, key)
                );

                CREATE TABLE IF NOT EXISTS strikes (
                    user_id     INTEGER PRIMARY KEY,
                    count       INTEGER NOT NULL DEFAULT 0,
                    last_strike TEXT
                );

                CREATE TABLE IF NOT EXISTS dm_counts (
                    user_id     INTEGER NOT NULL,
                    hour        TEXT NOT NULL,
                    count       INTEGER NOT NULL DEFAULT 0,
                    PRIMARY KEY (user_id, hour)
                );

                CREATE TABLE IF NOT EXISTS spam_log (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id     INTEGER NOT NULL,
                    text        TEXT NOT NULL,
                    detected_at TEXT NOT NULL DEFAULT (datetime('now'))
                );
            ")?;
            Ok(())
        }).await?;
        Ok(())
    }

    pub async fn save_message(
        &self,
        chat_id: i64,
        message_id: i32,
        user_id: u64,
        username: &str,
        first_name: &str,
        text: &str,
    ) -> Result<()> {
        let username = username.to_string();
        let first_name = first_name.to_string();
        let text = text.to_string();

        self.conn.call(move |conn| {
            conn.execute(
                "INSERT OR REPLACE INTO messages
                 (chat_id, message_id, user_id, username, first_name, text)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                rusqlite::params![
                    chat_id, message_id, user_id as i64,
                    username, first_name, text
                ],
            )?;
            Ok(())
        }).await?;
        Ok(())
    }

    pub async fn get_recent_messages(&self, chat_id: i64, limit: u32) -> Result<Vec<HistoryMessage>> {
        let messages = self.conn.call(move |conn| {
            let mut stmt = conn.prepare(
                "SELECT user_id, first_name, text FROM messages
                 WHERE chat_id = ?1
                 ORDER BY created_at DESC
                 LIMIT ?2"
            )?;

            let rows: Vec<(i64, String, String)> = stmt.query_map(
                rusqlite::params![chat_id, limit],
                |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
            )?.filter_map(|r| r.ok()).collect();

            Ok(rows)
        }).await?;

        // Reverse qilib history yaratish
        Ok(messages.into_iter().rev().map(|(user_id, name, text)| {
            if user_id == 0 {
                HistoryMessage { role: "model".to_string(), text }
            } else {
                HistoryMessage {
                    role: "user".to_string(),
                    text: format!("[{}]: {}", name, text),
                }
            }
        }).collect())
    }

    pub async fn add_strike(&self, user_id: u64) -> Result<u32> {
        let count = self.conn.call(move |conn| {
            conn.execute(
                "INSERT INTO strikes (user_id, count, last_strike)
                 VALUES (?1, 1, datetime('now'))
                 ON CONFLICT(user_id) DO UPDATE SET
                   count = count + 1,
                   last_strike = datetime('now')",
                rusqlite::params![user_id as i64],
            )?;

            let count: u32 = conn.query_row(
                "SELECT count FROM strikes WHERE user_id = ?1",
                rusqlite::params![user_id as i64],
                |row| row.get(0),
            )?;
            Ok(count)
        }).await?;
        Ok(count)
    }

    pub async fn get_dm_count_this_hour(&self, user_id: u64) -> Result<u32> {
        let count = self.conn.call(move |conn| {
            let hour = chrono::Utc::now().format("%Y-%m-%d %H").to_string();
            let count: u32 = conn.query_row(
                "SELECT COALESCE(count, 0) FROM dm_counts
                 WHERE user_id = ?1 AND hour = ?2",
                rusqlite::params![user_id as i64, hour],
                |row| row.get(0),
            ).unwrap_or(0);
            Ok(count)
        }).await?;
        Ok(count)
    }

    pub async fn increment_dm_count(&self, user_id: u64) -> Result<()> {
        self.conn.call(move |conn| {
            let hour = chrono::Utc::now().format("%Y-%m-%d %H").to_string();
            conn.execute(
                "INSERT INTO dm_counts (user_id, hour, count) VALUES (?1, ?2, 1)
                 ON CONFLICT(user_id, hour) DO UPDATE SET count = count + 1",
                rusqlite::params![user_id as i64, hour],
            )?;
            Ok(())
        }).await?;
        Ok(())
    }

    pub async fn log_spam(&self, user_id: u64, text: &str) -> Result<()> {
        let text = text.to_string();
        self.conn.call(move |conn| {
            conn.execute(
                "INSERT INTO spam_log (user_id, text) VALUES (?1, ?2)",
                rusqlite::params![user_id as i64, text],
            )?;
            Ok(())
        }).await?;
        Ok(())
    }

    pub async fn get_stats(&self) -> Result<Stats> {
        let stats = self.conn.call(|conn| {
            let total_messages: u64 = conn.query_row(
                "SELECT COUNT(*) FROM messages", [], |r| r.get(0)
            ).unwrap_or(0);

            let total_users: u64 = conn.query_row(
                "SELECT COUNT(DISTINCT user_id) FROM messages WHERE user_id != 0",
                [], |r| r.get(0)
            ).unwrap_or(0);

            let total_memories: u64 = conn.query_row(
                "SELECT COUNT(*) FROM memories", [], |r| r.get(0)
            ).unwrap_or(0);

            let spam_blocked: u64 = conn.query_row(
                "SELECT COUNT(*) FROM spam_log", [], |r| r.get(0)
            ).unwrap_or(0);

            Ok(Stats { total_messages, total_users, total_memories, spam_blocked })
        }).await?;
        Ok(stats)
    }
}
