"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Preloader.module.css';

const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className={styles.preloader}
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                >
                    <div className={styles.container}>
                        {/* Rotating Circle */}
                        <div className={styles.loaderCircle}>
                            <motion.div
                                className={styles.circleInner}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Logo / Text */}
                        <motion.div
                            className={styles.logoText}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <span className={styles.letter} data-text="H">H</span>
                            <span className={styles.letter} data-text="I">I</span>
                            <span className={styles.letter} data-text="R">R</span>
                            <span className={styles.letter} data-text="E">E</span>
                            <span className={styles.letter} data-text="Z">Z</span>
                            <span className={styles.letter} data-text="O">O</span>
                            <span className={styles.letter} data-text="N">N</span>
                            <span className={styles.letter} data-text="E">E</span>
                        </motion.div>

                        {/* Progress line (optional subtle detail) */}
                        <motion.div
                            className={styles.progressLine}
                            initial={{ width: 0 }}
                            animate={{ width: "120px" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
