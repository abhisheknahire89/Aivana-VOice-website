import React from 'react';

const SplineBackground: React.FC = () => {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none', // clicks pass through to cards/buttons
            }}
        >
            <iframe
                src="https://my.spline.design/animatedpaperboat-jeJTnCRZkUeZW3jf48yUoDEa/"
                frameBorder="0"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    pointerEvents: 'none',
                }}
                title="Aivana Animated Background"
                loading="eager"
            />
        </div>
    );
};

export default SplineBackground;
