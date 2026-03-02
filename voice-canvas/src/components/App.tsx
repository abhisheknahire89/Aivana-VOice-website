import React, { useState, useCallback, useEffect, useRef } from 'react';
import '../styles/globals.css';
import { PERSONAS, type Persona } from '../data/personas';
import Navbar from './Navbar/Navbar';
import HeroOrb from './HeroOrb/HeroOrb';
import FeaturesModal from './FeaturesModal/FeaturesModal';
import FAQsModal from './FAQsModal/FAQsModal';
import BookDemoModal from './BookDemoModal/BookDemoModal';
import SplineBackground from './SplineBackground/SplineBackground';

export type ModalType = 'features' | 'faqs' | 'demo' | null;

const App: React.FC = () => {
    const [personaIndex, setPersonaIndex] = useState(0);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [isTalking, setIsTalking] = useState(false);
    const [transitioning, setTransitioning] = useState(false);
    const scrollCooldown = useRef(false);
    const touchStart = useRef<number | null>(null);

    const activePersona: Persona = PERSONAS[personaIndex];

    const cyclePersona = useCallback((dir: 1 | -1) => {
        if (scrollCooldown.current) return;
        setTransitioning(true);
        setTimeout(() => {
            setPersonaIndex(prev => (prev + dir + PERSONAS.length) % PERSONAS.length);
            setIsTalking(false);
            setTransitioning(false);
        }, 180);
        scrollCooldown.current = true;
        setTimeout(() => { scrollCooldown.current = false; }, 650);
    }, []);

    // ── Arrow keys ────────────────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (activeModal) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') cyclePersona(1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') cyclePersona(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeModal, cyclePersona]);

    // ── Touch swipe ───────────────────────────────────────────────────────────
    useEffect(() => {
        const onStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientY; };
        const onEnd = (e: TouchEvent) => {
            if (touchStart.current === null || activeModal) return;
            const diff = touchStart.current - e.changedTouches[0].clientY;
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
        setIsTalking(prev => !prev);
    }, [activeModal]);

    const isBlurred = activeModal !== null;

    return (
        <div
            style={{
                position: 'relative',
                width: '100%', height: '100%',
                overflow: 'hidden',
                background: '#ebebef',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                userSelect: 'none',
                WebkitFontSmoothing: 'antialiased',
            } as React.CSSProperties}
        >
            {/* ── 1. Spline 3D background (fully interactive) ─────────────────── */}
            <SplineBackground />

            {/* ── 2. Persona dots — bottom-center, subtle ─────────────────────── */}
            {!activeModal && (
                <div
                    style={{
                        position: 'absolute', bottom: 32, left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 20, display: 'flex', gap: 8,
                        pointerEvents: 'auto',
                    }}
                >
                    {PERSONAS.map((p, i) => (
                        <div
                            key={p.id}
                            onClick={() => {
                                if (i === personaIndex) return;
                                setTransitioning(true);
                                setTimeout(() => { setPersonaIndex(i); setIsTalking(false); setTransitioning(false); }, 180);
                            }}
                            title={p.name}
                            style={{
                                width: i === personaIndex ? 24 : 7,
                                height: 7,
                                borderRadius: 999,
                                background: i === personaIndex ? activePersona.color : 'rgba(0,0,0,0.18)',
                                cursor: i === personaIndex ? 'default' : 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                                boxShadow: i === personaIndex ? `0 0 10px 2px ${activePersona.glowColor}` : 'none',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* ── 3. Main content (pointer-events none, children opt-in) ────────── */}
            <div
                style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    display: 'flex', flexDirection: 'column',
                    filter: isBlurred ? 'blur(10px)' : 'none',
                    transform: isBlurred ? 'scale(1.025)' : 'scale(1)',
                    transition: 'filter 0.45s ease, transform 0.45s ease',
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

                {/* ── Hero ────────────────────────────────────────────────────────── */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 56,
                        opacity: transitioning ? 0 : 1,
                        transform: transitioning ? 'translateY(10px) scale(0.99)' : 'translateY(0) scale(1)',
                        transition: 'opacity 0.18s ease, transform 0.18s ease',
                    }}
                >
                    {/* Persona eyebrow — just color dot + name, nothing else */}
                    <div
                        style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            marginBottom: 22,
                            animation: 'fade-in 0.5s ease 0.1s both',
                        }}
                    >
                        <div
                            style={{
                                width: 7, height: 7, borderRadius: '50%',
                                background: activePersona.color,
                                boxShadow: `0 0 10px 3px ${activePersona.glowColor}`,
                                transition: 'background 0.6s ease, box-shadow 0.6s ease',
                            }}
                        />
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: activePersona.color,
                                transition: 'color 0.6s ease',
                            }}
                        >
                            {activePersona.name} &mdash; {activePersona.role}
                        </span>
                    </div>

                    {/* H1 — Jobs would make this BIG and SHORT */}
                    <h1
                        style={{
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: 'clamp(30px, 5.2vw, 62px)',
                            color: '#080808',
                            letterSpacing: '-0.04em',
                            lineHeight: 1.08,
                            maxWidth: 700,
                            margin: '0 auto',
                            animation: 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both',
                        }}
                    >
                        Every customer call,<br />handled by AI.
                    </h1>

                    {/* Tagline — ONE line, persona-specific, high contrast */}
                    <p
                        style={{
                            marginTop: 14,
                            fontSize: 'clamp(14px, 1.6vw, 18px)',
                            color: '#555',
                            fontWeight: 400,
                            lineHeight: 1.5,
                            letterSpacing: '-0.01em',
                            textAlign: 'center',
                            maxWidth: 420,
                            animation: 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s both',
                        }}
                    >
                        {activePersona.tagline}
                    </p>

                    {/* THE ORB — the hero, unchanged, just bigger breathing room */}
                    <div
                        style={{
                            pointerEvents: 'auto',
                            animation: 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both',
                        }}
                    >
                        <HeroOrb
                            persona={activePersona}
                            isTalking={isTalking}
                            onClick={handleOrbClick}
                        />
                    </div>

                    {/* CTA — one button, dark pill, no competition */}
                    <div
                        style={{
                            pointerEvents: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 8,
                            animation: 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.45s both',
                        }}
                    >
                        <button
                            onClick={() => openModal('demo')}
                            style={{
                                padding: '14px 36px',
                                borderRadius: 999,
                                background: '#0a0a0a',
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: 600,
                                letterSpacing: '-0.02em',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1)',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = '#222';
                                (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = '#0a0a0a';
                                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                            }}
                        >
                            Book a demo
                        </button>

                        <span style={{ fontSize: 11, color: '#aaa', letterSpacing: '0.01em' }}>
                            {isTalking
                                ? `Speaking with ${activePersona.name}…`
                                : 'Live in one day. No engineering needed.'}
                        </span>
                    </div>

                    {/* Persona switcher — 4 minimal pills, no role subtitle clutter */}
                    <div
                        style={{
                            pointerEvents: 'auto',
                            display: 'flex',
                            gap: 6,
                            marginTop: 28,
                            padding: '6px',
                            background: 'rgba(255,255,255,0.55)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: 999,
                            backdropFilter: 'blur(16px)',
                            animation: 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.55s both',
                        }}
                    >
                        {PERSONAS.map((p, i) => {
                            const isActive = i === personaIndex;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        if (!isActive) {
                                            setTransitioning(true);
                                            setTimeout(() => { setPersonaIndex(i); setIsTalking(false); setTransitioning(false); }, 180);
                                        }
                                    }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '7px 16px',
                                        borderRadius: 999,
                                        background: isActive ? '#fff' : 'transparent',
                                        border: 'none',
                                        boxShadow: isActive ? '0 2px 12px rgba(0,0,0,0.1)' : 'none',
                                        cursor: isActive ? 'default' : 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 7, height: 7,
                                            borderRadius: '50%',
                                            background: p.color,
                                            flexShrink: 0,
                                            boxShadow: isActive ? `0 0 6px 2px ${p.glowColor}` : 'none',
                                            transition: 'box-shadow 0.3s ease',
                                        }}
                                    />
                                    <span
                                        style={{
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? '#0a0a0a' : '#777',
                                            transition: 'color 0.2s ease, font-weight 0.2s ease',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {p.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── 4. Modals ────────────────────────────────────────────────────── */}
            {activeModal === 'features' && <FeaturesModal persona={activePersona} onClose={closeModal} />}
            {activeModal === 'faqs' && <FAQsModal onClose={closeModal} />}
            {activeModal === 'demo' && <BookDemoModal onClose={closeModal} />}
        </div>
    );
};

export default App;
