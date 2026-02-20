"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
    Plus, Trash2, Download, Save, Eye, EyeOff, User, Briefcase,
    GraduationCap, Star, Phone, Mail, MapPin, Globe, Linkedin,
    Award, ChevronDown, ChevronUp, CheckCircle2, AlertCircle,
    FileText, Palette, LayoutTemplate, ArrowLeft, GripVertical,
    Columns2, Rows2, AlignLeft, Layout, Trello, Zap
} from 'lucide-react';
import styles from './CVBuilder.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header/Header';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Experience {
    id: string; company: string; position: string;
    startDate: string; endDate: string; current: boolean; description: string;
}
interface Education {
    id: string; school: string; degree: string; field: string;
    startDate: string; endDate: string; current: boolean; gpa: string;
}
interface Skill {
    id: string; name: string; level: number;
}
interface LangItem {
    id: string; name: string; level: string;
}
interface Award {
    id: string; title: string; issuer: string; date: string; description: string;
}
interface CVData {
    firstName: string; lastName: string; profession: string; summary: string;
    email: string; phone: string; location: string; website: string; linkedin: string;
    photo: string; color: string; font: string; template: string;
    experiences: Experience[]; education: Education[];
    skills: Skill[]; languages: LangItem[]; awards: Award[];
}

const uid = () => Math.random().toString(36).slice(2, 9);
const DEFAULT_CV: CVData = {
    firstName: 'Azizbek', lastName: 'Karimov', profession: 'Senior Software Engineer', summary: 'Men 5 yillik tajribaga ega Full-stack dasturchiman. Murakkab veb-ilovalarni yaratish va jamoani boshqarishda tajribam bor. Doimiy ravishda yangi texnologiyalarni o\'rganishga intilaman.',
    email: 'azizbek@example.com', phone: '+998 90 123 45 67', location: 'Toshkent, O\'zbekiston', website: 'hirezone.uz', linkedin: 'linkedin.com/in/azizbek',
    photo: '', color: '#00bf63', font: 'Jost', template: 'executive',
    experiences: [
        { id: uid(), company: 'Google', position: 'Senior Developer', startDate: '2021-01', endDate: '', current: true, description: 'Yirik qidiruv tizimlari va yuqori yuklamali servislar bilan ishlash.' },
        { id: uid(), company: 'EPAM Systems', position: 'Middle Developer', startDate: '2019-06', endDate: '2020-12', current: false, description: 'Xalqaro bank loyihalari uchun frontend qismini ishlab chiqish.' }
    ],
    education: [
        { id: uid(), school: 'Toshkent Axborot Texnologiyalari Universiteti', degree: 'Bakalavr', field: 'Dasturiy injiniring', startDate: '2015-09', endDate: '2019-06', current: false, gpa: '4.5' }
    ],
    skills: [
        { id: uid(), name: 'React', level: 4 },
        { id: uid(), name: 'Next.js', level: 4 },
        { id: uid(), name: 'TypeScript', level: 3 },
        { id: uid(), name: 'Node.js', level: 3 }
    ],
    languages: [
        { id: uid(), name: 'O\'zbek tili', level: 'Ona tili' },
        { id: uid(), name: 'Ingliz tili', level: 'IELTS 7.5' }
    ],
    awards: [],
};

const COLORS = ['#00bf63', '#3c375b', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4'];
const FONTS = ['Jost', 'Inter', 'Merriweather', 'Playfair Display', 'Roboto Mono'];
const TEMPLATES = [
    { id: 'executive', name: 'Executive', desc: 'Premium Executive dizayn', icon: LayoutTemplate },
    { id: 'pikachu', name: 'Pikachu', desc: 'Yorqin sarlavhali dizayn', icon: Zap },
    { id: 'bronzor', name: 'Bronzor', desc: 'Minimalist va toza', icon: AlignLeft },
];
const SKILL_LEVELS = ['Yangi', 'O\'rta', 'Yaxshi', 'Ekspert'];

// ─── CV TEMPLATES ─────────────────────────────────────────────────────────────
const ExecutiveTemplate = ({ cv }: { cv: CVData }) => {
    const name = `${cv.firstName} ${cv.lastName}`.trim() || 'Ism Familiya';
    return (
        <div className={styles.tplExec} style={{ fontFamily: cv.font + ', sans-serif' }}>
            <div className={styles.tplExecSidebar}>
                <div className={styles.tplExecPhotoWrap}>
                    {cv.photo ? <img src={cv.photo} alt="photo" className={styles.tplExecPhoto} /> : <div className={styles.tplExecPhotoNone}><User size={48} /></div>}
                </div>

                {cv.awards.length > 0 && (
                    <div className={styles.tplExecSideSection}>
                        <h3 style={{ color: cv.color }}>Sertifikatlar</h3>
                        {cv.awards.map(a => (
                            <div key={a.id} className={styles.tplExecSideItem}>
                                <strong>{a.title}</strong>
                                <div>{a.issuer} | {a.date}</div>
                            </div>
                        ))}
                    </div>
                )}

                {cv.languages.length > 0 && (
                    <div className={styles.tplExecSideSection}>
                        <h3 style={{ color: cv.color }}>Tillar</h3>
                        <div className={styles.tplExecSideItem}>
                            {cv.languages.map(l => (
                                <div key={l.id} style={{ marginBottom: '6px', fontSize: '11px' }}>
                                    <strong>{l.name || 'Til nomi'}</strong>: {l.level}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.tplExecSideSection}>
                    <h3 style={{ color: cv.color }}>Qiziqishlar</h3>
                    <div className={styles.tplExecInterests}>
                        <span>Futbol</span> <span>Kitobxonlik</span> <span>Sayohat</span>
                    </div>
                </div>
            </div>

            <div className={styles.tplExecMain}>
                <div className={styles.tplExecHeader} style={{ background: cv.color }}>
                    <h1 className={styles.tplExecName}>{name}</h1>
                    <p className={styles.tplExecHeadline}>{cv.profession}</p>
                    <div className={styles.tplExecContact}>
                        {cv.email && <span><Mail size={12} /> {cv.email}</span>}
                        {cv.phone && <span><Phone size={12} /> {cv.phone}</span>}
                        {cv.location && <span><MapPin size={12} /> {cv.location}</span>}
                    </div>
                </div>

                <div className={styles.tplExecSection}>
                    <h3 className={styles.tplExecSecTitle} style={{ color: cv.color, borderBottomColor: cv.color + '40' }}>Haqimda</h3>
                    <p className={styles.tplExecSummary}>{cv.summary}</p>
                </div>

                {cv.education.length > 0 && (
                    <div className={styles.tplExecSection}>
                        <h3 className={styles.tplExecSecTitle} style={{ color: cv.color, borderBottomColor: cv.color + '40' }}>Ta'lim</h3>
                        {cv.education.map(e => (
                            <div key={e.id} className={styles.tplExecEntry}>
                                <div className={styles.tplExecEntryHead}>
                                    <strong>{e.school || 'O\'quv maskani'}</strong>
                                    <span>{e.startDate} – {e.current ? 'Hozir' : e.endDate}</span>
                                </div>
                                <div className={styles.tplExecEntrySub}>{e.degree} {e.field && `• ${e.field}`}</div>
                                {e.gpa && <div style={{ fontSize: '11px', color: '#666' }}>GPA: {e.gpa}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {cv.skills.length > 0 && (
                    <div className={styles.tplExecSection}>
                        <h3 className={styles.tplExecSecTitle} style={{ color: cv.color, borderBottomColor: cv.color + '40' }}>Ko'nikmalar</h3>
                        <div className={styles.tplExecSkillsGrid}>
                            {cv.skills.map(s => (
                                <div key={s.id} className={styles.tplExecSkillItem}>
                                    <span className={styles.tplExecSkillName}>{s.name}</span>
                                    <div className={styles.tplExecStars}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} size={11} fill={star <= s.level ? cv.color : 'none'} color={cv.color} strokeWidth={2} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {cv.experiences.length > 0 && (
                    <div className={styles.tplExecSection} style={{ borderBottom: 'none' }}>
                        <h3 className={styles.tplExecSecTitle} style={{ color: cv.color, borderBottomColor: cv.color + '40' }}>Tajriba</h3>
                        {cv.experiences.map(e => (
                            <div key={e.id} className={styles.tplExecEntry}>
                                <div className={styles.tplExecEntryHead}>
                                    <strong>{e.position}</strong>
                                    <span>{e.startDate} – {e.current ? 'Hozir' : e.endDate}</span>
                                </div>
                                <div className={styles.tplExecEntrySub}>{e.company}</div>
                                {e.description && <p className={styles.tplExecEntryDesc}>{e.description}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const PikachuTemplate = ({ cv }: { cv: CVData }) => {
    const name = `${cv.firstName} ${cv.lastName}`.trim() || 'Ism Familiya';
    return (
        <div className={styles.tplPikachu} style={{ fontFamily: cv.font + ', sans-serif' }}>
            <div className={styles.tplPikachuHeader} style={{ background: cv.color }}>
                <div className={styles.tplPikachuPhotoWrap}>
                    {cv.photo ? (
                        <img src={cv.photo} alt="photo" className={styles.tplPikachuPhoto} />
                    ) : (
                        <div className={styles.tplPikachuPhotoNone}><User size={40} /></div>
                    )}
                </div>
                <div className={styles.tplPikachuInfo}>
                    <h1 className={styles.tplPikachuName}>{name}</h1>
                    <p className={styles.tplPikachuHeadline}>{cv.profession}</p>
                    <div className={styles.tplPikachuContacts}>
                        {cv.email && <span><Mail size={12} /> {cv.email}</span>}
                        {cv.phone && <span><Phone size={12} /> {cv.phone}</span>}
                        {cv.location && <span><MapPin size={12} /> {cv.location}</span>}
                    </div>
                </div>
            </div>

            <div className={styles.tplPikachuContent}>
                <div className={styles.tplPikachuMain}>
                    <div className={styles.tplPikachuSection}>
                        <h3 style={{ color: cv.color }}>Haqimda</h3>
                        <p>{cv.summary}</p>
                    </div>

                    {cv.experiences.length > 0 && (
                        <div className={styles.tplPikachuSection}>
                            <h3 style={{ color: cv.color }}>Ish tajribasi</h3>
                            {cv.experiences.map(e => (
                                <div key={e.id} className={styles.tplPikachuEntry}>
                                    <div className={styles.tplPikachuEntryHead}>
                                        <strong>{e.position}</strong>
                                        <span>{e.startDate} – {e.current ? 'Hozir' : e.endDate}</span>
                                    </div>
                                    <div className={styles.tplPikachuCompany}>{e.company}</div>
                                    {e.description && <p>{e.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {cv.education.length > 0 && (
                        <div className={styles.tplPikachuSection}>
                            <h3 style={{ color: cv.color }}>Ta'lim</h3>
                            {cv.education.map(e => (
                                <div key={e.id} className={styles.tplPikachuEntry}>
                                    <div className={styles.tplPikachuEntryHead}>
                                        <strong>{e.school}</strong>
                                        <span>{e.startDate} – {e.current ? 'Hozir' : e.endDate}</span>
                                    </div>
                                    <div className={styles.tplPikachuCompany}>{e.degree} {e.field && `• ${e.field}`}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.tplPikachuSidebar}>
                    {cv.skills.length > 0 && (
                        <div className={styles.tplPikachuSection}>
                            <h3 style={{ color: cv.color }}>Ko'nikmalar</h3>
                            <div className={styles.tplPikachuSkills}>
                                {cv.skills.map(s => (
                                    <div key={s.id} className={styles.tplPikachuSkillItem}>
                                        <span>{s.name}</span>
                                        <div className={styles.tplPikachuSkillBar}>
                                            <div style={{ width: `${s.level * 20}%`, background: cv.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {cv.languages.length > 0 && (
                        <div className={styles.tplPikachuSection}>
                            <h3 style={{ color: cv.color }}>Tillar</h3>
                            {cv.languages.map(l => (
                                <div key={l.id} className={styles.tplPikachuLang}>
                                    <strong>{l.name}</strong>
                                    <span>{l.level}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {cv.awards.length > 0 && (
                        <div className={styles.tplPikachuSection}>
                            <h3 style={{ color: cv.color }}>Sertifikatlar</h3>
                            {cv.awards.map(a => (
                                <div key={a.id} className={styles.tplPikachuAward}>
                                    <strong>{a.title}</strong>
                                    <div>{a.issuer}</div>
                                    <small>{a.date}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BronzorTemplate = ({ cv }: { cv: CVData }) => {
    const name = `${cv.firstName} ${cv.lastName}`.trim() || 'Ism Familiya';
    return (
        <div className={styles.tplBronzor} style={{ fontFamily: cv.font + ', sans-serif' }}>
            <div className={styles.tplBronzorHeader}>
                <div className={styles.tplBronzorPhotoWrap}>
                    {cv.photo ? (
                        <img src={cv.photo} alt="photo" className={styles.tplBronzorPhoto} />
                    ) : (
                        <div className={styles.tplBronzorPhotoNone}><User size={40} /></div>
                    )}
                </div>
                <h1 className={styles.tplBronzorName}>{name}</h1>
                <p className={styles.tplBronzorRole} style={{ color: cv.color }}>{cv.profession}</p>
                <div className={styles.tplBronzorContact}>
                    {cv.email && <span>{cv.email}</span>}
                    {cv.phone && <span>{cv.phone}</span>}
                    {cv.location && <span>{cv.location}</span>}
                </div>
                <div className={styles.tplBronzorLine} style={{ background: cv.color }} />
            </div>

            <div className={styles.tplBronzorBody}>
                <div className={styles.tplBronzorMain}>
                    <div className={styles.tplBronzorSection}>
                        <h2>Haqimda</h2>
                        <p>{cv.summary}</p>
                    </div>

                    {cv.experiences.length > 0 && (
                        <div className={styles.tplBronzorSection}>
                            <h2>Ish tajribasi</h2>
                            {cv.experiences.map(e => (
                                <div key={e.id} className={styles.tplBronzorEntry}>
                                    <div className={styles.tplBronzorEntryTop}>
                                        <strong>{e.position}</strong>
                                        <span>{e.startDate} – {e.current ? 'Hozir' : e.endDate}</span>
                                    </div>
                                    <div className={styles.tplBronzorCompany}>{e.company}</div>
                                    {e.description && <p>{e.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {cv.education.length > 0 && (
                        <div className={styles.tplBronzorSection}>
                            <h2>Ta'lim</h2>
                            {cv.education.map(e => (
                                <div key={e.id} className={styles.tplBronzorEntry}>
                                    <div className={styles.tplBronzorEntryTop}>
                                        <strong>{e.school}</strong>
                                        <span>{e.startDate} – {e.current ? 'Hozir' : e.endDate}</span>
                                    </div>
                                    <div className={styles.tplBronzorCompany}>{e.degree} {e.field && `• ${e.field}`}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.tplBronzorSide}>
                    {cv.skills.length > 0 && (
                        <div className={styles.tplBronzorSection}>
                            <h2>Ko'nikmalar</h2>
                            <div className={styles.tplBronzorSkills}>
                                {cv.skills.map(s => (
                                    <div key={s.id} className={styles.tplBronzorSkill}>
                                        <span>{s.name}</span>
                                        <div className={styles.tplBronzorDots}>
                                            {[1, 2, 3, 4, 5].map(d => (
                                                <div key={d} className={styles.tplBronzorDot} style={{ background: d <= s.level ? cv.color : '#e2e8f0' }} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {cv.languages.length > 0 && (
                        <div className={styles.tplBronzorSection}>
                            <h2>Tillar</h2>
                            {cv.languages.map(l => (
                                <div key={l.id} className={styles.tplBronzorLang}>
                                    <strong>{l.name}</strong>
                                    <span>{l.level}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {cv.awards.length > 0 && (
                        <div className={styles.tplBronzorSection}>
                            <h2>Sertifikatlar</h2>
                            {cv.awards.map(a => (
                                <div key={a.id} className={styles.tplBronzorAward}>
                                    <strong>{a.title}</strong>
                                    <div>{a.issuer}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Section = ({ icon, title, children, highlighted = false }: { icon: React.ReactNode; title: string; children: React.ReactNode; highlighted?: boolean }) => {
    const [open, setOpen] = useState(true);
    return (
        <div className={`${styles.formSection} ${highlighted ? styles.highlightedSection : ''}`}>
            <button className={styles.sectionBtn} onClick={() => setOpen(!open)}>
                <span>{icon} {title}</span>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {open && <div className={styles.sectionBody}>{children}</div>}
        </div>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CVBuilderPage() {
    const [cv, setCv] = useState<CVData>(DEFAULT_CV);
    const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
    const [showPreview, setShowPreview] = useState(false);
    const [saved, setSaved] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const s = localStorage.getItem('hirezone_cv');
        if (s) { try { setCv(JSON.parse(s)); } catch { } }
    }, []);

    const set = useCallback(<K extends keyof CVData>(field: K, val: CVData[K]) => {
        setCv(p => ({ ...p, [field]: val }));
    }, []);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                set('photo', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const save = () => {
        localStorage.setItem('hirezone_cv', JSON.stringify(cv));
        setSaved(true); setTimeout(() => setSaved(false), 2500);
    };

    const print = () => {
        const el = document.getElementById('cv-preview');
        if (!el) return;
        const win = window.open('', '_blank', 'width=850,height=1100');
        if (!win) return;
        const styles_all = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(el => el.outerHTML).join('');
        win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV</title>
      ${styles_all}
      <style>body{margin:0;padding:0}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}</style>
      </head><body>${el.outerHTML}</body></html>`);
        win.document.close();
        setTimeout(() => { win.focus(); win.print(); }, 600);
    };

    // array helpers
    const addExp = () => set('experiences', [...cv.experiences, { id: uid(), company: '', position: '', startDate: '', endDate: '', current: false, description: '' }]);
    const updExp = (id: string, f: keyof Experience, v: any) => set('experiences', cv.experiences.map(e => e.id === id ? { ...e, [f]: v } : e));
    const delExp = (id: string) => set('experiences', cv.experiences.filter(e => e.id !== id));

    const addEdu = () => set('education', [...cv.education, { id: uid(), school: '', degree: '', field: '', startDate: '', endDate: '', current: false, gpa: '' }]);
    const updEdu = (id: string, f: keyof Education, v: any) => set('education', cv.education.map(e => e.id === id ? { ...e, [f]: v } : e));
    const delEdu = (id: string) => set('education', cv.education.filter(e => e.id !== id));

    const addSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            set('skills', [...cv.skills, { id: uid(), name: newSkill.trim(), level: 3 }]);
            setNewSkill('');
        }
    };
    const updSkillLevel = (id: string, level: number) => set('skills', cv.skills.map(s => s.id === id ? { ...s, level } : s));
    const delSkill = (id: string) => set('skills', cv.skills.filter(s => s.id !== id));

    const addLang = () => set('languages', [...cv.languages, { id: uid(), name: '', level: "O'rta" }]);
    const updLang = (id: string, f: 'name' | 'level', v: string) => set('languages', cv.languages.map(l => l.id === id ? { ...l, [f]: v } : l));
    const delLang = (id: string) => set('languages', cv.languages.filter(l => l.id !== id));

    const addAward = () => set('awards', [...cv.awards, { id: uid(), title: '', issuer: '', date: '', description: '' }]);
    const updAward = (id: string, f: keyof Award, v: string) => set('awards', cv.awards.map(a => a.id === id ? { ...a, [f]: v } : a));
    const delAward = (id: string) => set('awards', cv.awards.filter(a => a.id !== id));

    const Template = cv.template === 'pikachu' ? PikachuTemplate :
        cv.template === 'bronzor' ? BronzorTemplate :
            ExecutiveTemplate;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <div className={styles.app}>
                {/* ─── TOP BAR ─── */}
                <header className={styles.topbar}>
                    <div className={styles.topbarLeft}>
                        <Link href="/" className={styles.topbarBack}>
                            <ArrowLeft size={18} />
                        </Link>
                        <div className={styles.topbarLogo}>
                            <img src="/logo.svg" alt="HireZone" height={32} />
                            <span className={styles.topbarDivider}>|</span>
                            <span className={styles.topbarTag}>CV BUILDER</span>
                        </div>
                    </div>
                    <div className={styles.topbarActions}>
                        <button className={`${styles.topBtn} ${showPreview ? styles.topBtnActive : ''}`} onClick={() => setShowPreview(!showPreview)}>
                            {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
                            <span>{showPreview ? 'Tahrirlash' : 'Ko\'rish'}</span>
                        </button>
                        <button className={styles.topBtn} onClick={save}>
                            {saved ? <><CheckCircle2 size={15} color="#00bf63" /> Saqlandi</> : <><Save size={15} /> Saqlash</>}
                        </button>
                        <button className={`${styles.topBtn} ${styles.topBtnDownload}`} onClick={print}>
                            <Download size={15} /> PDF Yuklash
                        </button>
                    </div>
                </header>

                <div className={styles.workspace}>
                    {/* ─── SIDEBAR FORM ─── */}
                    {!showPreview && (
                        <aside className={styles.sidebar}>
                            {/* Tabs */}
                            <div className={styles.tabs}>
                                <button className={`${styles.tab} ${activeTab === 'content' ? styles.tabActive : ''}`} onClick={() => setActiveTab('content')}>
                                    <FileText size={15} /> Ma'lumot
                                </button>
                                <button className={`${styles.tab} ${activeTab === 'design' ? styles.tabActive : ''}`} onClick={() => setActiveTab('design')}>
                                    <Palette size={15} /> Dizayn
                                </button>
                            </div>

                            <div className={styles.sidebarContent}>
                                {activeTab === 'design' ? (
                                    /* ─── DESIGN TAB ─── */
                                    <div className={styles.designTab}>
                                        <div className={styles.designGroup}>
                                            <label className={styles.designLabel}>Shablon</label>
                                            <div className={styles.templateGrid}>
                                                {TEMPLATES.map(t => (
                                                    <button
                                                        key={t.id}
                                                        className={`${styles.templateCard} ${cv.template === t.id ? styles.templateCardActive : ''}`}
                                                        onClick={() => set('template', t.id)}
                                                    >
                                                        <div className={styles.templateThumb}>
                                                            <t.icon size={28} color={cv.template === t.id ? cv.color : '#94a3b8'} strokeWidth={1.5} />
                                                        </div>
                                                        <span className={styles.templateName}>{t.name}</span>
                                                        <span className={styles.templateDesc}>{t.desc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.designGroup}>
                                            <label className={styles.designLabel}>Asosiy rang</label>
                                            <div className={styles.colorGrid}>
                                                {COLORS.map(c => (
                                                    <button
                                                        key={c}
                                                        className={`${styles.colorDot} ${cv.color === c ? styles.colorDotActive : ''}`}
                                                        style={{ background: c }}
                                                        onClick={() => set('color', c)}
                                                    />
                                                ))}
                                            </div>
                                            <input
                                                type="color"
                                                value={cv.color}
                                                onChange={e => set('color', e.target.value)}
                                                className={styles.colorCustom}
                                            />
                                        </div>

                                        <div className={styles.designGroup}>
                                            <label className={styles.designLabel}>Shrift</label>
                                            <div className={styles.fontGrid}>
                                                {FONTS.map(f => (
                                                    <button
                                                        key={f}
                                                        className={`${styles.fontBtn} ${cv.font === f ? styles.fontBtnActive : ''}`}
                                                        style={{ fontFamily: f }}
                                                        onClick={() => set('font', f)}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* ─── CONTENT TAB ─── */
                                    <div className={styles.contentTab}>
                                        {/* Personal */}
                                        <Section icon={<User size={15} />} title="SHAXSIY MA'LUMOT" highlighted>
                                            <div className={styles.photoUploadRow}>
                                                <div className={styles.photoPreviewSide}>
                                                    {cv.photo ? (
                                                        <img src={cv.photo} alt="Preview" />
                                                    ) : (
                                                        <div className={styles.photoPlaceholder}><User size={24} /></div>
                                                    )}
                                                </div>
                                                <div className={styles.photoUploadBtnGroup}>
                                                    <button
                                                        className={styles.uploadTrigger}
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <Plus size={14} /> Rasm yuklash
                                                    </button>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        style={{ display: 'none' }}
                                                        accept="image/*"
                                                        onChange={handlePhotoUpload}
                                                    />
                                                    {cv.photo && (
                                                        <button className={styles.photoDelBtn} onClick={() => set('photo', '')}>
                                                            O'chirish
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.grid2}>
                                                <div className={styles.field}>
                                                    <label>ISM</label>
                                                    <input value={cv.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Jasur" />
                                                </div>
                                                <div className={styles.field}>
                                                    <label>FAMILIYA</label>
                                                    <input value={cv.lastName} onChange={e => set('lastName', e.target.value)} placeholder="To'xtaev" />
                                                </div>
                                            </div>
                                            <div className={styles.field}>
                                                <label>KASB / LAVOZIM</label>
                                                <input value={cv.profession} onChange={e => set('profession', e.target.value)} placeholder="Full Stack Developer" />
                                            </div>
                                            <div className={styles.grid2}>
                                                <div className={styles.field}>
                                                    <label><Mail size={12} /> EMAIL</label>
                                                    <input type="email" value={cv.email} onChange={e => set('email', e.target.value)} placeholder="jasur@email.com" />
                                                </div>
                                                <div className={styles.field}>
                                                    <label><Phone size={12} /> TELEFON</label>
                                                    <input value={cv.phone} onChange={e => set('phone', e.target.value)} placeholder="+998 90 123 45 67" />
                                                </div>
                                                <div className={styles.field}>
                                                    <label><MapPin size={12} /> SHAHAR</label>
                                                    <input value={cv.location} onChange={e => set('location', e.target.value)} placeholder="Toshkent" />
                                                </div>
                                                <div className={styles.field}>
                                                    <label><Linkedin size={12} /> LINKEDIN</label>
                                                    <input value={cv.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
                                                </div>
                                            </div>
                                            <div className={styles.field}>
                                                <label><Globe size={12} /> WEBSITE</label>
                                                <input value={cv.website} onChange={e => set('website', e.target.value)} placeholder="https://mysite.com" />
                                            </div>
                                            <div className={styles.field}>
                                                <label>QISQACHA TANISHUV</label>
                                                <textarea rows={4} value={cv.summary} onChange={e => set('summary', e.target.value)} placeholder="O'zingiz va maqsadlaringiz haqida 2-4 jumla..." />
                                            </div>
                                        </Section>

                                        {/* Experience */}
                                        <Section icon={<Briefcase size={15} />} title="Ish tajribasi">
                                            {cv.experiences.map((exp) => (
                                                <div key={exp.id} className={styles.entryBlock}>
                                                    <div className={styles.entryBlockHeader}>
                                                        <strong>{exp.position || exp.company || 'Yangi yozuv'}</strong>
                                                        <button onClick={() => delExp(exp.id)} className={styles.delBtn}><Trash2 size={14} /></button>
                                                    </div>
                                                    <div className={styles.grid2}>
                                                        <div className={styles.field}>
                                                            <label>Kompaniya</label>
                                                            <input value={exp.company} onChange={e => updExp(exp.id, 'company', e.target.value)} placeholder="Google" />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label>Lavozim</label>
                                                            <input value={exp.position} onChange={e => updExp(exp.id, 'position', e.target.value)} placeholder="Developer" />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label>Boshlanish</label>
                                                            <input type="month" value={exp.startDate} onChange={e => updExp(exp.id, 'startDate', e.target.value)} />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label>Tugash</label>
                                                            <input type="month" value={exp.endDate} disabled={exp.current} onChange={e => updExp(exp.id, 'endDate', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <label className={styles.checkRow}>
                                                        <input type="checkbox" checked={exp.current} onChange={e => updExp(exp.id, 'current', e.target.checked)} />
                                                        Hozirda ishlayapman
                                                    </label>
                                                    <div className={styles.field}>
                                                        <label>Tavsif</label>
                                                        <textarea rows={3} value={exp.description} onChange={e => updExp(exp.id, 'description', e.target.value)} placeholder="Asosiy vazifalar..." />
                                                    </div>
                                                </div>
                                            ))}
                                            <button className={styles.addRowBtn} onClick={addExp}><Plus size={15} /> Tajriba qo'shish</button>
                                        </Section>

                                        {/* Education */}
                                        <Section icon={<GraduationCap size={15} />} title="Ta'lim">
                                            {cv.education.map((edu) => (
                                                <div key={edu.id} className={styles.entryBlock}>
                                                    <div className={styles.entryBlockHeader}>
                                                        <strong>{edu.school || 'Yangi yozuv'}</strong>
                                                        <button onClick={() => delEdu(edu.id)} className={styles.delBtn}><Trash2 size={14} /></button>
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>O'quv muassasasi</label>
                                                        <input value={edu.school} onChange={e => updEdu(edu.id, 'school', e.target.value)} placeholder="TATU" />
                                                    </div>
                                                    <div className={styles.grid2}>
                                                        <div className={styles.field}>
                                                            <label>Daraja</label>
                                                            <select value={edu.degree} onChange={e => updEdu(edu.id, 'degree', e.target.value)}>
                                                                <option value="">Tanlang</option>
                                                                {['Bakalavr', 'Magistr', 'Doktor', 'O\'rta maxsus', 'Kurs', 'Sertifikat'].map(d => <option key={d}>{d}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label>Yo'nalish</label>
                                                            <input value={edu.field} onChange={e => updEdu(edu.id, 'field', e.target.value)} placeholder="Dasturlash" />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label>Boshlanish</label>
                                                            <input type="month" value={edu.startDate} onChange={e => updEdu(edu.id, 'startDate', e.target.value)} />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label>Tugash</label>
                                                            <input type="month" value={edu.endDate} disabled={edu.current} onChange={e => updEdu(edu.id, 'endDate', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <label className={styles.checkRow}>
                                                        <input type="checkbox" checked={edu.current} onChange={e => updEdu(edu.id, 'current', e.target.checked)} />
                                                        Hozirda o'qimoqdaman
                                                    </label>
                                                    <div className={styles.field}>
                                                        <label>GPA (ixtiyoriy)</label>
                                                        <input value={edu.gpa} onChange={e => updEdu(edu.id, 'gpa', e.target.value)} placeholder="3.8" />
                                                    </div>
                                                </div>
                                            ))}
                                            <button className={styles.addRowBtn} onClick={addEdu}><Plus size={15} /> Ta'lim qo'shish</button>
                                        </Section>

                                        {/* Skills */}
                                        <Section icon={<Star size={15} />} title="Ko'nikmalar">
                                            <div className={styles.field}>
                                                <label>Ko'nikma qo'shish (Enter bosing)</label>
                                                <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={addSkill} placeholder="React, Figma, Excel..." />
                                            </div>
                                            {cv.skills.map(sk => (
                                                <div key={sk.id} className={styles.skillRow}>
                                                    <span className={styles.skillName}>{sk.name}</span>
                                                    <div className={styles.skillLevels}>
                                                        {[1, 2, 3, 4, 5].map(l => (
                                                            <button
                                                                key={l}
                                                                className={`${styles.levelDot} ${sk.level >= l ? styles.levelDotFill : ''}`}
                                                                style={{ background: sk.level >= l ? cv.color : undefined }}
                                                                onClick={() => updSkillLevel(sk.id, l)}
                                                                title={SKILL_LEVELS[l - 1]}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className={styles.levelLabel}>{SKILL_LEVELS[sk.level - 1] || 'Ekspert'}</span>
                                                    <button className={styles.delBtnMini} onClick={() => delSkill(sk.id)}><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                            {cv.skills.length === 0 && <p className={styles.emptyHint}>Ko'nikma qo'shing — ular CV'da daraja jadvalidek ko'rinadi</p>}

                                            <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                                                <label className={styles.subLabel}>Tillar</label>
                                                {cv.languages.map(l => (
                                                    <div key={l.id} className={styles.langRow}>
                                                        <input placeholder="Til nomi" value={l.name} onChange={e => updLang(l.id, 'name', e.target.value)} />
                                                        <select value={l.level} onChange={e => updLang(l.id, 'level', e.target.value)}>
                                                            {["Boshlang'ich", "O'rta", "Yuqori", "Mukammal", "Ona tili"].map(v => <option key={v}>{v}</option>)}
                                                        </select>
                                                        <button className={styles.delBtnMini} onClick={() => delLang(l.id)}><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                                <button className={styles.addRowBtn} onClick={addLang}><Plus size={15} /> Til qo'shish</button>
                                            </div>
                                        </Section>

                                        {/* Awards */}
                                        <Section icon={<Award size={15} />} title="Sertifikat va Mukofotlar">
                                            {cv.awards.map(a => (
                                                <div key={a.id} className={styles.entryBlock}>
                                                    <div className={styles.entryBlockHeader}>
                                                        <strong>{a.title || 'Yangi yozuv'}</strong>
                                                        <button onClick={() => delAward(a.id)} className={styles.delBtn}><Trash2 size={14} /></button>
                                                    </div>
                                                    <div className={styles.grid2}>
                                                        <div className={styles.field}>
                                                            <label>Nomi</label>
                                                            <input value={a.title} onChange={e => updAward(a.id, 'title', e.target.value)} placeholder="AWS Certified" />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label>Beruvchi tashkilot</label>
                                                            <input value={a.issuer} onChange={e => updAward(a.id, 'issuer', e.target.value)} placeholder="Amazon" />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label>Sana</label>
                                                            <input type="month" value={a.date} onChange={e => updAward(a.id, 'date', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button className={styles.addRowBtn} onClick={addAward}><Plus size={15} /> Qo'shish</button>
                                        </Section>
                                    </div>
                                )}
                            </div>
                        </aside>
                    )}

                    {/* ─── PREVIEW CANVAS ─── */}
                    <main className={`${styles.canvas} ${showPreview ? styles.canvasFull : ''}`}>
                        <div className={styles.canvasInner}>
                            <div className={styles.paper} id="cv-preview">
                                <Template cv={cv} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
