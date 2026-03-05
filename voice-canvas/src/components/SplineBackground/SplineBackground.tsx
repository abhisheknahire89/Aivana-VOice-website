import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbState } from '../HeroOrb/HeroOrb';

interface SplineBackgroundProps {
    orbState: OrbState;
    pulseKey: number;
}

const STAR_COUNT = 170;
const NEURAL_COUNT = 140;

const NEURAL_VERTEX_SHADER = `
attribute float aAlpha;
attribute float aSize;
varying float vAlpha;

void main() {
  vAlpha = aAlpha;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (260.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const NEURAL_FRAGMENT_SHADER = `
varying float vAlpha;

void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p) * 2.0;
  float mask = smoothstep(1.0, 0.0, d);

  vec3 purple = vec3(0.67, 0.50, 0.98);
  vec3 magenta = vec3(0.98, 0.42, 0.79);
  vec3 col = mix(purple, magenta, clamp(vAlpha * 1.2, 0.0, 1.0));

  gl_FragColor = vec4(col, mask * vAlpha);
}
`;

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

const buildStars = () => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const speed = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i += 1) {
        const idx = i * 3;
        positions[idx] = (Math.random() - 0.5) * 14;
        positions[idx + 1] = (Math.random() - 0.5) * 9;
        positions[idx + 2] = -3.8 + Math.random() * 2.8;
        speed[i] = 0.015 + Math.random() * 0.035;
    }

    return { positions, speed };
};

const buildNeural = () => {
    const positions = new Float32Array(NEURAL_COUNT * 3);
    const alpha = new Float32Array(NEURAL_COUNT);
    const size = new Float32Array(NEURAL_COUNT);
    const baseRadius = new Float32Array(NEURAL_COUNT);
    const baseHeight = new Float32Array(NEURAL_COUNT);
    const seed = new Float32Array(NEURAL_COUNT);
    const speed = new Float32Array(NEURAL_COUNT);

    for (let i = 0; i < NEURAL_COUNT; i += 1) {
        const idx = i * 3;
        const ang = Math.random() * Math.PI * 2;
        const radius = 1 + Math.random() * 3.2;
        const y = (Math.random() - 0.5) * 3.6;

        positions[idx] = Math.cos(ang) * radius;
        positions[idx + 1] = y;
        positions[idx + 2] = -2.8 + Math.random() * 1.8;

        baseRadius[i] = radius;
        baseHeight[i] = y;
        seed[i] = ang;
        speed[i] = 0.08 + Math.random() * 0.19;
        alpha[i] = 0.18 + Math.random() * 0.14;
        size[i] = 0.35 + Math.random() * 0.6;
    }

    return { positions, alpha, size, baseRadius, baseHeight, seed, speed };
};

const EnvironmentScene: React.FC<{
    orbState: OrbState;
    pulseKey: number;
    reducedMotion: boolean;
    hoverStrength: number;
    pointer: React.MutableRefObject<THREE.Vector2>;
}> = ({ orbState, pulseKey, reducedMotion, hoverStrength, pointer }) => {
    const starRef = useRef<THREE.Points>(null);
    const neuralRef = useRef<THREE.Points>(null);
    const auraRef = useRef<THREE.Mesh>(null);
    const rippleRef = useRef<THREE.Mesh>(null);
    const listenRingRef = useRef<THREE.Mesh>(null);

    const stars = useMemo(() => buildStars(), []);
    const neural = useMemo(() => buildNeural(), []);

    const auraTexture = useMemo(
        () => createRadialTexture('rgba(196,181,253,0.55)', 'rgba(124,58,237,0.24)', 'rgba(10,15,42,0.0)'),
        [],
    );

    const rippleTexture = useMemo(
        () => createRadialTexture('rgba(244,114,182,0.38)', 'rgba(124,58,237,0.12)', 'rgba(10,15,42,0.0)'),
        [],
    );

    const clickPulse = useRef(0);

    useEffect(() => {
        clickPulse.current = 1;
    }, [pulseKey]);

    useEffect(() => {
        return () => {
            auraTexture.dispose();
            rippleTexture.dispose();
        };
    }, [auraTexture, rippleTexture]);

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

        if (rippleRef.current) {
            const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
            rippleRef.current.scale.setScalar(1 + (1 - clickPulse.current) * 1.7);
            mat.opacity = 0.22 * clickPulse.current;
        }

        if (listenRingRef.current) {
            const active = orbState === 'listening' || orbState === 'speaking';
            listenRingRef.current.visible = active;
            if (active) {
                const mat = listenRingRef.current.material as THREE.MeshBasicMaterial;
                mat.color.set(orbState === 'listening' ? '#38bdf8' : '#a855f7');
                mat.opacity = 0.24;
                listenRingRef.current.rotation.z += delta * 0.17;
                listenRingRef.current.scale.setScalar(1 + hoverStrength * 0.16 + (orbState === 'speaking' ? 0.08 : 0));
            }
        }

        if (starRef.current && !reducedMotion) {
            const attr = starRef.current.geometry.attributes.position as THREE.BufferAttribute;
            const arr = attr.array as Float32Array;
            for (let i = 0; i < STAR_COUNT; i += 1) {
                const idx = i * 3;
                arr[idx + 1] += Math.sin(t * stars.speed[i] + i) * 0.0009;
            }
            attr.needsUpdate = true;
        }

        if (neuralRef.current) {
            const positionAttr = neuralRef.current.geometry.attributes.position as THREE.BufferAttribute;
            const alphaAttr = neuralRef.current.geometry.attributes.aAlpha as THREE.BufferAttribute;
            const sizeAttr = neuralRef.current.geometry.attributes.aSize as THREE.BufferAttribute;
            const posArr = positionAttr.array as Float32Array;
            const alphaArr = alphaAttr.array as Float32Array;
            const sizeArr = sizeAttr.array as Float32Array;

            const cursorWorldX = pointer.current.x * 5.2;
            const cursorWorldY = pointer.current.y * 2.9;
            const interactionRadius = 0.95;

            for (let i = 0; i < NEURAL_COUNT; i += 1) {
                const idx = i * 3;
                const angle = neural.seed[i] + t * neural.speed[i];
                const orbit = reducedMotion ? 0 : Math.sin(angle * 1.2) * 0.06;
                const distFade = Math.max(0.2, 1 - neural.baseRadius[i] / 4.8);
                const attract = hoverStrength * 0.18 * distFade;
                const targetX = pointer.current.x * 2.4 * attract;
                const targetY = pointer.current.y * 1.4 * attract;

                const clickBurst = clickPulse.current * 0.32 * distFade;
                const radius = neural.baseRadius[i] - hoverStrength * 0.12 * distFade + clickBurst;
                const x = Math.cos(angle) * radius + targetX;
                const y = neural.baseHeight[i] + orbit + targetY;
                const z = -2.6 + Math.sin(angle) * 0.16;

                posArr[idx] = THREE.MathUtils.lerp(posArr[idx], x, 0.07);
                posArr[idx + 1] = THREE.MathUtils.lerp(posArr[idx + 1], y, 0.07);
                posArr[idx + 2] = THREE.MathUtils.lerp(posArr[idx + 2], z, 0.06);

                const dx = x - cursorWorldX;
                const dy = y - cursorWorldY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const localBoost = dist < interactionRadius ? (1 - dist / interactionRadius) : 0;

                const targetAlpha = 0.18 + localBoost * 0.78;
                const targetSize = 0.38 + localBoost * 1.35;

                alphaArr[i] = THREE.MathUtils.lerp(alphaArr[i], targetAlpha, 0.16);
                sizeArr[i] = THREE.MathUtils.lerp(sizeArr[i], targetSize, 0.14);
            }

            positionAttr.needsUpdate = true;
            alphaAttr.needsUpdate = true;
            sizeAttr.needsUpdate = true;
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

            <mesh ref={rippleRef} position={[0, 0, -1.5]}>
                <planeGeometry args={[4.8, 4.8]} />
                <meshBasicMaterial
                    map={rippleTexture}
                    color="#f472b6"
                    transparent
                    opacity={0}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            <mesh ref={listenRingRef} position={[0, 0, -1.2]} visible={false}>
                <ringGeometry args={[1.45, 1.6, 84]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.24} blending={THREE.AdditiveBlending} />
            </mesh>

            <points ref={starRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[stars.positions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    color="#c4b5fd"
                    size={0.024}
                    transparent
                    opacity={0.3}
                    depthWrite={false}
                    sizeAttenuation
                />
            </points>

            <points ref={neuralRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[neural.positions, 3]} />
                    <bufferAttribute attach="attributes-aAlpha" args={[neural.alpha, 1]} />
                    <bufferAttribute attach="attributes-aSize" args={[neural.size, 1]} />
                </bufferGeometry>
                <shaderMaterial
                    vertexShader={NEURAL_VERTEX_SHADER}
                    fragmentShader={NEURAL_FRAGMENT_SHADER}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
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
                width: '100vw',
                height: '100vh',
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
                    pointer={pointer}
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
