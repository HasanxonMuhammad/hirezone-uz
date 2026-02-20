
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './WhyChooseUs.module.css';
import Link from 'next/link';

const WhyChooseUs = () => {
    const { t } = useLanguage();

    const features = [
        {
            icon: <UserCheck size={32} />,
            title: t.whyChooseUs.card1Title,
            text: t.whyChooseUs.card1Text,
        },
        {
            icon: <ShieldCheck size={32} />,
            title: t.whyChooseUs.card2Title,
            text: t.whyChooseUs.card2Text,
        },
        {
            icon: <TrendingUp size={32} />,
            title: t.whyChooseUs.card3Title,
            text: t.whyChooseUs.card3Text,
        }
    ];

    return (
        <section className={styles.section} id="why-us">
            <div className={styles.container}>
                <motion.div
                    className={styles.badgeWrapper}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    {t.whyChooseUs.badge}
                </motion.div>

                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {t.whyChooseUs.title}
                </motion.h2>

                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.iconWrapper}>
                                {feature.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardText}>{feature.text}</p>
                            <Link href="/about" className={styles.learnMore}>
                                {t.whyChooseUs.learnMore} <span><ArrowRight size={20} /></span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
