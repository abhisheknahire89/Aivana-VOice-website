import React from 'react';

const SplineBackground: React.FC = () => {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            <iframe
                src="https://my.spline.design/animatedpaperboat-jeJTnCRZkUeZW3jf48yUoDEa/"
                frameBorder="0"
                width="100%"
                height="100%"
                title="Aivana Background"
                style={{
                    position: 'absolute',
                    inset: 0,
                    border: 'none',
                    display: 'block',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default SplineBackground;
