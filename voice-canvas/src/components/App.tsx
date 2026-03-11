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
const BOOK_DEMO_URL = 'https://calendly.com/abhisheknahire89/30min';

const App: React.FC = () => {
    const [personaIndex, setPersonaIndex] = useState(0);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [transitioning, setTransitioning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [envPulseKey, setEnvPulseKey] = useState(0);
    const scrollCooldown = useRef(false);
    const touchStart = useRef<number | null>(null);
    const lastVoiceStartRef = useRef(0);
    const currentVoicePersonaRef = useRef<string | null>(null);
    const [isCompactViewport, setIsCompactViewport] = useState(false);

    const { isConnecting, isListening, isSpeaking, error: voiceError, startListening, stopListening } = useVoice();
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
        const media = window.matchMedia('(max-width: 1080px), (max-height: 760px)');
        const update = () => setIsCompactViewport(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

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

    const closeModal = useCallback(() => setActiveModal(null), []);
    const openDemoLink = useCallback(() => {
        const popup = window.open('', '_blank');
        if (popup) {
            popup.opener = null;
            popup.location.href = BOOK_DEMO_URL;
        } else {
            window.location.href = BOOK_DEMO_URL;
        }
    }, []);

    const handleOrbClick = useCallback(() => {
        if (activeModal) return;
        setEnvPulseKey(prev => prev + 1);
        if (isConnecting) {
            return;
        }
        if (isListening || isSpeaking) {
            const switchingPersona = currentVoicePersonaRef.current !== null && currentVoicePersonaRef.current !== activePersona.id;
            stopListening();
            if (switchingPersona) {
                const now = Date.now();
                if (now - lastVoiceStartRef.current < 500) return;
                lastVoiceStartRef.current = now;
                window.setTimeout(() => {
                    startListening(activePersona.id);
                    currentVoicePersonaRef.current = activePersona.id;
                }, 160);
            }
            return;
        }
        const now = Date.now();
        if (now - lastVoiceStartRef.current < 1500) return;
        lastVoiceStartRef.current = now;
        startListening(activePersona.id);
        currentVoicePersonaRef.current = activePersona.id;
    }, [activeModal, isConnecting, isListening, isSpeaking, stopListening, startListening, activePersona.id]);

    useEffect(() => {
        if (!isConnecting && !isListening && !isSpeaking) {
            currentVoicePersonaRef.current = null;
        }
    }, [isConnecting, isListening, isSpeaking]);

    useEffect(() => {
        const activeVoicePersona = currentVoicePersonaRef.current;
        if (!activeVoicePersona) return;
        if (activeVoicePersona !== activePersona.id && (isConnecting || isListening || isSpeaking)) {
            stopListening();
        }
    }, [activePersona.id, isConnecting, isListening, isSpeaking, stopListening]);

    const isBlurred = activeModal !== null;

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                minHeight: '100dvh',
                overflowX: 'hidden',
                overflowY: isCompactViewport ? 'auto' : 'hidden',
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
                        onBookDemo={openDemoLink}
                    />
                </div>

                {/* Vertical Center Wrapper for entire content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: isCompactViewport ? 'flex-start' : 'center',
                    alignItems: 'center',
                    width: '100%',
                    paddingTop: isCompactViewport ? '96px' : '24px',
                    paddingBottom: isCompactViewport ? '88px' : '40px'
                }}>

                    {/* ── Headline ──────────────────────────────────────────────── */}
                    <div
                        style={{
                            textAlign: 'center',
                            marginBottom: isCompactViewport ? 20 : 40,
                            animation: 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
                            padding: '0 clamp(12px, 4vw, 40px)',
                            width: '100%',
                            pointerEvents: 'auto',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: 'clamp(2rem, 7vw, 4.2rem)',
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
                                fontSize: 'clamp(0.95rem, 3.5vw, 1.2rem)',
                                color: 'rgba(255, 255, 255, 0.65)',
                                maxWidth: 600,
                                margin: '0 auto 40px',
                                lineHeight: 1.6,
                            }}
                        >
                            Resolve customer issues instantly, 24/7, across any language.
                        </p>

                        {/* CTAs */}
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 0 }}>
                            <button
                                onClick={openDemoLink}
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
                                        onClick={openDemoLink}
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
                                    <p style={{
                                        marginTop: 10,
                                        fontSize: isConnecting ? '0.9rem' : '0.75rem',
                                        fontWeight: isConnecting ? 700 : 500,
                                        letterSpacing: isConnecting ? '0.02em' : 'normal',
                                        color: isConnecting ? '#facc15' : 'rgba(255,255,255,0.6)',
                                        textShadow: isConnecting ? '0 0 12px rgba(250,204,21,0.6)' : 'none',
                                        padding: isConnecting ? '6px 12px' : '0',
                                        borderRadius: isConnecting ? 999 : 0,
                                        background: isConnecting ? 'rgba(250,204,21,0.16)' : 'transparent',
                                        border: isConnecting ? '1px solid rgba(250,204,21,0.45)' : 'none',
                                        minHeight: '1.2em'
                                    }}>
                                        {isConnecting ? 'Connecting… please wait' : isListening ? 'Listening…' : isSpeaking ? 'Speaking…' : '\u00A0'}
                                    </p>
                                    {voiceError && (
                                        <p style={{ marginTop: 6, fontSize: '0.75rem', color: 'rgba(248,113,113,0.9)' }}>
                                            {voiceError}
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
                className="trust-strip"
                style={{
                    position: isCompactViewport ? 'static' : 'absolute',
                    bottom: isCompactViewport ? undefined : 30,
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
                    paddingBottom: isCompactViewport ? 20 : 0,
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
