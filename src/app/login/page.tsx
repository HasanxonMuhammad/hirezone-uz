"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Login.module.css';

export default function LoginPage() {
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

                <h1>Welcome Back</h1>
                <p>Login to your account to continue</p>

                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" placeholder="name@example.com" required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" required />
                    </div>

                    <Link href="/forgot-password" className={styles.forgotPassword}>
                        Forgot password?
                    </Link>

                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                        Login Now
                    </button>
                </form>

                <p className={styles.registerLink}>
                    Don't have an account? <Link href="/register">Create an account</Link>
                </p>
            </motion.div>
        </div>
    );
}
