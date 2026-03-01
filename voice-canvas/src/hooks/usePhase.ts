import { useState, useEffect, useCallback } from 'react';
import type { Persona } from '../data/personas';

export type Phase = 'loading' | 'void' | 'awakening' | 'constellation' | 'interactive' | 'conversation' | 'recruitment' | 'protocols' | 'laboratory';

const PHASE_TIMINGS: Partial<Record<Phase, { next: Phase; delay: number }>> = {
    void: { next: 'awakening', delay: 1500 },
    awakening: { next: 'constellation', delay: 4000 },
    constellation: { next: 'interactive', delay: 6000 },
};

export function usePhase() {
    const [currentPhase, setCurrentPhase] = useState<Phase>('loading');
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

    // Auto-advance through timed phases
    useEffect(() => {
        const timing = PHASE_TIMINGS[currentPhase];
        if (!timing) return;

        const timer = setTimeout(() => {
            setCurrentPhase(timing.next);
        }, timing.delay);

        return () => clearTimeout(timer);
    }, [currentPhase]);

    // Called by App when audio is ready
    const startExperience = useCallback(() => {
        setCurrentPhase('void');
    }, []);

    const selectPersona = useCallback((persona: Persona) => {
        setSelectedPersona(persona);
        setCurrentPhase('conversation');
    }, []);

    const goBack = useCallback(() => {
        setSelectedPersona(null);
        setCurrentPhase('interactive');
    }, []);

    const goToRecruitment = useCallback(() => {
        setCurrentPhase('recruitment');
    }, []);

    const goToProtocols = useCallback(() => {
        setCurrentPhase('protocols');
    }, []);

    const goToLaboratory = useCallback(() => {
        setCurrentPhase('laboratory');
    }, []);

    const exitToInterface = useCallback(() => {
        setCurrentPhase('interactive');
    }, []);

    return {
        currentPhase,
        selectedPersona,
        selectPersona,
        goBack,
        startExperience,
        goToRecruitment,
        goToProtocols,
        goToLaboratory,
        exitToInterface
    };
}


