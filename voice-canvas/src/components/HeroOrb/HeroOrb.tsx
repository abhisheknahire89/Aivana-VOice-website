import React, { useEffect, useRef } from 'react';
import type { Persona } from '../../data/personas';

interface HeroOrbProps {
    persona: Persona;
    isTalking: boolean;
    onClick: () => void;
}

const HeroOrb: React.FC<HeroOrbProps> = ({ persona, isTalking, onClick }) => {
    const orbRef = useRef<HTMLDivElement>(null);

    // Subtle mouse parallax
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!orbRef.current) return;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            orbRef.current.style.transform = `translate(${dx * 10}px, ${dy * 10}px)`;
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const orbSize = window.innerWidth < 640 ? 180 : 240;
    const wrapSize = orbSize + 100;

    return (
        <div
            onClick={onClick}
            style={{
                position: 'relative',
                width: wrapSize,
                height: wrapSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                margin: '8px auto',
            }}
        >
            {/* Ripple rings when talking */}
            {isTalking && [0, 1, 2].map(i => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: orbSize,
                        height: orbSize,
                        borderRadius: '50%',
                        border: `1.5px solid ${persona.color}`,
                        animation: `ripple-out 2.2s ease-out ${i * 0.7}s infinite`,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* Soft outer glow */}
            <div
                style={{
                    position: 'absolute',
                    width: orbSize + 60,
                    height: orbSize + 60,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${persona.glowColor} 0%, transparent 70%)`,
                    filter: 'blur(24px)',
                    opacity: isTalking ? 1 : 0.55,
                    transition: 'opacity 0.6s ease, background 0.8s ease',
                    animation: isTalking ? 'orb-connecting 1.2s ease-in-out infinite' : 'float-c 5s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />

            {/* Main orb sphere */}
            <div
                ref={orbRef}
                style={{
                    position: 'relative',
                    width: orbSize,
                    height: orbSize,
                    borderRadius: '50%',
                    background: persona.orbGradient,
                    boxShadow: `
            inset 0 0 0 1px rgba(255,255,255,0.22),
            0 0 50px 12px ${persona.glowColor},
            0 24px 72px rgba(0,0,0,0.18),
            inset 0 -24px 48px rgba(0,0,0,0.14)
          `,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.8s ease, box-shadow 0.8s ease',
                    animation: isTalking
                        ? 'orb-connecting 0.9s ease-in-out infinite'
                        : 'orb-breathe 4s ease-in-out infinite',
                }}
            >
                {/* Primary specular highlight */}
                <div
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '14%',
                        width: '40%',
                        height: '28%',
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 80%)',
                        filter: 'blur(7px)',
                        pointerEvents: 'none',
                    }}
                />
                {/* Secondary rim highlight */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '16%',
                        width: '18%',
                        height: '12%',
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 80%)',
                        filter: 'blur(4px)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Label */}
                <span
                    style={{
                        color: 'rgba(255,255,255,0.88)',
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: '-0.01em',
                        textShadow: '0 1px 6px rgba(0,0,0,0.35)',
                        zIndex: 1,
                        transition: 'opacity 0.3s ease',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    {isTalking ? 'Connecting...' : 'Tap to talk'}
                </span>
            </div>
        </div>
    );
};

export default HeroOrb;
