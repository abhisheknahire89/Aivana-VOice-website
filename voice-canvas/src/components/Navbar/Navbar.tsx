import { useEffect, useState } from 'react';

interface NavbarProps {
    onBookDemo: () => void;
    onRecruitment?: () => void;
    onProtocols?: () => void;
    onLaboratory?: () => void;
    onInterface?: () => void;
}

export default function Navbar({ onBookDemo, onRecruitment, onProtocols, onLaboratory, onInterface }: NavbarProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    const navLinks = [
        { label: 'Interface', action: onInterface },
        { label: 'Protocols', action: onProtocols },
        { label: 'Laboratory', action: onLaboratory },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 h-[72px] px-8 md:px-12 flex items-center justify-between z-[100] transition-all duration-[1200ms] ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
            style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                background: 'rgba(0,0,0,0.15)',
            }}
        >
            {/* Logo */}
            <button
                onClick={onInterface}
                className="flex items-center gap-3 group focus:outline-none"
            >
                {/* Animated logo mark */}
                <div className="relative w-7 h-7 flex items-center justify-center">
                    <div
                        className="absolute inset-0 border border-white/15 rounded-lg transition-all duration-700 group-hover:border-white/50 group-hover:rotate-45 group-hover:scale-90"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                    />
                    <div
                        className="absolute inset-0 border border-transparent rounded-lg transition-all duration-700 group-hover:border-white/20 scale-110"
                    />
                    <span className="relative text-white/70 group-hover:text-white text-[11px] font-bold tracking-tight transition-colors z-10">
                        A
                    </span>
                </div>

                <div className="flex flex-col leading-none">
                    <span
                        className="text-white/90 font-bold text-[15px] tracking-[-0.02em] group-hover:text-white transition-colors"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        AIVANA
                    </span>
                    <span className="text-white/18 text-[7px] uppercase tracking-[0.35em] font-light mt-0.5">
                        Dimension Zero
                    </span>
                </div>
            </button>

            {/* Center nav */}
            <div className="hidden lg:flex items-center gap-10">
                {navLinks.map(({ label, action }) => (
                    <button
                        key={label}
                        onClick={action}
                        className="relative text-white/30 hover:text-white/80 transition-colors duration-400 group focus:outline-none"
                        style={{
                            fontSize: '10px',
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            fontFamily: "'Outfit', sans-serif",
                        }}
                    >
                        {label}
                        {/* Hover underline */}
                        <span
                            className="absolute -bottom-0.5 left-0 h-px bg-white/60 w-0 group-hover:w-full transition-all duration-500 ease-out"
                        />
                    </button>
                ))}

                <div className="h-3 w-px bg-white/10" />

                <button
                    onClick={onRecruitment}
                    className="text-white/20 hover:text-white/60 transition-colors duration-400 focus:outline-none"
                    style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 500, fontFamily: "'Outfit', sans-serif" }}
                >
                    Recruitment
                </button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
                {/* System status */}
                <div className="hidden sm:flex items-center gap-2.5 cursor-default">
                    <div className="relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
                    </div>
                    <span
                        className="text-white/30 text-[9px] uppercase tracking-[0.25em] font-light"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        Nodes Active
                    </span>
                </div>

                {/* CTA */}
                <button
                    onClick={onBookDemo}
                    className="relative px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full overflow-hidden group transition-all duration-400 hover:scale-[1.04] active:scale-[0.97] focus:outline-none"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    {/* Shine sweep */}
                    <span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"
                    />
                    <span className="relative">Connect Lab</span>
                </button>
            </div>
        </nav>
    );
}
