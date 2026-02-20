"use client";

import { motion, Variants } from 'framer-motion';
import { Code, Megaphone, Palette, HandCoins, Microscope, Monitor, Briefcase, HeartPulse } from 'lucide-react';
import styles from './Categories.module.css';

const categories = [
    { name: 'Software Development', icon: <Code />, count: '1.2k' },
    { name: 'Marketing & Sales', icon: <Megaphone />, count: '850' },
    { name: 'Graphic Design', icon: <Palette />, count: '430' },
    { name: 'Finance & Accounts', icon: <HandCoins />, count: '210' },
    { name: 'Health & Care', icon: <HeartPulse />, count: '120' },
    { name: 'Scientific Research', icon: <Microscope />, count: '80' },
    { name: 'Data Science', icon: <Monitor />, count: '150' },
    { name: 'Management', icon: <Briefcase />, count: '300' },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12,
        },
    },
};

const Categories = () => {
    return (
        <section className="section-padding bg-light">
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>Popular <span>Categories</span></h2>
                    <p>Browse jobs by category and find the perfect opportunity for your skills.</p>
                </motion.div>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {categories.map((cat, index) => (
                        <motion.div
                            key={index}
                            className={styles.categoryCard}
                            variants={itemVariants}
                        >
                            <div className={styles.iconWrapper}>{cat.icon}</div>
                            <h3>{cat.name}</h3>
                            <span>({cat.count} Jobs Available)</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Categories;
