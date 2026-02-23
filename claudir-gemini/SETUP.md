# 🤖 Claudir-Gemini — To'liq Setup Yo'riqnomasi

## Kerakli narsalar

| Narsa | Qayerdan | Bepul? |
|-------|---------|--------|
| Telegram Bot Token | [@BotFather](https://t.me/BotFather) | ✅ Ha |
| Gemini API Key | [aistudio.google.com](https://aistudio.google.com/apikey) | ✅ Ha |
| Linux server / VPS | Hetzner, DigitalOcean, yoki shaxsiy | 💰 ~$5/oy |
| Rust o'rnatilgan | rustup.rs | ✅ Ha |

---

## 1-qadam: Telegram Bot yaratish

1. Telegramda **[@BotFather](https://t.me/BotFather)** ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting (masalan: `Gemira`)
4. Username kiriting (masalan: `gemira_bot`)
5. **API tokenini** nusxalab oling — `.env` ga kerak bo'ladi

```
Bot nomingiz: Gemira
Username: @gemira_bot
Token: 1234567890:ABCdefGHIjklMNOpqrSTUVwxyz  ← shu kerak
```

---

## 2-qadam: Gemini API Key olish

1. [aistudio.google.com/apikey](https://aistudio.google.com/apikey) ga kiring
2. Google akkauntingiz bilan kiring
3. **"Create API Key"** tugmasini bosing
4. Kalitni nusxalab oling

> ⚠️ Kalit boshqalarga ko'rsatmang!

---

## 3-qadam: Telegram ID ni aniqlash

O'zingizning Telegram ID ingizni bilish uchun:
1. [@userinfobot](https://t.me/userinfobot) ga `/start` yuboring
2. U sizga ID raqamingizni ko'rsatadi (masalan: `123456789`)

Guruh ID ni bilish uchun:
1. [@getmyid_bot](https://t.me/getmyid_bot) ni guruhingizga qo'shing
2. Bot guruh ID ni ko'rsatadi (masalan: `-1001234567890`)

---

## 4-qadam: Rust o'rnatish

```bash
# Rust o'rnatish (agar yo'q bo'lsa)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Tekshirish
rustc --version  # rustc 1.75+ bo'lishi kerak
```

---

## 5-qadam: Botni sozlash

```bash
# Papkaga o'ting
cd claudir-gemini

# .env faylini yarating
cp .env.example .env

# Tahrirlang
nano .env
```

`.env` faylini to'ldiring:
```env
TELEGRAM_TOKEN=sizning_tokeningiz
GEMINI_API_KEY=sizning_gemini_kalitingiz
OWNER_IDS=sizning_telegram_id_ingiz
ALLOWED_GROUPS=guruh_id_ingiz
BOT_NAME=Gemira
```

---

## 6-qadam: Build va ishga tushirish

```bash
# Data papkasini yarating
mkdir -p data/memories

# Debug rejimida sinab ko'ring
cargo run

# Yoki Release (tezroq) rejimida
cargo build --release
./target/release/claudir-gemini
```

Konsolda quyidagini ko'rishingiz kerak:
```
✅ Database tayyor: data/bot.db
🤖 Claudir-Gemini bot ishga tushmoqda...
✅ Bot tayyor! Xabarlar kutilmoqda...
```

---

## 7-qadam: Bot bilan guruhda ishlash

1. Botni guruhingizga qo'shing
2. Botga **Admin** huquqi bering (xabar o'chirish uchun)
3. Botga murojaat qiling:

```
@gemira_bot salom, qandaysan?
```
yoki javob bering (reply) va bot javob beradi.

---

## 8-qadam: Server da doim ishlatish (systemd)

```bash
# Service fayl yaratish
sudo nano /etc/systemd/system/gemira-bot.service
```

```ini
[Unit]
Description=Gemira Telegram Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/claudir-gemini
ExecStart=/home/ubuntu/claudir-gemini/target/release/claudir-gemini
Restart=always
RestartSec=5
EnvironmentFile=/home/ubuntu/claudir-gemini/.env
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
# Ishga tushirish
sudo systemctl daemon-reload
sudo systemctl enable gemira-bot
sudo systemctl start gemira-bot

# Holat tekshirish
sudo systemctl status gemira-bot

# Loglarni ko'rish
sudo journalctl -u gemira-bot -f
```

---

## Bot buyruqlari

| Buyruq | Kim uchun | Tavsif |
|--------|-----------|--------|
| `/status` | Faqat owner | Bot statistikasini ko'rsatadi |
| `/clear_memory` | Faqat owner | Chatdagi xotiralarni o'chiradi |

---

## Bot imkoniyatlari

### 💬 Guruhda ishlash
- Botni **mention** qilganda (`@bot_nomi`) javob beradi
- **Reply** qilganda javob beradi
- Fon suhbatlarini **tinglaydi** (spam uchun)

### 📱 Shaxsiy (DM)
- Har qanday xabarga javob beradi
- Soatiga maksimal **20 ta xabar** (sozlanadi)

### 🚫 Spam filtrlash
- **Regex** — tez, API sarflamaydi
- **Gemini Flash Lite** — aqlli klassifikator
- **3 strike** → ban (sozlanadi)

### 🧠 Xotira
- Foydalanuvchi ismini eslab qoladi
- Muhim ma'lumotlarni saqlaydi
- Har bir chatda alohida xotira

### 🖼️ Rasm tahlili
- Rasm yuborilganda tahlil qiladi
- Caption bo'lsa uni ham hisobga oladi

### 🎤 Ovozli xabar
- Ovozni transkripsiya qiladi
- Savol bo'lsa javob beradi

---

## Muammolar va yechimlar

**Bot javob bermayapti:**
```bash
# Loglarni tekshiring
sudo journalctl -u gemira-bot -n 50

# Token to'g'riligini tekshiring
curl "https://api.telegram.org/bot<TOKEN>/getMe"
```

**Gemini xatosi:**
- API key to'g'riligini tekshiring
- [Quota limitini](https://aistudio.google.com) tekshiring

**Database xatosi:**
```bash
# data/ papkasi mavjudligini tekshiring
ls -la data/
```

---

## Xarajatlar

| Xizmat | Narx |
|--------|------|
| Gemini 2.0 Flash | Bepul (kuniga 1500 so'rov) |
| Gemini 2.0 Flash Lite | Bepul (spam uchun) |
| Telegram Bot API | Bepul |
| VPS server | ~$5-10/oy |

> 💡 **Bepul tier** ko'pchilik uchun yetarli! Juda ko'p foydalanuvchilar bo'lsa to'lovli planga o'tish mumkin.
