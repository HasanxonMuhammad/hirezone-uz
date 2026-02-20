
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './HowItWorks.module.css';

const HowItWorks = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'talents' | 'business'>('talents');

    const talentSteps = [
        { title: t.howItWorks.talentStep1Title, text: t.howItWorks.talentStep1Text },
        { title: t.howItWorks.talentStep2Title, text: t.howItWorks.talentStep2Text },
        { title: t.howItWorks.talentStep3Title, text: t.howItWorks.talentStep3Text },
    ];

    const businessSteps = [
        { title: t.howItWorks.businessStep1Title, text: t.howItWorks.businessStep1Text },
        { title: t.howItWorks.businessStep2Title, text: t.howItWorks.businessStep2Text },
        { title: t.howItWorks.businessStep3Title, text: t.howItWorks.businessStep3Text },
    ];

    const activeSteps = activeTab === 'talents' ? talentSteps : businessSteps;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.secTitle}>
                    <motion.div
                        className={styles.badgeWrapper}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {t.howItWorks.badge}
                    </motion.div>

                    <motion.h2
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        {t.howItWorks.title}
                    </motion.h2>
                </div>

                <div className={styles.tabsBox}>
                    <div className={styles.tabButtons}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'talents' ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab('talents')}
                        >
                            <User size={20} /> {t.howItWorks.forTalents}
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'business' ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab('business')}
                        >
                            <Briefcase size={20} /> {t.howItWorks.forBusiness}
                        </button>
                    </div>

                    <div className={styles.grid}>
                        <AnimatePresence mode="wait">
                            {activeSteps.map((step, index) => (
                                <motion.div
                                    key={`${activeTab}-${index}`}
                                    className={styles.processingBlock}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                >
                                    <div className={styles.innerBox}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.stepNumber}>{index + 1}</div>
                                            <h3 className={styles.cardTitle}>
                                                <a href="#">{step.title}</a>
                                            </h3>
                                        </div>
                                        <p className={styles.cardText}>{step.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
