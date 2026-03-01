import type { Persona } from '../../data/personas';

interface CarouselOrbProps {
    persona: Persona;
    isActive: boolean;
    style: {
        scale: number;
        opacity: number;
        size: number;
    };
    onClick: () => void;
}

export default function CarouselOrb({ persona, isActive, style, onClick }: CarouselOrbProps) {
    return (
        <div
            className="flex flex-col items-center cursor-pointer transition-all duration-500 ease-out"
            style={{
                transform: `scale(${style.scale})`,
                opacity: style.opacity,
            }}
            onClick={onClick}
        >
            {/* Orb Visual */}
            <div
                className="rounded-full relative transition-shadow duration-500"
                style={{
                    width: style.size,
                    height: style.size,
                    background: `radial-gradient(circle at 30% 30%, ${persona.color}66, ${persona.color}22)`,
                    boxShadow: isActive
                        ? `0 0 60px ${persona.glowColor}, 0 0 120px ${persona.glowColor}66`
                        : `0 0 30px ${persona.glowColor}44`,
                }}
            >
                {/* Wave texture overlay (Image 2 style) */}
                <div className="absolute inset-0 rounded-full overflow-hidden opacity-40">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <path
                                key={i}
                                d={`M 0 ${100 + Math.sin(i * 0.8) * 20} Q 50 ${100 + Math.sin(i * 0.8 + 1) * 20}, 100 ${100 + Math.sin(i * 0.8) * 20} Q 150 ${100 + Math.sin(i * 0.8 - 1) * 20}, 200 ${100 + Math.sin(i * 0.8) * 20}`}
                                stroke="white"
                                strokeWidth="0.5"
                                fill="none"
                                style={{
                                    transform: `translateY(${i * 12 - 70}px)`,
                                    opacity: 0.2 + (i / 30)
                                }}
                            />
                        ))}
                    </svg>
                </div>

                {/* Glass reflection */}
                <div className="absolute top-0 left-0 w-full h-1/2 rounded-t-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Label - only clear for active and adjacent */}
            <div className={`mt-6 text-center transition-all duration-500 ${style.opacity > 0.6 ? 'opacity-100' : 'opacity-0'}`}>
                <p className={`font-semibold tracking-tight transition-all ${isActive ? 'text-white text-xl md:text-2xl' : 'text-white/70 text-base'}`}>
                    {persona.name}
                </p>
                <p className={`transition-all ${isActive ? 'text-white/60 text-sm md:text-base' : 'text-white/40 text-xs'}`}>
                    {persona.role}
                </p>
            </div>

            {/* "Click to talk" indicator on active orb */}
            <div className={`mt-4 flex items-center gap-2 text-cyan-400 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}>
                <span className="animate-pulse">🎙️</span>
                <span className="text-sm font-medium uppercase tracking-widest">Click to talk</span>
            </div>
        </div>
    );
}
