import React from 'react';
import type { Persona } from '../../data/personas';

interface PersonaSwitcherProps {
    personas: Persona[];
    active: Persona;
    onChange: (p: Persona) => void;
}

const DOTS: Record<string, string> = {
    priya: '#7C3AED',
    rohan: '#D97706',
    neha: '#059669',
    veda: '#DC2626',
};

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ personas, active, onChange }) => {
    return (
        <div
            style={{
                display: 'flex',
                gap: 8,
                padding: '6px',
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 999,
                backdropFilter: 'blur(14px)',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: 520,
            }}
        >
            {personas.map((p, i) => {
                const isActive = p.id === active.id;
                return (
                    <button
                        key={p.id}
                        onClick={() => onChange(p)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            padding: '7px 16px',
                            borderRadius: 999,
                            border: 'none',
                            background: isActive ? 'white' : 'transparent',
                            boxShadow: isActive ? '0 2px 10px rgba(0,0,0,0.09)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                            animation: `chip-in 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both`,
                        }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: DOTS[p.id] || p.color,
                                flexShrink: 0,
                                boxShadow: isActive ? `0 0 6px 2px ${DOTS[p.id] || p.color}55` : 'none',
                                transition: 'box-shadow 0.3s ease',
                            }}
                        />
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? '#0f0f0f' : '#666',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {p.name}
                        </span>
                        {isActive && (
                            <span
                                style={{
                                    fontSize: 10,
                                    color: '#999',
                                    fontWeight: 400,
                                }}
                            >
                                · {p.role}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default PersonaSwitcher;
