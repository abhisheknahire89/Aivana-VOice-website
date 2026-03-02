import React from 'react';

interface NavbarProps {
    onFeatures: () => void;
    onFAQs: () => void;
    onBookDemo: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFeatures, onFAQs, onBookDemo }) => {
    return (
        <nav
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 28px',
            }}
        >
            {/* ── Logo (left) ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'default' }}>
                <span
                    style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: '#080808',
                        letterSpacing: '-0.05em',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    Aivana
                </span>
            </div>

            {/* ── Pill Nav (right) ── */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 0,
                    background: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: 999,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    padding: '3px',
                    flexShrink: 0,
                }}
            >
                {[
                    { label: 'Features', action: onFeatures },
                    { label: 'FAQs', action: onFAQs },
                ].map(({ label, action }) => (
                    <button
                        key={label}
                        onClick={action}
                        style={{
                            padding: '7px 16px',
                            borderRadius: 999,
                            background: 'transparent',
                            border: 'none',
                            fontSize: 13,
                            fontWeight: 500,
                            color: '#555',
                            cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif",
                            whiteSpace: 'nowrap',
                            transition: 'background 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)';
                            (e.currentTarget as HTMLElement).style.color = '#111';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#555';
                        }}
                    >
                        {label}
                    </button>
                ))}

                {/* Divider */}
                <div
                    style={{
                        width: 1,
                        height: 16,
                        background: 'rgba(0,0,0,0.1)',
                        margin: '0 3px',
                        flexShrink: 0,
                    }}
                />

                {/* Book a demo */}
                <button
                    onClick={onBookDemo}
                    style={{
                        padding: '8px 18px',
                        borderRadius: 999,
                        background: '#0f0f0f',
                        border: 'none',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#fff',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        letterSpacing: '-0.01em',
                        transition: 'background 0.18s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = '#333';
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = '#0f0f0f';
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}
                >
                    Book a demo
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
