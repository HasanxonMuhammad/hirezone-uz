"use client";
// v1.0.1 - force redeploy

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Login.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const { t } = useLanguage();

    return (
        <div className={styles.loginPage}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.svg" alt="HireZone Logo" width={180} height={45} priority />
                </Link>

                <h1>{t.auth.loginTitle}</h1>
                <p>{t.auth.loginSubtitle}</p>

                <div className={styles.socialAuth}>
                    <button
                        className={styles.googleBtn}
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>{t.auth.google}</span>
                    </button>
                </div>

                <div className={styles.divider}>
                    <span>{t.auth.or}</span>
                </div>

                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">{t.auth.email}</label>
                        <input type="email" id="email" placeholder="name@example.com" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">{t.auth.password}</label>
                        <input type="password" id="password" placeholder="••••••••" required />
                    </div>

                    <Link href="/forgot-password" className={styles.forgotPassword}>
                        {t.auth.forgotPassword}
                    </Link>

                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                        {t.auth.loginBtn}
                    </button>
                </form>

                <p className={styles.registerLink}>
                    {t.auth.noAccount} <Link href="/register">{t.auth.createAccount}</Link>
                </p>
            </motion.div>
        </div>
    );
}
