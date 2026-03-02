import React from 'react';

interface NavbarProps {
    onFeatures: () => void;
    onFAQs: () => void;
    onBookDemo: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFeatures, onFAQs, onBookDemo }) => {
    return (
        <nav
            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
            style={{ height: 64 }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2" style={{ cursor: 'default' }}>
                <div
                    style={{
                        width: 28, height: 28,
                        borderRadius: 8,
                        background: 'rgba(0,0,0,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: '#0f0f0f',
                    }}
                >
                    A
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#0f0f0f', letterSpacing: '-0.03em' }}>
                    Aivana
                </span>
            </div>

            {/* Pill nav — right side */}
            <div
                className="flex items-center"
                style={{
                    background: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 999,
                    backdropFilter: 'blur(16px)',
                    padding: '6px 6px',
                    gap: 2,
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
                            padding: '6px 16px',
                            borderRadius: 999,
                            background: 'transparent',
                            border: 'none',
                            fontSize: 13,
                            fontWeight: 500,
                            color: '#444',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)';
                            (e.currentTarget as HTMLElement).style.color = '#111';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#444';
                        }}
                    >
                        {label}
                    </button>
                ))}

                <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />

                <button
                    onClick={onBookDemo}
                    style={{
                        padding: '7px 18px',
                        borderRadius: 999,
                        background: '#0f0f0f',
                        border: 'none',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        letterSpacing: '-0.01em',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#333'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0f0f0f'; }}
                >
                    Book a demo
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
