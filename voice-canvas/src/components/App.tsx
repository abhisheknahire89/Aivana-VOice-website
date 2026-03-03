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
    const [isPaused, setIsPaused] = useState(false);
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

    // Auto-rotate every 5s
    useEffect(() => {
        if (activeModal || isPaused) return;
        const timer = setInterval(() => {
            cyclePersona(1);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeModal, isPaused, cyclePersona]);

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
                            fontSize: '4.2rem',
                            fontWeight: 700,
                            color: '#f1f1f5',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.1,
                            margin: '0 0 20px',
                            fontFamily: "'Satoshi', 'General Sans', sans-serif"
                        }}
                    >
                        Cut documentation time by <span style={{ color: '#a78bfa' }}>70%</span>.
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
                        Let doctors focus on patients, not paperwork.
                    </p>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 60 }}>
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

                    {/* Trust Indicators */}
                    <div
                        style={{
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
                        }}
                    >
                        <span>Trusted by IHH Healthcare</span>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                        <span>Fortis</span>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                        <span>371+ Consultations</span>
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                        <span>91% Diagnostic Accuracy</span>
                    </div>
                </div>

                {/* ── Content grid — no card, floats on background ─────────── */}
                <div
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
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
                            gap: 16,
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
                                    padding: '8px 16px',
                                    borderRadius: 999,
                                    background: i === personaIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    color: i === personaIndex ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                    border: i === personaIndex ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    fontWeight: 500,
                                    fontSize: 14,
                                    letterSpacing: '0.02em',
                                }}
                                aria-label={`Select persona ${p.name}`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Conversion Optimization Sections ──────────────────────────── */}
            <div style={{ position: 'relative', zIndex: 10, padding: '120px 20px', maxWidth: 1100, margin: '0 auto', color: '#fff' }}>

                {/* 1. Problem Statement */}
                <section style={{ textAlign: 'center', marginBottom: 160 }}>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, margin: '0 0 20px', fontFamily: "'Satoshi', 'General Sans', sans-serif" }}>
                        Indian doctors spend <span style={{ color: '#ef4444' }}>3+ hours daily</span> on documentation.
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto' }}>
                        Patients wait. Burnout rises. The system is broken.
                    </p>
                </section>

                {/* 2. Solution Demo */}
                <section style={{ marginBottom: 160, textAlign: 'center' }}>
                    <div style={{ width: '100%', maxWidth: 800, aspectRatio: '16/9', background: 'rgba(255,255,255,0.03)', borderRadius: 24, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem' }}>[ 15-second Ambient Documentation Demo Go Here ]</span>
                    </div>
                </section>

                {/* 3. How It Works */}
                <section style={{ marginBottom: 160 }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 700, textAlign: 'center', marginBottom: 60, fontFamily: "'Satoshi', 'General Sans', sans-serif" }}>
                        How It Works
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, textAlign: 'center' }}>
                        <div>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(167, 139, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#a78bfa', fontSize: 24, fontWeight: 700 }}>1</div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>Speak Naturally</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Doctor converses with the patient naturally in English, Hindi, or Hinglish.</p>
                        </div>
                        <div>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(167, 139, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#a78bfa', fontSize: 24, fontWeight: 700 }}>2</div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>AI Captures Context</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Our models process the conversation, separating medical facts from chit-chat.</p>
                        </div>
                        <div>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(167, 139, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#a78bfa', fontSize: 24, fontWeight: 700 }}>3</div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>Structured Notes</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>Prefilled SOAP notes appear in seconds, ready for review and EHR push.</p>
                        </div>
                    </div>
                </section>

                {/* 4. Social Proof / Quote */}
                <section style={{ marginBottom: 160, textAlign: 'center', padding: '60px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '1.4rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', maxWidth: 800, margin: '0 auto 30px', lineHeight: 1.6 }}>
                        "Aivana has completely transformed my practice. It's like having a highly trained medical scribe in the room, but without the cost or training overhead."
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#444' }}></div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600 }}>Dr. Anil Sharma</div>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Cardiologist, Fortis Hospital</div>
                        </div>
                    </div>
                </section>

                {/* 5. Pricing Teaser */}
                <section style={{ marginBottom: 160, textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: 20, fontFamily: "'Satoshi', 'General Sans', sans-serif" }}>Simple, Transparent Pricing</h2>
                    <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: 40 }}>
                        Plans starting at <span style={{ color: '#fff', fontWeight: 600 }}>₹X/month</span> per OPD.
                    </p>
                    <button onClick={() => openModal('demo')} style={{ padding: '12px 24px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                        View Pricing Details
                    </button>
                </section>

                {/* 6. FAQ Section */}
                <section style={{ marginBottom: 160 }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 700, textAlign: 'center', marginBottom: 60, fontFamily: "'Satoshi', 'General Sans', sans-serif" }}>Frequently Asked Questions</h2>
                    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 10 }}>Is my patient data secure?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.5 }}>Yes. Aivana is fully HIPAA and ABDM compliant. Audio is processed statelessly and we do not store PII on our servers.</p>
                        </div>
                        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 10 }}>Does it work with my existing EHR?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.5 }}>We integrate directly with Epic, Cerner, Bahmni, and most modern Indian EHRs via API or bulk export.</p>
                        </div>
                    </div>
                </section>

                {/* 7. Final CTA */}
                <section style={{ textAlign: 'center', padding: '80px 40px', background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.1) 0%, transparent 100%)', borderRadius: 32, border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, margin: '0 0 24px', fontFamily: "'Satoshi', 'General Sans', sans-serif" }}>
                        Ready to give your doctors <br />2 hours back every day?
                    </h2>
                    <button onClick={() => openModal('demo')} style={{ padding: '16px 32px', borderRadius: 999, background: '#7c3aed', color: '#fff', fontSize: '1.1rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)' }} onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'} onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}>
                        Get Started Today
                    </button>
                </section>
            </div>

            {/* ── Modals ────────────────────────────────────────────────────── */}
            {activeModal === 'features' && <FeaturesModal persona={activePersona} onClose={closeModal} />}
            {activeModal === 'faqs' && <FAQsModal onClose={closeModal} />}
            {activeModal === 'demo' && <BookDemoModal onClose={closeModal} />}
        </div>
    );
};

export default App;
