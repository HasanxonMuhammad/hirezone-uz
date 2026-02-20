"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Send, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Footer.module.css';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.about}>
                        <div className={styles.logo}>
                            <Link href="/">
                                <Image
                                    src="/logo.svg"
                                    alt="HireZone Logo"
                                    width={180}
                                    height={50}
                                    className={styles.logoImage}
                                />
                            </Link>
                        </div>
                        <p>{t.footer.about}</p>
                        <div className={styles.social}>
                            <a href="#"><Facebook size={20} /></a>
                            <a href="#"><Send size={20} /></a>
                            <a href="#"><Instagram size={20} /></a>
                            <a href="#"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    <div className={styles.links}>
                        <h3>{t.footer.forCandidates}</h3>
                        <ul>
                            <li><Link href="/jobs">{t.footer.browseJobs}</Link></li>
                            <li><Link href="/candidates">{t.footer.candidateDashboard}</Link></li>
                            <li><Link href="/alerts">{t.footer.jobAlerts}</Link></li>
                            <li><Link href="/bookmarks">{t.footer.bookmarks}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.links}>
                        <h3>{t.footer.forEmployers}</h3>
                        <ul>
                            <li><Link href="/post-job">{t.footer.postJob}</Link></li>
                            <li><Link href="/candidates">{t.footer.browseCandidates}</Link></li>
                            <li><Link href="/employer-dashboard">{t.footer.employerDashboard}</Link></li>
                            <li><Link href="/pricing">{t.footer.pricing}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.contact}>
                        <h3>{t.footer.reachUs}</h3>
                        <ul>
                            <li><MapPin size={18} /> 123 Tech Avenue, Tashkent</li>
                            <li><Phone size={18} /> +998 71 123 45 67</li>
                            <li><Mail size={18} /> info@hirezone.uz</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p suppressHydrationWarning>&copy; {new Date().getFullYear()} HireZone. {t.footer.rights}</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/privacy">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
