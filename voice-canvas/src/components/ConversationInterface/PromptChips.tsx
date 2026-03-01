interface PromptChipsProps {
    prompts: string[];
    onPromptClick: (prompt: string) => void;
    personaColor: string;
}

export default function PromptChips({ prompts, onPromptClick, personaColor }: PromptChipsProps) {
    return (
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-2 w-full md:w-auto" role="group" aria-label="Suggested prompts">
            {prompts.map((prompt) => (
                <button
                    key={prompt}
                    onClick={() => onPromptClick(prompt)}
                    className="prompt-chip px-4 py-3 md:py-2 rounded-[20px] text-sm text-white/80 hover:text-white transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = personaColor;
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    aria-label={`Ask: ${prompt}`}
                >
                    💬 {prompt}
                </button>
            ))}
        </div>
    );
}
