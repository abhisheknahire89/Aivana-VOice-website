import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { PERSONAS } from '../../data/personas';
import * as THREE from 'three';

interface OrbMeshProps {
    persona: typeof PERSONAS[0];
    position: [number, number, number];
    active: boolean;
    hovered: boolean;
    faded: boolean;
}

const OrbMesh: React.FC<OrbMeshProps> = ({ persona, position, active: _active, hovered, faded }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        const breathe = 1 + Math.sin(t * 0.8 + position[0] * 1.5) * 0.02;
        meshRef.current.scale.setScalar(breathe * (hovered ? 1.18 : faded ? 0.88 : 1));
        meshRef.current.rotation.y = t * 0.06;
    });

    const targetOpacity = hovered ? 1 : faded ? 0.35 : 0.85;

    return (
        <group position={position}>
            <Float speed={1.4 + position[0] * 0.1} rotationIntensity={0.2} floatIntensity={0.3}>
                {/* Core glow */}
                <mesh>
                    <sphereGeometry args={[0.68, 20, 20]} />
                    <meshStandardMaterial
                        color={new THREE.Color(persona.color)}
                        emissive={new THREE.Color(persona.color)}
                        emissiveIntensity={hovered ? 0.6 : 0.25}
                        transparent
                        opacity={0.3 * targetOpacity}
                        depthWrite={false}
                    />
                </mesh>

                {/* Main orb */}
                <mesh ref={meshRef}>
                    <sphereGeometry args={[1, 48, 48]} />
                    <MeshDistortMaterial
                        color={persona.color}
                        speed={hovered ? 2.5 : 1.2}
                        distort={hovered ? 0.28 : 0.15}
                        radius={1}
                        metalness={0.9}
                        roughness={0.07}
                        envMapIntensity={hovered ? 2.2 : 1.0}
                        transparent
                        opacity={targetOpacity * 0.92}
                    />
                </mesh>
            </Float>
        </group>
    );
};

interface ConstellationSceneProps {
    hoveredId: string | null;
    isMobile: boolean;
}

/**
 * Single Canvas renders all 5 constellation orbs.
 * Positions are mapped from percentage screen positions to 3D space.
 * This eliminates WebGL context loss.
 */
const ConstellationScene: React.FC<ConstellationSceneProps> = ({ hoveredId, isMobile }) => {
    // Map persona screen positions to 3D space coords
    const orbPositions: [number, number, number][] = PERSONAS.map(persona => {
        const pos = isMobile ? persona.mobilePosition : persona.position;
        // Convert "XX%" string to -4..4 range
        const x = (parseFloat(pos.x) / 100 - 0.5) * 7;
        const y = -(parseFloat(pos.y) / 100 - 0.5) * 4.5;
        return [x, y, 0];
    });

    return (
        <Canvas
            camera={{ position: [0, 0, 7], fov: 55 }}
            gl={{
                antialias: false,
                alpha: true,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: false,
            }}
            dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[-2, 3, 4]} intensity={2.0} color="#ffffff" />
            <pointLight position={[3, -2, -1]} intensity={0.6} color="#8866ee" />

            <Suspense fallback={null}>
                {PERSONAS.map((persona, i) => (
                    <OrbMesh
                        key={persona.id}
                        persona={persona}
                        position={orbPositions[i]}
                        active={hoveredId === persona.id}
                        hovered={hoveredId === persona.id}
                        faded={hoveredId !== null && hoveredId !== persona.id}
                    />
                ))}
                <Environment preset="night" />
            </Suspense>
        </Canvas>
    );
};

export default ConstellationScene;
