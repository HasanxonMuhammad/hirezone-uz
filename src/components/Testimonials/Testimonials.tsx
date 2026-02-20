"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
    {
        name: 'Asrorbek Olimov',
        role: 'CEO, Fintech Team',
        text: 'HireZone jamoasi bizga atigi 2 hafta ichida 5 nafar senior dasturchini topib berdi. Tizimlashtirish bo\'yicha maslahatlari esa HR jarayonlarimizni tubdan o\'zgartirdi.',
        avatar: 'https://i.pravatar.cc/150?u=asror',
        rating: 5
    },
    {
        name: 'Malika Ergasheva',
        role: 'HR Direktor, Global Retail',
        text: 'Platformaning SI qidiruv tizimi juda aniq ishlaydi. Nomzodlarni saralashga ketadigan vaqtimiz 70% ga qisqardi. Telegram orqali boshqarish esa juda qulay!',
        avatar: 'https://i.pravatar.cc/150?u=malika',
        rating: 5
    },
    {
        name: 'Javohir Karimov',
        role: 'Frontend Dasturchi',
        text: 'Rezyume builder yordamida yaratgan rezyumem bilan birinchi haftadanoq 3 ta kompaniyadan taklif oldim. Rahmat, HireZone!',
        avatar: 'https://i.pravatar.cc/150?u=javohir',
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Mijozlarimiz <span>fikri</span></h2>
                    <p className={styles.subtitle}>Biznes va nomzodlar uchun yaratilgan eng ishonchli yechimlar haqida</p>
                </div>

                <div className={styles.grid}>
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={styles.quoteIcon}><Quote size={30} fill="#4bcc5a" stroke="none" opacity={0.2} /></div>
                            <div className={styles.stars}>
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="#ffbc00" stroke="none" />
                                ))}
                            </div>
                            <p className={styles.text}>"{item.text}"</p>
                            <div className={styles.author}>
                                <img src={item.avatar} alt={item.name} className={styles.avatar} />
                                <div className={styles.info}>
                                    <h4 className={styles.name}>{item.name}</h4>
                                    <p className={styles.role}>{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
