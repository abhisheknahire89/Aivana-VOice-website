import React, { useState, useCallback, useEffect, useRef } from 'react';
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
    const [personaIndex, setPersonaIndex] = useState(0);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [isTalking, setIsTalking] = useState(false);
    const [transitioning, setTransitioning] = useState(false);

    // scroll throttle
    const scrollCooldown = useRef(false);

    const activePersona: Persona = PERSONAS[personaIndex];

    // ── Scroll to cycle personas ──────────────────────────────────────────────
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (activeModal) return;             // ignore while modal is open
            if (scrollCooldown.current) return;  // throttle

            const direction = e.deltaY > 0 ? 1 : -1;

            setTransitioning(true);
            setTimeout(() => {
                setPersonaIndex(prev => (prev + direction + PERSONAS.length) % PERSONAS.length);
                setIsTalking(false);
                setTransitioning(false);
            }, 200); // brief fade-out, then swap

            scrollCooldown.current = true;
            setTimeout(() => { scrollCooldown.current = false; }, 700); // 700 ms cooldown
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [activeModal]);

    // ── Touch swipe to cycle personas (mobile) ────────────────────────────────
    const touchStart = useRef<number | null>(null);
    useEffect(() => {
        const onTouchStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientY; };
        const onTouchEnd = (e: TouchEvent) => {
            if (touchStart.current === null || activeModal) return;
            const diff = touchStart.current - e.changedTouches[0].clientY;
            if (Math.abs(diff) < 40) return; // too small → ignore
            const direction = diff > 0 ? 1 : -1;
            setTransitioning(true);
            setTimeout(() => {
                setPersonaIndex(prev => (prev + direction + PERSONAS.length) % PERSONAS.length);
                setIsTalking(false);
                setTransitioning(false);
            }, 200);
            touchStart.current = null;
        };
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        return () => {
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [activeModal]);

    const openModal = useCallback((m: ModalType) => setActiveModal(m), []);
    const closeModal = useCallback(() => setActiveModal(null), []);
    const handleOrbClick = useCallback(() => {
        if (activeModal) return;
        setIsTalking(prev => !prev);
    }, [activeModal]);
    const handlePersonaChange = useCallback((p: Persona) => {
        const idx = PERSONAS.findIndex(x => x.id === p.id);
        setPersonaIndex(idx);
        setIsTalking(false);
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

            {/* Scroll hint arrows on sides */}
            {!activeModal && (
                <>
                    <div
                        onClick={() => {
                            setPersonaIndex(prev => (prev - 1 + PERSONAS.length) % PERSONAS.length);
                            setIsTalking(false);
                        }}
                        style={{
                            position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                            zIndex: 20, cursor: 'pointer', opacity: 0.4,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.4'}
                    >
                        <span style={{ fontSize: 11, color: '#333', writingMode: 'vertical-rl', letterSpacing: '0.08em', fontWeight: 500 }}>PREV</span>
                        <div style={{ width: 1, height: 40, background: 'rgba(0,0,0,0.25)' }} />
                    </div>
                    <div
                        onClick={() => {
                            setPersonaIndex(prev => (prev + 1) % PERSONAS.length);
                            setIsTalking(false);
                        }}
                        style={{
                            position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
                            zIndex: 20, cursor: 'pointer', opacity: 0.4,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.4'}
                    >
                        <div style={{ width: 1, height: 40, background: 'rgba(0,0,0,0.25)' }} />
                        <span style={{ fontSize: 11, color: '#333', writingMode: 'vertical-rl', letterSpacing: '0.08em', fontWeight: 500 }}>NEXT</span>
                    </div>
                </>
            )}

            {/* Persona index dots */}
            {!activeModal && (
                <div
                    style={{
                        position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)',
                        zIndex: 20, display: 'flex', gap: 6,
                    }}
                >
                    {PERSONAS.map((p, i) => (
                        <div
                            key={p.id}
                            onClick={() => { setPersonaIndex(i); setIsTalking(false); }}
                            style={{
                                width: i === personaIndex ? 20 : 6,
                                height: 6,
                                borderRadius: 999,
                                background: i === personaIndex ? activePersona.color : 'rgba(0,0,0,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                            }}
                        />
                    ))}
                </div>
            )}

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

                {/* Hero */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 24px',
                        paddingTop: 64,
                        // fade during transition
                        opacity: transitioning ? 0 : 1,
                        transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                    }}
                >
                    {/* Persona label badge */}
                    <div
                        style={{
                            marginBottom: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '7px 16px',
                            borderRadius: 999,
                            background: 'rgba(255,255,255,0.72)',
                            border: '1px solid rgba(0,0,0,0.07)',
                            backdropFilter: 'blur(10px)',
                            animation: 'slide-down 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                        }}
                    >
                        <div
                            style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: activePersona.color,
                                boxShadow: `0 0 8px 2px ${activePersona.glowColor}`,
                                flexShrink: 0,
                            }}
                        />
                        <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>
                            {activePersona.name} &nbsp;·&nbsp; {activePersona.role}
                        </span>
                        <span style={{ fontSize: 11, color: '#bbb' }}>scroll to explore ↕</span>
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

                    {/* Persona tagline */}
                    <p
                        style={{
                            marginTop: 10,
                            textAlign: 'center',
                            fontSize: 'clamp(13px, 1.5vw, 17px)',
                            color: activePersona.color,
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                            animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.28s both',
                        }}
                    >
                        {activePersona.tagline}
                    </p>

                    {/* Persona description */}
                    <p
                        style={{
                            marginTop: 6,
                            textAlign: 'center',
                            fontSize: 'clamp(13px, 1.4vw, 16px)',
                            color: '#64646e',
                            maxWidth: 460,
                            lineHeight: 1.65,
                            animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.34s both',
                        }}
                    >
                        {activePersona.description}
                    </p>

                    {/* Hero Orb */}
                    <div style={{ animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.42s both' }}>
                        <HeroOrb persona={activePersona} isTalking={isTalking} onClick={handleOrbClick} />
                    </div>

                    {/* CTA */}
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
                            fontFamily: "'Inter', sans-serif",
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = '#2d2d2d';
                            (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)';
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

                    {/* Persona Switcher pills */}
                    <div style={{ marginTop: 20, animation: 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s both' }}>
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
                        paddingBottom: 22,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
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
