import type { Persona } from '../../data/personas';

interface HoverCardProps {
    persona: Persona | null;
    position: { x: number; y: number } | null;
    visible: boolean;
}

export default function HoverCard({ persona, position, visible }: HoverCardProps) {
    if (!persona || !position || !visible) return null;

    return (
        <div
            className="absolute z-60 pointer-events-none transition-all duration-500 ease-out hidden md:block"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -100%)',
                marginTop: '-32px',
                opacity: visible ? 1 : 0,
                scale: visible ? '1' : '0.9',
            }}
        >
            <div className="glass-card p-6 min-w-[240px] max-w-[300px] text-center border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl shadow-black/50">
                <div
                    className="w-12 h-12 rounded-full mx-auto mb-4 border border-white/10 flex items-center justify-center"
                    style={{ backgroundColor: `${persona.color}11` }}
                >
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: persona.color }} />
                </div>

                <h3 className="text-white font-bold text-xl tracking-tighter leading-tight mb-1">{persona.name}</h3>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium mb-4">{persona.role}</p>

                <p className="text-white/30 text-xs leading-relaxed line-clamp-2 px-2">
                    {persona.description}
                </p>

                <div className="mt-6 flex items-center justify-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60">
                        Initiate Connection
                    </p>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                </div>
            </div>

            {/* Subtle light bridge */}
            <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-8 w-[1px] h-8 bg-gradient-to-t from-white/20 to-transparent"
            />
        </div>
    );
}

