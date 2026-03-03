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
            }}
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    padding: '28px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* ── Logo (left) ── */}
                <span
                    style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: '#f9fafb',
                        letterSpacing: '-0.05em',
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    Aivana
                </span>

                {/* ── CTA (right) ── */}
                <button
                    onClick={onBookDemo}
                    style={{
                        padding: '10px 20px',
                        borderRadius: 999,
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.25)',
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#f1f1f5',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.01em',
                        transition: 'background 0.2s ease, border-color 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.4)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
                    }}
                >
                    Book a demo
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
