"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from './SolutionsHome.module.css';
import {
    Users,
    BookOpen,
    TrendingUp,
    CreditCard,
    Layout,
    Clock,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const SolutionsHome = () => {
    const { t } = useLanguage();

    const solutions = [
        {
            id: 'executiveSearch',
            title: t.nav.executiveSearch,
            text: 'Meticulously designed to identify and attract top-tier leadership talent.',
            icon: <Users size={40} />,
            href: '/solutions'
        },
        {
            id: 'trainingSession',
            title: t.nav.trainingSession,
            text: 'Enhance your team skills with our professional training programs.',
            icon: <BookOpen size={40} />,
            href: '/solutions'
        },
        {
            id: 'careerGrowth',
            title: t.nav.careerGrowth,
            text: 'Specialized strategies to accelerate professional development.',
            icon: <TrendingUp size={40} />,
            href: '/solutions'
        },
        {
            id: 'payrollServices',
            title: t.nav.payrollServices,
            text: 'Streamlined payroll management for businesses of all sizes.',
            icon: <CreditCard size={40} />,
            href: '/solutions'
        },
        {
            id: 'workforceSystem',
            title: t.nav.workforceSystem,
            text: 'Advanced systems to manage and scale your global workforce.',
            icon: <Layout size={40} />,
            href: '/solutions'
        },
        {
            id: 'temporaryJobs',
            title: t.nav.temporaryJobs,
            text: 'Quick and reliable staffing for short-term and urgent projects.',
            icon: <Clock size={40} />,
            href: '/solutions'
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <motion.div
                        className={styles.badge}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {t.nav.solutions.toUpperCase()}
                    </motion.div>
                    <motion.h2
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Inspiring Staffing <span className={styles.highlight}>Solutions</span>
                    </motion.h2>
                </div>

                <div className={styles.grid}>
                    {solutions.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.iconWrapper}>
                                {item.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardText}>{item.text}</p>
                            <Link href={item.href} className={styles.learnMore}>
                                Learn More <ArrowRight size={16} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SolutionsHome;
