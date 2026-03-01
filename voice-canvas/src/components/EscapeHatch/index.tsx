import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface EscapeHatchProps {
    show: boolean;
}

export default function EscapeHatch({ show }: EscapeHatchProps) {
    const [visible, setVisible] = useState(false);
    const linkRef = useRef<HTMLButtonElement>(null);

    // Show after 8s delay once `show` becomes true
    useEffect(() => {
        if (!show) {
            setVisible(false);
            return;
        }

        const timer = setTimeout(() => {
            setVisible(true);
        }, 8000);

        return () => clearTimeout(timer);
    }, [show]);

    // Fade in when visible
    useEffect(() => {
        if (visible && linkRef.current) {
            gsap.fromTo(linkRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' });
        }
    }, [visible]);

    if (!visible) return null;

    const handleClick = () => {
        // TODO: Navigate to /traditional or open modal
        console.log('[EscapeHatch] Traditional site requested');
        alert('Traditional website coming soon! For now, explore the voice experience.');
    };

    return (
        <button
            ref={linkRef}
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 text-xs cursor-pointer transition-colors duration-200"
            style={{
                color: 'rgba(255, 255, 255, 0.3)',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.6)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.3)'; }}
        >
            Prefer a traditional website? →
        </button>
    );
}
