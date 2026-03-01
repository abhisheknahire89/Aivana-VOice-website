import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import type { Persona } from '../../data/personas';
import { PERSONAS } from '../../data/personas';
import * as THREE from 'three';

interface PersonaOrbMeshProps {
    persona: Persona;
    active: boolean;
    position: [number, number, number];
}

const PersonaOrbMesh = ({ persona, active, position }: PersonaOrbMeshProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const color = useMemo(() => new THREE.Color(persona.color), [persona.color]);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        const breathe = 1 + Math.sin(t * 0.7 + position[0]) * 0.018;
        meshRef.current.scale.setScalar(breathe);
        meshRef.current.rotation.y = t * 0.07;
        meshRef.current.rotation.z = Math.sin(t * 0.25) * 0.035;

        if (glowRef.current) {
            const gp = 1 + Math.sin(t * 1.3 + position[0]) * 0.1;
            glowRef.current.scale.setScalar(gp);
            (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
                active ? 0.55 + Math.sin(t * 1.5) * 0.15 : 0.2;
        }
    });

    const scale = active ? 1 : 0.55;

    return (
        <group position={position} scale={scale}>
            <Float speed={active ? 2.0 : 1.4} rotationIntensity={0.25} floatIntensity={active ? 0.5 : 0.2}>
                {/* Inner glow core */}
                <mesh ref={glowRef}>
                    <sphereGeometry args={[0.7, 24, 24]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={active ? 0.55 : 0.2}
                        transparent
                        opacity={0.3}
                        depthWrite={false}
                    />
                </mesh>

                {/* Main sphere */}
                <mesh ref={meshRef}>
                    <sphereGeometry args={[1, 56, 56]} />
                    <MeshDistortMaterial
                        color={persona.color}
                        speed={active ? 2.0 : 1.0}
                        distort={active ? 0.26 : 0.14}
                        radius={1}
                        metalness={0.9}
                        roughness={0.07}
                        envMapIntensity={active ? 2.5 : 1.0}
                    />
                </mesh>

                {/* Glass shell */}
                <mesh>
                    <sphereGeometry args={[1.05, 32, 32]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        metalness={0}
                        roughness={0}
                        transparent
                        opacity={active ? 0.05 : 0.02}
                        depthWrite={false}
                        side={THREE.BackSide}
                    />
                </mesh>
            </Float>
        </group>
    );
};

interface CarouselSceneProps {
    activeIndex: number;
}

/**
 * A single shared Canvas renders all 5 orbs at once.
 * This prevents WebGL context loss from too many simultaneous canvases.
 */
const CarouselScene: React.FC<CarouselSceneProps> = ({ activeIndex }) => {
    const totalOrbs = PERSONAS.length;
    const anglePerOrb = (2 * Math.PI) / totalOrbs;
    const radiusX = 3.2;

    return (
        <Canvas
            camera={{ position: [0, 0, 5.5], fov: 55 }}
            gl={{
                antialias: false,
                alpha: true,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: false,
            }}
            dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
            style={{ width: '100%', height: '100%' }}
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[-2, 3, 4]} intensity={2.5} color="#ffffff" />
            <pointLight position={[3, -2, -2]} intensity={0.8} color="#8866ff" />
            <pointLight position={[-3, 2, 1]} intensity={0.4} color="#0066ff" />

            <Suspense fallback={null}>
                {PERSONAS.map((persona, i) => {
                    let offset = i - activeIndex;
                    if (offset > 2) offset -= totalOrbs;
                    if (offset < -2) offset += totalOrbs;

                    const angle = offset * anglePerOrb * 1.05;
                    const x = Math.sin(angle) * radiusX;
                    const z = Math.cos(angle) * 1.8 - 1.8;
                    const isActive = offset === 0;

                    return (
                        <PersonaOrbMesh
                            key={persona.id}
                            persona={persona}
                            active={isActive}
                            position={[x, 0, z]}
                        />
                    );
                })}
                <Environment preset="night" />
            </Suspense>
        </Canvas>
    );
};

export default CarouselScene;
