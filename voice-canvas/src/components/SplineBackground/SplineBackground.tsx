import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbState } from '../HeroOrb/HeroOrb';

interface SplineBackgroundProps {
    orbState: OrbState;
    pulseKey: number;
}


const createRadialTexture = (inner: string, mid: string, outer: string) => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    const gradient = ctx.createRadialGradient(size / 2, size / 2, 18, size / 2, size / 2, 128);
    gradient.addColorStop(0, inner);
    gradient.addColorStop(0.45, mid);
    gradient.addColorStop(1, outer);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
};

const EnvironmentScene: React.FC<{
    orbState: OrbState;
    pulseKey: number;
    reducedMotion: boolean;
    hoverStrength: number;
}> = ({ orbState, pulseKey, reducedMotion, hoverStrength }) => {
    const auraRef = useRef<THREE.Mesh>(null);

    const auraTexture = useMemo(
        () => createRadialTexture('rgba(196,181,253,0.55)', 'rgba(124,58,237,0.24)', 'rgba(10,15,42,0.0)'),
        [],
    );

    const clickPulse = useRef(0);

    useEffect(() => {
        clickPulse.current = 1;
    }, [pulseKey]);

    useEffect(() => {
        return () => {
            auraTexture.dispose();
        };
    }, [auraTexture]);

    useFrame((_state, delta) => {
        const t = performance.now() * 0.001;

        if (clickPulse.current > 0) {
            clickPulse.current = Math.max(0, clickPulse.current - delta * (reducedMotion ? 2.5 : 1.5));
        }

        if (auraRef.current) {
            const mat = auraRef.current.material as THREE.MeshBasicMaterial;
            const idlePulse = 1 + Math.sin(t * 0.72) * 0.03;
            const hoverPulse = hoverStrength * 0.12;
            const clickBoost = clickPulse.current * 0.25;
            auraRef.current.scale.setScalar(idlePulse + hoverPulse + clickBoost);

            if (orbState === 'listening') {
                mat.color.set('#38bdf8');
                mat.opacity = 0.34 + hoverStrength * 0.2;
            } else if (orbState === 'speaking') {
                mat.color.set('#a855f7');
                mat.opacity = 0.38 + hoverStrength * 0.24;
            } else {
                mat.color.set('#8b5cf6');
                mat.opacity = 0.3 + hoverStrength * 0.2;
            }
        }

    });

    return (
        <>
            <ambientLight intensity={0.34} />

            <mesh ref={auraRef} position={[0, 0, -1.8]}>
                <planeGeometry args={[7.2, 7.2]} />
                <meshBasicMaterial
                    map={auraTexture}
                    color="#8b5cf6"
                    transparent
                    opacity={0.32}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

        </>
    );
};

const SplineBackground: React.FC<SplineBackgroundProps> = ({ orbState, pulseKey }) => {
    const [reducedMotion, setReducedMotion] = useState(false);
    const [hoverStrength, setHoverStrength] = useState(0);
    const pointer = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        const onMove = (event: MouseEvent) => {
            const nx = event.clientX / window.innerWidth;
            const ny = event.clientY / window.innerHeight;

            pointer.current.set(nx * 2 - 1, -(ny * 2 - 1));

            const dx = nx - 0.5;
            const dy = ny - 0.54;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const focus = THREE.MathUtils.clamp(1 - dist / 0.32, 0, 1);
            setHoverStrength(focus);
        };

        const onLeave = () => {
            pointer.current.set(0, 0);
            setHoverStrength(0);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseout', onLeave);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseout', onLeave);
        };
    }, []);

    const waveTilt = reducedMotion ? 0 : hoverStrength * 8;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100dvh',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                background:
                    'radial-gradient(1200px 680px at 50% 54%, rgba(58,33,139,0.34) 0%, rgba(16,20,52,0.18) 35%, rgba(7,8,20,0.96) 80%), linear-gradient(180deg, #070814 0%, #0a0f2a 100%)',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.08,
                    backgroundImage:
                        'radial-gradient(rgba(255,255,255,0.16) 0.45px, transparent 0.45px), radial-gradient(rgba(255,255,255,0.08) 0.45px, transparent 0.45px)',
                    backgroundPosition: '0 0, 24px 18px',
                    backgroundSize: '36px 36px, 48px 48px',
                }}
            />

            <Canvas
                camera={{ position: [0, 0, 6], fov: 46 }}
                dpr={[1, 1.8]}
                gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
                style={{ position: 'absolute', inset: 0 }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                }}
            >
                <EnvironmentScene
                    orbState={orbState}
                    pulseKey={pulseKey}
                    reducedMotion={reducedMotion}
                    hoverStrength={hoverStrength}
                />
            </Canvas>

            {!reducedMotion && (
                <svg
                    viewBox="0 0 1440 900"
                    preserveAspectRatio="xMidYMid slice"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        transform: `translateY(${hoverStrength * -4}px) rotate(${waveTilt * 0.03}deg)`,
                        transition: 'transform 280ms ease-out',
                    }}
                >
                    <defs>
                        <linearGradient id="envWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.06" />
                            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.09" />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.06" />
                        </linearGradient>
                        <linearGradient id="envWave2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.05" />
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    <path
                        d="M0,550 C260,510 480,610 720,560 C960,510 1160,610 1440,550 L1440,900 L0,900 Z"
                        fill="url(#envWave1)"
                        style={{ animation: 'wave1Move 20s ease-in-out infinite alternate' }}
                    />

                    <path
                        d="M0,620 C220,580 480,700 720,640 C960,580 1220,700 1440,620 L1440,900 L0,900 Z"
                        fill="url(#envWave2)"
                        style={{ animation: 'wave2Move 26s ease-in-out infinite alternate' }}
                    />
                </svg>
            )}
        </div>
    );
};

export default SplineBackground;
