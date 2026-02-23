use anyhow::Result;
use once_cell::sync::Lazy;
use regex::Regex;
use std::sync::Arc;
use tracing::debug;

use crate::config::Config;
use crate::gemini::GeminiClient;

pub struct SpamResult {
    pub is_spam: bool,
    pub reason: SpamReason,
}

#[derive(Debug)]
pub enum SpamReason {
    Clean,
    RegexMatch(String),
    AiClassified,
}

// ── Spam regex patterns ────────────────────────────────────────────────────
static SPAM_PATTERNS: Lazy<Vec<Regex>> = Lazy::new(|| {
    let patterns = [
        // Kripto spam
        r"(?i)(crypto|bitcoin|btc|eth|usdt|token|coin|nft|blockchain|defi|airdrop)",
        r"(?i)(x100|x10|x50|pump|dump|moon|lambo)",
        r"(?i)(guaranteed.*profit|profit.*guaranteed|guaranteed.*return)",
        r"(?i)(invest.*\$|earn.*\$|make.*money.*fast)",
        // Forex/Casino
        r"(?i)(forex|trading.*signal|binary.*option|casino|bet.*win|jackpot)",
        // Phishing
        r"(?i)(click.*link|free.*gift|you.*won|congratulation.*prize)",
        r"(?i)(verify.*account|account.*suspended|login.*here)",
        // O'zbek spam
        r"(?i)(pul.*ishlash|daromad.*kafolat|investitsiya.*kirim|ko'p.*pul)",
        // Umumiy
        r"(?i)(spam|advertisement|promo code|discount.*%.*off)",
        r"(?i)(@[a-zA-Z0-9_]{5,}.*@[a-zA-Z0-9_]{5,}.*@[a-zA-Z0-9_]{5,})", // Ko'p mention
    ];

    patterns.iter()
        .filter_map(|p| Regex::new(p).ok())
        .collect()
});

// ── Safe patterns (bypass spam filter) ────────────────────────────────────
static SAFE_PATTERNS: Lazy<Vec<Regex>> = Lazy::new(|| {
    let patterns = [
        r"(?i)^(salom|hello|hi|привет|hey)[\s!?]*$",
        r"(?i)^(rahmat|thanks|thank you|spasibo|xop)[\s!?]*$",
        r"(?i)^(ok|okay|yaxshi|xo'p|понял|good)[\s!?]*$",
    ];

    patterns.iter()
        .filter_map(|p| Regex::new(p).ok())
        .collect()
});

pub struct SpamFilter {
    gemini: Arc<GeminiClient>,
    config: Arc<Config>,
}

impl SpamFilter {
    pub fn new(gemini: Arc<GeminiClient>, config: Arc<Config>) -> Self {
        Self { gemini, config }
    }

    pub async fn check(&self, text: &str, user_id: u64) -> Result<SpamResult> {
        // 1. Ishonchli foydalanuvchi tekshiruvi
        if self.config.owner_ids.contains(&user_id) {
            return Ok(SpamResult { is_spam: false, reason: SpamReason::Clean });
        }

        // 2. Qisqa xabar — safe
        if text.len() < 20 && !has_url(text) {
            // Safe patterns tekshiruvi
            for pattern in SAFE_PATTERNS.iter() {
                if pattern.is_match(text) {
                    return Ok(SpamResult { is_spam: false, reason: SpamReason::Clean });
                }
            }
            // Qisqa va URLsiz = safe
            return Ok(SpamResult { is_spam: false, reason: SpamReason::Clean });
        }

        // 3. Regex prefilter — tez tekshiruv
        for pattern in SPAM_PATTERNS.iter() {
            if pattern.is_match(text) {
                debug!("Regex spam aniqlandi: {}", text.chars().take(50).collect::<String>());
                return Ok(SpamResult {
                    is_spam: true,
                    reason: SpamReason::RegexMatch(pattern.as_str().to_string()),
                });
            }
        }

        // 4. Ko'p URL — shubhali
        if count_urls(text) >= 3 {
            return Ok(SpamResult {
                is_spam: true,
                reason: SpamReason::RegexMatch("Ko'p URL".to_string()),
            });
        }

        // 5. Noaniq — Gemini klassifikatsiya
        if text.len() > 50 || has_url(text) {
            let is_spam = self.gemini.classify_spam(text).await.unwrap_or(false);
            if is_spam {
                debug!("Gemini spam aniqladi: {}", text.chars().take(50).collect::<String>());
                return Ok(SpamResult { is_spam: true, reason: SpamReason::AiClassified });
            }
        }

        Ok(SpamResult { is_spam: false, reason: SpamReason::Clean })
    }
}

fn has_url(text: &str) -> bool {
    text.contains("http://") || text.contains("https://") || text.contains("t.me/")
}

fn count_urls(text: &str) -> usize {
    text.matches("http").count() + text.matches("t.me/").count()
}
