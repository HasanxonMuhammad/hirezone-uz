"use client";

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { motion } from 'framer-motion';
import styles from './PostJob.module.css';

export default function PostJobPage() {
    return (
        <>
            <Header />
            <main className={styles.postJobPage}>
                <div className="container">
                    <motion.div
                        className={styles.formCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h1>Post a <span>New Job</span></h1>

                        <form onSubmit={(e) => e.preventDefault()}>
                            <h3 className={styles.sectionHeader}>Job Information</h3>
                            <div className={styles.grid}>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Job Title</label>
                                    <input type="text" placeholder="e.g. Senior Product Designer" required />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Job Category</label>
                                    <select required>
                                        <option value="">Select Category</option>
                                        <option value="it">Development</option>
                                        <option value="design">Design</option>
                                        <option value="marketing">Marketing</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Job Type</label>
                                    <select required>
                                        <option value="full-time">Full Time</option>
                                        <option value="part-time">Part Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="remote">Remote</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Salary Range (Optional)</label>
                                    <input type="text" placeholder="e.g. $2000 - $3000" />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Location</label>
                                    <input type="text" placeholder="e.g. Tashkent, Uzbekistan" required />
                                </div>

                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Description</label>
                                    <textarea rows={6} placeholder="Describe the job responsibilities and requirements..." required></textarea>
                                </div>
                            </div>

                            <h3 className={styles.sectionHeader}>Company Information</h3>
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label>Company Name</label>
                                    <input type="text" placeholder="Your Company Ltd." required />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Website URL</label>
                                    <input type="url" placeholder="https://example.com" />
                                </div>
                            </div>

                            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                                Publish Job Opening
                            </button>
                        </form>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
