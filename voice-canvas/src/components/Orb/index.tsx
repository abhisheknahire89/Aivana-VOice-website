import { useRef, useEffect, memo } from 'react';
import gsap from 'gsap';
import type { Persona } from '../../data/personas';
import PersonaThreeD from '../CircularCarousel/PersonaThreeD';

interface OrbProps {
    persona: Persona;
    isActive: boolean;
    isOtherActive: boolean;
    isMobile: boolean;
    onHover: (e: React.MouseEvent | React.TouchEvent) => void;
    onLeave: () => void;
    onClick: (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => void;
}

const Orb = memo(function Orb({ persona, isActive, isOtherActive, isMobile, onHover, onLeave, onClick }: OrbProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const permanentLabelRef = useRef<HTMLDivElement>(null);

    const defaultSize = isMobile ? 60 : 80;
    const activeSize = isMobile ? 100 : 140;
    const pos = isMobile ? persona.mobilePosition : persona.position;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        gsap.to(container, {
            opacity: isOtherActive ? 0.3 : 1,
            scale: isActive ? 1.2 : 1,
            duration: 0.4,
            ease: 'power2.out',
        });
    }, [isOtherActive, isActive]);

    useEffect(() => {
        if (permanentLabelRef.current) {
            gsap.fromTo(permanentLabelRef.current,
                { opacity: 0, y: 5 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' }
            );
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
        }
    };

    return (
        <div
            ref={containerRef}
            className="absolute flex flex-col items-center cursor-pointer outline-none z-10"
            style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
                width: activeSize,
                height: activeSize + 100,
                transition: 'width 0.4s ease, height 0.4s ease',
            }}
            tabIndex={0}
            role="button"
            aria-label={`${persona.name} — ${persona.role}`}
            onMouseEnter={!isMobile ? onHover : undefined}
            onMouseLeave={!isMobile ? onLeave : undefined}
            onClick={onClick}
            onTouchStart={isMobile ? (e) => { onHover(e); } : undefined}
            onKeyDown={handleKeyDown}
        >
            <div
                className="relative"
                style={{
                    width: isActive ? activeSize : defaultSize,
                    height: isActive ? activeSize : defaultSize,
                    transition: 'width 0.4s ease, height 0.4s ease',
                }}
            >
                <PersonaThreeD persona={persona} active={isActive} />
            </div>

            <div
                ref={permanentLabelRef}
                className="mt-4 text-center pointer-events-none w-48"
            >
                <p className="text-white font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
                    {persona.name}
                </p>
                <p className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-widest mt-1 font-light">
                    {persona.role}
                </p>
            </div>
        </div>
    );
});

export default Orb;
