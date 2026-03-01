interface ActiveOrbProps {
    color: string;
    glowColor: string;
    isListening: boolean;
    isSpeaking: boolean;
    isMobile?: boolean;
}

export default function ActiveOrb({ color, glowColor, isListening, isSpeaking, isMobile = false }: ActiveOrbProps) {
    const stateClass = isSpeaking
        ? 'active-orb--speaking'
        : isListening
            ? 'active-orb--listening'
            : 'active-orb--idle';

    const size = isMobile ? 150 : 200;

    return (
        <div
            className={`active-orb ${stateClass}`}
            style={{
                '--orb-color': color,
                '--orb-glow': glowColor,
                width: size,
                height: size,
            } as React.CSSProperties}
            aria-label={isSpeaking ? 'AI is speaking' : isListening ? 'Listening to you' : 'Voice AI assistant'}
            role="status"
        >
            {/* Outer glow ring */}
            <div className="active-orb__glow" />

            {/* Speaking ripples */}
            {isSpeaking && (
                <>
                    <div className="active-orb__ripple active-orb__ripple--1" />
                    <div className="active-orb__ripple active-orb__ripple--2" />
                    <div className="active-orb__ripple active-orb__ripple--3" />
                </>
            )}

            {/* Core sphere */}
            <div className="active-orb__core" style={{ width: size, height: size }}>
                <div className="active-orb__particle active-orb__particle--1" />
                <div className="active-orb__particle active-orb__particle--2" />
                <div className="active-orb__particle active-orb__particle--3" />
            </div>
        </div>
    );
}
