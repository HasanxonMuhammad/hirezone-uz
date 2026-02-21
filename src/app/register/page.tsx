"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Register.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/login?registered=true');
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Network error, please try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.registerPage}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.svg" alt="HireZone Logo" width={220} height={75} priority />
                </Link>

                <h1>{t.auth.registerTitle}</h1>
                <p>{t.auth.registerSubtitle}</p>

                {error && <div className={styles.errorMessage}>{error}</div>}

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

                <div className={styles.roleSelection}>
                    <div
                        className={`${styles.roleItem} ${role === 'candidate' ? styles.active : ''}`}
                        onClick={() => setRole('candidate')}
                    >
                        <h3>{t.auth.candidate}</h3>
                        <p>{t.auth.candidateText}</p>
                    </div>
                    <div
                        className={`${styles.roleItem} ${role === 'employer' ? styles.active : ''}`}
                        onClick={() => setRole('employer')}
                    >
                        <h3>{t.auth.employer}</h3>
                        <p>{t.auth.employerText}</p>
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="firstName">{t.auth.firstName}</label>
                        <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="lastName">{t.auth.lastName}</label>
                        <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label htmlFor="email">{t.auth.email}</label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">{t.auth.password}</label>
                        <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">{t.auth.confirmPassword}</label>
                        <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                    </div>

                    <button type="submit" disabled={loading} className={`btn btn-primary ${styles.submitBtn}`}>
                        {loading ? '...' : t.auth.registerBtn}
                    </button>
                </form>

                <p className={styles.loginLink}>
                    {t.auth.hasAccount} <Link href="/login">{t.auth.loginHere}</Link>
                </p>
            </motion.div>
        </div>
    );
}
