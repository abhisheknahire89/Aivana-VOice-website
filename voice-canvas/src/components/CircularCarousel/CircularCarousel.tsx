import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { PERSONAS, type Persona } from '../../data/personas';
import CarouselScene from './CarouselScene';

interface CircularCarouselProps {
    onSelectPersona: (persona: Persona) => void;
}

const CircularCarousel: React.FC<CircularCarouselProps> = ({ onSelectPersona }) => {
    const [activeIndex, setActiveIndex] = useState(2); // Start with Neha (middle)
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Momentum scroll
    const velocityRef = useRef(0);
    const lastTouchX = useRef(0);
    const lastTimestamp = useRef(0);
    const touchStartX = useRef(0);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const TOTAL = PERSONAS.length;

    const activePersona = PERSONAS[activeIndex];

    // Animate label transitions (pure CSS labels overlaid on top of Canvas)
    const animateLabels = useCallback((newIndex: number) => {
        labelRefs.current.forEach((el, i) => {
            if (!el) return;
            let offset = i - newIndex;
            if (offset > 2) offset -= TOTAL;
            if (offset < -2) offset += TOTAL;
            const absOff = Math.abs(offset);

            const isCenter = absOff === 0;
            const visible = absOff <= 1;

            gsap.to(el, {
                opacity: isCenter ? 1 : visible ? 0.35 : 0,
                y: isCenter ? 0 : offset > 0 ? 8 : -8,
                scale: isCenter ? 1 : 0.85,
                duration: 0.6,
                ease: 'expo.out',
            });
        });
    }, [TOTAL]);

    const animateToIndex = useCallback((newIndex: number) => {
        if (isAnimating) return;
        setIsAnimating(true);

        const normalized = ((newIndex % TOTAL) + TOTAL) % TOTAL;
        animateLabels(normalized);
        setActiveIndex(normalized);

        setTimeout(() => setIsAnimating(false), 700);
    }, [isAnimating, TOTAL, animateLabels]);

    const goNext = useCallback(() => animateToIndex(activeIndex + 1), [activeIndex, animateToIndex]);
    const goPrev = useCallback(() => animateToIndex(activeIndex - 1), [activeIndex, animateToIndex]);

    // Initial label setup
    useEffect(() => {
        animateLabels(activeIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Wheel
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        let delta = 0;
        let timeout: ReturnType<typeof setTimeout>;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            delta += e.deltaY;
            if (Math.abs(delta) > 40) {
                if (delta > 0) goNext();
                else goPrev();
                delta = 0;
            }
            clearTimeout(timeout);
            timeout = setTimeout(() => { delta = 0; }, 200);
        };

        container.addEventListener('wheel', onWheel, { passive: false });
        return () => container.removeEventListener('wheel', onWheel);
    }, [goNext, goPrev]);

    // Touch
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        lastTouchX.current = e.touches[0].clientX;
        lastTimestamp.current = Date.now();
        velocityRef.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const x = e.touches[0].clientX;
        const dt = Date.now() - lastTimestamp.current;
        if (dt > 0) velocityRef.current = (x - lastTouchX.current) / dt;
        lastTouchX.current = x;
        lastTimestamp.current = Date.now();
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const vel = Math.abs(velocityRef.current);
        if (Math.abs(dx) > 25 || vel > 0.2) {
            const steps = vel > 1.2 ? 2 : 1;
            if (dx > 0) animateToIndex(activeIndex - steps);
            else animateToIndex(activeIndex + steps);
        }
        velocityRef.current = 0;
    };

    // Keyboard
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'Enter' || e.key === ' ') onSelectPersona(PERSONAS[activeIndex]);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeIndex, goNext, goPrev, onSelectPersona]);

    return (
        <div
            ref={containerRef}
            className="relative w-full flex flex-col items-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Radial background glow synced to active persona */}
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-1000"
                style={{
                    background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${activePersona.color}18 0%, transparent 80%)`,
                }}
            />

            {/* Single Canvas — all orbs */}
            <div
                className="relative w-full"
                style={{
                    height: isMobile ? 280 : 380,
                    cursor: 'default',
                }}
                onClick={() => {/* click handled in nav buttons / dots */ }}
            >
                <CarouselScene activeIndex={activeIndex} />

                {/* Nav arrows overlaid on canvas */}
                {!isMobile && (
                    <>
                        <button
                            onClick={goPrev}
                            className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-30"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 3L5 8L10 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            onClick={goNext}
                            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-30"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 3L11 8L6 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Labels — CSS layer, perfectly synced */}
            <div className="relative flex gap-0 w-full justify-center mt-4" style={{ height: 80 }}>
                {PERSONAS.map((persona, i) => {
                    let offset = i - activeIndex;
                    if (offset > 2) offset -= TOTAL;
                    if (offset < -2) offset += TOTAL;
                    const isCenter = offset === 0;

                    return (
                        <div
                            key={persona.id}
                            ref={el => { labelRefs.current[i] = el; }}
                            className="absolute left-1/2 flex flex-col items-center text-center pointer-events-none"
                            style={{
                                transform: `translateX(-50%) translateX(${offset * (isMobile ? 95 : 160)}px)`,
                                opacity: 0,
                                width: isMobile ? 80 : 120,
                            }}
                        >
                            <p
                                className="font-bold uppercase"
                                style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontSize: isCenter ? (isMobile ? 18 : 22) : 11,
                                    color: isCenter ? '#fff' : 'rgba(255,255,255,0.4)',
                                    letterSpacing: '0.2em',
                                    transition: 'font-size 0.5s ease, color 0.5s ease',
                                }}
                            >
                                {persona.name}
                            </p>
                            {isCenter && (
                                <>
                                    <div className="w-8 h-px bg-white/15 my-2" />
                                    <p
                                        className="uppercase font-light text-white/35"
                                        style={{
                                            fontFamily: "'Outfit', sans-serif",
                                            fontSize: 10,
                                            letterSpacing: '0.22em',
                                        }}
                                    >
                                        {persona.role}
                                    </p>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* CTA + Dots row */}
            <div className="flex flex-col items-center gap-5 mt-6">
                <button
                    onClick={() => onSelectPersona(activePersona)}
                    className="px-8 py-3 rounded-full border transition-all duration-500"
                    style={{
                        borderColor: `${activePersona.color}55`,
                        background: `${activePersona.color}0d`,
                        fontSize: 10,
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: activePersona.color,
                        boxShadow: `0 0 20px ${activePersona.color}18`,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${activePersona.color}aa`;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${activePersona.color}30`;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${activePersona.color}55`;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${activePersona.color}18`;
                    }}
                >
                    Activate {activePersona.name}
                </button>

                {/* Navigation dots */}
                <div className="flex gap-2.5">
                    {PERSONAS.map((persona, index) => (
                        <button
                            key={persona.id}
                            onClick={() => animateToIndex(index)}
                            className="rounded-full transition-all duration-400"
                            style={{
                                width: index === activeIndex ? 28 : 8,
                                height: 8,
                                backgroundColor: index === activeIndex ? persona.color : `${persona.color}44`,
                                boxShadow: index === activeIndex ? `0 0 10px ${persona.color}66` : 'none',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CircularCarousel;
