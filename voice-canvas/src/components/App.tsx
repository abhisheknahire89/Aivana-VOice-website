import React, { useState, useCallback, useEffect, useRef } from 'react';
import '../styles/globals.css';
import { PERSONAS, type Persona } from '../data/personas';
import Navbar from './Navbar/Navbar';
import HeroOrb, { type OrbState } from './HeroOrb/HeroOrb';
import FeaturesModal from './FeaturesModal/FeaturesModal';
import FAQsModal from './FAQsModal/FAQsModal';
import BookDemoModal from './BookDemoModal/BookDemoModal';
import SplineBackground from './SplineBackground/SplineBackground';
import { useVoice } from '../hooks/useVoice';

export type ModalType = 'features' | 'faqs' | 'demo' | null;

const App: React.FC = () => {
    const [personaIndex, setPersonaIndex] = useState(0);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [transitioning, setTransitioning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [envPulseKey, setEnvPulseKey] = useState(0);
    const scrollCooldown = useRef(false);
    const touchStart = useRef<number | null>(null);
    const lastVoiceStartRef = useRef(0);

    const { isConnecting, isListening, isSpeaking, transcript, error: voiceError, startListening, stopListening } = useVoice();
    const orbState: OrbState = isConnecting ? 'connecting' : isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle';

    const activePersona: Persona = PERSONAS[personaIndex];

    const cyclePersona = useCallback((dir: 1 | -1) => {
        if (scrollCooldown.current) return;
        if (isConnecting || isListening || isSpeaking) return;
        setTransitioning(true);
        setTimeout(() => {
            setPersonaIndex(prev => (prev + dir + PERSONAS.length) % PERSONAS.length);
            setTransitioning(false);
        }, 200);
        scrollCooldown.current = true;
        setTimeout(() => { scrollCooldown.current = false; }, 700);
    }, [isConnecting, isListening, isSpeaking]);

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

    // Auto-rotate every 5s (paused during voice conversation)
    useEffect(() => {
        if (activeModal || isPaused || isConnecting || isListening || isSpeaking) return;
        const timer = setInterval(() => {
            cyclePersona(1);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeModal, isPaused, isConnecting, isListening, isSpeaking, cyclePersona]);

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
        setEnvPulseKey(prev => prev + 1);
        if (isConnecting || isListening || isSpeaking) {
            stopListening();
            return;
        }
        const now = Date.now();
        if (now - lastVoiceStartRef.current < 1500) return;
        lastVoiceStartRef.current = now;
        startListening(activePersona.id);
    }, [activeModal, isConnecting, isListening, isSpeaking, stopListening, startListening, activePersona.id]);

    const isBlurred = activeModal !== null;

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                background: 'transparent',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                userSelect: 'none',
                WebkitFontSmoothing: 'antialiased',
                pointerEvents: isBlurred ? 'none' : 'auto',
            } as React.CSSProperties}
        >
            {/* ── New Spline background (animated paper boat scene) ─────────── */}
            <SplineBackground orbState={orbState} pulseKey={envPulseKey} />
            {/* ── Main layer ────────────────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: 'opacity 0.8s ease, transform 0.8s ease, filter 0.4s ease',
                    filter: isBlurred ? 'blur(10px)' : 'none',
                    pointerEvents: 'none',
                }}
            >
                {/* Navbar */}
                <div style={{ pointerEvents: 'auto', flexShrink: 0 }}>
                    <Navbar
                        onBookDemo={() => openModal('demo')}
                    />
                </div>

                {/* Vertical Center Wrapper for entire content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    paddingBottom: '40px'
                }}>

                    {/* ── Headline ──────────────────────────────────────────────── */}
                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: 40,
                            animation: 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
                            padding: '0 40px',
                            width: '100%',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '4.2rem',
                                fontWeight: 700,
                                color: '#f1f1f5',
                                letterSpacing: '-0.03em',
                                lineHeight: 1.1,
                                margin: '0 0 20px',
                                fontFamily: "'Satoshi', 'General Sans', sans-serif"
                            }}
                        >
                            Automate your voice support with <span style={{ color: '#a78bfa' }}>AI</span>.
                        </h1>
                        <p
                            style={{
                                fontSize: '1.2rem',
                                color: 'rgba(255, 255, 255, 0.65)',
                                maxWidth: 600,
                                margin: '0 auto 40px',
                                lineHeight: 1.6,
                            }}
                        >
                            Resolve customer issues instantly, 24/7, across any language.
                        </p>

                        {/* CTAs */}
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 0 }}>
                            <button
                                onClick={() => openModal('demo')}
                                style={{
                                    padding: '14px 28px',
                                    borderRadius: 999,
                                    background: '#7c3aed',
                                    color: '#ffffff',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#6d28d9')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#7c3aed')}
                            >
                                Book a Demo
                            </button>
                            <button
                                style={{
                                    padding: '14px 28px',
                                    borderRadius: 999,
                                    background: 'transparent',
                                    color: '#ffffff',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                }}
                            >
                                <span style={{ fontSize: '1.2em' }}>▶</span> See it in Action
                            </button>
                        </div>

                    </div>

                    {/* ── Content grid — no card, floats on background ─────────── */}
                    <div
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            pointerEvents: 'auto',
                            width: '100%',
                        }}
                    >
                        <section className="agent-section-wrapper" data-agent={activePersona.id}>

                            {/* ── Left Arrow (disabled during voice call) ─────── */}
                            <button
                                className="carousel-arrow left"
                                onClick={() => cyclePersona(-1)}
                                aria-disabled={isConnecting || isListening || isSpeaking}
                                style={{
                                    opacity: isConnecting || isListening || isSpeaking ? 0.35 : 1,
                                    pointerEvents: isConnecting || isListening || isSpeaking ? 'none' : 'auto',
                                }}
                            >
                                ‹
                            </button>

                            {/* ── Right Arrow (disabled during voice call) ─────── */}
                            <button
                                className="carousel-arrow right"
                                onClick={() => cyclePersona(1)}
                                aria-disabled={isConnecting || isListening || isSpeaking}
                                style={{
                                    opacity: isConnecting || isListening || isSpeaking ? 0.35 : 1,
                                    pointerEvents: isConnecting || isListening || isSpeaking ? 'none' : 'auto',
                                }}
                            >
                                ›
                            </button>

                            <div
                                className="agent-section"
                                style={{
                                    opacity: transitioning ? 0 : 1,
                                    transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
                                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                                    animation: 'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                                }}
                            >
                                {/* ══ LEFT COLUMN — Persona identity + CTA ════════ */}
                                <div className="agent-info">
                                    <h2 className="agent-name">
                                        {activePersona.name}
                                    </h2>
                                    <p className="agent-description">
                                        {activePersona.description}
                                    </p>
                                    <button
                                        className="cta-button"
                                        onClick={() => openModal('demo')}
                                        style={{
                                            padding: '12px 28px',
                                            borderRadius: 999,
                                            color: '#ffffff',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'filter 0.2s',
                                        }}
                                    >
                                        Book a Demo
                                    </button>
                                </div>

                                {/* ══ CENTER COLUMN — Petal orb hero + Mic ════════ */}
                                <div className="petal-area">
                                    <div className="petal-wrapper">
                                        <HeroOrb
                                            persona={activePersona}
                                            orbState={orbState}
                                            onClick={handleOrbClick}
                                        />
                                    </div>
                                    <p style={{ marginTop: 8, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                                        {isConnecting ? 'Connecting…' : isListening ? 'Listening…' : isSpeaking ? 'Speaking…' : 'Tap to talk'}
                                    </p>
                                    {voiceError && (
                                        <p style={{ marginTop: 6, fontSize: '0.75rem', color: 'rgba(248,113,113,0.9)' }}>
                                            {voiceError}
                                        </p>
                                    )}
                                    {transcript && (
                                        <p style={{ marginTop: 12, maxWidth: 360, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                                            {transcript}
                                        </p>
                                    )}
                                </div>

                                {/* ══ RIGHT COLUMN — Capabilities List ═══════════ */}
                                <ul className="capabilities-list">
                                    {activePersona.bestFor.map((item, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: 'var(--accent)', fontSize: '1.2em', transition: 'color 0.5s ease' }}>•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section> {/* End Agent Section Wrapper */}
                    </div>

                </div> {/* End Vertical Center Wrapper */}
            </div>

            {/* ── Absolute Bottom: Trust Indicators ───────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 30,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 24,
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    flexWrap: 'wrap',
                    zIndex: 20,
                    pointerEvents: 'auto',
                }}
            >
                <span>Trusted by leading enterprises</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                <span>1M+ Conversations</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                <span>98% Accuracy</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                <span>24/7 Availability</span>
            </div>

            {/* ── Modals ────────────────────────────────────────────────────── */}
            {activeModal === 'features' && <FeaturesModal persona={activePersona} onClose={closeModal} />}
            {activeModal === 'faqs' && <FAQsModal onClose={closeModal} />}
            {activeModal === 'demo' && <BookDemoModal onClose={closeModal} />}
        </div >
    );
};

export default App;
