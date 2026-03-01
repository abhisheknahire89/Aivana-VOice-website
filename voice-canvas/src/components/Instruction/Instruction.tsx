import { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface InstructionProps {
    visible: boolean;
}

export default function Instruction({ visible }: InstructionProps) {
    const [show, setShow] = useState(false);
    const isMobile = useIsMobile();

    const languages = ['Hindi', 'Tamil', 'Telugu', 'Marathi', '+6 more'];

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setShow(true), 500);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [visible]);

    return (
        <div
            className={`absolute bottom-[13%] md:bottom-[15%] left-1/2 -translate-x-1/2 text-center z-40 max-w-md transition-all duration-700 pointer-events-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
        >
            {/* Main instruction */}
            <p className="text-white/70 text-base md:text-lg flex items-center justify-center gap-2">
                <span className="animate-bounce">👆</span>
                <span>{isMobile ? 'Tap any agent to talk' : 'Click any agent to start talking'}</span>
            </p>

            {/* Language badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {languages.map((lang) => (
                    <span
                        key={lang}
                        className="text-[10px] md:text-xs text-white/40 px-3 py-1 border border-white/10 rounded-full bg-white/5"
                    >
                        {lang}
                    </span>
                ))}
            </div>
        </div>
    );
}
