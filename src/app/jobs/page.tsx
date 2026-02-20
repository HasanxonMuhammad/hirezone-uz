"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { MapPin, Search, Loader2, X, Clock, FileText, AlertCircle, ExternalLink, Building2, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Jobs.module.css';

interface Job {
    id: number;
    title: string;
    company?: string;
    location: string;
    type: string;
    description: string;
    logo?: string;
    createdAt?: string;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Hozirgina';
    if (h < 24) return `${h} soat oldin`;
    const d = Math.floor(h / 24);
    return `${d} kun oldin`;
}

function getTypeBadgeClass(type: string) {
    const map: Record<string, string> = {
        'Full Time': 'fulltime',
        'Part Time': 'parttime',
        'Contract': 'contract',
        'Remote': 'remote',
    };
    return map[type] || 'fulltime';
}

// ─── JOB DETAIL MODAL ────────────────────────────────────────────────────────
function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
    const [hasCV, setHasCV] = useState(false);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [showSimpleForm, setShowSimpleForm] = useState(false);
    const [simpleData, setSimpleData] = useState({ name: '', phone: '' });

    useEffect(() => {
        const saved = localStorage.getItem('hirezone_cv');
        if (saved) {
            const cv = JSON.parse(saved);
            setHasCV(!!(cv.firstName && cv.lastName && cv.email));
        }
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // ESC key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleApply = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Basic validation for simple form
        if (showSimpleForm && (!simpleData.name || !simpleData.phone)) {
            alert("Iltimos, ism va telefon raqamingizni kiriting");
            return;
        }

        setApplying(true);
        try {
            // Bu yerda backend API'ga yuborish kerak
            // const body = showSimpleForm ? { ...simpleData, jobId: job.id } : { cv: true, jobId: job.id };
            // await fetch('/api/apply', { method: 'POST', body: JSON.stringify(body) });

            await new Promise(r => setTimeout(r, 1500)); // simulate delay
            setApplying(false);
            setApplied(true);
        } catch (error) {
            console.error("Apply error:", error);
            setApplying(false);
        }
    };

    // Format description (newlines → paragraphs, markdown-like)
    const formatDesc = (text: string) => {
        return text.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            return <p key={i} style={{ marginBottom: '6px', lineHeight: '1.7' }}>{trimmed}</p>;
        });
    };

    return (
        <AnimatePresence>
            <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className={styles.modal}
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className={styles.modalHeader}>
                        <div className={styles.modalHeaderLeft}>
                            <div className={styles.modalLogo}>
                                <img
                                    src={job.logo || `https://placehold.co/56x56/4bcc5a/white?text=${job.title.charAt(0)}`}
                                    alt={job.company || job.title}
                                    onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/56x56/4bcc5a/white?text=${job.title.charAt(0)}`; }}
                                />
                            </div>
                            <div>
                                <h2 className={styles.modalTitle}>{job.title}</h2>
                                <div className={styles.modalMeta}>
                                    <span className={styles.modalCompany}>
                                        <Building2 size={14} /> {job.company || 'Magnat HR'}
                                    </span>
                                    <span className={styles.modalLocation}>
                                        <MapPin size={14} /> {job.location}
                                    </span>
                                    {job.createdAt && (
                                        <span className={styles.modalTime}>
                                            <Clock size={14} /> {timeAgo(job.createdAt)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button className={styles.modalClose} onClick={onClose}><X size={20} /></button>
                    </div>

                    {/* Badge */}
                    <div className={styles.modalBadgeRow}>
                        <span className={`${styles.badge} ${styles[getTypeBadgeClass(job.type)]}`}>{job.type}</span>
                    </div>

                    {/* Description Section */}
                    <div className={styles.modalBody}>
                        <div className={styles.modalInfoGrid}>
                            <div className={styles.modalInfoItem}>
                                <div className={styles.modalInfoIcon}><Clock size={18} /></div>
                                <div className={styles.modalInfoText}>
                                    <label>E'lon qilingan</label>
                                    <span>{job.createdAt ? timeAgo(job.createdAt) : 'Hozirgina'}</span>
                                </div>
                            </div>
                            <div className={styles.modalInfoItem}>
                                <div className={styles.modalInfoIcon}><Building2 size={18} /></div>
                                <div className={styles.modalInfoText}>
                                    <label>Kompaniya</label>
                                    <span>{job.company || 'Magnat HR'}</span>
                                </div>
                            </div>
                            <div className={styles.modalInfoItem}>
                                <div className={styles.modalInfoIcon}><MapPin size={18} /></div>
                                <div className={styles.modalInfoText}>
                                    <label>Joylashuv</label>
                                    <span>{job.location}</span>
                                </div>
                            </div>
                            <div className={styles.modalInfoItem}>
                                <div className={styles.modalInfoIcon}><FileText size={18} /></div>
                                <div className={styles.modalInfoText}>
                                    <label>Ish turi</label>
                                    <span>{job.type}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalSection}>
                            <h3 className={styles.modalSectionTitle}>
                                <FileText size={16} /> Vakansiya tavsifi
                            </h3>
                            <div className={styles.modalDesc}>
                                {job.description ? formatDesc(job.description) : 'Batafsil ma\'lumot mavjud emas.'}
                            </div>
                        </div>
                    </div>

                    {/* Apply Section */}
                    <div className={styles.modalFooter}>
                        {applied ? (
                            <div className={styles.appliedMessage}>
                                ✅ <strong>Arizangiz muvaffaqiyatli yuborildi!</strong> Tez orada mutaxassislarimiz {showSimpleForm ? simpleData.phone : 'siz'} bilan bog'lanishadi.
                            </div>
                        ) : showSimpleForm ? (
                            <form className={styles.simpleApplyForm} onSubmit={handleApply}>
                                <div className={styles.simpleFormDesc}>
                                    <strong>Tezkor ariza</strong>
                                    <p>CVingiz bo'lmasa, ma'lumotlaringizni qoldiring, biz sizga qo'ng'iroq qilamiz.</p>
                                </div>
                                <div className={styles.simpleFormFields}>
                                    <div className={styles.simpleInputField}>
                                        <label>Ism va familiyangiz</label>
                                        <input
                                            type="text"
                                            placeholder="Masalan: Aziz Azizov"
                                            required
                                            value={simpleData.name}
                                            onChange={e => setSimpleData({ ...simpleData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.simpleInputField}>
                                        <label>Telefon raqamingiz</label>
                                        <input
                                            type="tel"
                                            placeholder="+998 90 123 45 67"
                                            required
                                            value={simpleData.phone}
                                            onChange={e => setSimpleData({ ...simpleData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className={styles.simpleFormActions}>
                                    <button type="button" className={styles.backBtn} onClick={() => setShowSimpleForm(false)}>Orqaga</button>
                                    <button type="submit" className={styles.applyBtn} disabled={applying}>
                                        {applying ? <><Loader2 size={16} className={styles.spinIcon} /> Yuborilmoqda...</> : "Arizani yuborish"}
                                    </button>
                                </div>
                            </form>
                        ) : hasCV ? (
                            <div className={styles.applySection}>
                                <div className={styles.cvReadyBadge}>
                                    <FileText size={16} />
                                    <span>Sizning CVingiz tayyor</span>
                                </div>
                                <button
                                    className={styles.applyBtn}
                                    onClick={() => handleApply()}
                                    disabled={applying}
                                >
                                    {applying ? (
                                        <><Loader2 size={16} className={styles.spinIcon} /> Yuborilmoqda...</>
                                    ) : (
                                        <>📄 CV bilan ariza topshirish</>
                                    )}
                                </button>
                                <Link href="/cv-builder">
                                    <button className={styles.editCvBtn}>
                                        <ExternalLink size={14} /> CVni tahrirlash
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.noCvSection}>
                                <div className={styles.noCvAlert}>
                                    <AlertCircle size={18} />
                                    <div>
                                        <strong>CVingiz topilmadi</strong>
                                        <p>Professional CV yaratib, vakansiyaga bir tugma bilan ariza topshiring yoki tezkor ariza qoldiring.</p>
                                    </div>
                                </div>
                                <div className={styles.noCvActions}>
                                    <Link href="/cv-builder">
                                        <button className={styles.applyBtn}>
                                            <FileText size={16} /> CV yaratish →
                                        </button>
                                    </Link>
                                    <button className={styles.skipBtn} onClick={() => setShowSimpleForm(true)}>
                                        CVsiz ariza topshirish (Tezkor)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function JobsContent() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();

    const queryParam = searchParams.get('q') || '';
    const locationParam = searchParams.get('location') || '';

    const [queryVal, setQueryVal] = useState(queryParam);
    const [locationVal, setLocationVal] = useState(locationParam);
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        setQueryVal(queryParam);
        setLocationVal(locationParam);
    }, [queryParam, locationParam]);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/vacancies?lang=${language}`);
                const data = await res.json();
                if (data.success) setAllJobs(data.jobs);
            } catch (err) {
                console.error('Jobs fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [language]);

    const filteredJobs = useMemo(() => {
        return allJobs.filter(job => {
            const matchesQuery = !queryParam ||
                job.title.toLowerCase().includes(queryParam.toLowerCase()) ||
                (job.description || '').toLowerCase().includes(queryParam.toLowerCase());
            const matchesLocation = !locationParam ||
                job.location.toLowerCase().includes(locationParam.toLowerCase());
            return matchesQuery && matchesLocation;
        });
    }, [allJobs, queryParam, locationParam]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (queryVal) params.set('q', queryVal);
        if (locationVal) params.set('location', locationVal);
        router.push(`/jobs?${params.toString()}`);
    };

    return (
        <div className={styles.jobsPage}>
            <Header />

            {/* Hero Banner */}
            <section className={styles.banner}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        {t.latestJobs.title} <span>{t.latestJobs.titleSpan}</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        {t.latestJobs.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
                <div className="container">
                    <form className={styles.searchBar} onSubmit={handleSearch}>
                        <div className={styles.searchField}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder={t.hero?.searchPlaceholder || 'Kasb yoki kalit so\'z'}
                                value={queryVal}
                                onChange={e => setQueryVal(e.target.value)}
                            />
                        </div>
                        <div className={styles.searchField}>
                            <MapPin size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder={t.hero?.locationPlaceholder || 'Shahar'}
                                value={locationVal}
                                onChange={e => setLocationVal(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={styles.searchBtn}>
                            <Search size={18} />
                            <span>Qidirish</span>
                        </button>
                    </form>
                </div>
            </div>

            <div className="container">
                <div className={styles.mainContent}>
                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        <div className={styles.filterGroup}>
                            <h3>Ish turi</h3>
                            <div className={styles.checkboxList}>
                                {['Full Time', 'Part Time', 'Contract', 'Remote'].map(type => (
                                    <label key={type} className={styles.checkboxItem}>
                                        <input type="checkbox" /> {type}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.filterGroup}>
                            <h3>Yo'nalish</h3>
                            <div className={styles.checkboxList}>
                                {['IT va Dasturlash', 'Dizayn', 'Marketing', 'Moliya', 'Ta\'lim'].map(cat => (
                                    <label key={cat} className={styles.checkboxItem}>
                                        <input type="checkbox" /> {cat}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* CV builder promo */}
                        <div className={styles.cvPromo}>
                            <div className={styles.cvPromoIcon}>📄</div>
                            <h4>CV yarating</h4>
                            <p>Professional CV bilan ish topish 3x osonlashadi</p>
                            <Link href="/cv-builder">
                                <button className={styles.cvPromoBtn}>
                                    CV Builder <ChevronRight size={14} />
                                </button>
                            </Link>
                        </div>
                    </aside>

                    {/* Job Listings */}
                    <main>
                        <div className={styles.resultsHeader}>
                            <div className={styles.resultsCount}>
                                {loading ? 'Yuklanmoqda...' : (
                                    <>{filteredJobs.length === 0
                                        ? 'Vakansiya topilmadi'
                                        : <><span>{filteredJobs.length}</span> ta vakansiya topildi</>
                                    }</>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                                <Loader2 size={40} style={{ color: '#4bcc5a', animation: 'spin 1s linear infinite' }} />
                            </div>
                        ) : (
                            <motion.div className={styles.jobList}>
                                {filteredJobs.map((job, idx) => (
                                    <motion.div
                                        key={job.id || idx}
                                        className={styles.jobCard}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.07 }}
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        <div className={styles.jobMain}>
                                            <img
                                                src={job.logo || `https://placehold.co/60x60/4bcc5a/white?text=${job.title.charAt(0)}`}
                                                alt={job.company || job.title}
                                                className={styles.jobLogo}
                                                onError={e => {
                                                    (e.target as HTMLImageElement).src =
                                                        `https://placehold.co/60x60/4bcc5a/white?text=${job.title.charAt(0)}`;
                                                }}
                                            />
                                            <div>
                                                <h3>{job.title}</h3>
                                                <div className={styles.meta}>
                                                    <span className={styles.companyName}>
                                                        <Building2 size={13} /> {job.company || 'Magnat HR'}
                                                    </span>
                                                    <span className={styles.location}><MapPin size={13} /> {job.location}</span>
                                                </div>
                                                {job.description && (
                                                    <p className={styles.jobSnippet}>
                                                        {job.description.replace(/[🏢💰📞📋\-—\n]/g, ' ').trim().substring(0, 90)}...
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.jobActions}>
                                            <span className={`${styles.badge} ${styles[getTypeBadgeClass(job.type)]}`}>
                                                {job.type}
                                            </span>
                                            {job.createdAt && (
                                                <span className={styles.jobTime}>
                                                    <Clock size={12} /> {timeAgo(job.createdAt)}
                                                </span>
                                            )}
                                            <button
                                                className={styles.viewBtn}
                                                onClick={e => { e.stopPropagation(); setSelectedJob(job); }}
                                            >
                                                Ko'rish <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>

            <Footer />

            {/* Modal */}
            {selectedJob && (
                <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 size={40} /></div>}>
            <JobsContent />
        </Suspense>
    );
}
