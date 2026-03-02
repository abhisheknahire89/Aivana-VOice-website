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
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: 'radial-gradient(ellipse at 50% 50%, #eaeaee 0%, #d8d8e0 40%, #c4c4d0 70%, #b8b8c8 100%)',
                fontFamily: "'Inter', -apple-system, sans-serif",
                userSelect: 'none',
            }}
        >
            {/* Edge vignette */}
            <div
                style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                    background: 'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(70,70,100,0.12) 65%, rgba(50,50,80,0.28) 100%)',
                }}
            />

            {/* Floating background orbs */}
            <FloatingOrbs persona={activePersona} />

            {/* Main content layer */}
            <div
                style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    display: 'flex', flexDirection: 'column',
                    transition: 'filter 0.5s ease, transform 0.5s ease',
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

                {/* Hero — fills space below navbar */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 24px',
                        paddingTop: 72, // navbar height offset
                    }}
                >
                    {/* Announcement pill */}
                    <div
                        style={{
                            marginBottom: 20,
                            padding: '8px 18px',
                            borderRadius: 999,
                            background: 'rgba(255,255,255,0.72)',
                            border: '1px solid rgba(0,0,0,0.07)',
                            fontSize: 12,
                            color: '#555',
                            backdropFilter: 'blur(10px)',
                            animation: 'slide-down 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Voice AI built for Indian businesses &nbsp;·&nbsp;
                        <span style={{ color: '#7C3AED', fontWeight: 600 }}>See how it works →</span>
                    </div>

                    {/* Headline */}
                    <h1
                        style={{
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: 'clamp(26px, 4.5vw, 54px)',
                            color: '#0f0f0f',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.12,
                            maxWidth: 680,
                            margin: '0 auto',
                            animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                        }}
                    >
                        Voice AI agents, tailored<br />
                        for every customer journey
                    </h1>

                    {/* Subheading */}
                    <p
                        style={{
                            marginTop: 14,
                            textAlign: 'center',
                            fontSize: 'clamp(13px, 1.5vw, 17px)',
                            color: '#64646e',
                            maxWidth: 480,
                            lineHeight: 1.65,
                            animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both',
                        }}
                    >
                        {activePersona.description}
                    </p>

                    {/* Hero Orb */}
                    <div style={{ animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both' }}>
                        <HeroOrb persona={activePersona} isTalking={isTalking} onClick={handleOrbClick} />
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => openModal('demo')}
                        style={{
                            padding: '13px 32px',
                            borderRadius: 999,
                            background: '#0f0f0f',
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease, transform 0.15s ease',
                            animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#2d2d2d';
                            (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '#0f0f0f';
                            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                        }}
                    >
                        Book a demo
                    </button>

                    <p
                        style={{
                            marginTop: 8,
                            fontSize: 11,
                            color: '#9090a0',
                            textAlign: 'center',
                            animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.58s both',
                        }}
                    >
                        {isTalking
                            ? `Connected to ${activePersona.name} · AI conversation in progress`
                            : 'Go live in a day. Multilingual from day one.'}
                    </p>

                    {/* Persona Switcher */}
                    <div style={{ marginTop: 18, animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s both' }}>
                        <PersonaSwitcher
                            personas={PERSONAS}
                            active={activePersona}
                            onChange={handlePersonaChange}
                        />
                    </div>
                </div>

                {/* Trust bar */}
                <div
                    style={{
                        paddingBottom: 18,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.8s both',
                    }}
                >
                    <p style={{ fontSize: 10, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>
                        Trusted by leading businesses across India
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'center', padding: '0 16px' }}>
                        {['HealthFirst', 'QuickCure', 'ZenClinics', 'MediRoute'].map(b => (
                            <span key={b} style={{ fontSize: 13, fontWeight: 700, color: '#999', letterSpacing: '-0.02em' }}>{b}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'features' && <FeaturesModal persona={activePersona} onClose={closeModal} />}
            {activeModal === 'faqs' && <FAQsModal onClose={closeModal} />}
            {activeModal === 'demo' && <BookDemoModal onClose={closeModal} />}
        </div>
    );
};

export default App;
