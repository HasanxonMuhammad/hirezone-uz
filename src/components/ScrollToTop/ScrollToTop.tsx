"use client";

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ScrollToTop.module.css';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after 300px
            const scrolled = window.scrollY;
            if (scrolled > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            // Calculate scroll progress
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                const progressPercentage = (scrolled / scrollHeight) * 100;
                setProgress(progressPercentage);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // SVG Circle Path Calculation
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={styles.scrollTopWrapper}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    onClick={scrollToTop}
                >
                    <svg className={styles.progressCircle} width="50" height="50" viewBox="0 0 50 50">
                        <circle
                            className={styles.progressCircleBg}
                            cx="25"
                            cy="25"
                            r={radius}
                            fill="none"
                            strokeWidth="3"
                        />
                        <motion.circle
                            className={styles.progressCircleValue}
                            cx="25"
                            cy="25"
                            r={radius}
                            fill="none"
                            strokeWidth="3"
                            strokeDasharray={circumference}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            style={{
                                transform: 'rotate(-90deg)',
                                transformOrigin: 'center'
                            }}
                        />
                    </svg>
                    <div className={styles.icon}>
                        <ChevronUp size={24} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
