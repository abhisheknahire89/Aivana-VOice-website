import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import type { Persona } from '../../data/personas';
import * as THREE from 'three';

interface PersonaThreeDProps {
    persona: Persona;
    active: boolean;
}

const PersonaOrb = ({ persona, active }: PersonaThreeDProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const innerGlowRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        // Organic breathing motion
        const breathe = Math.sin(t * 0.8) * 0.015 + 1;
        meshRef.current.scale.setScalar(breathe);
        // Slow ambient rotation for life
        meshRef.current.rotation.y = t * 0.08;
        meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.04;

        if (innerGlowRef.current) {
            const glowPulse = 1 + Math.sin(t * 1.2) * 0.08;
            innerGlowRef.current.scale.setScalar(glowPulse);
        }
    });

    const color = new THREE.Color(persona.color);

    return (
        <Float speed={active ? 2 : 1.2} rotationIntensity={0.3} floatIntensity={active ? 0.6 : 0.3}>
            {/* Inner glow sphere */}
            <mesh ref={innerGlowRef}>
                <sphereGeometry args={[0.72, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={active ? 0.6 : 0.3}
                    transparent
                    opacity={0.25}
                    depthWrite={false}
                />
            </mesh>

            {/* Main orb */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color={persona.color}
                    speed={active ? 2.5 : 1.2}
                    distort={active ? 0.28 : 0.18}
                    radius={1}
                    metalness={0.85}
                    roughness={0.08}
                    envMapIntensity={active ? 2 : 1.2}
                    transparent
                    opacity={0.92}
                />
            </mesh>

            {/* Outer shell — glass refraction feel */}
            <mesh>
                <sphereGeometry args={[1.06, 48, 48]} />
                <meshStandardMaterial
                    color={'#ffffff'}
                    metalness={0.1}
                    roughness={0}
                    transparent
                    opacity={0.04}
                    depthWrite={false}
                    side={THREE.BackSide}
                />
            </mesh>
        </Float>
    );
};

const PersonaThreeD: React.FC<PersonaThreeDProps> = ({ persona, active }) => {
    return (
        <div className="w-full h-full relative" style={{ pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 3.2], fov: 42 }}
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: 'high-performance',
                    preserveDrawingBuffer: false,
                }}
                dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
            >
                {/* Warm ambient */}
                <ambientLight intensity={active ? 0.5 : 0.3} />
                {/* Key light — positions specular highlight top-left */}
                <directionalLight
                    position={[-2, 3, 4]}
                    intensity={active ? 2.5 : 1.5}
                    color="#ffffff"
                />
                {/* Rim light — chromatic dispersion feel */}
                <pointLight
                    position={[3, -2, -2]}
                    intensity={active ? 1.0 : 0.5}
                    color={persona.color}
                />
                {/* Subtle fill from below */}
                <pointLight
                    position={[0, -3, 2]}
                    intensity={0.3}
                    color="#1a1a2e"
                />

                <Suspense fallback={null}>
                    <PersonaOrb persona={persona} active={active} />
                    <Environment preset="night" />
                </Suspense>
            </Canvas>

            {/* Ambient glow halo — CSS layer, no WebGL cost */}
            <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 40% 35%, ${persona.color}55 0%, ${persona.glowColor} 40%, transparent 70%)`,
                    filter: `blur(${active ? 24 : 16}px)`,
                    opacity: active ? 0.65 : 0.25,
                    transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease',
                    mixBlendMode: 'screen',
                }}
            />

            {/* Specular glint overlay */}
            {active && (
                <div
                    className="absolute pointer-events-none"
                    style={{
                        top: '12%',
                        left: '18%',
                        width: '28%',
                        height: '18%',
                        background: 'radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, transparent 80%)',
                        borderRadius: '50%',
                        filter: 'blur(4px)',
                    }}
                />
            )}
        </div>
    );
};

export default PersonaThreeD;
