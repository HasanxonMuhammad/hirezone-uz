"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Preloader.module.css';

const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = 'auto';
        }, 2000); // Strict 2-second limit

        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
        };
    }, []);

    const text = "HIREZONE";

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className={styles.preloader}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    <div className={styles.innerContainer}>
                        {/* Spinner on Top */}
                        <div className={styles.spinnerContainer}>
                            <motion.div
                                className={styles.circle}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Rapid Staggered Text Fill */}
                        <div className={styles.logoText}>
                            <svg className={styles.svgLogo} viewBox="0 0 800 120">
                                {text.split('').map((char, index) => {
                                    const xPos = index * 90 + 40;
                                    return (
                                        <g key={index}>
                                            {/* Step 1: Decorative Outline Base */}
                                            <text
                                                x={xPos}
                                                y="80"
                                                className={styles.letterBase}
                                                textAnchor="middle"
                                            >
                                                {char}
                                            </text>

                                            {/* Step 2: The "Scanning" Orbit Effect */}
                                            <motion.text
                                                x={xPos}
                                                y="80"
                                                className={styles.letterScan}
                                                textAnchor="middle"
                                                initial={{ strokeDashoffset: 1000, strokeDasharray: "150 1000" }}
                                                animate={{ strokeDashoffset: 0 }}
                                                transition={{
                                                    duration: 1.2,
                                                    delay: index * 0.1,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                {char}
                                            </motion.text>

                                            {/* Step 3: Lateral Wipe Fill (Left to Right) */}
                                            <motion.text
                                                x={xPos}
                                                y="80"
                                                className={styles.letterSolid}
                                                textAnchor="middle"
                                                initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0 }}
                                                animate={{
                                                    clipPath: 'inset(0% 0% 0% 0%)',
                                                    opacity: 1,
                                                }}
                                                transition={{
                                                    delay: 0.7 + (index * 0.12),
                                                    duration: 0.8,
                                                    ease: [0.4, 0, 0.2, 1]
                                                }}
                                                style={{
                                                    animation: `${styles.shine} 2s infinite ease-in-out`,
                                                    animationDelay: `${1.5 + (index * 0.1)}s`
                                                }}
                                            >
                                                {char}
                                            </motion.text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
