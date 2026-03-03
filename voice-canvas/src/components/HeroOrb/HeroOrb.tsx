import React, { useEffect, useRef, useState } from 'react';
import type { Persona } from '../../data/personas';

export type OrbState = 'idle' | 'listening' | 'speaking';

interface HeroOrbProps {
    persona: Persona;
    orbState: OrbState;
    onClick: () => void;
}

// 8 petals evenly spaced around the center
const PETAL_COUNT = 8;
const petals = Array.from({ length: PETAL_COUNT }, (_, i) => i);

const HeroOrb: React.FC<HeroOrbProps> = ({ persona, orbState, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const glowRef = useRef<HTMLDivElement>(null);

    const isListening = orbState === 'listening';
    const isSpeaking = orbState === 'speaking';

    // Mouse parallax — ambient glow follows cursor
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${dx * 18}px, ${dy * 18}px)`;
            }
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const orbSize = window.innerWidth < 640 ? 200 : 260;
    const wrapSize = orbSize + 80;

    // ── Colors ──────────────────────────────────────────────────────────────
    const ORANGE = '#FF6B00';
    const ORANGE_GLOW = 'rgba(255,107,0,0.35)';

    const glowColor = isSpeaking
        ? ORANGE_GLOW
        : isListening
            ? 'rgba(255,107,0,0.22)'
            : persona.glowColor + '55';

    const outerGlowBox = isSpeaking
        ? `0 0 80px 30px ${ORANGE_GLOW}, 0 0 140px 50px rgba(255,107,0,0.15)`
        : isListening
            ? `0 0 40px 12px rgba(255,107,0,0.18)`
            : hovered
                ? `0 0 40px 10px ${persona.glowColor}`
                : `0 0 18px 4px ${persona.glowColor}`;

    const labelText = isSpeaking
        ? 'Speaking…'
        : isListening
            ? 'Listening…'
            : 'Tap to talk';

    // Per-state animation — each uses its own keyframe so scale differs too
    const svgAnimation = isSpeaking
        ? 'petalSpinSpeaking 5.5s linear infinite'   // 5.5s + scale 0.95→1.08
        : isListening
            ? 'petalSpinListening 3.5s linear infinite' // 3.5s + scale 1.0→1.05
            : 'petalSpin 11s linear infinite';           // 11s, no scale

    return (
        <div
            style={{
                position: 'relative',
                width: wrapSize,
                height: wrapSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                cursor: 'pointer',
            }}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* ── Ambient glow disc ─────────────────────────────────────── */}
            <div
                ref={glowRef}
                style={{
                    position: 'absolute',
                    width: orbSize + (hovered ? 80 : 40),
                    height: orbSize + (hovered ? 80 : 40),
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                    filter: `blur(${isSpeaking ? 36 : 22}px)`,
                    opacity: isSpeaking ? 1 : isListening ? 0.85 : hovered ? 0.7 : 0.45,
                    transition: 'all 0.5s ease',
                    animation: isSpeaking
                        ? 'orb-breathe-fast 0.7s ease-in-out infinite'
                        : isListening
                            ? 'orb-breathe 1.4s ease-in-out infinite'
                            : 'float-c 5s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Ripple rings (speaking) ────────────────────────────────── */}
            {isSpeaking && [0, 1, 2].map(i => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: orbSize + 20,
                        height: orbSize + 20,
                        borderRadius: '50%',
                        border: `1.5px solid ${ORANGE}`,
                        opacity: 0.6,
                        animation: `ripple-out 1.6s ease-out ${i * 0.5}s infinite`,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* ── Pulse ring — interactive trigger cue ─────────────────────── */}
            {/* Idle: 1 slow ring; Listening: 1 fast ring; Speaking: 2 rings */}
            {[0, ...(isSpeaking ? [1] : [])].map(i => (
                <div
                    key={`pulse-${i}`}
                    style={{
                        position: 'absolute',
                        width: orbSize + 20,
                        height: orbSize + 20,
                        borderRadius: '50%',
                        border: `2px solid ${isSpeaking ? ORANGE : isListening ? ORANGE : persona.color}`,
                        opacity: isSpeaking ? 0.7 : isListening ? 0.6 : 0.45,
                        animation: `pulseRing ${isSpeaking ? '1.2s' : isListening ? '1.6s' : '2.4s'} ease-out ${i * 0.6}s infinite`,
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                />
            ))}

            {/* ── SVG petal orb inside perspective wrapper ───────────────── */}
            {/* perspective on the container gives rotateY a true 3D coin-flip depth */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 2,
                    perspective: 900,
                    perspectiveOrigin: '50% 50%',
                    width: orbSize,
                    height: orbSize,
                }}
            >
                <svg
                    width={orbSize}
                    height={orbSize}
                    viewBox="-1 -1 2 2"
                    style={{
                        display: 'block',
                        overflow: 'visible',
                        transformStyle: 'preserve-3d',
                        filter: isSpeaking
                            ? `drop-shadow(0 0 18px ${ORANGE}) drop-shadow(0 0 6px #ffb347)`
                            : isListening
                                ? `drop-shadow(0 0 10px ${ORANGE}88)`
                                : `drop-shadow(0 0 6px ${persona.glowColor})`,
                        transition: 'filter 0.5s ease',
                        // ── Y-axis rotation — speed & scale differ per state ──
                        animation: svgAnimation,
                    }}
                >
                    <defs>
                        {/* Petal gradient — orange when active, persona color when idle */}
                        <radialGradient id="petalGrad" cx="50%" cy="30%" r="70%">
                            <stop offset="0%" stopColor={isSpeaking ? '#FFD580' : isListening ? '#FFB347' : persona.color} stopOpacity="0.95" />
                            <stop offset="60%" stopColor={isSpeaking ? ORANGE : isListening ? ORANGE : persona.color} stopOpacity="0.75" />
                            <stop offset="100%" stopColor={isSpeaking ? '#cc3300' : isListening ? '#cc4400' : persona.glowColor} stopOpacity="0.3" />
                        </radialGradient>

                        {/* Core gradient */}
                        <radialGradient id="coreGrad" cx="40%" cy="38%" r="65%">
                            <stop offset="0%" stopColor={isSpeaking ? '#FFD580' : isListening ? '#FFB34788' : persona.color + '44'} />
                            <stop offset="100%" stopColor={isSpeaking ? ORANGE : isListening ? ORANGE + '33' : 'transparent'} stopOpacity="0" />
                        </radialGradient>

                        {/* Shimmer highlight */}
                        <radialGradient id="shimmerGrad" cx="35%" cy="28%" r="45%">
                            <stop offset="0%" stopColor="white" stopOpacity={isSpeaking ? 0.5 : 0.2} />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Petal group — Z-axis spin when listening/speaking */}
                    <g
                        style={{
                            animation: isSpeaking
                                ? 'spin-fast 2s linear infinite'
                                : isListening
                                    ? 'spin-med 3.5s linear infinite'
                                    : 'none',
                            transformOrigin: '0 0',
                            transformBox: 'fill-box',
                        }}
                    >
                        {petals.map(i => {
                            const angle = (360 / PETAL_COUNT) * i;
                            const petalR = 0.33;
                            const petalRx = 0.13;
                            const petalRy = 0.265;
                            return (
                                <ellipse
                                    key={i}
                                    cx={0}
                                    cy={-petalR}
                                    rx={petalRx}
                                    ry={petalRy}
                                    fill="url(#petalGrad)"
                                    opacity={isSpeaking ? 0.95 : isListening ? 0.88 : 0.6}
                                    transform={`rotate(${angle})`}
                                    style={{ transition: 'opacity 0.4s ease' }}
                                />
                            );
                        })}
                    </g>

                    {/* Core glow circle */}
                    <circle
                        cx={0}
                        cy={0}
                        r={isSpeaking ? 0.44 : 0.28}
                        fill="url(#coreGrad)"
                        style={{ transition: 'r 0.5s ease' }}
                    />

                    {/* Shimmer highlight */}
                    <circle cx={-0.12} cy={-0.15} r={0.22} fill="url(#shimmerGrad)" />
                </svg>
            </div>
            {/* ── end perspective wrapper ───────────────────────────────────── */}

            {/* ── Label pill ────────────────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '8%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '7px 20px',
                    background: isSpeaking
                        ? ORANGE
                        : isListening
                            ? 'rgba(255,107,0,0.15)'
                            : 'rgba(255,255,255,0.82)',
                    color: isSpeaking ? '#fff' : isListening ? ORANGE : '#0a0a0a',
                    border: `1px solid ${isSpeaking ? 'transparent' : isListening ? ORANGE + '55' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    backdropFilter: 'blur(12px)',
                    boxShadow: isSpeaking
                        ? `0 4px 20px ${ORANGE_GLOW}`
                        : '0 2px 10px rgba(0,0,0,0.07)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    transition: 'all 0.35s ease',
                    zIndex: 10,
                }}
            >
                {labelText}
            </div>

            {/* ── Outer glow ring ───────────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    width: orbSize,
                    height: orbSize,
                    borderRadius: '50%',
                    boxShadow: outerGlowBox,
                    pointerEvents: 'none',
                    transition: 'box-shadow 0.5s ease',
                }}
            />
        </div>
    );
};

export default HeroOrb;
