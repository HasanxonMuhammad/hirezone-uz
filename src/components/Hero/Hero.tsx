"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Search, MapPin, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import styles from './Hero.module.css';

const CATEGORIES = [
    'IT & Tech', 'Marketing', 'Finance', 'Design', 'Sales', 'HR', 'Management', 'Engineering'
];

const Hero = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const [isBtnHovered, setIsBtnHovered] = React.useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [catOpen, setCatOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (searchLocation) params.set('location', searchLocation);
        if (selectedCat) params.set('category', selectedCat);
        router.push(`/jobs?${params.toString()}`);
    };

    return (
        <motion.section
            className={`${styles.hero} ${isBtnHovered ? styles.heroHovered : ''}`}
            initial="rest"
            animate={isBtnHovered ? "hover" : "rest"}
        >
            {/* Floating Avatars */}
            <motion.div
                className={`${styles.floatingAvatar} ${styles.avatar1}`}
                variants={{
                    rest: { x: -50, opacity: 1, scale: 0.9 },
                    hover: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 25, mass: 1.2 } }
                }}
                animate={isBtnHovered ? "hover" : "rest"}
            >
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                    <div className={styles.avatarImage}><img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" alt="HR Manager" /></div>
                    <div className={styles.avatarLabel} style={{ backgroundColor: '#4bcc5a' }}>{t.avatars.hrManager}</div>
                </motion.div>
            </motion.div>

            <motion.div
                className={`${styles.floatingAvatar} ${styles.avatar2}`}
                variants={{
                    rest: { x: 50, opacity: 1, scale: 0.9 },
                    hover: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 25, mass: 1.2 } }
                }}
                animate={isBtnHovered ? "hover" : "rest"}
            >
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                    <div className={styles.avatarImage}><img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" alt="Business Owner" /></div>
                    <div className={styles.avatarLabel} style={{ backgroundColor: '#fcd34d' }}>{t.avatars.businessOwner}</div>
                </motion.div>
            </motion.div>

            <motion.div
                className={`${styles.floatingAvatar} ${styles.avatar3}`}
                variants={{
                    rest: { x: -50, opacity: 1, scale: 0.9 },
                    hover: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 25, mass: 1.2, delay: 0.1 } }
                }}
                animate={isBtnHovered ? "hover" : "rest"}
            >
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                    <div className={styles.avatarImage}><img src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=200&h=200&fit=crop" alt="Recruiter" /></div>
                    <div className={styles.avatarLabel} style={{ backgroundColor: '#2dd4bf' }}>{t.avatars.recruiter}</div>
                </motion.div>
            </motion.div>

            <motion.div
                className={`${styles.floatingAvatar} ${styles.avatar4}`}
                variants={{
                    rest: { x: 50, opacity: 1, scale: 0.9 },
                    hover: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 25, mass: 1.2, delay: 0.1 } }
                }}
                animate={isBtnHovered ? "hover" : "rest"}
            >
                <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
                    <div className={styles.avatarImage}><img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop" alt="HR Expert" /></div>
                    <div className={styles.avatarLabel} style={{ backgroundColor: '#fb923c' }}>{t.avatars.expert}</div>
                </motion.div>
            </motion.div>

            <div className="container">
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className={styles.heroBadge}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <span className={styles.badgeDot}></span>
                        {t.hero.trustedBy}
                    </motion.div>

                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {t.hero.title} <br />
                        <span>{t.hero.titleSpan}</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {t.hero.subtitle}
                    </motion.p>

                    {/* Search Bar */}
                    <motion.form
                        className={styles.searchBar}
                        onSubmit={handleSearch}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <div className={styles.searchField}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder={t.hero.searchPlaceholder || 'Job title or keyword...'}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.searchDivider} />

                        <div className={styles.searchField}>
                            <MapPin size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder={t.hero.locationPlaceholder || 'City or remote...'}
                                value={searchLocation}
                                onChange={e => setSearchLocation(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.searchDivider} />

                        <div className={styles.searchField + ' ' + styles.catField} onClick={() => setCatOpen(!catOpen)}>
                            <ChevronDown size={18} className={styles.searchIcon} />
                            <span className={styles.catText}>
                                {selectedCat || (t.hero.categoryPlaceholder || 'Category')}
                            </span>
                            {catOpen && (
                                <div className={styles.catDropdown}>
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={e => { e.stopPropagation(); setSelectedCat(cat); setCatOpen(false); }}
                                            className={selectedCat === cat ? styles.catActive : ''}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" className={styles.searchBtn}>
                            <Search size={18} />
                            {t.hero.searchBtn || 'Search Jobs'}
                        </button>
                    </motion.form>

                    {/* CTA Buttons */}
                    <motion.div
                        className={styles.heroButtons}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.5 }}
                    >
                        <Link
                            href="/hire"
                            className={`${styles.btnMain} ${styles.btnHire}`}
                            onMouseEnter={() => setIsBtnHovered(true)}
                            onMouseLeave={() => setIsBtnHovered(false)}
                        >
                            {t.hero.hireTalent}
                        </Link>
                        <Link
                            href="/jobs"
                            className={`${styles.btnMain} ${styles.btnFind}`}
                            onMouseEnter={() => setIsBtnHovered(true)}
                            onMouseLeave={() => setIsBtnHovered(false)}
                        >
                            {t.hero.findJob} <ArrowUpRight size={20} />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Hero;
