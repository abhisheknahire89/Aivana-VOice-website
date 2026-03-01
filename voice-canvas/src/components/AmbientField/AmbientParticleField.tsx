import { useEffect, useRef, memo } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedY: number;
    speedX: number;
    opacity: number;
    maxOpacity: number;
    life: number;
    maxLife: number;
}

/**
 * AmbientParticleField — Minimal floating dust particles.
 * WebGL-free, canvas-based. ~60fps on all devices.
 */
const AmbientParticleField = memo(function AmbientParticleField({ count = 40 }: { count?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const spawnParticle = (): Particle => ({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            size: Math.random() * 1.2 + 0.3,
            speedY: -(Math.random() * 0.3 + 0.08),
            speedX: (Math.random() - 0.5) * 0.15,
            opacity: 0,
            maxOpacity: Math.random() * 0.12 + 0.03,
            life: 0,
            maxLife: Math.random() * 600 + 300,
        });

        // Initialise at scattered positions
        particlesRef.current = Array.from({ length: count }, () => {
            const p = spawnParticle();
            p.y = Math.random() * canvas.height;
            p.life = Math.random() * p.maxLife;
            return p;
        });

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((p, i) => {
                p.life += 1;
                p.x += p.speedX;
                p.y += p.speedY;

                // Fade in / out
                const progress = p.life / p.maxLife;
                if (progress < 0.15) {
                    p.opacity = (progress / 0.15) * p.maxOpacity;
                } else if (progress > 0.85) {
                    p.opacity = ((1 - progress) / 0.15) * p.maxOpacity;
                } else {
                    p.opacity = p.maxOpacity;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.opacity.toFixed(3)})`;
                ctx.fill();

                if (p.life >= p.maxLife || p.y < -10) {
                    particlesRef.current[i] = spawnParticle();
                }
            });

            animRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1, opacity: 0.6 }}
        />
    );
});

export default AmbientParticleField;
