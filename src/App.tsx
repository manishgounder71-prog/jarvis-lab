import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { GestureDetector } from './components/GestureDetector';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { ControlPanel } from './components/UI/ControlPanel';
import { PartInfo } from './components/UI/PartInfo';
import { HologramHUD } from './components/UI/HologramHUD';
import { ModelSelector } from './components/UI/ModelSelector';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

export interface ModelOption {
    id: string;
    name: string;
    path: string;
    type: 'arc-reactor' | 'endurance' | 'helicopter' | 'ironman-suit' | 'ironman-mark85' | 'ironman-suit-v2' | 'schematic' | 'schematic-2';
    embedUrl?: string;
    rotation?: [number, number, number];
    scale?: [number, number, number];
}

function App() {
    const [selectedModel, setSelectedModel] = useState<ModelOption>({
        id: 'reference-schematic-2',
        name: '📐 SCHEMATIC V2',
        path: '/textures/hologram-download.jpg',
        type: 'schematic-2'
    });

    const handleModelChange = (model: ModelOption) => {
        setSelectedModel(model);
    };

    const handleReset = () => {
        // Reset to default safe model (Schematic V2)
        setSelectedModel({
            id: 'reference-schematic-2',
            name: '📐 SCHEMATIC V2',
            path: '/textures/hologram-download.jpg',
            type: 'schematic-2'
        });
    };

    return (
        <ErrorBoundary>
            <div className="app-container">
                {/* Video Background */}
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        opacity: 0.85 // More visible background
                    }}
                >
                    <source src="/textures/50513.webm" type="video/webm" />
                </video>
                
                {/* Dark Overlay for readability */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)', // Lighter overlay
                    zIndex: 1,
                    pointerEvents: 'none'
                }} />

                {/* Loading Screen */}
                <LoadingScreen />

                {/* Header */}
                <div className="app-header">
                    <h1 className="app-title">J.A.R.V.I.S.</h1>
                </div>

                {/* 3D Scene */}
                <div className="scene-container" style={{ zIndex: 2 }}>
                    <Scene selectedModel={selectedModel} onReset={handleReset} />
                </div>

                <div className="ui-overlay">
                    <HologramHUD />
                    <ModelSelector 
                        currentModel={selectedModel.id} 
                        onModelChange={handleModelChange} 
                    />
                    <ControlPanel />
                    <PartInfo />
                    <GestureDetector />
                </div>
            </div>
        </ErrorBoundary>
    );
}

export default App;
