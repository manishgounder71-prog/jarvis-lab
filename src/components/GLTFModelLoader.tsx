import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';
import { SCENE_CONFIG } from '../config/sceneConfig';
import { createHologramMaterial } from '../shaders/hologramShader';

interface GLTFLoaderProps {
    modelPath: string;
    modelType?: 'arc-reactor' | 'endurance' | 'helicopter' | 'ironman-suit' | 'ironman-mark85' | 'ironman-suit-v2' | 'schematic' | 'schematic-2' | 'schematic-3' | 'schematic-4';
}

/**
 * Universal GLTF Model Loader with Holographic Effects
 * Loads external models from Sketchfab and applies holographic materials
 */
export const GLTFModelLoader: React.FC<GLTFLoaderProps> = ({ modelPath, modelType }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(modelPath);
    
    const {
        setIsLoading,
        setLoadingProgress,
    } = useAppStore();

    const { raycaster, pointer, camera } = useThree();

    // Apply holographic materials to loaded model
    useEffect(() => {
        if (scene) {
            setLoadingProgress(80);
            
            const meshes: THREE.Mesh[] = [];
            
            // Traverse model and apply holographic shader
            scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    meshes.push(child);
                    
                    // Determine color based on model type
                    let color = 0x00ffff; // Default cyan
                    let glowIntensity = 2.0;
                    
                    switch (modelType) {
                        case 'arc-reactor':
                            color = 0x00ffff; // Cyan for Arc Reactor
                            glowIntensity = 3.5;
                            break;
                        case 'endurance':
                            color = 0x88ccff; // Light blue for spaceship
                            glowIntensity = 1.8;
                            break;
                        case 'helicopter':
                            color = 0x00ff88; // Green for military
                            glowIntensity = 2.2;
                            break;
                        case 'ironman-suit':
                            color = 0xff0000; // Red for Iron Man
                            glowIntensity = 2.5;
                            break;
                        case 'ironman-mark85':
                        case 'ironman-suit-v2':
                            color = 0xff3333; // Red/Gold
                            glowIntensity = 2.8;
                            break;
                    }
                    
                    // Apply holographic material
                    const holoMaterial = createHologramMaterial(color, { 
                        glowIntensity,
                        opacity: 0.7 
                    });
                    
                    child.material = holoMaterial;
                }
            });
            
            setLoadingProgress(100);
            setTimeout(() => setIsLoading(false), 500);
        }
    }, [scene, modelType, setIsLoading, setLoadingProgress]);

    // Animate model with subtle floating motion
    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
            
            // Slow rotation
            groupRef.current.rotation.y += 0.002;
            
            // Update shader time uniforms
            groupRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
                    child.material.uniforms.time.value = state.clock.elapsedTime;
                }
            });
        }
    });


    return (
        <group 
            ref={groupRef}
            position={SCENE_CONFIG.model.position}
            scale={SCENE_CONFIG.model.scale}
        >
            <primitive object={scene} />
        </group>
    );
};

// Preload models removed to prevent errors when files are missing
// useGLTF.preload('/models/arc-reactor/scene.glb');
// useGLTF.preload('/models/endurance/scene.glb');
// useGLTF.preload('/models/helicopter/scene.glb');
// useGLTF.preload('/models/ironman-mark85/scene.glb');
