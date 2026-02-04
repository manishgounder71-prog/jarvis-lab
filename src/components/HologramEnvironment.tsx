import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';

export const HologramEnvironment: React.FC = () => {
    const gridRef = useRef<THREE.Group>(null);
    const platformRef = useRef<THREE.Mesh>(null);
    const lightRaysRef = useRef<THREE.Group>(null);

    // Animate grid and holographic base
    useFrame((state) => {
        if (gridRef.current) {
            // Slow rotation
            gridRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }

        // Pulse the holographic platform
        if (platformRef.current) {
            const material = platformRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
        }

        // Rotate light rays
        if (lightRaysRef.current) {
            lightRaysRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <>
            {/* Minimal ambient light for depth */}
            <ambientLight
                intensity={0.2}
                color={0x001122}
            />

            {/* Key lights for hologram effect */}
            <spotLight
                position={[5, 8, 5]}
                intensity={1.5}
                color={0x00ffff}
                angle={0.6}
                penumbra={0.8}
                castShadow={false}
            />

            <spotLight
                position={[-5, 6, -3]}
                intensity={1.0}
                color={0xff00ff}
                angle={0.5}
                penumbra={0.7}
            />

            {/* Rim light from below */}
            <pointLight
                position={[0, -3, 0]}
                intensity={0.8}
                color={0x00ccff}
                distance={10}
            />

            {/* Holographic grid floor */}
            <group ref={gridRef} position={[0, -2, 0]}>
                <Grid
                    args={[20, 20]}
                    cellSize={0.5}
                    cellThickness={0.5}
                    cellColor={'#00ffff'}
                    sectionSize={2}
                    sectionThickness={1}
                    sectionColor={'#ff00ff'}
                    fadeDistance={25}
                    fadeStrength={1}
                    infiniteGrid
                />
            </group>

            {/* Holographic projection platform */}
            <mesh ref={platformRef} position={[0, -1.95, 0]} rotation-x={-Math.PI / 2}>
                <ringGeometry args={[1.5, 2.5, 32]} />
                <meshStandardMaterial
                    color={0x00ffff}
                    emissive={0x00ffff}
                    emissiveIntensity={0.3}
                    transparent={true}
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Volumetric light rays (simplified) */}
            <group ref={lightRaysRef} position={[0, -2, 0]}>
                {[0, 1, 2, 3].map((i) => (
                    <mesh
                        key={i}
                        rotation-y={(Math.PI / 2) * i}
                        position={[0, 1, 0]}
                    >
                        <planeGeometry args={[0.05, 4]} />
                        <meshBasicMaterial
                            color={0x00ffff}
                            transparent={true}
                            opacity={0.1}
                            side={THREE.DoubleSide}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                ))}
            </group>

            {/* Particle field for holographic "dust" */}
            <points>
                <bufferGeometry>
                        args={[new Float32Array(
                            Array.from({ length: 500 * 3 }, () => (Math.random() - 0.5) * 15)
                        ), 3]}
                </bufferGeometry>
                <pointsMaterial
                    size={0.02}
                    color={0x00ffff}
                    transparent={true}
                    opacity={0.4}
                    sizeAttenuation={true}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Dark space fog for depth */}
            <fog attach="fog" args={['#000008', 8, 30]} />
        </>
    );
};
