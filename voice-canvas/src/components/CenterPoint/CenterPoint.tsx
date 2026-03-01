import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function CenterPoint() {
    const dotRef = useRef<HTMLDivElement>(null);

    // Fade in on mount
    useEffect(() => {
        const el = dotRef.current;
        if (!el) return;

        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    }, []);

    return (
        <div
            ref={dotRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
                width: 8,
                height: 8,
                backgroundColor: '#ffffff',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                animation: 'center-pulse 2s ease-in-out infinite',
                opacity: 0,
            }}
        />
    );
}
