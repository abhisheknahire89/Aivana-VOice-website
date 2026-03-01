import React, { useRef } from 'react';
import { type Persona } from '../../data/personas';
import PersonaThreeD from './PersonaThreeD';

interface OrbWithLabelProps {
    persona: Persona;
    isCenter: boolean;
    size: number;
    offset: number;
}

const OrbWithLabel: React.FC<OrbWithLabelProps> = ({ persona, isCenter, size, offset }) => {
    const absOffset = Math.abs(offset);
    const showLabel = absOffset <= 1;
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center select-none"
        >
            {/* 3D Orb */}
            <div
                className="relative"
                style={{
                    width: size,
                    height: size,
                    transition: 'filter 0.5s ease',
                    filter: isCenter
                        ? `drop-shadow(0 0 30px ${persona.color}55)`
                        : 'none',
                }}
            >
                <PersonaThreeD persona={persona} active={isCenter} />
            </div>

            {/* Label */}
            {showLabel && (
                <div
                    className="text-center mt-6 transition-all duration-700 ease-out"
                    style={{ opacity: isCenter ? 1 : 0.45 }}
                >
                    <p
                        className={`font-bold text-white uppercase tracking-[0.22em] transition-all duration-500 ${isCenter ? 'text-xl' : 'text-[10px]'}`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        {persona.name}
                    </p>
                    {isCenter && (
                        <div className="flex flex-col items-center mt-2">
                            <span className="w-6 h-px bg-white/15 mb-2" />
                            <p
                                className="text-white/35 tracking-[0.18em] text-[11px] font-light uppercase"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {persona.role}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* CTA — center only */}
            {isCenter && (
                <button
                    className="mt-6 px-6 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md btn-premium"
                    style={{
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${persona.color}88`;
                        (e.currentTarget as HTMLElement).style.background = `${persona.color}11`;
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    }}
                >
                    <span
                        className="text-[10px] font-bold uppercase tracking-[0.3em]"
                        style={{ color: persona.color, fontFamily: "'Outfit', sans-serif" }}
                    >
                        Activate Agent
                    </span>
                </button>
            )}
        </div>
    );
};

export default OrbWithLabel;
