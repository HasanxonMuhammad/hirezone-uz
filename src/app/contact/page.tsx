"use client";

import { MapPin, Phone, Mail, Navigation, Footprints } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './Contact.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
    const { t, language } = useLanguage();

    const getMapLang = () => {
        switch (language) {
            case 'ru': return 'ru_RU';
            case 'uz': return 'uz_UZ';
            default: return 'en_US';
        }
    };

    const handleGetDirections = () => {
        // Shota Rustaveli 150 coordinates
        const lat = 41.260000;
        const lon = 69.223799;
        const url = `https://yandex.uz/maps/?rtext=~${lat}%2C${lon}&rtt=auto`;
        window.open(url, '_blank');
    };

    return (
        <>
            <Header />
            <main>
                {/* Page Header */}
                <section className={styles.pageHeader}>
                    <div className="container">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {t.contact.title}
                        </motion.h1>
                        <motion.div
                            className={styles.breadcrumb}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Link href="/">{t.nav.home}</Link>
                            <span>-</span>
                            <span className={styles.breadcrumbActive}>{t.contact.title}</span>
                        </motion.div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className={styles.contactSection}>
                    <div className="container">
                        <div className={styles.grid}>
                            {/* Left: Contact Information Card */}
                            <motion.div
                                className={styles.contactInfoCard}
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h3 className={styles.contactInfoTitle}>Contact Information</h3>

                                <div className={styles.infoItems}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.iconCircle}>
                                            <MapPin size={22} />
                                        </div>
                                        <div className={styles.infoText}>
                                            <h4>Corporate Office</h4>
                                            <p>{t.contact.address}<br />{t.contact.tashkent}, Uzbekistan</p>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.iconCircle}>
                                            <MapPin size={22} />
                                        </div>
                                        <div className={styles.infoText}>
                                            <h4>Branch Office</h4>
                                            <p>Chilonzor District,<br />Tashkent, Uzbekistan</p>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.iconCircle}>
                                            <Mail size={22} />
                                        </div>
                                        <div className={styles.infoText}>
                                            <h4>Email Address</h4>
                                            <p>support@hirezone.uz</p>
                                            <p>contact@hirezone.uz</p>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.iconCircle}>
                                            <Phone size={22} />
                                        </div>
                                        <div className={styles.infoText}>
                                            <h4>Phone Number</h4>
                                            <p>+998 90 123 45 67</p>
                                            <p>+998 71 234 56 78</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right: Contact Form */}
                            <motion.div
                                className={styles.contactForm}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className={styles.formRow}>
                                        <div className={styles.inputGroup}>
                                            <label>Name <span className={styles.required}>*</span></label>
                                            <input type="text" placeholder="" required />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Phone <span className={styles.required}>*</span></label>
                                            <input type="tel" placeholder="+998" required />
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Email Address <span className={styles.required}>*</span></label>
                                        <input type="email" placeholder="" required />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Subject <span className={styles.required}>*</span></label>
                                        <input type="text" placeholder="" required />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Write Message <span className={styles.required}>*</span></label>
                                        <textarea rows={6} placeholder="" required></textarea>
                                    </div>

                                    <button type="submit" className={styles.submitBtn}>
                                        Send Message
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className={styles.mapSection}>
                    <div className={styles.mapWrapper}>
                        <div className={styles.mapContainer}>
                            <iframe
                                src={`https://yandex.uz/map-widget/v1/?ll=69.223799%2C41.260000&z=16&pt=69.223799%2C41.260000%2Cpm2rdm&lang=${getMapLang()}`}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>

                            {/* Yandex Info Card Overlay - Replicating the screenshot */}
                            <motion.div
                                className={styles.yandexCard}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                <div className={styles.cardHeader}>
                                    <h3>{t.contact.address}</h3>
                                    <p>{t.contact.tashkent}</p>
                                    <button className={styles.closeBtn}>×</button>
                                </div>

                                <div className={styles.metroList}>
                                    <div className={styles.metroItem}>
                                        <div className={styles.metroIcon} style={{ background: '#ef4444' }}>M</div>
                                        <span>{t.contact.metro.chilonzor}</span>
                                        <span className={styles.distance}>
                                            <Footprints size={14} /> 2,45 км
                                        </span>
                                    </div>
                                    <div className={styles.metroItem}>
                                        <div className={styles.metroIcon} style={{ background: '#ef4444' }}>M</div>
                                        <span>{t.contact.metro.olmazor}</span>
                                        <span className={styles.distance}>
                                            <Footprints size={14} /> 2,72 км
                                        </span>
                                    </div>
                                    <div className={styles.metroItem}>
                                        <div className={styles.metroIcon} style={{ background: '#ef4444' }}>M</div>
                                        <span>{t.contact.metro.mirzoUlugbek}</span>
                                        <span className={styles.distance}>
                                            <Footprints size={14} /> 3,4 км
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.cardButtons}>
                                    <button
                                        className={styles.primaryBtn}
                                        onClick={handleGetDirections}
                                    >
                                        {t.contact.buttons.directions}
                                    </button>
                                    <button className={styles.secondaryBtn}>{t.contact.buttons.reportError}</button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
