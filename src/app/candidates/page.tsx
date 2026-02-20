"use client";

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { motion, Variants } from 'framer-motion';
import { MapPin, Briefcase } from 'lucide-react';
import styles from './Candidates.module.css';

const candidates = [
    { id: 1, name: 'Anvar Alimov', title: 'Senior Java Developer', location: 'Tashkent', exp: '5 Years', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Malika Karimova', title: 'UX/UI Designer', location: 'Samarkand', exp: '3 Years', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Jasur Bekov', title: 'Product Manager', location: 'Tashkent', exp: '7 Years', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'Zilola Ahmedova', title: 'Marketing Specialist', location: 'Remote', exp: '4 Years', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, name: 'Rustam Sodiqov', title: 'Data Scientist', location: 'Tashkent', exp: '2 Years', avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: 6, name: 'Shahnoza Ergasheva', title: 'Mobile Developer', location: 'Bukhara', exp: '4 Years', avatar: 'https://i.pravatar.cc/150?u=6' },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function CandidatesPage() {
    return (
        <>
            <Header />
            <main className={styles.candidatesPage}>
                <div className="container">
                    <motion.div
                        className={styles.banner}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1>Browse <span>Top Candidates</span></h1>
                        <p>Connect with the best talent in Uzbekistan for your business growth.</p>
                    </motion.div>

                    <motion.div
                        className={styles.grid}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {candidates.map((person) => (
                            <motion.div
                                key={person.id}
                                className={styles.candidateCard}
                                variants={itemVariants}
                            >
                                <img src={person.avatar} alt={person.name} className={styles.avatar} />
                                <h3>{person.name}</h3>
                                <span className={styles.title}>{person.title}</span>

                                <div className={styles.meta}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <MapPin size={14} /> {person.location}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Briefcase size={14} /> {person.exp}
                                    </span>
                                </div>

                                <button className={`btn btn-primary ${styles.viewBtn}`}>View Profile</button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
}
