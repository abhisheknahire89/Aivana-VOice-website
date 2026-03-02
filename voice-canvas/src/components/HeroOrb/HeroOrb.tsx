import React, { useEffect, useRef, useState } from 'react';
import type { Persona } from '../../data/personas';

interface HeroOrbProps {
    persona: Persona;
    isTalking: boolean;
    onClick: () => void;
}

const HeroOrb: React.FC<HeroOrbProps> = ({ persona, isTalking, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const glowRef = useRef<HTMLDivElement>(null);

    // Mouse parallax for the glow
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

    const orbSize = window.innerWidth < 640 ? 200 : 280;
    const wrapSize = orbSize + 120;

    // We use CSS sepia + hue-rotate to aggressively recolor the iframe based on the persona
    const getFilterForPersona = (id: string) => {
        switch (id) {
            case 'priya': // Purple
                return 'sepia(1) hue-rotate(230deg) saturate(2.5) contrast(1.1)';
            case 'rohan': // Orange
                return 'sepia(1) hue-rotate(350deg) saturate(3) contrast(1.1)';
            case 'neha':  // Green
                return 'sepia(1) hue-rotate(90deg) saturate(2) contrast(1.1)';
            case 'veda':  // Red
                return 'sepia(1) hue-rotate(320deg) saturate(3.5) contrast(1.1)';
            default:
                return 'none';
        }
    };

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
                // We let pointer events pass through to the iframe so the 3D robot is interactive
                pointerEvents: 'none',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* ── Ripple rings (talking state) ───────────────────────────────── */}
            {isTalking && [0, 1, 2].map(i => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: orbSize - 20,
                        height: orbSize - 20,
                        borderRadius: '50%',
                        border: `1.5px solid ${persona.color}`,
                        animation: `ripple-out 2.4s ease-out ${i * 0.75}s infinite`,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* ── Ambient glow behind the robot ─────────────────────────────── */}
            <div
                ref={glowRef}
                style={{
                    position: 'absolute',
                    width: orbSize + (hovered ? 60 : 30),
                    height: orbSize + (hovered ? 60 : 30),
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${persona.glowColor} 0%, transparent 68%)`,
                    filter: `blur(${hovered ? 28 : 22}px)`,
                    opacity: isTalking ? 1 : hovered ? 0.85 : 0.55,
                    transition: 'width 0.4s ease, height 0.4s ease, opacity 0.4s ease, filter 0.4s ease',
                    animation: isTalking ? 'orb-connecting 1.1s ease-in-out infinite' : 'float-c 5s ease-in-out infinite',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Spline 3D Robot Iframe ────────────────────────────────────── */}
            <div
                style={{
                    position: 'relative',
                    width: orbSize,
                    height: orbSize,
                    pointerEvents: 'auto', // Robot is interactive!
                    filter: getFilterForPersona(persona.id),
                    transition: 'filter 0.8s ease',
                    animation: isTalking ? 'orb-breathe 0.9s ease-in-out infinite' : 'none',
                    borderRadius: '50%', // Helps clip if the scene overflows
                    overflow: 'hidden',
                    boxShadow: hovered ? `0 0 30px 10px ${persona.glowColor}` : 'none',
                }}
            >
                <iframe
                    src='https://my.spline.design/happyrobotbutton-B0eXZIPruOrnllOWSVKBKEUK/'
                    frameBorder='0'
                    style={{ width: '100%', height: '100%' }}
                    title={`${persona.name} 3D Robot`}
                />
            </div>

            {/* ── Floating "Tap to talk" button overlay ─────────────────────── */}
            {/* Since the iframe consumes clicks, we provide a dedicated connect button overlapping the bottom */}
            <button
                onClick={onClick}
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    padding: '8px 20px',
                    background: isTalking ? persona.color : 'rgba(255,255,255,0.85)',
                    color: isTalking ? '#fff' : '#0a0a0a',
                    border: `1px solid ${isTalking ? 'transparent' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    backdropFilter: 'blur(10px)',
                    boxShadow: isTalking ? `0 4px 20px ${persona.glowColor}` : '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                }}
                onMouseEnter={(e) => {
                    if (!isTalking) {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isTalking) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.85)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }
                }}
            >
                {isTalking ? 'Connecting…' : 'Tap to talk'}
            </button>

        </div>
    );
};

export default HeroOrb;
