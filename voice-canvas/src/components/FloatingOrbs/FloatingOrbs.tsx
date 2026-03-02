import React from 'react';
import type { Persona } from '../../data/personas';

interface FloatingOrbsProps {
    persona: Persona;
}

type OrbConfig = {
    size: number;
    top: string;
    left: string;
    opacity: number;
    blur: number;
    animation: string;
    delay: string;
    gradient: string;
};

const FloatingOrbs: React.FC<FloatingOrbsProps> = ({ persona }) => {
    const orbs: OrbConfig[] = [
        {
            size: 130,
            top: '8%', left: '4%',
            opacity: 0.85, blur: 0,
            animation: 'float-a 7s ease-in-out infinite',
            delay: '0s',
            gradient: persona.orbGradient,
        },
        {
            size: 60,
            top: '55%', left: '2%',
            opacity: 0.5, blur: 0,
            animation: 'float-b 9s ease-in-out infinite',
            delay: '1.5s',
            gradient: persona.orbGradient,
        },
        {
            size: 44,
            top: '72%', left: '10%',
            opacity: 0.35, blur: 2,
            animation: 'float-c 8s ease-in-out infinite',
            delay: '3s',
            gradient: 'radial-gradient(circle at 35% 30%, #e0e0e8 0%, #b0b0c0 60%, #8080a0 100%)',
        },
        {
            size: 90,
            top: '12%', left: '88%',
            opacity: 0.4, blur: 2,
            animation: 'float-b 11s ease-in-out infinite',
            delay: '0.5s',
            gradient: 'radial-gradient(circle at 35% 30%, #e0e0e8 0%, #b0b0c0 60%, #8080a0 100%)',
        },
        {
            size: 50,
            top: '75%', left: '85%',
            opacity: 0.6, blur: 0,
            animation: 'float-a 8.5s ease-in-out infinite',
            delay: '2s',
            gradient: persona.orbGradient,
        },
        {
            size: 36,
            top: '40%', left: '92%',
            opacity: 0.3, blur: 3,
            animation: 'float-c 10s ease-in-out infinite',
            delay: '4s',
            gradient: 'radial-gradient(circle at 35% 30%, #e0e0e8 0%, #b0b0c0 60%, #8080a0 100%)',
        },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none z-5" style={{ overflow: 'hidden' }}>
            {orbs.map((orb, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: orb.size,
                        height: orb.size,
                        top: orb.top,
                        left: orb.left,
                        borderRadius: '50%',
                        background: orb.gradient,
                        opacity: orb.opacity,
                        filter: orb.blur > 0 ? `blur(${orb.blur}px)` : undefined,
                        animation: orb.animation,
                        animationDelay: orb.delay,
                        boxShadow: `
              0 0 0 1px rgba(255,255,255,0.2) inset,
              inset 0 -10px 20px rgba(0,0,0,0.12)
            `,
                        transition: 'background 1s ease',
                    }}
                >
                    {/* Specular on each floating orb */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '12%', left: '16%',
                            width: '35%', height: '25%',
                            borderRadius: '50%',
                            background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 80%)',
                            filter: 'blur(3px)',
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default FloatingOrbs;
