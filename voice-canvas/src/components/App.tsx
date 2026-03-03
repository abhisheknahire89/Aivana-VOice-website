import React, { useState, useCallback, useEffect, useRef } from 'react';
import '../styles/globals.css';
import { PERSONAS, type Persona } from '../data/personas';
import Navbar from './Navbar/Navbar';
import HeroOrb, { type OrbState } from './HeroOrb/HeroOrb';
import FeaturesModal from './FeaturesModal/FeaturesModal';
import FAQsModal from './FAQsModal/FAQsModal';
import BookDemoModal from './BookDemoModal/BookDemoModal';

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
                background: '#f4f4f6',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                userSelect: 'none',
                WebkitFontSmoothing: 'antialiased',
            } as React.CSSProperties}
        >
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
                        padding: '28px 24px 20px',
                        animation: 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
                    }}
                >
                    <h1
                        style={{
                            fontSize: 'clamp(24px, 3.8vw, 50px)',
                            fontWeight: 700,
                            color: '#080808',
                            letterSpacing: '-0.04em',
                            lineHeight: 1.08,
                            margin: 0,
                        }}
                    >
                        AI voice agents for intelligent conversations.
                    </h1>
                </div>

                {/* ── Card ──────────────────────────────────────────────────── */}
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
                            maxWidth: 960,
                            background: 'rgba(255,255,255,0.88)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            borderRadius: 28,
                            boxShadow: '0 8px 48px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
                            border: '1px solid rgba(255,255,255,0.7)',
                            opacity: transitioning ? 0 : 1,
                            transform: transitioning ? 'translateY(8px) scale(0.99)' : 'translateY(0) scale(1)',
                            transition: 'opacity 0.2s ease, transform 0.2s ease',
                            animation: 'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 1fr',
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

                        {/* ── Left Column: Persona Info ────────────────────── */}
                        <div
                            style={{
                                padding: '44px 36px 44px 48px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: 0,
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: 'clamp(32px, 3.5vw, 46px)',
                                    fontWeight: 700,
                                    color: activePersona.color,
                                    letterSpacing: '-0.04em',
                                    lineHeight: 1,
                                    margin: '0 0 6px',
                                    transition: 'color 0.4s ease',
                                }}
                            >
                                {activePersona.name}
                            </h2>

                            <p
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: activePersona.color,
                                    letterSpacing: '0.01em',
                                    margin: '0 0 18px',
                                    opacity: 0.85,
                                    transition: 'color 0.4s ease',
                                }}
                            >
                                {activePersona.role}
                            </p>

                            <p
                                style={{
                                    fontSize: 14,
                                    lineHeight: 1.65,
                                    color: '#444',
                                    margin: '0 0 28px',
                                    maxWidth: 280,
                                }}
                            >
                                {activePersona.description}
                            </p>

                            <button
                                onClick={() => openModal('demo')}
                                style={{
                                    alignSelf: 'flex-start',
                                    padding: '12px 26px',
                                    borderRadius: 999,
                                    background: '#0a0a0a',
                                    color: '#fff',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    letterSpacing: '-0.01em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s ease, transform 0.18s ease',
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
                                Book a Live Demo
                            </button>
                        </div>

                        {/* ── Center Column: Petal Orb ─────────────────────── */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '32px 0',
                            }}
                        >
                            <HeroOrb
                                persona={activePersona}
                                orbState={orbState}
                                onClick={handleOrbClick}
                            />
                        </div>

                        {/* ── Right Column: Best For ───────────────────────── */}
                        <div
                            style={{
                                padding: '44px 48px 44px 36px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: '#888',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    margin: '0 0 16px',
                                }}
                            >
                                Best for
                            </p>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {activePersona.bestFor.map((item, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            fontSize: 15,
                                            color: '#222',
                                            fontWeight: 400,
                                            letterSpacing: '-0.01em',
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                background: activePersona.color,
                                                flexShrink: 0,
                                                boxShadow: `0 0 6px 2px ${activePersona.glowColor}`,
                                                transition: 'background 0.4s ease',
                                            }}
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Persona dot switcher */}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 6,
                                    marginTop: 36,
                                    alignItems: 'center',
                                }}
                            >
                                {PERSONAS.map((p, i) => (
                                    <div
                                        key={p.id}
                                        onClick={() => {
                                            if (i === personaIndex) return;
                                            setTransitioning(true);
                                            setTimeout(() => { setPersonaIndex(i); setOrbState('idle'); setTransitioning(false); }, 200);
                                        }}
                                        title={p.name}
                                        style={{
                                            width: i === personaIndex ? 22 : 7,
                                            height: 7,
                                            borderRadius: 999,
                                            background: i === personaIndex ? p.color : 'rgba(0,0,0,0.15)',
                                            cursor: i === personaIndex ? 'default' : 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                                            boxShadow: i === personaIndex ? `0 0 8px 2px ${p.glowColor}` : 'none',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ── Card footer tip ──────────────────────────────── */}
                        <div
                            style={{
                                gridColumn: '1 / -1',
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                padding: '12px 48px',
                                textAlign: 'center',
                                fontSize: 12,
                                color: '#aaa',
                                letterSpacing: '0.02em',
                            }}
                        >
                            Tip: Use earphones for the best experience
                        </div>
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
