import React from 'react';

interface NavbarProps {
    onBookDemo: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBookDemo }) => {
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
                className="main-navbar-inner"
                style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    padding: 'clamp(14px, 2.8vw, 28px) clamp(12px, 3.5vw, 40px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                }}
            >
                {/* ── Logo + Tagline (left) ── */}
                <div className="main-navbar-brand" style={{ display: 'flex', flexDirection: 'column', gap: 2, cursor: 'pointer', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {/* Logo Icon */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'min-content min-content', gap: '2px' }}>
                            <div style={{ width: '6px', height: '6px', background: '#f9fafb', borderRadius: '1px' }}></div>
                            <div style={{ width: '6px', height: '6px', background: '#f9fafb', borderRadius: '1px' }}></div>
                            <div style={{ width: '6px', height: '6px', background: '#f9fafb', borderRadius: '1px' }}></div>
                            <div style={{ width: '6px', height: '6px', background: '#a78bfa', borderRadius: '1px' }}></div>
                        </div>
                        <span
                            style={{
                                fontSize: 'clamp(18px, 2vw, 22px)',
                                fontWeight: 700,
                                color: '#f9fafb',
                                letterSpacing: '-0.03em',
                                fontFamily: "'Satoshi', 'General Sans', sans-serif",
                                lineHeight: 1,
                            }}
                        >
                            Aivana
                        </span>
                    </div>
                    <span className="main-navbar-tagline" style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Voice AI Agents
                    </span>
                </div>

                {/* ── Center Links ── */}
                <div className="main-navbar-links" style={{ gap: 32, alignItems: 'center', display: 'flex' }}>
                    <a href="#"
                        style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                        Platform
                    </a>
                    <a href="#"
                        style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                        Use Cases
                    </a>
                </div>

                {/* ── CTA (right) ── */}
                <button
                    onClick={onBookDemo}
                    className="main-navbar-cta"
                    style={{
                        padding: 'clamp(8px, 1.8vw, 10px) clamp(14px, 2.5vw, 24px)',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        fontSize: 'clamp(12px, 1.6vw, 14px)',
                        fontWeight: 600,
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.01em',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 0 rgba(167, 139, 250, 0)',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(167, 139, 250, 0.1)';
                        (e.currentTarget as HTMLElement).style.borderColor = '#a78bfa';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(167, 139, 250, 0.4)';
                        (e.currentTarget as HTMLElement).style.color = '#ffffff';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.4)';
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 rgba(167, 139, 250, 0)';
                    }}
                >
                    Book a demo
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
