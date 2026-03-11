import React, { useState } from 'react';
import type { Persona } from '../../data/personas';

interface FeaturesModalProps {
    persona: Persona;
    onClose: () => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({ persona, onClose }) => {
    const [activeCard, setActiveCard] = useState(0);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backdropFilter: 'blur(2px)', padding: 'clamp(8px, 2.8vw, 12px)', background: 'rgba(0,0,0,0.4)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="animate-modal-in"
                style={{
                    background: 'rgba(255,255,255,0.82)',
                    border: '1px solid rgba(255,255,255,0.9)',
                    borderRadius: 24,
                    backdropFilter: 'blur(32px)',
                    padding: 'clamp(18px, 4.8vw, 36px) clamp(16px, 4.8vw, 36px) clamp(18px, 4vw, 28px)',
                    maxWidth: 480,
                    width: 'min(92vw, 480px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)',
                    maxHeight: 'min(88dvh, 720px)',
                    overflowY: 'auto',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div
                        style={{
                            width: 10, height: 10, borderRadius: '50%',
                            background: persona.color,
                            boxShadow: `0 0 10px 3px ${persona.glowColor}`,
                        }}
                    />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {persona.name} · {persona.role}
                    </span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f0f0f', letterSpacing: '-0.03em', marginBottom: 6 }}>
                    What {persona.name} can do
                </h2>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
                    {persona.tagline}
                </p>

                {/* Feature cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {persona.features.map((f, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveCard(i === activeCard ? -1 : i)}
                            style={{
                                padding: '16px 20px',
                                borderRadius: 14,
                                background: activeCard === i ? 'white' : 'rgba(0,0,0,0.025)',
                                border: `1.5px solid ${activeCard === i ? 'rgba(0,0,0,0.08)' : 'transparent'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: activeCard === i ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#0f0f0f' }}>{f.title}</span>
                                <span style={{ fontSize: 18, color: '#bbb', transition: 'transform 0.2s', transform: activeCard === i ? 'rotate(45deg)' : 'none' }}>+</span>
                            </div>
                            {activeCard === i && (
                                <p style={{ marginTop: 8, fontSize: 13, color: '#666', lineHeight: 1.6 }}>
                                    {f.body}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Try prompts */}
                <div style={{ marginTop: 20, padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: 14 }}>
                    <p style={{ fontSize: 11, color: '#aaa', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                        Try asking {persona.name}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {persona.prompts.map((prompt, i) => (
                            <span
                                key={i}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 999,
                                    background: 'white',
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    fontSize: 12,
                                    color: '#444',
                                    fontWeight: 500,
                                }}
                            >
                                "{prompt}"
                            </span>
                        ))}
                    </div>
                </div>

                {/* Close */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 28px',
                            borderRadius: 999,
                            background: 'transparent',
                            border: '1.5px solid rgba(220,38,38,0.35)',
                            color: '#DC2626',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.06)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturesModal;
