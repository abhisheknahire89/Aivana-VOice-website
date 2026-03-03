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
                backgroundColor: '#FFFFFF', // fallback while Spline loads
            }}
        >
            {/* Spline iframe — desaturated + lightened to act as subtle ambient texture */}
            <iframe
                src="https://my.spline.design/animatedpaperboat-jeJTnCRZkUeZW3jf48yUoDEa/"
                frameBorder="0"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    pointerEvents: 'none',
                    // Lighten, desaturate and fade so it's a subtle ambient layer
                    filter: 'brightness(1.3) saturate(0.35) opacity(0.3)',
                }}
                title="Aivana Animated Background"
                loading="eager"
            />

            {/* White wash overlay — keeps text + cards fully readable */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(
                        ellipse at center,
                        rgba(255,255,255,0.20) 0%,
                        rgba(255,255,255,0.70) 60%,
                        rgba(255,255,255,0.95) 100%
                    )`,
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
            />
        </div>
    );
};

export default SplineBackground;
