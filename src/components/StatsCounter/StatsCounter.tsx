"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Building2, Users, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './StatsCounter.module.css';

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);

    return count;
}

const StatsCounter = () => {
    const { t } = useLanguage();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const jobs = useCountUp(12500, 2200, isInView);
    const companies = useCountUp(340, 1800, isInView);
    const candidates = useCountUp(48000, 2400, isInView);
    const placements = useCountUp(98, 1600, isInView);

    const stats = [
        {
            icon: <Briefcase size={28} />,
            value: jobs.toLocaleString() + '+',
            label: t.stats?.activeJobs || 'Active Jobs',
            color: '#4bcc5a',
            bg: 'rgba(75, 204, 90, 0.08)',
        },
        {
            icon: <Building2 size={28} />,
            value: companies.toLocaleString() + '+',
            label: t.stats?.companies || 'Companies',
            color: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.08)',
        },
        {
            icon: <Users size={28} />,
            value: candidates.toLocaleString() + '+',
            label: t.stats?.candidates || 'Candidates',
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.08)',
        },
        {
            icon: <CheckCircle2 size={28} />,
            value: placements + '%',
            label: t.stats?.successRate || 'Success Rate',
            color: '#8b5cf6',
            bg: 'rgba(139, 92, 246, 0.08)',
        },
    ];

    return (
        <section className={styles.stats} ref={ref}>
            <div className={styles.inner}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        className={styles.card}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                        whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}
                    >
                        <div className={styles.iconWrap} style={{ background: stat.bg, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className={styles.value} style={{ color: stat.color }}>
                            {stat.value}
                        </div>
                        <div className={styles.label}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default StatsCounter;
