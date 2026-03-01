import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { Persona } from '../../data/personas';
import { useAudio } from '../../hooks/useAudio';
import { useVoice } from '../../hooks/useVoice';
import ActiveOrb from './ActiveOrb';
import PromptChips from './PromptChips';
import PersonaDots from './PersonaDots';

interface ConversationInterfaceProps {
    persona: Persona;
    onBack: () => void;
    onSwitchPersona: (id: string) => void;
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return isMobile;
}

export default function ConversationInterface({
    persona,
    onBack,
    onSwitchPersona,
}: ConversationInterfaceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { playFullIntro } = useAudio();
    const {
        isListening,
        isSpeaking,
        transcript,
        error,
        startListening,
        stopListening,
        sendTextPrompt,
    } = useVoice();
    const isMobile = useIsMobile();

    // Play full intro on mount / persona change
    useEffect(() => {
        playFullIntro(persona.id);
    }, [persona.id, playFullIntro]);

    // Animate entrance
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        gsap.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    }, []);

    // Keyboard: Escape → back, Space → toggle listening
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onBack();
            }
            if (e.key === ' ' && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) {
                e.preventDefault();
                if (isListening) {
                    stopListening();
                } else {
                    startListening(`wss://api.aivana.io/voice/${persona.id}`);
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onBack, isListening, stopListening, startListening, persona.id]);

    // Tap anywhere to speak — ignore interactive elements
    const handleTapToSpeak = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button, a, nav, .prompt-chip')) return;

        if (isListening) {
            stopListening();
        } else {
            startListening(`wss://api.aivana.io/voice/${persona.id}`);
        }
    };

    const handlePromptClick = (prompt: string) => {
        sendTextPrompt(prompt);
    };

    // Display text logic
    const displayText = error
        ? error
        : transcript || persona.fullIntroText;
    const textStyle = error
        ? 'text-red-400 text-sm'
        : transcript
            ? 'text-white/70 text-sm'
            : 'text-white/30 text-sm italic';

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-30 flex flex-col h-screen w-screen overflow-hidden cursor-pointer"
            style={{
                background: `radial-gradient(ellipse at 50% 40%, ${persona.glowColor} 0%, ${persona.deepColor} 40%, #000000 80%)`,
            }}
            onClick={handleTapToSpeak}
            role="main"
            aria-label={`Conversation with ${persona.name}`}
        >
            {/* Listening pulse overlay */}
            {isListening && (
                <div
                    className="listening-overlay"
                    style={{ '--persona-color': persona.color } as React.CSSProperties}
                />
            )}

            {/* Top Nav */}
            <nav className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 z-10 relative" aria-label="Conversation navigation">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium cursor-pointer p-2 -ml-2 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none rounded-lg"
                    aria-label="Go back to persona selection"
                >
                    <span className="text-lg">←</span>
                    <span>Back</span>
                </button>

                <a
                    href="https://calendly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
                    style={{
                        background: persona.color,
                        boxShadow: `0 0 20px ${persona.glowColor}`,
                    }}
                    aria-label="Book a demo"
                >
                    Book Demo
                </a>
            </nav>

            {/* Center Content */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 md:gap-6 px-4 md:px-6 relative z-10">
                <ActiveOrb
                    color={persona.color}
                    glowColor={persona.glowColor}
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                    isMobile={isMobile}
                />

                {/* Persona Info */}
                <div className="text-center">
                    <h1
                        className="text-3xl md:text-4xl font-bold tracking-wide"
                        style={{ color: persona.color }}
                    >
                        {persona.name}
                    </h1>
                    <p className="text-white/50 text-base md:text-lg mt-1">{persona.role}</p>
                </div>

                {/* Transcription Area */}
                <div className="w-full max-w-md min-h-[60px] md:min-h-[80px] flex items-center justify-center px-4">
                    <p className={`text-center transition-all duration-300 ${textStyle}`} aria-live="polite">
                        {displayText}
                    </p>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col items-center gap-4 md:gap-5 px-4 md:px-6 pb-6 md:pb-8 relative z-10">
                <PromptChips
                    prompts={persona.prompts}
                    onPromptClick={handlePromptClick}
                    personaColor={persona.color}
                />

                {/* Speak Instruction */}
                {!isMobile && (
                    <p className={`text-sm flex items-center gap-2 transition-all duration-200 ${isListening ? 'text-white/80' : 'text-white/40'}`}>
                        <span className={`text-lg ${isListening ? 'animate-pulse' : ''}`}>
                            {isListening ? '🔴' : '🎙️'}
                        </span>
                        {isListening ? 'Listening... tap to stop' : isSpeaking ? 'Speaking...' : 'Click or press Space to speak'}
                    </p>
                )}

                {isMobile && (
                    <p className={`text-xs transition-all duration-200 ${isListening ? 'text-white/80' : 'text-white/40'}`}>
                        {isListening ? '🔴 Listening...' : isSpeaking ? 'Speaking...' : 'Tap anywhere to speak'}
                    </p>
                )}

                <PersonaDots
                    currentPersonaId={persona.id}
                    onSwitch={onSwitchPersona}
                />
            </div>
        </div>
    );
}
