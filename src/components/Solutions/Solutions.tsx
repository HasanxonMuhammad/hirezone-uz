"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Solutions.module.css';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    TrendingUp,
    CreditCard,
    Layout,
    Clock,
    ChevronRight,
    Download,
    PhoneCall,
    Mail,
    MapPin
} from 'lucide-react';

const Solutions = () => {
    const { t } = useLanguage();

    const services = [
        { id: 'executiveSearch', title: t.nav.executiveSearch, icon: <Users size={20} />, active: true },
        { id: 'trainingSession', title: t.nav.trainingSession, icon: <BookOpen size={20} /> },
        { id: 'careerGrowth', title: t.nav.careerGrowth, icon: <TrendingUp size={20} /> },
        { id: 'payrollServices', title: t.nav.payrollServices, icon: <CreditCard size={20} /> },
        { id: 'workforceSystem', title: t.nav.workforceSystem, icon: <Layout size={20} /> },
        { id: 'temporaryJobs', title: t.nav.temporaryJobs, icon: <Clock size={20} /> },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarSection}>
                        <h3 className={styles.sidebarTitle}>{t.solutionsPage.sidebarTitle}</h3>
                        <ul className={styles.serviceList}>
                            {services.map((service) => (
                                <li key={service.id} className={`${styles.serviceItem} ${service.active ? styles.active : ''}`}>
                                    <div className={styles.serviceLink}>
                                        {service.icon}
                                        <span>{service.title}</span>
                                        <ChevronRight size={16} className={styles.chevron} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.helpBox}>
                        <div className={styles.helpIcon}>
                            <PhoneCall size={32} />
                        </div>
                        <h4>{t.solutionsPage.needHelpTitle}</h4>
                        <p>{t.solutionsPage.needHelpText}</p>
                        <div className={styles.contactInfo}>
                            <a href="tel:+998711234567" className={styles.contactItem}>
                                <PhoneCall size={16} />
                                <span>+998 71 123 45 67</span>
                            </a>
                            <a href="mailto:info@hirezone.uz" className={styles.contactItem}>
                                <Mail size={16} />
                                <span>info@hirezone.uz</span>
                            </a>
                        </div>
                    </div>

                    <div className={styles.downloadBox}>
                        <button className={styles.downloadBtn}>
                            <Download size={20} />
                            <span>{t.solutionsPage.downloadBrochure}</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={styles.mainContent}>
                    <motion.div
                        className={styles.heroImage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Placeholder for the executive search image */}
                        <div className={styles.imageOverlay}>
                            <h1>{t.nav.executiveSearch}</h1>
                        </div>
                    </motion.div>

                    <section className={styles.contentSection}>
                        <h2 className={styles.sectionTitle}>{t.solutionsPage.processTitle}</h2>
                        <p className={styles.description}>
                            {t.solutionsPage.processText1}
                        </p>
                        <p className={styles.description}>
                            {t.solutionsPage.processText2}
                        </p>

                        <div className={styles.featuresGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><Clock size={24} /></div>
                                <h3>{t.solutionsPage.feature1Title}</h3>
                                <p>{t.solutionsPage.feature1Text}</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><Clock size={24} /></div>
                                <h3>{t.solutionsPage.feature2Title}</h3>
                                <p>{t.solutionsPage.feature2Text}</p>
                            </div>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}><Clock size={24} /></div>
                                <h3>{t.solutionsPage.feature3Title}</h3>
                                <p>{t.solutionsPage.feature3Text}</p>
                            </div>
                        </div>

                        <h2 className={styles.sectionTitle}>{t.solutionsPage.leadersTitle}</h2>
                        <p className={styles.description}>
                            {t.solutionsPage.leadersText}
                        </p>

                        {/* Subscription Section */}
                        <div className={styles.subscribeBox}>
                            <div className={styles.subscribeContent}>
                                <h2>Subscribe for latest update</h2>
                                <p>Since 2018, HireZone has been connecting experts to thousands of businesses and private projects.</p>
                                <div className={styles.appBtns}>
                                    <button className={styles.appStoreBtn}>
                                        <div className={styles.btnIcon}>📱</div>
                                        <div className={styles.btnText}>
                                            <span>Download on</span>
                                            <strong>App Store</strong>
                                        </div>
                                    </button>
                                    <button className={styles.playStoreBtn}>
                                        <div className={styles.btnIcon}>🤖</div>
                                        <div className={styles.btnText}>
                                            <span>Get it on</span>
                                            <strong>Google Play</strong>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Solutions;
