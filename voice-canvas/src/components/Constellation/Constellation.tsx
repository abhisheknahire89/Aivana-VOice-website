import { useState, useCallback, useRef, useEffect } from 'react';
import type { Persona } from '../../data/personas';
import { PERSONAS } from '../../data/personas';
import { useAudio } from '../../hooks/useAudio';
import { createColorExplosion } from '../../utils/animations';
import ConstellationScene from './ConstellationScene';
import gsap from 'gsap';

interface ConstellationProps {
    currentPhase: string;
    onSelectPersona: (persona: Persona) => void;
    onHoverPersona: (persona: Persona | null, position: { x: number; y: number } | null) => void;
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);
    return isMobile;
}

export default function Constellation({ currentPhase: _currentPhase, onSelectPersona, onHoverPersona }: ConstellationProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [previewedId, setPreviewedId] = useState<string | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const lastWhisperRef = useRef<string | null>(null);
    const { playWhisper } = useAudio();
    const isMobile = useIsMobile();

    // Entrance: fade in the whole layer
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'power2.out', delay: 0.2 });
    }, []);

    const handleHover = useCallback((persona: Persona, e: React.MouseEvent) => {
        setHasInteracted(true);
        setHoveredId(persona.id);
        onHoverPersona(persona, { x: e.clientX, y: e.clientY });
        if (lastWhisperRef.current !== persona.id) {
            lastWhisperRef.current = persona.id;
            playWhisper(persona.id);
        }
    }, [playWhisper, onHoverPersona]);

    const handleLeave = useCallback(() => {
        setHoveredId(null);
        lastWhisperRef.current = null;
        onHoverPersona(null, null);
    }, [onHoverPersona]);

    const handleClick = useCallback((persona: Persona, e: React.MouseEvent | React.KeyboardEvent) => {
        setHasInteracted(true);

        if (isMobile && previewedId !== persona.id) {
            setPreviewedId(persona.id);
            setHoveredId(persona.id);
            return;
        }

        // Implode all other orbs
        const el = overlayRef.current;
        if (el) {
            const buttons = el.querySelectorAll('[data-persona-id]');
            buttons.forEach(btn => {
                if ((btn as HTMLElement).dataset.personaId !== persona.id) {
                    gsap.to(btn, { opacity: 0, scale: 0.3, duration: 0.4, ease: 'power2.in' });
                }
            });
        }

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        setTimeout(() => {
            createColorExplosion(persona.color, x, y, () => onSelectPersona(persona));
        }, 250);
    }, [onSelectPersona, isMobile, previewedId]);

    // Active persona for radial bg
    const hoveredPersona = PERSONAS.find(p => p.id === hoveredId);
    const bgStyle: React.CSSProperties = hoveredPersona
        ? {
            background: `radial-gradient(circle at ${isMobile ? hoveredPersona.mobilePosition.x : hoveredPersona.position.x} ${isMobile ? hoveredPersona.mobilePosition.y : hoveredPersona.position.y}, ${hoveredPersona.glowColor} 0%, transparent 50%), #000000`,
            transition: 'background 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }
        : { background: '#000000', transition: 'background 0.8s ease-out' };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-10"
            style={{ opacity: 0, ...bgStyle }}
        >
            {/* Single shared 3D canvas — all orbs */}
            <ConstellationScene hoveredId={hoveredId} isMobile={isMobile} />

            {/* SVG signal lines */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 2 }}
            >
                {PERSONAS.map(persona => {
                    const pos = isMobile ? persona.mobilePosition : persona.position;
                    const isHov = hoveredId === persona.id;
                    return (
                        <line
                            key={persona.id}
                            x1="50%" y1="50%"
                            x2={pos.x} y2={pos.y}
                            stroke={persona.color}
                            strokeWidth="0.5"
                            strokeDasharray="3 10"
                            opacity={isHov ? 0.45 : 0.08}
                            style={{ transition: 'opacity 0.6s ease' }}
                        />
                    );
                })}
                <circle cx="50%" cy="50%" r="2.5" fill="rgba(255,255,255,0.12)" />
            </svg>

            {/* Invisible clickable/hoverable hit areas */}
            <div
                ref={overlayRef}
                className="absolute inset-0"
                style={{ zIndex: 3 }}
            >
                {PERSONAS.map(persona => {
                    const pos = isMobile ? persona.mobilePosition : persona.position;
                    const hitSize = isMobile ? 80 : 110;
                    const isHov = hoveredId === persona.id;
                    const isOther = hoveredId !== null && hoveredId !== persona.id;

                    return (
                        <button
                            key={persona.id}
                            data-persona-id={persona.id}
                            className="absolute flex flex-col items-center focus:outline-none"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                transform: 'translate(-50%, -50%)',
                                width: hitSize,
                                cursor: 'pointer',
                            }}
                            onMouseEnter={!isMobile ? e => handleHover(persona, e) : undefined}
                            onMouseLeave={!isMobile ? handleLeave : undefined}
                            onClick={e => handleClick(persona, e)}
                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleClick(persona, e)}
                            aria-label={`${persona.name} — ${persona.role}`}
                        >
                            {/* Transparent hit area sized to orb */}
                            <div
                                style={{
                                    width: hitSize,
                                    height: hitSize,
                                    borderRadius: '50%',
                                    opacity: 0,  // invisible — 3D canvas shows the orb
                                }}
                            />

                            {/* Label */}
                            <div
                                className="mt-4 flex flex-col items-center"
                                style={{
                                    opacity: isOther ? 0.2 : 1,
                                    transition: 'opacity 0.4s ease',
                                }}
                            >
                                <p
                                    className="text-white font-semibold uppercase"
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontSize: 10,
                                        letterSpacing: '0.22em',
                                        textShadow: isHov ? `0 0 12px ${persona.color}` : 'none',
                                        transition: 'text-shadow 0.4s ease',
                                    }}
                                >
                                    {persona.name}
                                </p>
                                <p
                                    className="text-white/25 uppercase font-light"
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontSize: 8,
                                        letterSpacing: '0.2em',
                                        marginTop: 3,
                                    }}
                                >
                                    {persona.role}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Instruction hint */}
            {!hasInteracted && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5 pointer-events-none" style={{ zIndex: 4 }}>
                    <div className="w-px h-4 bg-white/10" />
                    <span
                        className="text-white/20 uppercase font-light"
                        style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: '0.4em' }}
                    >
                        Approach a signal
                    </span>
                    <div className="w-px h-4 bg-white/10" />
                </div>
            )}
        </div>
    );
}
