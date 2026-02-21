"use client";

import { MapPin, Phone, Mail, Navigation, Footprints } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './Contact.module.css';

export default function ContactPage() {
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
                            Contact us
                        </motion.h1>
                        <motion.div
                            className={styles.breadcrumb}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Link href="/">Home</Link>
                            <span>-</span>
                            <span className={styles.breadcrumbActive}>Contact us</span>
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
                                            <p>Shota Rustaveli Street, 150<br />Tashkent, Uzbekistan</p>
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
                                src="https://yandex.uz/map-widget/v1/-/CDg3sE4b"
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
                                    <h3>улица Шота Руставели, 150</h3>
                                    <p>Ташкент</p>
                                    <button className={styles.closeBtn}>×</button>
                                </div>

                                <div className={styles.metroList}>
                                    <div className={styles.metroItem}>
                                        <div className={styles.metroIcon} style={{ background: '#ef4444' }}>M</div>
                                        <span>Чиланзар</span>
                                        <span className={styles.distance}>
                                            <Footprints size={14} /> 2,45 км
                                        </span>
                                    </div>
                                    <div className={styles.metroItem}>
                                        <div className={styles.metroIcon} style={{ background: '#ef4444' }}>M</div>
                                        <span>Алмазар</span>
                                        <span className={styles.distance}>
                                            <Footprints size={14} /> 2,72 км
                                        </span>
                                    </div>
                                    <div className={styles.metroItem}>
                                        <div className={styles.metroIcon} style={{ background: '#ef4444' }}>M</div>
                                        <span>Мирзо Улугбек</span>
                                        <span className={styles.distance}>
                                            <Footprints size={14} /> 3,4 км
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.cardButtons}>
                                    <button className={styles.primaryBtn}>Организации в доме</button>
                                    <button className={styles.secondaryBtn}>Сообщить об ошибке</button>
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
