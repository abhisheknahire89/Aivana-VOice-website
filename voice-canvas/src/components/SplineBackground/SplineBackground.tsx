import React from 'react';

const SplineBackground: React.FC = () => {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
            }}
        >
            {/* Spline 3D scene — fully interactive */}
            <iframe
                src="https://my.spline.design/radialpattern-2AKA2YvF0UDxoEnfQM78r5db/"
                frameBorder="0"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    pointerEvents: 'auto', // ← fully interactive now
                }}
                title="Aivana 3D Background"
                loading="eager"
                allowFullScreen
            />

            {/* Soft vignette overlay — purely visual, no pointer blocking */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            radial-gradient(ellipse at 50% 50%,
              rgba(240,240,244,0.0) 0%,
              rgba(230,230,238,0.15) 45%,
              rgba(210,210,225,0.4) 75%,
              rgba(190,190,210,0.6) 100%
            )
          `,
                    pointerEvents: 'none', // vignette is visual only
                }}
            />

            {/* Top / bottom edge fades */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            linear-gradient(to bottom,
              rgba(235,235,242,0.45) 0%,
              transparent 15%,
              transparent 85%,
              rgba(225,225,235,0.45) 100%
            )
          `,
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default SplineBackground;
