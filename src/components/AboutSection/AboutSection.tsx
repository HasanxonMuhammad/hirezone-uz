"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './AboutSection.module.css';

const AboutSection = () => {
    const { t } = useLanguage();
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);

    return (
        <section className={styles.about}>
            <div className={styles.container}>
                {/* Visual Side with Enhanced Stacking Layers */}
                <motion.div
                    className={styles.visualSide}
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className={styles.imageStack}>
                        <div className={styles.layer1}></div>
                        <div className={styles.layer2}></div>
                        <div className={styles.imageWrapper} onClick={() => setIsVideoOpen(true)}>
                            <img
                                src="https://img.youtube.com/vi/AzXpZYMTaZA/maxresdefault.jpg"
                                alt="Hospitality Staffing Platform Video"
                            />
                            <div className={styles.videoOverlay}>
                                <div className={styles.playBtn}>
                                    <Play size={26} />
                                </div>
                                <span className={styles.watchText}>{t.aboutSection.watchVideo}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Video Modal */}
                <AnimatePresence>
                    {isVideoOpen && (
                        <motion.div
                            className={styles.modalOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsVideoOpen(false)}
                        >
                            <motion.div
                                className={styles.modalContent}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/AzXpZYMTaZA?autoplay=1"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                                <button className={styles.closeBtn} onClick={() => setIsVideoOpen(false)}>×</button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content Side */}
                <motion.div
                    className={styles.contentSide}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className={styles.badge}>{t.aboutSection.badge}</span>
                    <h2 className={styles.title}>
                        {t.aboutSection.title} <span>{t.aboutSection.titleSpan}</span>
                    </h2>
                    <p className={styles.description}>
                        {t.aboutSection.description}
                    </p>

                    <div className={styles.points}>
                        <div className={styles.point}>
                            <div className={styles.checkIcon}>
                                <Check size={14} strokeWidth={4} />
                            </div>
                            <span>{t.aboutSection.point1}</span>
                        </div>
                        <div className={styles.point}>
                            <div className={styles.checkIcon}>
                                <Check size={14} strokeWidth={4} />
                            </div>
                            <span>{t.aboutSection.point2}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
