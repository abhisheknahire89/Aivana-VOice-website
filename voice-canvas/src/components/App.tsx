import React, { useState, useCallback, useEffect, useRef } from 'react';
import '../styles/globals.css';
import { PERSONAS, type Persona } from '../data/personas';
import Navbar from './Navbar/Navbar';
import HeroOrb, { type OrbState } from './HeroOrb/HeroOrb';
import FeaturesModal from './FeaturesModal/FeaturesModal';
import FAQsModal from './FAQsModal/FAQsModal';
import BookDemoModal from './BookDemoModal/BookDemoModal';
import SplineBackground from './SplineBackground/SplineBackground';

export type ModalType = 'features' | 'faqs' | 'demo' | null;

const App: React.FC = () => {
    const [personaIndex, setPersonaIndex] = useState(0);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [orbState, setOrbState] = useState<OrbState>('idle');
    const [transitioning, setTransitioning] = useState(false);
    const scrollCooldown = useRef(false);
    const touchStart = useRef<number | null>(null);

    const activePersona: Persona = PERSONAS[personaIndex];

    const cyclePersona = useCallback((dir: 1 | -1) => {
        if (scrollCooldown.current) return;
        setTransitioning(true);
        setTimeout(() => {
            setPersonaIndex(prev => (prev + dir + PERSONAS.length) % PERSONAS.length);
            setOrbState('idle');
            setTransitioning(false);
        }, 200);
        scrollCooldown.current = true;
        setTimeout(() => { scrollCooldown.current = false; }, 700);
    }, []);

    // Arrow keys
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (activeModal) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') cyclePersona(1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') cyclePersona(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeModal, cyclePersona]);

    // Touch swipe
    useEffect(() => {
        const onStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientX; };
        const onEnd = (e: TouchEvent) => {
            if (touchStart.current === null || activeModal) return;
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) < 44) return;
            cyclePersona(diff > 0 ? 1 : -1);
            touchStart.current = null;
        };
        window.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('touchend', onEnd, { passive: true });
        return () => {
            window.removeEventListener('touchstart', onStart);
            window.removeEventListener('touchend', onEnd);
        };
    }, [activeModal, cyclePersona]);

    const openModal = useCallback((m: ModalType) => setActiveModal(m), []);
    const closeModal = useCallback(() => setActiveModal(null), []);
    const handleOrbClick = useCallback(() => {
        if (activeModal) return;
        setOrbState(prev =>
            prev === 'idle' ? 'listening' :
                prev === 'listening' ? 'speaking' :
                    'idle'
        );
    }, [activeModal]);

    const isBlurred = activeModal !== null;

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: 'transparent',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                userSelect: 'none',
                WebkitFontSmoothing: 'antialiased',
            } as React.CSSProperties}
        >
            {/* ── New Spline background (animated paper boat scene) ─────────── */}
            <SplineBackground />
            {/* ── Main layer ────────────────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    filter: isBlurred ? 'blur(10px)' : 'none',
                    transform: isBlurred ? 'scale(1.02)' : 'scale(1)',
                    transition: 'filter 0.4s ease, transform 0.4s ease',
                    pointerEvents: 'none',
                }}
            >
                {/* Navbar */}
                <div style={{ pointerEvents: 'auto' }}>
                    <Navbar
                        onFeatures={() => openModal('features')}
                        onFAQs={() => openModal('faqs')}
                        onBookDemo={() => openModal('demo')}
                    />
                </div>

                {/* ── Headline ──────────────────────────────────────────────── */}
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 80,
                        marginBottom: 80,
                        animation: 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
                        padding: '0 40px',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '3.2rem',
                            fontWeight: 600,
                            color: '#f1f1f5',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.15,
                            margin: 0,
                        }}
                    >
                        AI voice agents for{' '}
                        <span style={{ color: '#a78bfa' }}>
                            intelligent conversations
                        </span>.
                    </h1>
                </div>

                {/* ── Content grid — no card, floats on background ─────────── */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 32px 24px',
                        pointerEvents: 'auto',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 980,
                            opacity: transitioning ? 0 : 1,
                            transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
                            transition: 'opacity 0.2s ease, transform 0.2s ease',
                            animation: 'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                            display: 'grid',
                            gridTemplateColumns: '1.4fr 1.2fr 1.1fr',
                            gap: 0,
                            minHeight: 380,
                        }}
                    >
                        {/* ── Left Arrow ──────────────────────────────────── */}
                        <button
                            onClick={() => cyclePersona(-1)}
                            style={{
                                position: 'absolute',
                                left: -20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.95)',
                                border: '1px solid rgba(0,0,0,0.08)',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                                color: '#444',
                                zIndex: 2,
                                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
                            }}
                        >
                            ‹
                        </button>

                        {/* ── Right Arrow ─────────────────────────────────── */}
                        <button
                            onClick={() => cyclePersona(1)}
                            style={{
                                position: 'absolute',
                                right: -20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.95)',
                                border: '1px solid rgba(0,0,0,0.08)',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                                color: '#444',
                                zIndex: 2,
                                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
                            }}
                        >
                            ›
                        </button>

                        {/* ══ LEFT COLUMN — Persona identity + CTA ════════════════ */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >

                            {/* Name — monumental */}
                            <h2
                                style={{
                                    fontSize: 'clamp(36px, 4vw, 54px)',
                                    fontWeight: 800,
                                    color: activePersona.color,
                                    letterSpacing: '-0.05em',
                                    lineHeight: 0.95,
                                    margin: '0 0 20px',
                                    transition: 'color 0.4s ease',
                                }}
                            >
                                {activePersona.name}
                            </h2>

                            {/* Description */}
                            <p
                                style={{
                                    fontSize: 14,
                                    lineHeight: 1.7,
                                    color: 'rgba(255,255,255,0.70)',
                                    margin: '0 0 32px',
                                    maxWidth: 260,
                                    fontWeight: 400,
                                }}
                            >
                                {activePersona.description}
                            </p>

                            {/* CTA — persona colored */}
                            <button
                                onClick={() => openModal('demo')}
                                style={{
                                    alignSelf: 'flex-start',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '14px 28px',
                                    borderRadius: 999,
                                    background: '#7c3aed',
                                    color: '#ffffff',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = '#6d28d9';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = '#7c3aed';
                                }}
                            >
                                Book a Live Demo
                            </button>
                        </div>

                        {/* ══ CENTER COLUMN — Petal orb hero ══════════════════════ */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 20,
                            }}
                        >
                            <div style={{ width: 200, height: 200, perspective: 800 }}>
                                <HeroOrb
                                    persona={activePersona}
                                    orbState={orbState}
                                    onClick={handleOrbClick}
                                />
                            </div>
                        </div>

                        {/* ══ RIGHT COLUMN — Best for spec ════════════════════════ */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            {/* Spec rows */}
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {activePersona.bestFor.map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            fontSize: '0.9rem',
                                            color: 'rgba(255, 255, 255, 0.65)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                background: '#a78bfa',
                                                flexShrink: 0,
                                            }}
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ══ CAROUSEL NAV ═══════════════════════════════════════════ */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 6,
                            marginTop: 60,
                        }}
                    >
                        {PERSONAS.map((p, i) => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    if (i === personaIndex) return;
                                    setTransitioning(true);
                                    setTimeout(() => { setPersonaIndex(i); setOrbState('idle'); setTransitioning(false); }, 200);
                                }}
                                style={{
                                    width: i === personaIndex ? 24 : 6,
                                    height: 6,
                                    borderRadius: i === personaIndex ? 999 : '50%',
                                    background: i === personaIndex ? '#a78bfa' : 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    padding: 0,
                                }}
                                aria-label={`Select persona ${p.name}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Modals ────────────────────────────────────────────────────── */}
            {activeModal === 'features' && <FeaturesModal persona={activePersona} onClose={closeModal} />}
            {activeModal === 'faqs' && <FAQsModal onClose={closeModal} />}
            {activeModal === 'demo' && <BookDemoModal onClose={closeModal} />}
        </div>
    );
};

export default App;
