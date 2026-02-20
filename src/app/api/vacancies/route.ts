import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Bot bazasidan eksport qilingan vakansiyalar JSON faylini o'qish
// Bu faylni bot yangilagandan keyin API avtomatik o'qiydi
const VACANCIES_JSON_PATH = process.env.VACANCIES_JSON_PATH ||
    path.resolve('D:/flutter/magnat-bot/data/vacancies.json');

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'uz';
        const q = searchParams.get('q')?.toLowerCase() || '';
        const locationFilter = searchParams.get('location')?.toLowerCase() || '';

        // JSON fayldan o'qish
        let vacancies: any[] = [];

        if (fs.existsSync(VACANCIES_JSON_PATH)) {
            const raw = fs.readFileSync(VACANCIES_JSON_PATH, 'utf-8');
            vacancies = JSON.parse(raw);
        } else {
            // Default demo vacancies if file doesn't exist (e.g. on Vercel)
            vacancies = [
                {
                    id: 1,
                    is_active: 1,
                    title_uz: 'Administrator (Reception)',
                    title_ru: 'Администратор (Ресепшн)',
                    description_uz: '🏢 Magnat HR\n💰 Maosh: Kellshiladi\n📍 Manzil: Toshkent shahri, Chilonzor',
                    description_ru: '🏢 Magnat HR\n💰 Зарплата: Договорная\n📍 Адрес: Ташкент, Чиланзар',
                    location: 'Toshkent',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    is_active: 1,
                    title_uz: 'Sotuv menejeri',
                    title_ru: 'Менеджер по продажам',
                    description_uz: '🏢 Global Trade\n💰 Maosh: 5,000,000 - 10,000,000\n📍 Manzil: Toshkent, Yunusobod',
                    description_ru: '🏢 Global Trade\n💰 Зарплата: 5,000,000 - 10,000,000\n📍 Адрес: Ташкент, Юнусабад',
                    location: 'Toshkent',
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    is_active: 1,
                    title_uz: 'UI/UX Dizayner',
                    title_ru: 'UI/UX Дизайнер',
                    description_uz: '🏢 Creative Studio\n💰 Maosh: Kellshiladi\n📍 Manzil: Masofaviy (Remote)',
                    description_ru: '🏢 Creative Studio\n💰 Зарплата: Договорная\n📍 Адрес: Удаленно (Remote)',
                    location: 'Remote',
                    created_at: new Date().toISOString()
                }
            ];
        }

        // Vakansiyalarni formatlash
        const formattedJobs = vacancies
            .filter((v: any) => v.is_active === 1)
            .map((v: any) => ({
                id: v.id,
                title: lang === 'uz' ? v.title_uz : v.title_ru,
                description: lang === 'uz' ? v.description_uz : v.description_ru,
                location: v.location || 'Toshkent',
                type: 'Full Time',
                createdAt: v.created_at,
            }));

        // Qidiruv filtri
        const filtered = formattedJobs.filter(job => {
            const matchesQuery = !q ||
                job.title.toLowerCase().includes(q) ||
                job.description.toLowerCase().includes(q);
            const matchesLocation = !locationFilter ||
                job.location.toLowerCase().includes(locationFilter);
            return matchesQuery && matchesLocation;
        });

        return NextResponse.json({
            success: true,
            count: filtered.length,
            jobs: filtered,
        });
    } catch (error: any) {
        console.error('Vacancies API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Vakansiyalarni yuklashda xatolik',
                jobs: [],
            },
            { status: 500 }
        );
    }
}
