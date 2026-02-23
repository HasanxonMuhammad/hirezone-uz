use anyhow::{Context, Result};
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use tracing::{debug, error};

const GEMINI_BASE: &str = "https://generativelanguage.googleapis.com/v1beta";

#[derive(Clone)]
pub struct GeminiClient {
    api_key: String,
    client: Client,
}

// ── Request types ──────────────────────────────────────────────────────────

#[derive(Serialize)]
struct GenerateRequest {
    contents: Vec<Content>,
    #[serde(skip_serializing_if = "Option::is_none")]
    system_instruction: Option<SystemInstruction>,
    generation_config: GenerationConfig,
}

#[derive(Serialize)]
struct SystemInstruction {
    parts: Vec<Part>,
}

#[derive(Serialize, Clone)]
struct Content {
    role: String,
    parts: Vec<Part>,
}

#[derive(Serialize, Clone)]
struct Part {
    #[serde(skip_serializing_if = "Option::is_none")]
    text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    inline_data: Option<InlineData>,
}

#[derive(Serialize, Clone)]
struct InlineData {
    mime_type: String,
    data: String, // base64
}

#[derive(Serialize)]
struct GenerationConfig {
    temperature: f32,
    max_output_tokens: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    top_p: Option<f32>,
}

// ── Response types ─────────────────────────────────────────────────────────

#[derive(Deserialize, Debug)]
struct GenerateResponse {
    candidates: Option<Vec<Candidate>>,
    error: Option<GeminiError>,
}

#[derive(Deserialize, Debug)]
struct Candidate {
    content: Option<ContentResponse>,
    #[serde(rename = "finishReason")]
    finish_reason: Option<String>,
}

#[derive(Deserialize, Debug)]
struct ContentResponse {
    parts: Vec<PartResponse>,
}

#[derive(Deserialize, Debug)]
struct PartResponse {
    text: Option<String>,
}

#[derive(Deserialize, Debug)]
struct GeminiError {
    message: String,
    code: u32,
}

// ── History type for DB ────────────────────────────────────────────────────

pub struct HistoryMessage {
    pub role: String, // "user" or "model"
    pub text: String,
}

impl GeminiClient {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: Client::builder()
                .timeout(std::time::Duration::from_secs(30))
                .build()
                .expect("HTTP client yaratib bo'lmadi"),
        }
    }

    /// Oddiy matnli chat
    pub async fn chat(
        &self,
        user_message: &str,
        user_name: &str,
        memories: &[String],
        history: &[HistoryMessage],
        is_private: bool,
    ) -> Result<String> {
        let system = self.build_system_prompt(memories, is_private);

        let mut contents: Vec<Content> = history.iter().map(|h| Content {
            role: h.role.clone(),
            parts: vec![Part { text: Some(h.text.clone()), inline_data: None }],
        }).collect();

        contents.push(Content {
            role: "user".to_string(),
            parts: vec![Part {
                text: Some(format!("[{}]: {}", user_name, user_message)),
                inline_data: None,
            }],
        });

        let req = GenerateRequest {
            contents,
            system_instruction: Some(SystemInstruction {
                parts: vec![Part { text: Some(system), inline_data: None }],
            }),
            generation_config: GenerationConfig {
                temperature: 0.85,
                max_output_tokens: 1024,
                top_p: Some(0.95),
            },
        };

        self.generate("gemini-2.0-flash", req).await
    }

    /// Rasm tahlili (vision)
    pub async fn vision(
        &self,
        image_data: &[u8],
        prompt: &str,
        user_name: &str,
    ) -> Result<String> {
        let image_b64 = BASE64.encode(image_data);

        // MIME type aniqlash (oddiy versiya)
        let mime_type = if image_data.starts_with(&[0xFF, 0xD8]) {
            "image/jpeg"
        } else if image_data.starts_with(&[0x89, 0x50, 0x4E, 0x47]) {
            "image/png"
        } else {
            "image/jpeg"
        };

        let req = GenerateRequest {
            contents: vec![Content {
                role: "user".to_string(),
                parts: vec![
                    Part {
                        text: Some(format!("[{}]: {}", user_name, prompt)),
                        inline_data: None,
                    },
                    Part {
                        text: None,
                        inline_data: Some(InlineData {
                            mime_type: mime_type.to_string(),
                            data: image_b64,
                        }),
                    },
                ],
            }],
            system_instruction: Some(SystemInstruction {
                parts: vec![Part {
                    text: Some("Sen rasm tahlil qiluvchi aqlli assistantsan. \
                                Rasmni batafsil va aniq tushuntir. \
                                O'zbek tilida javob ber agar savol o'zbek tilida bo'lsa.".to_string()),
                    inline_data: None,
                }],
            }),
            generation_config: GenerationConfig {
                temperature: 0.7,
                max_output_tokens: 1024,
                top_p: None,
            },
        };

        self.generate("gemini-2.0-flash", req).await
    }

    /// Ovozni transkripsiya qilish va javob berish
    pub async fn transcribe_and_respond(&self, audio_data: &[u8]) -> Result<String> {
        let audio_b64 = BASE64.encode(audio_data);

        let req = GenerateRequest {
            contents: vec![Content {
                role: "user".to_string(),
                parts: vec![
                    Part {
                        text: Some("Bu ovozli xabarni transkripsiya qil va savol bo'lsa javob ber.".to_string()),
                        inline_data: None,
                    },
                    Part {
                        text: None,
                        inline_data: Some(InlineData {
                            mime_type: "audio/ogg".to_string(),
                            data: audio_b64,
                        }),
                    },
                ],
            }],
            system_instruction: Some(SystemInstruction {
                parts: vec![Part {
                    text: Some("Ovozni transkripsiya qil va qisqa javob ber. \
                                Format: 🎤 *Aytilgan:* [transkripsiya]\n\n💬 *Javob:* [javob]".to_string()),
                    inline_data: None,
                }],
            }),
            generation_config: GenerationConfig {
                temperature: 0.7,
                max_output_tokens: 512,
                top_p: None,
            },
        };

        self.generate("gemini-2.0-flash", req).await
    }

    /// Spam klassifikatsiyasi (Gemini Flash Lite bilan arzon)
    pub async fn classify_spam(&self, text: &str) -> Result<bool> {
        let req = GenerateRequest {
            contents: vec![Content {
                role: "user".to_string(),
                parts: vec![Part {
                    text: Some(format!(
                        "Quyidagi xabar spam yoki reklama ekanligini aniqlang.\n\
                         Faqat bitta so'z javob bering: SPAM yoki NOT_SPAM\n\
                         <message>{}</message>",
                        text
                    )),
                    inline_data: None,
                }],
            }],
            system_instruction: None,
            generation_config: GenerationConfig {
                temperature: 0.0,
                max_output_tokens: 10,
                top_p: None,
            },
        };

        let response = self.generate("gemini-2.0-flash-lite", req).await?;
        Ok(response.trim().to_uppercase().contains("SPAM")
            && !response.trim().to_uppercase().contains("NOT_SPAM"))
    }

    fn build_system_prompt(&self, memories: &[String], is_private: bool) -> String {
        let mut prompt = String::from(
            "Sen aqlli, do'stona va foydali Telegram botisan. \
             O'zbek, Rus va Ingliz tillarini bilasan. \
             Qisqa va aniq javob ber. Markdown formatlashdan foydalanish mumkin.\n\n"
        );

        if !memories.is_empty() {
            prompt.push_str("## Eslab qolilgan ma'lumotlar:\n");
            for mem in memories {
                prompt.push_str(&format!("- {}\n", mem));
            }
            prompt.push('\n');
        }

        if is_private {
            prompt.push_str(
                "Bu shaxsiy suhbat. Foydalanuvchi bilan samimiy muloqot qil.\n"
            );
        }

        prompt
    }

    async fn generate(&self, model: &str, req: GenerateRequest) -> Result<String> {
        let url = format!(
            "{}/models/{}:generateContent?key={}",
            GEMINI_BASE, model, self.api_key
        );

        debug!("Gemini so'rovi: {}", model);

        let resp = self.client
            .post(&url)
            .json(&req)
            .send()
            .await
            .context("Gemini API so'rovi yuborishda xato")?;

        let status = resp.status();
        let body: GenerateResponse = resp.json().await
            .context("Gemini javobini parse qilishda xato")?;

        if let Some(err) = body.error {
            error!("Gemini xatosi ({}): {}", err.code, err.message);
            return Err(anyhow::anyhow!("Gemini API xatosi: {}", err.message));
        }

        let text = body.candidates
            .and_then(|c| c.into_iter().next())
            .and_then(|c| c.content)
            .and_then(|c| c.parts.into_iter().next())
            .and_then(|p| p.text)
            .unwrap_or_else(|| "Kechirasiz, javob berib bo'lmadi.".to_string());

        Ok(text)
    }
}
