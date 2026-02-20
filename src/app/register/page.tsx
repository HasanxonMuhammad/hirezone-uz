"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Register.module.css';

export default function RegisterPage() {
    const [role, setRole] = useState<'candidate' | 'employer'>('candidate');

    return (
        <div className={styles.registerPage}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.svg" alt="HireZone Logo" width={180} height={45} priority />
                </Link>

                <h1>Create Account</h1>
                <p>Join our professional community today</p>

                <div className={styles.roleSelection}>
                    <div
                        className={`${styles.roleItem} ${role === 'candidate' ? styles.active : ''}`}
                        onClick={() => setRole('candidate')}
                    >
                        <h3>Candidate</h3>
                        <p>I am looking for a job</p>
                    </div>
                    <div
                        className={`${styles.roleItem} ${role === 'employer' ? styles.active : ''}`}
                        onClick={() => setRole('employer')}
                    >
                        <h3>Employer</h3>
                        <p>I am hiring talent</p>
                    </div>
                </div>

                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" placeholder="John" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" placeholder="Doe" required />
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" placeholder="name@example.com" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                        Register Now
                    </button>
                </form>

                <p className={styles.loginLink}>
                    Already have an account? <Link href="/login">Login here</Link>
                </p>
            </motion.div>
        </div>
    );
}
