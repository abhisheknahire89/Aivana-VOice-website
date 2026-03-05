import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import type { Persona } from '../../data/personas';

export type OrbState = 'idle' | 'connecting' | 'listening' | 'speaking';

/** Lighten a hex color by blending with white (0–1). */
function lightenHex(hex: string, amount: number): string {
    const c = new THREE.Color(hex);
    const w = new THREE.Color(0xffffff);
    c.lerp(w, amount);
    return '#' + c.getHexString();
}

/** Darken a hex color by scaling RGB (0–1). */
function darkenHex(hex: string, factor: number): string {
    const c = new THREE.Color(hex);
    c.r *= factor;
    c.g *= factor;
    c.b *= factor;
    return '#' + c.getHexString();
}

interface HeroOrbProps {
    persona: Persona;
    orbState: OrbState;
    onClick: () => void;
    presentation?: boolean;
}

interface FlowerSceneProps {
    persona: Persona;
    orbState: OrbState;
    audioLevel: number;
    pointer: React.MutableRefObject<THREE.Vector2>;
    hoverBoost: number;
    burst: React.MutableRefObject<number>;
    reducedMotion: boolean;
    presentation: boolean;
}

const OUTER_PETAL_COUNT = 12;
const INNER_PETAL_COUNT = 8;
const PARTICLE_COUNT = 90;
const SURFACE_SPARKS = 72;

const CORE_VERTEX_SHADER = `
uniform float uTime;
uniform float uAudio;
uniform float uReduced;
varying vec3 vNormal;

void main() {
  vNormal = normal;
  vec3 transformed = position;
  float wave = sin((position.y * 6.0) + (uTime * 2.0)) * (0.05 + uAudio * 0.16) * (1.0 - uReduced);
  transformed += normal * wave;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const CORE_FRAGMENT_SHADER = `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uPulse;
varying vec3 vNormal;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.3);
  vec3 col = mix(uColorA, uColorB, fresnel);
  col += vec3(0.10, 0.18, 0.35) * uPulse;
  gl_FragColor = vec4(col, 0.8);
}
`;

const INTERACTION_VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const INTERACTION_FRAGMENT_SHADER = `
uniform vec2 uCursor;
uniform float uStrength;
uniform float uTime;
varying vec2 vUv;

void main() {
  float d = distance(vUv, uCursor);
  float mask = smoothstep(0.12, 0.0, d);
  float shimmer = 0.74 + 0.26 * sin((vUv.x + vUv.y) * 36.0 + uTime * 8.0);
  float alpha = mask * uStrength * shimmer * 0.14;

  vec3 purple = vec3(0.71, 0.52, 0.98);
  vec3 pink = vec3(0.97, 0.42, 0.79);
  vec3 col = mix(purple, pink, smoothstep(0.26, 0.0, d));

  gl_FragColor = vec4(col, alpha);
}
`;

const SPARK_VERTEX_SHADER = `
attribute float aLife;
varying float vLife;

void main() {
  vLife = aLife;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = (8.0 + aLife * 10.0) * (180.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const SPARK_FRAGMENT_SHADER = `
varying float vLife;

void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p) * 2.0;
  float m = smoothstep(1.0, 0.0, d);

  vec3 c1 = vec3(0.74, 0.54, 0.98);
  vec3 c2 = vec3(0.98, 0.45, 0.82);
  vec3 col = mix(c1, c2, 1.0 - vLife);

  gl_FragColor = vec4(col, m * vLife);
}
`;

const createPetalShape = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.22, 0.08, 0.32, 0.52, 0, 1.0);
    shape.bezierCurveTo(-0.32, 0.52, -0.22, 0.08, 0, 0);
    return shape;
};

const buildParticles = () => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const angles = new Float32Array(PARTICLE_COUNT);
    const radii = new Float32Array(PARTICLE_COUNT);
    const heights = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const radius = 0.92 + Math.random() * 1.05;
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 1.4;

        const idx = i * 3;
        positions[idx] = Math.cos(angle) * radius;
        positions[idx + 1] = y;
        positions[idx + 2] = Math.sin(angle) * radius;

        angles[i] = angle;
        radii[i] = radius;
        heights[i] = y;
        speeds[i] = 0.08 + Math.random() * 0.18;
    }

    return { positions, angles, radii, heights, speeds };
};

const FlowerPetals: React.FC<{
    count: number;
    radius: number;
    material: THREE.Material;
    yScale: number;
}> = ({ count, radius, material, yScale }) => {
    const shape = useMemo(() => createPetalShape(), []);
    const geom = useMemo(() => new THREE.ShapeGeometry(shape, 30), [shape]);

    useEffect(() => {
        return () => geom.dispose();
    }, [geom]);

    return (
        <>
            {Array.from({ length: count }, (_, i) => {
                const angle = (Math.PI * 2 * i) / count;
                return (
                    <mesh
                        key={i}
                        geometry={geom}
                        material={material}
                        position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
                        rotation={[0, 0, angle - Math.PI / 2]}
                        scale={[0.72, yScale, 1]}
                    />
                );
            })}
        </>
    );
};

const COLOR_TRANSITION_DURATION = 0.65;
const COLOR_TRANSITION_EASE = 'power2.inOut';

const FlowerScene: React.FC<FlowerSceneProps> = ({ persona, orbState, audioLevel, pointer, hoverBoost, burst, reducedMotion, presentation }) => {
    const rootRef = useRef<THREE.Group>(null);
    const outerRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const waveRef = useRef<THREE.Mesh>(null);
    const rippleRef = useRef<THREE.Mesh>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const pointLightRef = useRef<THREE.PointLight>(null);
    const interactionRef = useRef<THREE.Mesh>(null);
    const sparksRef = useRef<THREE.Points>(null);

    const currentMainColor = useRef(new THREE.Color(persona.color));
    const currentDarkColor = useRef(new THREE.Color(darkenHex(persona.color, 0.55)));
    const currentLightColor = useRef(new THREE.Color(lightenHex(persona.color, 0.35)));

    useEffect(() => {
        const targetMain = new THREE.Color(persona.color);
        const targetDark = new THREE.Color(darkenHex(persona.color, 0.55));
        const targetLight = new THREE.Color(lightenHex(persona.color, 0.35));
        gsap.to(currentMainColor.current, {
            r: targetMain.r,
            g: targetMain.g,
            b: targetMain.b,
            duration: COLOR_TRANSITION_DURATION,
            ease: COLOR_TRANSITION_EASE,
        });
        gsap.to(currentDarkColor.current, {
            r: targetDark.r,
            g: targetDark.g,
            b: targetDark.b,
            duration: COLOR_TRANSITION_DURATION,
            ease: COLOR_TRANSITION_EASE,
        });
        gsap.to(currentLightColor.current, {
            r: targetLight.r,
            g: targetLight.g,
            b: targetLight.b,
            duration: COLOR_TRANSITION_DURATION,
            ease: COLOR_TRANSITION_EASE,
        });
    }, [persona.id, persona.color]);

    const coreUniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uAudio: { value: 0 },
            uPulse: { value: 0.3 },
            uReduced: { value: reducedMotion ? 1 : 0 },
            uColorA: { value: new THREE.Color(persona.color) },
            uColorB: { value: new THREE.Color(persona.color) },
        }),
        [reducedMotion],
    );

    const interactionUniforms = useMemo(
        () => ({
            uCursor: { value: new THREE.Vector2(0.5, 0.5) },
            uStrength: { value: 0 },
            uTime: { value: 0 },
        }),
        [],
    );

    const outerMat = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(persona.color),
                transparent: true,
                opacity: 0.52,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide,
            }),
        [],
    );

    const innerMat = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(lightenHex(persona.color, 0.35)),
                transparent: true,
                opacity: 0.42,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide,
            }),
        [],
    );

    const particles = useMemo(() => buildParticles(), []);

    const sparkPositions = useRef(new Float32Array(SURFACE_SPARKS * 3));
    const sparkLife = useRef(new Float32Array(SURFACE_SPARKS));
    const sparkVel = useRef(new Float32Array(SURFACE_SPARKS * 2));
    const sparkSpawn = useRef(0);

    useEffect(() => {
        for (let i = 0; i < SURFACE_SPARKS; i += 1) {
            const idx = i * 3;
            sparkPositions.current[idx] = 999;
            sparkPositions.current[idx + 1] = 999;
            sparkPositions.current[idx + 2] = 999;
            sparkLife.current[i] = 0;
        }
    }, []);

    useEffect(() => {
        coreUniforms.uReduced.value = reducedMotion ? 1 : 0;
    }, [coreUniforms, reducedMotion]);

    useEffect(() => {
        return () => {
            outerMat.dispose();
            innerMat.dispose();
        };
    }, [outerMat, innerMat]);

    useFrame((_state, delta) => {
        const time = performance.now() * 0.001;
        const pulse = orbState === 'speaking' ? 1 : orbState === 'listening' ? 0.7 : 0.42;
        const intensity = THREE.MathUtils.lerp(pulse, pulse + audioLevel * 0.95 + hoverBoost * 0.06, 0.7);

        coreUniforms.uTime.value = time;
        coreUniforms.uAudio.value = audioLevel;
        coreUniforms.uPulse.value = intensity;

        (coreUniforms.uColorA.value as THREE.Color).copy(currentDarkColor.current);
        (coreUniforms.uColorB.value as THREE.Color).copy(
            orbState === 'listening' ? currentLightColor.current : currentMainColor.current
        );
        outerMat.color.copy(currentMainColor.current);
        innerMat.color.copy(currentLightColor.current);
        if (pointLightRef.current) pointLightRef.current.color.copy(currentMainColor.current);

        const cursorUvX = pointer.current.x * 0.5 + 0.5;
        const cursorUvY = pointer.current.y * 0.5 + 0.5;
        interactionUniforms.uCursor.value.set(cursorUvX, cursorUvY);
        interactionUniforms.uStrength.value = 0;
        interactionUniforms.uTime.value = time;

        if (rootRef.current) {
            const tiltX = reducedMotion ? 0 : pointer.current.y * 0.14;
            const tiltY = reducedMotion ? 0 : pointer.current.x * 0.18;
            rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, tiltX, 0.06);
            rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, tiltY, 0.06);
            const baseScale = presentation ? 1.8 : 1;
            rootRef.current.scale.setScalar(baseScale * (1 + Math.sin(time * 1.25) * (reducedMotion ? 0.008 : 0.02)));
        }

        if (outerRef.current) {
            outerRef.current.rotation.z += delta * (reducedMotion ? 0.01 : 0.04);
            const bloom = 1 + burst.current * 0.12 + (orbState === 'speaking' ? audioLevel * 0.18 : audioLevel * 0.08);
            outerRef.current.scale.setScalar(bloom);
        }

        if (innerRef.current) {
            innerRef.current.rotation.z -= delta * (reducedMotion ? 0.008 : 0.03);
            const bloom = 1 + burst.current * 0.08 + audioLevel * 0.06;
            innerRef.current.scale.setScalar(bloom);
        }

        if (waveRef.current) {
            waveRef.current.visible = orbState === 'listening';
            waveRef.current.scale.setScalar(1.05 + audioLevel * 1.15);
            waveRef.current.rotation.z = 0;
            (waveRef.current.material as THREE.MeshBasicMaterial).color.copy(currentMainColor.current);
        }

        if (rippleRef.current) {
            rippleRef.current.scale.setScalar(1 + burst.current * 2.6);
            const material = rippleRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = 0.2 * burst.current;
            material.color.copy(currentLightColor.current);
        }

        if (pointsRef.current) {
            (pointsRef.current.material as THREE.PointsMaterial).color.copy(currentMainColor.current);
            const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
            const arr = attr.array as Float32Array;

            for (let i = 0; i < PARTICLE_COUNT; i += 1) {
                const idx = i * 3;
                const a = particles.angles[i] + time * particles.speeds[i];
                const r = particles.radii[i] + (orbState === 'speaking' ? audioLevel * 0.12 : 0);
                arr[idx] = Math.cos(a) * r;
                arr[idx + 1] = particles.heights[i] + Math.sin(a * 1.3) * 0.07;
                arr[idx + 2] = Math.sin(a) * r;
            }
            attr.needsUpdate = true;
        }

        if (sparksRef.current) {
            sparkSpawn.current += delta;
            if (!presentation && !reducedMotion && hoverBoost > 0.06 && sparkSpawn.current > 0.028) {
                sparkSpawn.current = 0;
                const id = Math.floor(Math.random() * SURFACE_SPARKS);
                const pIdx = id * 3;
                const vIdx = id * 2;

                const cx = pointer.current.x * 0.64;
                const cy = pointer.current.y * 0.64;

                sparkPositions.current[pIdx] = cx + (Math.random() - 0.5) * 0.14;
                sparkPositions.current[pIdx + 1] = cy + (Math.random() - 0.5) * 0.14;
                sparkPositions.current[pIdx + 2] = 0.32;

                sparkVel.current[vIdx] = (Math.random() - 0.5) * 0.12;
                sparkVel.current[vIdx + 1] = (Math.random() - 0.5) * 0.12;
                sparkLife.current[id] = 1;
            }

            const posAttr = sparksRef.current.geometry.attributes.position as THREE.BufferAttribute;
            const lifeAttr = sparksRef.current.geometry.attributes.aLife as THREE.BufferAttribute;
            const posArr = posAttr.array as Float32Array;
            const lifeArr = lifeAttr.array as Float32Array;

            for (let i = 0; i < SURFACE_SPARKS; i += 1) {
                if (sparkLife.current[i] <= 0) continue;

                const pIdx = i * 3;
                const vIdx = i * 2;

                sparkLife.current[i] = Math.max(0, sparkLife.current[i] - delta * 0.75);
                lifeArr[i] = sparkLife.current[i];

                posArr[pIdx] += sparkVel.current[vIdx] * delta * 2.2;
                posArr[pIdx + 1] += sparkVel.current[vIdx + 1] * delta * 2.2;
                posArr[pIdx + 2] = 0.32;

                if (sparkLife.current[i] <= 0) {
                    posArr[pIdx] = 999;
                    posArr[pIdx + 1] = 999;
                    posArr[pIdx + 2] = 999;
                }
            }

            posAttr.needsUpdate = true;
            lifeAttr.needsUpdate = true;
        }
    });

    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight ref={pointLightRef} position={[0, 0, 3]} intensity={1.1} color={currentMainColor.current.getStyle()} />

            <group ref={rootRef}>
                <group ref={outerRef}>
                    <FlowerPetals count={OUTER_PETAL_COUNT} radius={0.3} material={outerMat} yScale={0.95} />
                </group>

                <group ref={innerRef}>
                    <FlowerPetals count={INNER_PETAL_COUNT} radius={0.2} material={innerMat} yScale={0.78} />
                </group>

                <mesh ref={coreRef}>
                    <icosahedronGeometry args={[0.24, 4]} />
                    <shaderMaterial
                        uniforms={coreUniforms}
                        vertexShader={CORE_VERTEX_SHADER}
                        fragmentShader={CORE_FRAGMENT_SHADER}
                        transparent
                        depthWrite={false}
                        blending={THREE.NormalBlending}
                    />
                </mesh>

                {false && (
                    <mesh ref={interactionRef} position={[0, 0, 0.26]}>
                        <planeGeometry args={[2.2, 2.2]} />
                        <shaderMaterial
                            uniforms={interactionUniforms}
                            vertexShader={INTERACTION_VERTEX_SHADER}
                            fragmentShader={INTERACTION_FRAGMENT_SHADER}
                            transparent
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                )}

                {/* Rings centered around flower: same group origin, no Z rotation so they stay aligned */}
                <mesh ref={waveRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
                    <ringGeometry args={[0.52, 0.62, 64]} />
                    <meshBasicMaterial color={persona.color} transparent opacity={0.4} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
                </mesh>

                <mesh ref={rippleRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.66, 0.75, 64]} />
                    <meshBasicMaterial color={lightenHex(persona.color, 0.35)} transparent opacity={0} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
                </mesh>

                <points ref={pointsRef}>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
                    </bufferGeometry>
                    <pointsMaterial
                        color={persona.color}
                        size={0.012}
                        sizeAttenuation
                        transparent
                        opacity={0.34}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </points>

                {false && (
                    <points ref={sparksRef}>
                        <bufferGeometry>
                            <bufferAttribute attach="attributes-position" args={[sparkPositions.current, 3]} />
                            <bufferAttribute attach="attributes-aLife" args={[sparkLife.current, 1]} />
                        </bufferGeometry>
                        <shaderMaterial
                            vertexShader={SPARK_VERTEX_SHADER}
                            fragmentShader={SPARK_FRAGMENT_SHADER}
                            transparent
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </points>
                )}
            </group>
        </>
    );
};

const HeroOrb: React.FC<HeroOrbProps> = ({ persona, orbState, onClick, presentation = false }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pointer = useRef(new THREE.Vector2(0, 0));
    const burst = useRef(0);

    const [audioLevel, setAudioLevel] = useState(0);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (presentation) return;
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const onMove = (event: MouseEvent) => {
            const rect = wrapper.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
            pointer.current.set(x, -y);
        };

        const onLeave = () => {
            pointer.current.set(0, 0);
        };

        wrapper.addEventListener('mousemove', onMove);
        wrapper.addEventListener('mouseleave', onLeave);

        return () => {
            wrapper.removeEventListener('mousemove', onMove);
            wrapper.removeEventListener('mouseleave', onLeave);
        };
    }, [presentation]);

    useEffect(() => {
        if (!presentation) return;
        let raf = 0;
        const tick = () => {
            const t = performance.now() * 0.001;
            pointer.current.set(Math.sin(t * 0.55) * 0.22, Math.cos(t * 0.42) * 0.18);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [presentation]);

    useEffect(() => {
        let raf = 0;
        let cancelled = false;
        let stream: MediaStream | null = null;
        let audioContext: AudioContext | null = null;
        let oscillator: OscillatorNode | null = null;

        const cleanup = async () => {
            cancelled = true;
            if (raf) cancelAnimationFrame(raf);
            if (oscillator) oscillator.stop();
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (audioContext) await audioContext.close();
        };

        const sample = (analyser: AnalyserNode) => {
            const buffer = new Uint8Array(analyser.fftSize);
            const tick = () => {
                analyser.getByteTimeDomainData(buffer);
                let sum = 0;
                for (let i = 0; i < buffer.length; i += 1) {
                    const v = (buffer[i] - 128) / 128;
                    sum += v * v;
                }
                const rms = Math.sqrt(sum / buffer.length);
                const level = THREE.MathUtils.clamp(rms * 4.2, 0, 1);
                setAudioLevel(prev => THREE.MathUtils.lerp(prev, level, 0.35));
                if (!cancelled) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
        };

        const listen = async () => {
            if (!navigator.mediaDevices?.getUserMedia) return;
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            sample(analyser);
        };

        const speak = async () => {
            audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            const gain = audioContext.createGain();
            gain.gain.value = 0.0001;
            oscillator = audioContext.createOscillator();
            oscillator.type = 'triangle';
            oscillator.frequency.value = 176;
            oscillator.connect(gain);
            gain.connect(analyser);
            analyser.connect(audioContext.destination);
            oscillator.start();
            sample(analyser);
        };

        if (presentation || reducedMotion || orbState === 'idle' || orbState === 'connecting') {
            setAudioLevel(0);
            return () => {
                cleanup().catch(() => undefined);
            };
        }

        if (orbState === 'listening') {
            listen().catch(() => {
                const fallback = () => {
                    const v = 0.12 + Math.abs(Math.sin(Date.now() * 0.0034)) * 0.2;
                    setAudioLevel(prev => THREE.MathUtils.lerp(prev, v, 0.2));
                    if (!cancelled) raf = requestAnimationFrame(fallback);
                };
                raf = requestAnimationFrame(fallback);
            });
        } else {
            speak().catch(() => undefined);
        }

        return () => {
            cleanup().catch(() => undefined);
        };
    }, [orbState, reducedMotion, presentation]);

    useEffect(() => {
        burst.current = 0;
    }, [persona.id]);

    const triggerClick = () => {
        if (presentation) return;
        gsap.fromTo(
            burst,
            { current: 1 },
            {
                current: 0,
                duration: reducedMotion ? 0.45 : 1.2,
                ease: 'power3.out',
            },
        );
        onClick();
    };

    const accentRgb = (() => {
        const c = new THREE.Color(persona.color);
        return `${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}`;
    })();
    const tapTextColor = orbState === 'connecting'
        ? 'rgba(255,255,255,0.6)'
        : orbState === 'listening'
            ? 'rgba(125, 211, 252, 0.95)'
            : orbState === 'speaking'
                ? `rgba(${accentRgb}, 0.95)`
                : 'rgba(255,255,255,0.72)';

    const hoverBoost = presentation ? 0.2 : 0;

    return (
        <div
            ref={wrapperRef}
            style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'relative',
                cursor: presentation ? 'default' : 'default',
                background: presentation ? 'transparent' : `radial-gradient(circle, ${persona.color}1a 0%, rgba(7,8,20,0.0) 72%)`,
                boxShadow: presentation ? 'none' : `0 0 70px ${persona.glowColor}, inset 0 0 28px ${persona.color}20`,
            }}
            role="button"
            tabIndex={presentation ? -1 : 0}
            aria-label={`Activate ${persona.name} voice core`}
            onKeyDown={(event) => {
                if (presentation) return;
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    triggerClick();
                }
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 3.6], fov: 44 }}
                dpr={[1, 1.8]}
                gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
                style={{ background: 'transparent' }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                }}
            >
                <FlowerScene
                    persona={persona}
                    orbState={orbState}
                    audioLevel={audioLevel}
                    pointer={pointer}
                    hoverBoost={hoverBoost}
                    burst={burst}
                    reducedMotion={reducedMotion}
                    presentation={presentation}
                />
            </Canvas>

            {!presentation && (
                <>
                    <button
                        aria-label={`Tap to talk with ${persona.name}`}
                        onClick={triggerClick}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            margin: 'auto',
                            width: 96,
                            height: 96,
                            transform: 'translateY(6px)',
                            borderRadius: '50%',
                            border: `1px solid ${orbState === 'connecting' ? 'rgba(255,255,255,0.2)' : orbState === 'listening' ? 'rgba(56,189,248,0.68)' : `${persona.color}66`}`,
                            background: orbState === 'connecting'
                                ? 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), rgba(255,255,255,0.04) 100%)'
                                : orbState === 'listening'
                                ? 'radial-gradient(circle at 50% 50%, rgba(125,211,252,0.28), rgba(56,189,248,0.12) 52%, rgba(14,116,144,0.06) 100%)'
                                : `radial-gradient(circle at 50% 50%, ${persona.color}30, ${persona.color}22 52%, ${persona.color}14 100%)`,
                            boxShadow: `0 0 8px ${persona.color}40, inset 0 0 8px rgba(255,255,255,0.05)`,
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                            zIndex: 3,
                            transition: 'all 200ms ease',
                        }}
                    >
                        <svg
                            width="42"
                            height="42"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                color: 'rgba(244,244,255,0.82)',
                                filter: `drop-shadow(0 0 6px ${persona.color}60)`,
                            }}
                        >
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                            <line x1="8" y1="22" x2="16" y2="22" />
                        </svg>
                    </button>

                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: 'calc(50% + 52px)',
                            width: 2,
                            height: 36,
                            transform: 'translateX(-50%)',
                            background: `linear-gradient(to bottom, ${persona.color}8c, ${persona.color}14, ${persona.color}00)`,
                            pointerEvents: 'none',
                            zIndex: 2,
                        }}
                    />

                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: '7%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.76rem',
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            fontWeight: 500,
                            color: tapTextColor,
                            textShadow: `0 0 12px ${persona.color}73`,
                            transition: 'color 0.2s ease',
                            pointerEvents: 'none',
                            zIndex: 2,
                        }}
                    >
                        Tap to talk
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroOrb;
