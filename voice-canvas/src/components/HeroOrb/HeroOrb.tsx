import React, { useEffect, useRef } from 'react';
import type { Persona } from '../../data/personas';

interface HeroOrbProps {
    persona: Persona;
    isTalking: boolean;
    onClick: () => void;
}

const HeroOrb: React.FC<HeroOrbProps> = ({ persona, isTalking, onClick }) => {
    const orbRef = useRef<HTMLDivElement>(null);

    // Subtle mouse parallax on the orb
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!orbRef.current) return;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            orbRef.current.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`;
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const size = typeof window !== 'undefined' && window.innerWidth < 640 ? 180 : 220;

    return (
        <div
            style={{
                position: 'relative',
                width: size + 80,
                height: size + 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            {/* Ripple rings when talking */}
            {isTalking && [0, 1, 2].map(i => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        borderRadius: '50%',
                        border: `1.5px solid ${persona.color}`,
                        opacity: 0,
                        animation: `ripple-out 2.2s ease-out ${i * 0.7}s infinite`,
                    }}
                />
            ))}

            {/* Outer glow halo */}
            <div
                style={{
                    position: 'absolute',
                    width: size + 40,
                    height: size + 40,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${persona.glowColor} 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                    opacity: isTalking ? 0.9 : 0.5,
                    transition: 'opacity 0.6s ease',
                    animation: isTalking ? 'orb-connecting 1.2s ease-in-out infinite' : 'float-a 6s ease-in-out infinite',
                }}
            />

            {/* Main orb */}
            <div
                ref={orbRef}
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: persona.orbGradient,
                    boxShadow: `
            0 0 0 1px rgba(255,255,255,0.25) inset,
            0 0 40px 10px ${persona.glowColor},
            0 20px 60px rgba(0,0,0,0.15),
            inset 0 -20px 40px rgba(0,0,0,0.15)
          `,
                    transition: 'background 0.8s ease, box-shadow 0.8s ease',
                    animation: isTalking
                        ? 'orb-connecting 0.9s ease-in-out infinite'
                        : 'orb-breathe 4s ease-in-out infinite',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                    position: 'relative',
                }}
            >
                {/* Specular highlight */}
                <div
                    style={{
                        position: 'absolute',
                        top: '12%',
                        left: '16%',
                        width: '38%',
                        height: '25%',
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 80%)',
                        filter: 'blur(6px)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Secondary highlight */}
                <div
                    style={{
                        position: 'absolute',
                        top: '55%',
                        right: '18%',
                        width: '16%',
                        height: '10%',
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 80%)',
                        filter: 'blur(3px)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Label */}
                <span
                    style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 13,
                        fontWeight: 500,
                        letterSpacing: '-0.01em',
                        textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                        zIndex: 1,
                        transition: 'opacity 0.3s ease',
                    }}
                >
                    {isTalking ? 'Connecting...' : 'Tap to talk'}
                </span>
            </div>
        </div>
    );
};

export default HeroOrb;
