import React, { useEffect, useRef } from 'react';
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

    const labelText = isSpeaking
        ? 'Speaking…'
        : isListening
            ? 'Listening…'
            : 'Tap to talk';

    // Petal is fully static — no rotation in any state
    const svgAnimation = 'none';

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
        >
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

                    {/* Petal group — static, no spin */}
                    <g
                        style={{
                            animation: 'none',
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

            {/* ── Label pill -> quiet text ─────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.8rem',
                    color: isSpeaking || isListening ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    transition: 'color 0.3s ease',
                }}
            >
                {labelText}
            </div>
        </div>
    );
};

export default HeroOrb;
