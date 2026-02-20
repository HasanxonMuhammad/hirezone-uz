
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Users, Settings, Target, BadgeDollarSign, Truck, Headset, Factory } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './IndustriesServed.module.css';

const IndustriesServed = () => {
    const { t } = useLanguage();

    const industries = [
        { icon: <Cpu size={32} />, title: t.industries.itTech, count: "4,250" },
        { icon: <Users size={32} />, title: t.industries.hrRecruitment, count: "1,820" },
        { icon: <Settings size={32} />, title: t.industries.businessSystems, count: "950" },
        { icon: <Target size={32} />, title: t.industries.salesMarketing, count: "3,100" },
        { icon: <BadgeDollarSign size={32} />, title: t.industries.financeAudit, count: "1,450" },
        { icon: <Truck size={32} />, title: t.industries.logistics, count: "2,780" },
        { icon: <Headset size={32} />, title: t.industries.customerService, count: "5,400" },
        { icon: <Factory size={32} />, title: t.industries.manufacturing, count: "2,150" },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.badgeWrapper}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {t.industries.badge}
                </motion.div>

                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {t.industries.title}
                </motion.h2>

                <div className={styles.grid}>
                    {industries.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.iconWrapper}>{item.icon}</div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardText}>{item.count} {t.industries.staffs}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    className={styles.viewAllBtn}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {t.industries.viewAll}
                </motion.button>
            </div>
        </section>
    );
};

export default IndustriesServed;
