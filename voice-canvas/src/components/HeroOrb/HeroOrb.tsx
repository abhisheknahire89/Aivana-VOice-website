import React, { useEffect, useRef, useState } from 'react';
import type { Persona } from '../../data/personas';

interface HeroOrbProps {
    persona: Persona;
    isTalking: boolean;
    onClick: () => void;
}

const HeroOrb: React.FC<HeroOrbProps> = ({ persona, isTalking, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    const orbRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    // Mouse parallax — orb follows cursor subtly
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!orbRef.current) return;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            orbRef.current.style.transform = `translate(${dx * 12}px, ${dy * 12}px)`;
            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${dx * 18}px, ${dy * 18}px)`;
            }
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    const orbSize = window.innerWidth < 640 ? 175 : 230;
    const wrapSize = orbSize + 120;

    const orbScale = pressed ? 0.93 : hovered ? 1.07 : 1;

    return (
        <div
            style={{
                position: 'relative',
                width: wrapSize,
                height: wrapSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '6px auto',
                cursor: 'pointer',
                pointerEvents: 'auto',
            }}
            onClick={() => { onClick(); }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setPressed(false); }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            // Touch support
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => { setPressed(false); onClick(); }}
        >
            {/* ── Ripple rings (talking state) ───────────────────────────────── */}
            {isTalking && [0, 1, 2].map(i => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: orbSize,
                        height: orbSize,
                        borderRadius: '50%',
                        border: `1.5px solid ${persona.color}`,
                        animation: `ripple-out 2.4s ease-out ${i * 0.75}s infinite`,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* ── Hover pulse ring ────────────────────────────────────────────── */}
            {hovered && !isTalking && (
                <div
                    style={{
                        position: 'absolute',
                        width: orbSize + 20,
                        height: orbSize + 20,
                        borderRadius: '50%',
                        border: `1px solid ${persona.color}55`,
                        animation: 'ripple-out 1.8s ease-out infinite',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* ── Ambient glow (moves slightly independently) ─────────────────── */}
            <div
                ref={glowRef}
                style={{
                    position: 'absolute',
                    width: orbSize + (hovered ? 80 : 50),
                    height: orbSize + (hovered ? 80 : 50),
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${persona.glowColor} 0%, transparent 68%)`,
                    filter: `blur(${hovered ? 28 : 22}px)`,
                    opacity: isTalking ? 1 : hovered ? 0.85 : 0.55,
                    transition: 'width 0.4s ease, height 0.4s ease, opacity 0.4s ease, filter 0.4s ease, background 0.8s ease',
                    animation: isTalking ? 'orb-connecting 1.1s ease-in-out infinite' : 'float-c 5s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Main orb sphere ─────────────────────────────────────────────── */}
            <div
                ref={orbRef}
                style={{
                    position: 'relative',
                    width: orbSize,
                    height: orbSize,
                    borderRadius: '50%',

                    // ← This is the key: persona gradient applied directly
                    background: persona.orbGradient,

                    boxShadow: hovered
                        ? `
                inset 0 0 0 1px rgba(255,255,255,0.3),
                0 0 70px 20px ${persona.glowColor},
                0 28px 80px rgba(0,0,0,0.22),
                inset 0 -28px 56px rgba(0,0,0,0.18)
              `
                        : `
                inset 0 0 0 1px rgba(255,255,255,0.2),
                0 0 48px 10px ${persona.glowColor},
                0 20px 60px rgba(0,0,0,0.16),
                inset 0 -20px 44px rgba(0,0,0,0.14)
              `,

                    // scale driven by hover/press state
                    transform: `scale(${orbScale})`,
                    transition: `transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, background 0.9s ease`,

                    animation: isTalking
                        ? 'orb-connecting 0.9s ease-in-out infinite'
                        : 'orb-breathe 4s ease-in-out infinite',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Primary specular highlight */}
                <div
                    style={{
                        position: 'absolute',
                        top: '10%', left: '13%',
                        width: '42%', height: '30%',
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.65) 0%, transparent 80%)',
                        filter: 'blur(8px)',
                        pointerEvents: 'none',
                        transition: 'opacity 0.3s ease',
                        opacity: hovered ? 0.9 : 0.7,
                    }}
                />

                {/* Secondary bottom-right rim */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '18%', right: '15%',
                        width: '20%', height: '12%',
                        borderRadius: '50%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.25) 0%, transparent 80%)',
                        filter: 'blur(4px)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Centre label */}
                <span
                    style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: '-0.01em',
                        textShadow: '0 1px 8px rgba(0,0,0,0.45)',
                        zIndex: 1,
                        fontFamily: "'Inter', sans-serif",
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                    }}
                >
                    {isTalking ? 'Connecting…' : hovered ? `Talk to ${persona.name}` : 'Tap to talk'}
                </span>
            </div>
        </div>
    );
};

export default HeroOrb;
