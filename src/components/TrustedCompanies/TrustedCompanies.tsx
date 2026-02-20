"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './TrustedCompanies.module.css';

const companies = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Airbnb', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg' },
];

const TrustedCompanies = () => {
    return (
        <section className={styles.trusted}>
            <div className="container">
                <p className={styles.title}>500+ dan ortiq yetakchi kompaniyalar bizning platformadan foydalanadi</p>
                <div className={styles.logoGrid}>
                    {companies.map((company, index) => (
                        <motion.div
                            key={index}
                            className={styles.logoItem}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 0.5, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ opacity: 1, scale: 1.05 }}
                        >
                            <img src={company.logo} alt={company.name} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedCompanies;
