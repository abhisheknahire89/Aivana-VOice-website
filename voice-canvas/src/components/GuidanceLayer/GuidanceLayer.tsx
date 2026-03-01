import type { Persona } from '../../data/personas';
import Headline from '../Headline/Headline';
import HoverCard from '../HoverCard/HoverCard';

interface GuidanceLayerProps {
    phase: string;
    hoveredPersona: Persona | null;
    hoveredPosition: { x: number; y: number } | null;
    onBookDemo: () => void;
}

export default function GuidanceLayer({
    phase,
    hoveredPersona,
    hoveredPosition,
}: GuidanceLayerProps) {
    // Only show core guidance elements during interactive phase
    const showElements = phase === 'interactive';
    const showHeadline = phase === 'awakening' || phase === 'constellation';

    return (
        <>
            {/* Headline - intro only */}
            <Headline visible={showHeadline} />

            {/* Hover Card (desktop only) */}
            <HoverCard
                persona={hoveredPersona}
                position={hoveredPosition}
                visible={showElements && !!hoveredPersona}
            />
        </>
    );
}
