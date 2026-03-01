import type { Persona } from '../../data/personas';

interface NavigationDotsProps {
    total: number;
    activeIndex: number;
    onDotClick: (index: number) => void;
    personas: Persona[];
}

export default function NavigationDots({ total, activeIndex, onDotClick, personas }: NavigationDotsProps) {
    return (
        <div className="flex items-center justify-center gap-4 mt-12 z-20">
            {Array.from({ length: total }).map((_, index) => {
                const isActive = index === activeIndex;
                return (
                    <button
                        key={index}
                        onClick={() => onDotClick(index)}
                        className={`
              relative h-1.5 rounded-full transition-all duration-500 ease-out cursor-pointer
              ${isActive ? 'w-10' : 'w-2 hover:w-4 bg-white/20 hover:bg-white/40'}
            `}
                        style={{
                            backgroundColor: isActive ? personas[index].color : undefined,
                        }}
                        aria-label={`Go to ${personas[index].name}`}
                    >
                        {isActive && (
                            <div
                                className="absolute inset-0 rounded-full blur-[4px] opacity-60"
                                style={{ backgroundColor: personas[index].color }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
