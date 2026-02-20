"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { MapPin, Clock, Bookmark, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './LatestJobs.module.css';

// Fallback data agar API ishlamasa
const fallbackJobs = [
    {
        id: 0,
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions',
        location: 'Toshkent',
        type: 'Full Time',
        description: 'React, Next.js, TypeScript bilan ishlash',
        logo: 'https://placehold.co/60x60/4bcc5a/white?text=TS',
        time: '2 hours ago',
    },
    {
        id: 0,
        title: 'UI/UX Designer',
        company: 'Creative Hub',
        location: 'Remote',
        type: 'Contract',
        description: 'Figma, Design Systems bilan ishlash',
        logo: 'https://placehold.co/60x60/6366f1/white?text=CH',
        time: '5 hours ago',
    },
    {
        id: 0,
        title: 'Backend Engineer',
        company: 'Data Flows',
        location: 'Toshkent',
        type: 'Full Time',
        description: 'Node.js, PostgreSQL, API development',
        logo: 'https://placehold.co/60x60/007bff/white?text=DF',
        time: '1 day ago',
    },
];

interface Job {
    id: number;
    title: string;
    company?: string;
    location: string;
    type: string;
    description: string;
    logo?: string;
    time?: string;
    createdAt?: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
    const d = Math.floor(h / 24);
    return `${d} day${d > 1 ? 's' : ''} ago`;
}

const LatestJobs = () => {
    const { t, language } = useLanguage();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch(`/api/vacancies?lang=${language}&limit=4`);
                const data = await res.json();
                if (data.success && data.jobs.length > 0) {
                    setJobs(data.jobs.slice(0, 4));
                } else {
                    setJobs(fallbackJobs as Job[]);
                }
            } catch {
                setJobs(fallbackJobs as Job[]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [language]);

    const getJobTypeLabel = (type: string) => {
        if (type === 'Full Time') return t.latestJobs.fullTime;
        if (type === 'Contract') return t.latestJobs.contract;
        if (type === 'Part Time') return t.latestJobs.partTime;
        return type;
    };

    const getCompanyLogo = (job: Job) => {
        if (job.logo) return job.logo;
        const initial = (job.company || job.title || 'J').charAt(0).toUpperCase();
        return `https://placehold.co/60x60/4bcc5a/white?text=${initial}`;
    };

    return (
        <section className="section-padding" style={{ background: '#fafafa', padding: '100px 0' }}>
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '50px' }}
                >
                    <h2 style={{ fontSize: '36px', fontWeight: 800 }}>
                        {t.latestJobs.title} <span style={{ color: '#4bcc5a' }}>{t.latestJobs.titleSpan}</span>
                    </h2>
                    <p style={{ color: '#666', maxWidth: '600px', margin: '15px auto 0' }}>
                        {t.latestJobs.subtitle}
                    </p>
                </motion.div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                        <Loader2 size={36} style={{ color: '#4bcc5a', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : (
                    <motion.div
                        className={styles.jobList}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.05 }}
                    >
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.id || index}
                                className={styles.jobCard}
                                variants={itemVariants}
                            >
                                <div className={styles.jobMain}>
                                    <img
                                        src={getCompanyLogo(job)}
                                        alt={job.company || job.title}
                                        className={styles.logo}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                `https://placehold.co/60x60/4bcc5a/white?text=${job.title.charAt(0)}`;
                                        }}
                                    />
                                    <div className={styles.jobInfo}>
                                        <h3>{job.title}</h3>
                                        <div className={styles.meta}>
                                            <span style={{ color: '#4bcc5a', fontWeight: 700 }}>
                                                {job.company || 'Magnat HR'}
                                            </span>
                                            <span className={styles.dot}></span>
                                            <span className={styles.iconMeta}>
                                                <MapPin size={14} /> {job.location}
                                            </span>
                                        </div>
                                        {job.description && (
                                            <p style={{
                                                fontSize: '13px',
                                                color: '#888',
                                                marginTop: '4px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '320px'
                                            }}>
                                                {job.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.jobDetails}>
                                    <div className={styles.detailsGroup}>
                                        <span className={styles.iconMeta} style={{ color: '#888', fontSize: '13px', fontWeight: 500 }}>
                                            <Clock size={14} />
                                            {job.createdAt ? timeAgo(job.createdAt) : (job.time || 'Recently')}
                                        </span>
                                    </div>
                                    <div className={styles.badgeGroup}>
                                        <span className={`${styles.badge} ${styles[job.type.replace(' ', '').toLowerCase()]}`}>
                                            {getJobTypeLabel(job.type)}
                                        </span>
                                        <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <button className={styles.bookmarkBtn}><Bookmark size={18} /></button>
                                            <Link href={`/jobs${job.id ? `?id=${job.id}` : ''}`}>
                                                <button className={`btn btn-primary ${styles.applyBtn}`}>
                                                    {t.latestJobs.applyNow}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <motion.div
                    style={{ textAlign: 'center', marginTop: '50px' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <Link href="/jobs">
                        <button className="btn btn-primary" style={{ padding: '16px 40px', borderRadius: '50px', fontWeight: 700 }}>
                            {t.latestJobs.browseAll}
                        </button>
                    </Link>
                </motion.div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </section>
    );
};

export default LatestJobs;
