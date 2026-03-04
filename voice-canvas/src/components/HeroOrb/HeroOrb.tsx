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

    const orbSize = window.innerWidth < 640 ? 260 : 320;
    const wrapSize = orbSize + 40;

    // ── Colors ──────────────────────────────────────────────────────────────
    // Petal breathing animation (scale + subtle opacity/filter depending on globals)
    const svgAnimation = isSpeaking
        ? 'orb-breathe-fast 1s ease-in-out infinite'
        : isListening
            ? 'orb-breathe-fast 1.8s ease-in-out infinite'
            : 'orb-breathe 5s ease-in-out infinite';

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
                        transition: 'filter 0.5s ease',
                        animation: svgAnimation,
                        isolation: 'isolate',
                    }}
                >
                    <g
                        style={{
                            animation: 'none',
                            transformOrigin: '0 0',
                            transformBox: 'fill-box',
                        }}
                    >
                        {petals.map(i => {
                            const angle = (360 / PETAL_COUNT) * i;
                            const petalR = 0.40;
                            const petalRx = 0.16;
                            const petalRy = 0.40;
                            return (
                                <ellipse
                                    key={i}
                                    cx={0}
                                    cy={-petalR}
                                    rx={petalRx}
                                    ry={petalRy}
                                    fill={persona.color}
                                    style={{
                                        mixBlendMode: 'multiply',
                                        transition: 'all 0.4s ease'
                                    }}
                                    opacity={0.8}
                                    transform={`rotate(${angle})`}
                                />
                            );
                        })}
                    </g>
                </svg>
            </div>
            {/* ── end perspective wrapper ───────────────────────────────────── */}

        </div>
    );
};

export default HeroOrb;
