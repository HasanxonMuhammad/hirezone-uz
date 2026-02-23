"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSession, signOut } from 'next-auth/react';
import { Sun, Moon, Coffee, LogOut, ChevronLeft, User as UserIcon, Globe, Bell, Shield, Palette } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Settings.module.css';

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const { data: session } = useSession();

    const themes = [
        { id: 'light', name: 'Light', icon: Sun, color: '#ffffff' },
        { id: 'dark', name: 'Dark', icon: Moon, color: '#1a1a1a' },
        { id: 'sepia', name: 'Sepia', icon: Coffee, color: '#f4ecd8' },
    ];

    if (!session) {
        return (
            <div className={styles.container}>
                <div className={styles.loginPrompt}>
                    <h2>{t.auth.loginTitle}</h2>
                    <p>Please log in to access settings.</p>
                    <Link href="/login" className={styles.loginBtn}>Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <header className={styles.header}>
                    <Link href="/" className={styles.backBtn}>
                        <ChevronLeft size={20} />
                        <span>Back to Home</span>
                    </Link>
                    <h1>{t.nav.settings || 'Settings'}</h1>
                </header>

                <div className={styles.content}>
                    {/* User Profile Summary */}
                    <section className={styles.section}>
                        <div className={styles.profileCard}>
                            <div className={styles.avatarLarge}>
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="Avatar" />
                                ) : (
                                    <span>{session.user?.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className={styles.profileInfo}>
                                <h2>{session.user?.name}</h2>
                                <p>{session.user?.email}</p>
                            </div>
                        </div>
                    </section>

                    {/* Appearance Settings */}
                    <section className={styles.section}>
                        <div className={styles.sectionTitle}>
                            <Palette size={18} />
                            <h3>Appearance</h3>
                        </div>
                        <div className={styles.themeGrid}>
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    className={`${styles.themeCard} ${theme === t.id ? styles.activeTheme : ''}`}
                                    onClick={() => setTheme(t.id as any)}
                                >
                                    <div className={styles.themePreview} style={{ background: t.color }}>
                                        <t.icon size={24} />
                                    </div>
                                    <span>{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* General Settings */}
                    <section className={styles.section}>
                        <div className={styles.sectionTitle}>
                            <Globe size={18} />
                            <h3>Language</h3>
                        </div>
                        <div className={styles.langList}>
                            {['uz', 'ru', 'en'].map((lang) => (
                                <button
                                    key={lang}
                                    className={`${styles.langItem} ${language === lang ? styles.activeLang : ''}`}
                                    onClick={() => setLanguage(lang as any)}
                                >
                                    {lang === 'uz' ? "O'zbek" : lang === 'ru' ? "Русский" : "English"}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Placeholder Sections */}
                    <section className={styles.section}>
                        <div className={styles.sectionTitle}>
                            <Bell size={18} />
                            <h3>Notifications</h3>
                        </div>
                        <div className={styles.toggleItem}>
                            <span>Email Notifications</span>
                            <div className={styles.toggle}></div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionTitle}>
                            <Shield size={18} />
                            <h3>Privacy & Security</h3>
                        </div>
                        <Link href="/settings/privacy" className={styles.linkItem}>
                            <span>Manage your privacy data</span>
                        </Link>
                    </section>

                    {/* Bottom Actions */}
                    <div className={styles.footer}>
                        <button onClick={() => signOut()} className={styles.logoutBtn}>
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
