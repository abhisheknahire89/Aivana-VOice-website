import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface RippleProps {
    delay: number;
}

function Ripple({ delay }: RippleProps) {
    const rippleRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const el = rippleRef.current;
        if (!el) return;

        const timer = setTimeout(() => {
            gsap.fromTo(
                el,
                { scale: 0, opacity: 0.4 },
                {
                    scale: 30,
                    opacity: 0,
                    duration: 3,
                    ease: 'power2.out',
                    onComplete: () => setVisible(false),
                }
            );
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    if (!visible) return null;

    return (
        <div
            ref={rippleRef}
            className="absolute rounded-full pointer-events-none"
            style={{
                width: 50,
                height: 50,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                opacity: 0,
            }}
        />
    );
}

const RIPPLE_DELAYS = [0, 500, 1200];

export default function RippleManager() {
    return (
        <>
            {RIPPLE_DELAYS.map((delay, i) => (
                <Ripple key={i} delay={delay} />
            ))}
        </>
    );
}
