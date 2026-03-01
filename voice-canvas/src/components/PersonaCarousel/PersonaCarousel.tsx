import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { PERSONAS, type Persona } from '../../data/personas';
import CarouselOrb from './CarouselOrb';
import NavigationDots from './NavigationDots';
import { useSwipe } from '../../hooks/useSwipe';

interface PersonaCarouselProps {
    onSelectPersona: (persona: Persona) => void;
}

export default function PersonaCarousel({ onSelectPersona }: PersonaCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(2); // Start with center persona (Neha)
    const [isVisible, setIsVisible] = useState(false);
    const [rotationAngle, setRotationAngle] = useState(0); // Current global rotation offset in degrees
    const containerRef = useRef<HTMLDivElement>(null);
    const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

    const totalPersonas = PERSONAS.length;
    const angleStep = 360 / totalPersonas;

    // Entrance animation
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Function to calculate target rotation to bring an index to the front (0 degrees)
    const rotateToIndex = useCallback((index: number) => {
        // We want the selected index to be at the front (angle 0)
        // Current angle of index i is (i * angleStep + currentRotationOffset)
        // To make it 0: targetOffset = -(i * angleStep)
        const targetOffset = -(index * angleStep);

        // Handle shortest path rotation
        // We calculate the delta and apply it to rotationAngle
        let delta = targetOffset - rotationAngle;

        // Adjust delta for shortest path (wrap around 360)
        // This makes sure we don't spin 300 degrees when 60 would suffice
        delta = ((delta + 180) % 360 + 360) % 360 - 180;

        const finalTarget = rotationAngle + delta;

        gsap.to({ val: rotationAngle }, {
            val: finalTarget,
            duration: 0.8,
            ease: 'power3.inOut',
            onUpdate: function () {
                setRotationAngle(this.targets()[0].val);
            }
        });
        setActiveIndex(index);
    }, [angleStep, rotationAngle]);

    const handleNext = useCallback(() => {
        const nextIndex = (activeIndex + 1) % totalPersonas;
        rotateToIndex(nextIndex);
    }, [activeIndex, rotateToIndex, totalPersonas]);

    const handlePrev = useCallback(() => {
        const prevIndex = (activeIndex - 1 + totalPersonas) % totalPersonas;
        rotateToIndex(prevIndex);
    }, [activeIndex, rotateToIndex, totalPersonas]);

    // Swipe navigation
    useSwipe(containerRef, {
        onSwipeLeft: handleNext,
        onSwipeRight: handlePrev,
    });

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                handleNext();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                handlePrev();
            } else if (e.key === 'Enter' || e.key === ' ') {
                onSelectPersona(PERSONAS[activeIndex]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, handleNext, handlePrev, onSelectPersona]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 overflow-hidden"
            style={{ perspective: '1200px' }}
        >
            {/* Background soft glow */}
            <div
                className="absolute inset-0 transition-all duration-1000 opacity-20 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, ${PERSONAS[activeIndex].color} 0%, transparent 70%)`
                }}
            />

            {/* Headline */}
            <div
                className={`absolute top-[15%] text-center transition-all duration-700 ease-out z-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            >
                <h2 className="text-white/90 text-xl md:text-3xl font-light tracking-widest uppercase px-6">
                    AI voice bot for intelligent conversations
                </h2>
            </div>

            {/* 3D Circular Container */}
            <div className="relative w-full h-[50%] flex items-center justify-center mt-10" style={{ transformStyle: 'preserve-3d' }}>
                {PERSONAS.map((persona, index) => {
                    // Calculate angle for this orb
                    const orbAngle = (index * angleStep + rotationAngle);
                    const angleRad = (orbAngle * Math.PI) / 180;

                    // Constants for the elliptical path
                    const radiusX = window.innerWidth < 768 ? 180 : 450;
                    const radiusZ = window.innerWidth < 768 ? 120 : 300;

                    // Calculate 3D coordinates
                    // x is horizontal, z is depth (smaller = front, larger = back)
                    const x = Math.sin(angleRad) * radiusX;
                    const z = Math.cos(angleRad) * radiusZ;

                    // Normalized depth (0 to 1, where 0 is front, 1 is back)
                    const depth = (z + radiusZ) / (2 * radiusZ);

                    // Style values based on depth
                    const scale = 1.3 - (depth * 0.8); // 1.3 to 0.5
                    const opacity = 1.0 - (depth * 0.9); // 1.0 to 0.1
                    const blur = depth * 6; // 0px to 6px blur
                    const zIndex = Math.round((1 - depth) * 100);

                    return (
                        <div
                            key={persona.id}
                            ref={el => { orbRefs.current[index] = el; }}
                            className="absolute transition-all duration-700 ease-out"
                            style={{
                                transform: `translate3d(${x}px, 0, ${-z}px) scale(${scale})`,
                                opacity: isVisible ? opacity : 0,
                                zIndex: zIndex,
                                filter: `blur(${blur}px)`,
                                pointerEvents: opacity < 0.2 ? 'none' : 'auto',
                                transitionDelay: !isVisible ? `${index * 80}ms` : '0ms'
                            }}
                        >
                            <CarouselOrb
                                persona={persona}
                                isActive={index === activeIndex}
                                style={{
                                    scale: 1, // Handled by parent container
                                    opacity: 1, // Handled by parent container
                                    size: window.innerWidth < 768 ? 140 : 220
                                }}
                                onClick={() => {
                                    if (index === activeIndex) {
                                        onSelectPersona(persona);
                                    } else {
                                        rotateToIndex(index);
                                    }
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Navigation Dots */}
            <div className={`mt-12 transition-all duration-700 delay-500 z-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <NavigationDots
                    total={totalPersonas}
                    activeIndex={activeIndex}
                    onDotClick={rotateToIndex}
                    personas={PERSONAS}
                />
            </div>

            {/* Bottom context UI */}
            <div
                className={`absolute bottom-[10%] flex flex-col items-center gap-6 transition-all duration-700 delay-700 z-20 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                <p className="text-white/40 text-[10px] md:text-xs tracking-[0.3em] uppercase">
                    ← Swipe or use arrow keys to revolve →
                </p>

                <div className="flex items-center gap-4 text-white/30 text-[10px] md:text-xs">
                    <span>🎧 Tip: Use earphones for best experience</span>
                </div>
            </div>
        </div>
    );
}
