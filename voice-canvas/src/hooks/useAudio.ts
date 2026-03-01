import { Howl } from 'howler';
import { useRef, useCallback, useState } from 'react';

const AUDIO_SOURCES = {
    introVoice: '/audio/intro-voice.mp3',
    promptVoice: '/audio/prompt-voice.mp3',
    whispers: {
        priya: '/audio/priya-whisper.mp3',
        rohan: '/audio/rohan-whisper.mp3',
        neha: '/audio/neha-whisper.mp3',
        veda: '/audio/veda-whisper.mp3',
        arjun: '/audio/arjun-whisper.mp3',
    },
    fullIntros: {
        priya: '/audio/priya-intro.mp3',
        rohan: '/audio/rohan-intro.mp3',
        neha: '/audio/neha-intro.mp3',
        veda: '/audio/veda-intro.mp3',
        arjun: '/audio/arjun-intro.mp3',
    },
    ambientDrone: '/audio/ambient-drone.mp3',
} as const;

type PersonaId = keyof typeof AUDIO_SOURCES.whispers;

export function useAudio() {
    const howlsRef = useRef<Map<string, Howl>>(new Map());
    const [isReady, setIsReady] = useState(false);

    const getOrCreate = useCallback((key: string, src: string, options?: Partial<{ loop: boolean; volume: number }>) => {
        let howl = howlsRef.current.get(key);
        if (!howl) {
            howl = new Howl({
                src: [src],
                loop: options?.loop ?? false,
                volume: options?.volume ?? 1,
                preload: false,
            });
            howlsRef.current.set(key, howl);
        }
        return howl;
    }, []);

    // Preload critical audio, resolve when loaded or on error (graceful)
    const preloadCritical = useCallback(() => {
        const introHowl = new Howl({
            src: [AUDIO_SOURCES.introVoice],
            preload: true,
            onload: () => {
                howlsRef.current.set('introVoice', introHowl);
                setIsReady(true);
            },
            onloaderror: () => {
                // Gracefully continue even if audio fails
                console.warn('[useAudio] Intro voice failed to load, continuing anyway');
                setIsReady(true);
            },
        });

        // Fallback timeout — don't block the experience forever
        setTimeout(() => {
            setIsReady(true);
        }, 3000);
    }, []);

    const playIntroVoice = useCallback(() => {
        const howl = howlsRef.current.get('introVoice') || getOrCreate('introVoice', AUDIO_SOURCES.introVoice);
        howl.play();
    }, [getOrCreate]);

    const playPromptVoice = useCallback(() => {
        const howl = getOrCreate('promptVoice', AUDIO_SOURCES.promptVoice);
        howl.play();
    }, [getOrCreate]);

    const playWhisper = useCallback((personaId: string) => {
        const src = AUDIO_SOURCES.whispers[personaId as PersonaId];
        if (!src) return;
        const key = `whisper-${personaId}`;
        const howl = getOrCreate(key, src, { volume: 0.3 });
        howl.play();
    }, [getOrCreate]);

    const playFullIntro = useCallback((personaId: string) => {
        const src = AUDIO_SOURCES.fullIntros[personaId as PersonaId];
        if (!src) return;
        const key = `fullIntro-${personaId}`;
        const howl = getOrCreate(key, src);
        howl.play();
    }, [getOrCreate]);

    const startAmbient = useCallback(() => {
        const howl = getOrCreate('ambient', AUDIO_SOURCES.ambientDrone, { loop: true, volume: 0.1 });
        if (!howl.playing()) {
            howl.play();
        }
    }, [getOrCreate]);

    const stopAmbient = useCallback(() => {
        const howl = howlsRef.current.get('ambient');
        if (howl) howl.stop();
    }, []);

    const stopAll = useCallback(() => {
        howlsRef.current.forEach((howl) => howl.stop());
    }, []);

    return {
        isReady,
        preloadCritical,
        playIntroVoice,
        playPromptVoice,
        playWhisper,
        playFullIntro,
        startAmbient,
        stopAmbient,
        stopAll,
    };
}
