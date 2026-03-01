import { PERSONAS } from '../../data/personas';

interface PersonaDotsProps {
    currentPersonaId: string;
    onSwitch: (id: string) => void;
}

export default function PersonaDots({ currentPersonaId, onSwitch }: PersonaDotsProps) {
    return (
        <div className="flex flex-col items-center gap-1.5" role="group" aria-label="Switch persona">
            {/* Dots */}
            <div className="flex items-center gap-3">
                {PERSONAS.map((p) => {
                    const isActive = p.id === currentPersonaId;
                    return (
                        <button
                            key={p.id}
                            onClick={() => onSwitch(p.id)}
                            className="rounded-full cursor-pointer focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
                            style={{
                                width: 12,
                                height: 12,
                                backgroundColor: p.color,
                                opacity: isActive ? 1 : 0.4,
                                transform: isActive ? 'scale(1.3)' : 'scale(1)',
                                boxShadow: isActive ? `0 0 8px ${p.glowColor}` : 'none',
                                transition: 'all 0.2s ease',
                            }}
                            title={p.name}
                            aria-label={`Switch to ${p.name} — ${p.role}`}
                            aria-current={isActive ? 'true' : undefined}
                        />
                    );
                })}
            </div>

            {/* Initials */}
            <div className="flex items-center gap-3">
                {PERSONAS.map((p) => {
                    const isActive = p.id === currentPersonaId;
                    return (
                        <span
                            key={p.id}
                            className="text-[9px] font-medium w-3 text-center"
                            style={{
                                color: isActive ? p.color : 'rgba(255, 255, 255, 0.25)',
                                transition: 'color 0.2s ease',
                            }}
                            aria-hidden="true"
                        >
                            {p.name[0]}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
