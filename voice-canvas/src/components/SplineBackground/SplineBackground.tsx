import React from 'react';

// Pure CSS animated wave background — no iframe, no boat
const SplineBackground: React.FC = () => {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                background: 'linear-gradient(160deg, #0d0d12 0%, #111118 40%, #0a0a10 100%)',
            }}
        >
            {/* SVG wave layers — dark, smooth, layered */}
            <svg
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#16213e" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0f3460" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#533483" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0f3460" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#162447" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.6" />
                    </linearGradient>
                </defs>

                {/* Wave 1 — slow */}
                <path
                    d="M0,500 C200,440 400,560 600,500 C800,440 1000,560 1200,500 C1320,460 1400,520 1440,500 L1440,900 L0,900 Z"
                    fill="url(#wave1)"
                    style={{ animation: 'wave1Move 14s ease-in-out infinite alternate' }}
                />

                {/* Wave 2 — medium */}
                <path
                    d="M0,580 C240,520 480,640 720,580 C960,520 1200,640 1440,580 L1440,900 L0,900 Z"
                    fill="url(#wave2)"
                    style={{ animation: 'wave2Move 10s ease-in-out infinite alternate' }}
                />

                {/* Wave 3 — fast */}
                <path
                    d="M0,650 C180,610 360,690 540,650 C720,610 900,690 1080,650 C1260,610 1380,680 1440,650 L1440,900 L0,900 Z"
                    fill="url(#wave3)"
                    style={{ animation: 'wave3Move 7s ease-in-out infinite alternate' }}
                />
            </svg>

            {/* Subtle top radial glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '70%',
                    height: '50%',
                    background: 'radial-gradient(ellipse at center, rgba(83,52,131,0.18) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default SplineBackground;
