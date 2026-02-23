import React from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Solutions from '@/components/Solutions/Solutions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Solutions - HireZone HR Services',
    description: 'Explore our professional HR solutions including Executive Search, Training, and Workforce Management.',
};

const SolutionsPage = () => {
    return (
        <main>
            <Header />
            <Solutions />
            <Footer />
        </main>
    );
};

export default SolutionsPage;
