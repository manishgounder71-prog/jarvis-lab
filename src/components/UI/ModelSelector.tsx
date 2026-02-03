import React from 'react';
import './ModelSelector.css';

interface ModelOption {
    id: string;
    name: string;
    path: string;
    type: 'arc-reactor' | 'endurance' | 'helicopter' | 'ironman-suit' | 'ironman-mark85' | 'ironman-suit-v2' | 'schematic' | 'schematic-2';
    embedUrl?: string;
    rotation?: [number, number, number];
    scale?: [number, number, number];
}

const AVAILABLE_MODELS: ModelOption[] = [
    {
        id: 'reference-schematic',
        name: '📐 SCHEMATIC V1',
        path: '/textures/download.2.jpg',
        type: 'schematic'
    },
    {
        id: 'reference-schematic-2',
        name: '📐 SCHEMATIC V2',
        path: '/textures/download.1.jpg',
        type: 'schematic-2'
    },
    {
        id: 'suit-v1',
        name: '🦾 SUIT V1',
        path: '/textures/Ironman.jpg',
        type: 'schematic',
        rotation: [0, 0, 0] 
    },
    {
        id: 'ironman-mark85',
        name: '🤖 MARK 85',
        path: '/models/ironman-mark85/scene.glb',
        type: 'ironman-mark85',
        embedUrl: 'https://sketchfab.com/models/dde1085c464d4f8da259fe6669ae4dd2/embed'
    },
    {
        id: 'arc-reactor',
        name: '⚡ Arc Reactor',
        path: '/models/arc-reactor/scene.glb',
        type: 'arc-reactor',
        embedUrl: 'https://sketchfab.com/models/d87547f21f904cfa954f4cf77a1409ac/embed'
    },
    {
        id: 'endurance',
        name: '🚀 Endurance Spaceship',
        path: '/models/endurance/scene.glb',
        type: 'endurance',
        embedUrl: 'https://sketchfab.com/models/6e391e1c7789448dbcc832fb41f557da/embed'
    },
    {
        id: 'helicopter',
        name: '🚁 Attack Helicopter',
        path: '/models/helicopter/scene.glb',
        type: 'helicopter',
        embedUrl: 'https://sketchfab.com/models/8980af7152db43f6ba49e93f3950a74e/embed'
    }
];

interface ModelSelectorProps {
    currentModel: string;
    onModelChange: (model: ModelOption) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ currentModel, onModelChange }) => {
    return (
        <div className="model-selector">
            <div className="selector-title">HOLOGRAM MODEL</div>
            <div className="model-grid">
                {AVAILABLE_MODELS.map((model) => (
                    <button
                        key={model.id}
                        className={`model-button ${currentModel === model.id ? 'active' : ''}`}
                        onClick={() => onModelChange(model)}
                    >
                        <div className="model-icon">{model.name.split(' ')[0]}</div>
                        <div className="model-name">{model.name.split(' ').slice(1).join(' ')}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};
