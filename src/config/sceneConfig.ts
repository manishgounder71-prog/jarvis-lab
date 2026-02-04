// Centralized scene configuration
export const SCENE_CONFIG = {
    // Camera settings
    camera: {
        fov: 50,
        position: [5, 3, 8] as [number, number, number],
        near: 0.1,
        far: 1000,
        minDistance: 2,
        maxDistance: 20,
        minPolarAngle: 0, // Allow looking from top
        maxPolarAngle: Math.PI, // Allow looking from bottom
    },

    // Lighting
    lighting: {
        ambient: {
            intensity: 0.5,
            color: '#ffffff',
        },
        spotlight: {
            intensity: 1.5,
            position: [10, 10, 10] as [number, number, number],
            color: '#00ffff',
            castShadow: true,
        },
        hemisphereLight: {
            skyColor: '#00ffff',
            groundColor: '#ff00ff',
            intensity: 0.6,
        },
    },

    // Performance

    // Performance
    performance: {
        enableLOD: true,
        shadowMapSize: 2048,
        maxFPS: 60,
    },

    // Model
    model: {
        defaultPath: '/models/sample-car.glb',
        scale: 1,
        position: [0, 0, 0] as [number, number, number],
    },
} as const;
