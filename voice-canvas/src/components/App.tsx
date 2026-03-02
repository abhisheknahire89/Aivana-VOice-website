import React, { useState, useCallback } from 'react';
import '../styles/globals.css';
import { PERSONAS, type Persona } from '../data/personas';
import Navbar from './Navbar/Navbar';
import HeroOrb from './HeroOrb/HeroOrb';
import PersonaSwitcher from './PersonaSwitcher/PersonaSwitcher';
import FeaturesModal from './FeaturesModal/FeaturesModal';
import FAQsModal from './FAQsModal/FAQsModal';
import BookDemoModal from './BookDemoModal/BookDemoModal';
import FloatingOrbs from './FloatingOrbs/FloatingOrbs';

export type ModalType = 'features' | 'faqs' | 'demo' | null;

const App: React.FC = () => {
    const [activePersona, setActivePersona] = useState<Persona>(PERSONAS[0]);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [isTalking, setIsTalking] = useState(false);

    const openModal = useCallback((m: ModalType) => setActiveModal(m), []);
    const closeModal = useCallback(() => setActiveModal(null), []);

    const handleOrbClick = useCallback(() => {
        if (activeModal) return;
        setIsTalking(prev => !prev);
    }, [activeModal]);

    const handlePersonaChange = useCallback((p: Persona) => {
        setIsTalking(false);
        setActivePersona(p);
    }, []);

    const isBlurred = activeModal !== null;

    return (
        <div
            className="relative w-full h-full overflow-hidden select-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #e8e8ec 0%, #d4d4dc 40%, #c0c0cc 70%, #b0b0c4 100%)' }}
        >
            {/* Edge vignette */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(80,80,110,0.18) 70%, rgba(60,60,90,0.35) 100%)',
                }}
            />

            {/* Floating background orbs */}
            <FloatingOrbs persona={activePersona} />

            {/* Main content — blurs when modal open */}
            <div
                className="absolute inset-0 z-10 flex flex-col transition-all duration-500"
                style={{
                    filter: isBlurred ? 'blur(8px)' : 'none',
                    transform: isBlurred ? 'scale(1.02)' : 'scale(1)',
                    pointerEvents: isBlurred ? 'none' : 'auto',
                }}
            >
                <Navbar
                    onFeatures={() => openModal('features')}
                    onFAQs={() => openModal('faqs')}
                    onBookDemo={() => openModal('demo')}
                />

                {/* Hero */}
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    {/* Announcement pill */}
                    <div
                        className="mb-6 px-4 py-2 rounded-full text-xs font-medium animate-slide-down"
                        style={{
                            background: 'rgba(255,255,255,0.7)',
                            border: '1px solid rgba(0,0,0,0.07)',
                            color: '#555',
                            backdropFilter: 'blur(10px)',
                            animationDelay: '0.1s',
                            opacity: 0,
                        }}
                    >
                        Voice AI built for Indian businesses &nbsp;·&nbsp; <span style={{ color: '#7C3AED', fontWeight: 600 }}>See how it works →</span>
                    </div>

                    {/* Headline */}
                    <h1
                        className="text-center font-bold leading-tight animate-fade-up"
                        style={{
                            fontSize: 'clamp(28px, 5vw, 58px)',
                            color: '#0f0f0f',
                            letterSpacing: '-0.03em',
                            maxWidth: 720,
                            animationDelay: '0.2s',
                            opacity: 0,
                        }}
                    >
                        Voice AI agents, tailored<br />
                        for every customer journey
                    </h1>

                    {/* Sub */}
                    <p
                        className="mt-4 text-center animate-fade-up"
                        style={{
                            fontSize: 'clamp(14px, 1.6vw, 18px)',
                            color: '#64646e',
                            maxWidth: 500,
                            lineHeight: 1.6,
                            animationDelay: '0.32s',
                            opacity: 0,
                        }}
                    >
                        {activePersona.description}
                    </p>

                    {/* Orb */}
                    <div className="my-6 md:my-8">
                        <HeroOrb persona={activePersona} isTalking={isTalking} onClick={handleOrbClick} />
                    </div>

                    {/* Book a demo CTA */}
                    <button
                        onClick={() => openModal('demo')}
                        className="animate-fade-up"
                        style={{
                            padding: '14px 32px',
                            borderRadius: 999,
                            background: '#0f0f0f',
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            animationDelay: '0.5s',
                            opacity: 0,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#333'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0f0f0f'; }}
                    >
                        Book a demo
                    </button>
                    <p
                        className="mt-2 animate-fade-up"
                        style={{
                            fontSize: 12,
                            color: '#9090a0',
                            animationDelay: '0.58s',
                            opacity: 0,
                        }}
                    >
                        {isTalking ? `Connected to ${activePersona.name} · AI conversation in progress` : 'Go live in a day. Multilingual from day one.'}
                    </p>

                    {/* Persona switcher */}
                    <div
                        className="mt-6 animate-fade-up"
                        style={{ animationDelay: '0.65s', opacity: 0 }}
                    >
                        <PersonaSwitcher
                            personas={PERSONAS}
                            active={activePersona}
                            onChange={handlePersonaChange}
                        />
                    </div>
                </div>

                {/* Trust bar */}
                <div
                    className="pb-5 flex flex-col items-center gap-2 animate-fade-up"
                    style={{ animationDelay: '0.8s', opacity: 0 }}
                >
                    <p style={{ fontSize: 11, color: '#aaa', letterSpacing: '0.04em' }}>
                        TRUSTED BY LEADING BUSINESSES ACROSS INDIA
                    </p>
                    <div className="flex items-center gap-8 flex-wrap justify-center px-4">
                        {['HealthFirst', 'QuickCure', 'ZenClinics', 'MediRoute'].map(b => (
                            <span key={b} style={{ fontSize: 13, fontWeight: 600, color: '#888', letterSpacing: '-0.02em' }}>{b}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'features' && (
                <FeaturesModal persona={activePersona} onClose={closeModal} />
            )}
            {activeModal === 'faqs' && (
                <FAQsModal onClose={closeModal} />
            )}
            {activeModal === 'demo' && (
                <BookDemoModal onClose={closeModal} />
            )}
        </div>
    );
};

export default App;
