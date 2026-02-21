# Reactive Resume - Deploy qilish bo‘yicha qo‘llanma (O‘zbek tilida)

Ushbu qo‘llanma Reactive Resume’ni o‘z serveringizga Docker orqali deploy qilish bo‘yicha to‘liq ko‘rsatmalarni o‘z ichiga oladi.

## 1. Tayyorgarlik
Serveringizda quyidagilar o‘rnatilgan bo‘lishi kerak:
- **Docker** va **Docker Compose**
- **Domain/Subdomain** (masalan: `resume.hirezone.uz`)
- **SSL sertifikati** (Nginx Proxy Manager yoki Certbot orqali tavsiya etiladi)

## 2. Loyihani sozlash
Loyiha ichidagi `compose.yml` fayli production uchun tayyorlangan. Ammo, `.env` faylini yaratishingiz va undagi qiymatlarni o‘zgartirishingiz kerak.

### .env faylini yaratish:
Terminalda quyidagi buyruqni bajaring:
```bash
cp .env.example .env
```

### .env faylini tahrirlash:
Quyidagi muhim o‘zgaruvchilarni sozlang:
```env
# Server URL
APP_URL="https://resume.yourdomain.uz"

# Ichki printer URL (Docker ichida bir-birini topishi uchun)
PRINTER_APP_URL="http://reactive_resume:3000"

# Ma'lumotlar bazasi
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres"

# Xavfsizlik uchun maxfiy kalit (O‘zingiz ixtiyoriy 32 belgili string yozing)
AUTH_SECRET="falskjdfhalksjvblkjasdhflkasjdhflkasjhfd"

# Storage (SeaweedFS yoki S3)
S3_ENDPOINT="http://seaweedfs:8333"
S3_BUCKET="reactive-resume"
```

## 3. Dokerni ishga tushirish
Hamma narsa tayyor bo‘lgach, quyidagi buyruq bilan loyihani ishga tushiring:
```bash
docker-compose up -d
```

Bu buyruq quyidagi servislarni ko‘taradi:
1. `postgres`: Ma’lumotlar bazasi
2. `browserless`: PDF yaratish uchun headless Chrome
3. `seaweedfs`: Fayllarni saqlash uchun mini-S3
4. `reactive_resume`: Asosiy web ilova

## 4. O‘zbek tili va Fontlar
Loyiha allaqachon O‘zbek tiliga to‘liq tarjima qilingan va standart font sifatida **Inter** sozlab chiqilgan. Bu font `o‘`, `g‘`, `sh`, `ch` harflarini PDF eksportida to‘g‘ri ko‘rsatishni ta’minlaydi.

## 5. Telegram Web App (TWA) sifatida ulash
Ilova Telegram Web App scriptini o‘z ichiga oladi. Uni Telegram bot menyusiga qo‘shish uchun:
1. BotFather’ga boring va botingizni tanlang.
2. `Bot Settings` -> `Menu Button` -> `Configure Menu Button` qismiga o‘ting.
3. Subdomeningiz URL manzilini kiriting (masalan: `https://resume.hirezone.uz`).

## 6. PDF va PNG eksportini tekshirish
PDF eksporti ishlashi uchun `browserless` servisi yuklanganligiga ishonch hosil qiling. 
Agar PDF yaratishda xatolik bo‘lsa, `PRINTER_APP_URL` muhiti to‘g‘ri sozlanganligini (Docker ichidan asosiy ilovaga yo‘l) tekshiring.
