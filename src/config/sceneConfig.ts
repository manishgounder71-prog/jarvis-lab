// Centralized scene configuration
export const SCENE_CONFIG = {
    // Camera settings
    camera: {
        fov: 50,
        position: [5, 3, 8] as [number, number, number],
        near: 0.1,
        far: 1000,
        minDistance: 3,
        maxDistance: 20,
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

    // Explosion settings
    explosion: {
        intensity: 3,
        duration: 1.5,
        ease: 'power2.inOut',
    },

    // Gesture sensitivity
    gestures: {
        zoomSensitivity: 0.01,
        rotateSensitivity: 0.005,
        pinchThreshold: 0.08,
        spreadThreshold: 0.15,
        fistThreshold: 0.5,
        swipeThreshold: 0.02,
        throttleMs: 16, // ~60fps
    },

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
