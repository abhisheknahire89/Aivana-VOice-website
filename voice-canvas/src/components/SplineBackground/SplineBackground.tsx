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
            {/* ── Animated mesh gradient ───────────────────────────────── */}
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

            {/* ── Spline paper boat — subtle ambient layer ─────────────── */}
            <iframe
                src="https://my.spline.design/animatedpaperboat-jeJTnCRZkUeZW3jf48yUoDEa/"
                frameBorder="0"
                width="100%"
                height="100%"
                title="Aivana Background"
                style={{
                    position: 'absolute',
                    inset: 0,
                    border: 'none',
                    display: 'block',
                    pointerEvents: 'none',
                    filter: 'brightness(1.3) saturate(0.35) opacity(0.25)',
                }}
            />

            {/* ── White radial overlay — keeps text readable ────────────── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(ellipse at center,
                        rgba(255,255,255,0.15) 0%,
                        rgba(255,255,255,0.65) 60%,
                        rgba(255,255,255,0.92) 100%)`,
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />
        </div>
    );
};

export default SplineBackground;
