"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './UserChoice.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const UserChoice = () => {
    const { t } = useLanguage();

    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                {/* For Local Workers Card */}
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.content}>
                        <h2>{t.userChoice.workersTitle}</h2>
                        <p>{t.userChoice.workersText}</p>
                    </div>

                    <div className={styles.buttonWrapper}>
                        <Link href="/jobs" className={styles.btn}>
                            {t.userChoice.findWork}
                        </Link>
                    </div>

                    <div className={styles.imageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1522071823991-b5182991e38f?auto=format&fit=crop&q=80&w=800"
                            alt="Local Workers"
                            className={styles.image}
                        />
                    </div>
                </motion.div>

                {/* For Business Owner Card */}
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.content}>
                        <h2>{t.userChoice.businessTitle}</h2>
                        <p>{t.userChoice.businessText}</p>
                    </div>

                    <div className={styles.buttonWrapper}>
                        <Link href="/post-job" className={styles.btn}>
                            {t.userChoice.findEmployee}
                        </Link>
                    </div>

                    <div className={styles.imageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
                            alt="Business Owners"
                            className={styles.image}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default UserChoice;
