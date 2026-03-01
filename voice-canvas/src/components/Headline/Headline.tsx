import { useEffect, useState } from 'react';

interface HeadlineProps {
    visible: boolean;
}

export default function Headline({ visible }: HeadlineProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setShow(true), 300);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [visible]);

    return (
        <div
            className={`absolute top-[15%] left-1/2 -translate-x-1/2 text-center z-40 transition-all duration-1000 ease-out pointer-events-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
        >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-premium-gradient leading-tight">
                AI VOICE NODES
            </h1>
            <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-white/20 font-bold">
                Dimension Zero // Active Phase
            </p>
        </div>
    );
}

