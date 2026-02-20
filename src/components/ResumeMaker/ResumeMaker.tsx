
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ResumeMaker.module.css';

const ResumeMaker = () => {
    const { t } = useLanguage();

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.contentRow}>
                    <motion.div
                        className={styles.textContent}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={styles.badgeWrapper}>{t.resumeBuilder.badge}</div>
                        <h2 className={styles.title}>
                            {t.resumeBuilder.title} <br />
                            <span>{t.resumeBuilder.titleSpan}</span>
                        </h2>
                        <p className={styles.description}>
                            {t.resumeBuilder.description}
                        </p>

                        <div className={styles.featureList}>
                            {t.resumeBuilder.features.map((feature, index) => (
                                <div key={index} className={styles.featureItem}>
                                    <div className={styles.checkIcon}>
                                        <CheckCircle2 size={20} />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <a href="/cv-builder" className={styles.ctaBtn}>
                            {t.resumeBuilder.cta} <ArrowRight size={22} />
                        </a>
                    </motion.div>

                    <motion.div
                        className={styles.imageContent}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={styles.decorationGlow}></div>
                        <div className={styles.imageWrapper}>
                            {/* Static UI Mockup Image */}
                            <img
                                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop"
                                alt="Resume Builder UI"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ResumeMaker;
