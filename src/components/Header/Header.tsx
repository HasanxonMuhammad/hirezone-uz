"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search as SearchIcon, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isPagesOpen, setIsPagesOpen] = useState(false);
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const languages: { code: Language; label: string }[] = [
        { code: 'uz', label: 'O\'zbek' },
        { code: 'ru', label: 'Русский' },
        { code: 'en', label: 'English' },
    ];

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
            <div className={styles.headerContainer}>
                <div className={styles.logo}>
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="HireZone Logo"
                            width={180}
                            height={50}
                            priority
                            className={styles.logoImage}
                        />
                    </Link>
                </div>

                <nav className={`${styles.nav} ${isSearchOpen ? styles.navHidden : ''}`}>
                    <ul>
                        <li><Link href="/">{t.nav.home}</Link></li>
                        <li
                            className={styles.hasDropdown}
                            onMouseEnter={() => setIsSolutionsOpen(true)}
                            onMouseLeave={() => setIsSolutionsOpen(false)}
                        >
                            <Link href="#">{t.nav.solutions} <ChevronDown size={14} /></Link>
                            <AnimatePresence>
                                {isSolutionsOpen && (
                                    <motion.div
                                        className={styles.dropdown}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 15 }}
                                    >
                                        <Link href="/solutions">Our Solutions</Link>
                                        <Link href="/executive-search">Executive Search</Link>
                                        <Link href="/training">Training Session</Link>
                                        <Link href="/career-growth">Career Growth</Link>
                                        <Link href="/payroll">Payroll Services</Link>
                                        <Link href="/workforce">Workforce System</Link>
                                        <Link href="/temporary-jobs">Temporary Jobs</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                        <li
                            className={styles.hasDropdown}
                            onMouseEnter={() => setIsPagesOpen(true)}
                            onMouseLeave={() => setIsPagesOpen(false)}
                        >
                            <Link href="#">Pages <ChevronDown size={14} /></Link>
                            <AnimatePresence>
                                {isPagesOpen && (
                                    <motion.div
                                        className={styles.dropdown}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 15 }}
                                    >
                                        <Link href="/about">About Us</Link>
                                        <Link href="/recruitment">Recruitment</Link>
                                        <Link href="/consulting">Consulting</Link>
                                        <Link href="/outsourcing">Outsourcing</Link>
                                        <Link href="/contact">Contact</Link>
                                        <Link href="/jobs">Jobs List</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                        <li><Link href="/cv-builder">📄 CV Builder</Link></li>
                        <li><Link href="/contact">{t.nav.contact}</Link></li>
                    </ul>
                </nav>

                <div className={styles.actions}>
                    <div className={styles.secondaryActions}>
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.div
                                    className={styles.searchContainer}
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 220, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        autoFocus
                                        className={styles.searchInput}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            className={styles.searchBtn}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            {isSearchOpen ? <X size={18} /> : <SearchIcon size={18} />}
                        </button>

                        {!isSearchOpen && (
                            <div className={styles.langWrapper}>
                                <button
                                    className={styles.langBtn}
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                >
                                    <Globe size={16} />
                                    <span>{language.toUpperCase()}</span>
                                </button>
                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div
                                            className={styles.langDropdown}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                        >
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        setLanguage(lang.code);
                                                        setIsLangOpen(false);
                                                    }}
                                                    className={language === lang.code ? styles.activeLang : ''}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {!isSearchOpen && <div className={styles.divider}></div>}

                    <div className={`${styles.primaryActions} ${isSearchOpen ? styles.primaryHidden : ''}`}>
                        <Link href="/login" className={styles.loginBtn}>{t.nav.login}</Link>
                        <Link href="/post-job" className={styles.getStartedBtn}>{t.nav.getStarted}</Link>
                    </div>

                    {/* Mobile: Resume Maker CTA + Hamburger */}
                    <Link href="/cv-builder" className={styles.mobileResumeBtn}>
                        Rezyume Maker
                    </Link>

                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu — Full-Screen Curtain */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ y: '-100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-100%' }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    >
                        <nav className={styles.mobileNav}>
                            {[
                                { href: '/', label: t.nav.home },
                                { href: '/about', label: t.nav.about },
                                { href: '/recruitment', label: t.nav.recruitment || 'Recruitment' },
                                { href: '/consulting', label: t.nav.consulting || 'Consulting' },
                                { href: '/outsourcing', label: t.nav.outsourcing || 'Outsourcing' },
                                { href: '/business', label: t.nav.forBusiness },
                                { href: '/contact', label: t.nav.contact },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={styles.mobileNavLink}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        <motion.div
                            className={styles.mobileMenuFooter}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.3 }}
                        >
                            <div className={styles.mobileMenuLang}>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                        }}
                                        className={`${styles.mobileLangBtn} ${language === lang.code ? styles.mobileLangActive : ''}`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.mobileMenuActions}>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className={styles.mobileLoginBtn}>
                                    {t.nav.login}
                                </Link>
                                <Link href="/post-job" onClick={() => setIsMenuOpen(false)} className={styles.mobileGetStartedBtn}>
                                    {t.nav.getStarted}
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
