import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

interface UseVoiceHintOptions {
    enabled: boolean;           // Only run when in interactive phase
    hasInteracted: boolean;     // Track if user has hovered/clicked
    delayMs?: number;           // Default 5000ms
}

export function useVoiceHint({ enabled, hasInteracted, delayMs = 5000 }: UseVoiceHintOptions) {
    const hasPlayedRef = useRef(false);
    const soundRef = useRef<Howl | null>(null);

    useEffect(() => {
        // Don't play if already played, not enabled, or user has interacted
        if (hasPlayedRef.current || !enabled || hasInteracted) return;

        const timer = setTimeout(() => {
            if (!hasInteracted && !hasPlayedRef.current) {
                // Create and play hint audio
                soundRef.current = new Howl({
                    src: ['/audio/hint-voice.mp3'], // Need to ensure this exists or use a mock
                    volume: 0.6,
                    onloaderror: () => {
                        console.warn('[useVoiceHint] Hint voice failed to load');
                    },
                    onend: () => {
                        hasPlayedRef.current = true;
                    }
                });
                soundRef.current.play();
                hasPlayedRef.current = true;
            }
        }, delayMs);

        return () => {
            clearTimeout(timer);
            soundRef.current?.stop();
        };
    }, [enabled, hasInteracted, delayMs]);

    const stopHint = () => {
        soundRef.current?.stop();
    };

    return { stopHint };
}
