"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, BookOpen, User, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './MobileBottomNav.module.css';

const MobileBottomNav = () => {
    const { t } = useLanguage();
    const pathname = usePathname();

    const navItems = [
        { icon: <Home size={22} />, href: '/' },
        { icon: <Search size={22} />, href: '/jobs' },
        { icon: <PlusCircle size={28} />, href: '/post-job', special: true },
        { icon: <BookOpen size={22} />, href: '/cv-builder' },
        { icon: <User size={22} />, href: '/login' },
    ];

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={`${styles.navItem} ${pathname === item.href ? styles.active : ''} ${item.special ? styles.special : ''}`}
                >
                    <div className={styles.iconWrapper}>
                        {item.icon}
                    </div>
                </Link>
            ))}
        </nav>
    );
};

export default MobileBottomNav;
