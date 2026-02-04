import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { HologramEnvironment } from './HologramEnvironment';
import { Model } from './Model';
import { GLTFModelLoader } from './GLTFModelLoader';
import { ModelErrorBoundary } from './ModelErrorBoundary';
import { HolographicImage } from './HolographicImage';
import { Controls } from './Controls';
import { SCENE_CONFIG } from '../config/sceneConfig';
import { ModelOption } from '../App';

interface SceneProps {
    selectedModel: ModelOption;
    onReset?: () => void;
}

export const Scene: React.FC<SceneProps> = ({ selectedModel, onReset }) => {
    return (
        <Canvas
            camera={{
                position: SCENE_CONFIG.camera.position,
                fov: SCENE_CONFIG.camera.fov,
                near: SCENE_CONFIG.camera.near,
                far: SCENE_CONFIG.camera.far,
            }}
            shadows={false}
            dpr={[1, 1.5]} // Capped at 1.5 for performance on high-res screens
            gl={{ 
                antialias: true, 
                alpha: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.2,
                powerPreference: "high-performance", // Request high-performance GPU
                preserveDrawingBuffer: false,
            }}
            style={{ background: 'transparent' }}
        >
            <AdaptiveDpr pixelated /> {/* Dynamically reduce dpr when moving */}
            
            {/* Environment and lighting */}
            <HologramEnvironment />

            {/* Main 3D model - switch between procedural, GLTF, and schematic */}
            {['schematic', 'schematic-2', 'schematic-3', 'schematic-4'].includes(selectedModel.type) ? (
                <HolographicImage 
                    imageUrl={selectedModel.path} 
                    rotation={selectedModel.rotation}
                />
            ) : selectedModel.path === 'procedural' ? (
                <Model />
            ) : (
                <ModelErrorBoundary key={selectedModel.id} embedUrl={selectedModel.embedUrl} onReset={onReset}>
                    <React.Suspense fallback={null}>
                        <GLTFModelLoader 
                            modelPath={selectedModel.path} 
                            modelType={selectedModel.type}
                        />
                    </React.Suspense>
                </ModelErrorBoundary>
            )}
            
            {/* <mesh>
                <boxGeometry />
                <meshBasicMaterial color="red" wireframe />
            </mesh> */}
            
            <ambientLight intensity={1} />

            {/* Camera controls */}
            <Controls />

            {/* Post-processing effects for holographic look - DISABLED DUE TO COMPATIBILITY ISSUE */}
            {/* <EffectComposer>
                <Bloom
                    intensity={1.5}
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    mipmapBlur={true}
                    radius={0.8}
                />
            </EffectComposer> */}
            {/* Preload all assets for smooth opening */}
            <Preload all />
        </Canvas>
    );
};
