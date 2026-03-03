import React, { useEffect, useRef } from 'react';

const SplineBackground: React.FC = () => {
    const boatRef = useRef<HTMLDivElement>(null);

    // Subtle mouse parallax on desktop
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!boatRef.current) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 10;   // -5 to +5
            const y = (e.clientY / window.innerHeight - 0.5) * 6;   // -3 to +3
            boatRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                // Watery radial base gradient
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
                    zIndex: 0,
                }}
            />

            {/* ── Boat layer — gentle vertical float + mouse parallax ───── */}
            <div
                ref={boatRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    animation: 'boatFloat 8s ease-in-out infinite alternate',
                    willChange: 'transform',
                    zIndex: 1,
                    transition: 'transform 0.15s ease-out', // smooth parallax follow
                }}
            >
                <iframe
                    src="https://my.spline.design/animatedpaperboat-jeJTnCRZkUeZW3jf48yUoDEa/"
                    frameBorder="0"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: 'block',
                        pointerEvents: 'none',
                        filter: 'brightness(1.3) saturate(0.35) opacity(0.3)',
                    }}
                    title="Aivana Animated Background"
                    loading="eager"
                />
            </div>

            {/* ── White radial overlay — keeps text and cards readable ──── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    background: `radial-gradient(
                        ellipse at center,
                        rgba(255,255,255,0.20) 0%,
                        rgba(255,255,255,0.70) 60%,
                        rgba(255,255,255,0.95) 100%
                    )`,
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
                    zIndex: 3,
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default SplineBackground;
