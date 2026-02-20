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
