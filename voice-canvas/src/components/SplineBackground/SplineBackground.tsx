import React from 'react';

const SplineBackground: React.FC = () => {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                background: 'radial-gradient(circle at 20% 20%, #eef1ff 0%, #ffffff 45%, #f4f7ff 100%)',
            }}
        >
            {/* ── Animated mesh gradient — slow liquid drift ───────────── */}
            <div
                style={{
                    position: 'absolute',
                    inset: '-20%',
                    background: `
                        radial-gradient(circle at 10% 20%, rgba(120,132,255,0.28), transparent 55%),
                        radial-gradient(circle at 80% 10%, rgba(130,220,255,0.24), transparent 55%),
                        radial-gradient(circle at 50% 90%, rgba(180,150,255,0.25), transparent 55%)
                    `,
                    animation: 'meshDrift 30s ease-in-out infinite alternate',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Soft reflection glow below card area ─────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '12%',
                    left: '50%',
                    width: '40%',
                    height: 40,
                    transform: 'translateX(-50%)',
                    background: 'radial-gradient(ellipse at center, rgba(120,132,255,0.25), transparent 70%)',
                    filter: 'blur(6px)',
                    opacity: 0.4,
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default SplineBackground;
