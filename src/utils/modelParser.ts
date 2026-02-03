import * as THREE from 'three';

interface ModelPart {
    mesh: THREE.Mesh;
    name: string;
    originalPosition: THREE.Vector3;
    explodeDirection: THREE.Vector3;
}

/**
 * Parse GLTF model and extract individual parts
 */
export function parseModelParts(scene: THREE.Group): ModelPart[] {
    const parts: ModelPart[] = [];

    scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            const part: ModelPart = {
                mesh: object,
                name: object.name || `Part_${parts.length}`,
                originalPosition: object.position.clone(),
                explodeDirection: calculateExplodeDirection(object.position),
            };
            parts.push(part);
        }
    });

    return parts;
}

/**
 * Calculate explosion direction for a mesh based on its position
 */
function calculateExplodeDirection(position: THREE.Vector3): THREE.Vector3 {
    // Direction is away from the center (0, 0, 0)
    const direction = position.clone().normalize();

    // If too close to center, use random direction
    if (direction.length() < 0.01) {
        return new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
    }

    return direction;
}

/**
 * Get part metadata for UI display
 */
export function getPartMetadata(partName: string): { name: string; description: string } {
    // Parse part name to create user-friendly display
    const cleanName = partName
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/\s+/g, ' ');

    // Generate description based on common part naming patterns
    const lowerName = partName.toLowerCase();
    let description = 'Component of the model';

    if (lowerName.includes('wheel') || lowerName.includes('tire')) {
        description = 'Provides traction and supports the vehicle weight';
    } else if (lowerName.includes('engine') || lowerName.includes('motor')) {
        description = 'Power generation unit that drives the vehicle';
    } else if (lowerName.includes('door')) {
        description = 'Provides access to the interior cabin';
    } else if (lowerName.includes('window') || lowerName.includes('glass')) {
        description = 'Transparent panel for visibility and protection';
    } else if (lowerName.includes('body') || lowerName.includes('chassis')) {
        description = 'Main structural framework and exterior shell';
    } else if (lowerName.includes('light') || lowerName.includes('lamp')) {
        description = 'Illumination system for visibility and signaling';
    } else if (lowerName.includes('seat')) {
        description = 'Passenger seating and comfort system';
    } else if (lowerName.includes('exhaust') || lowerName.includes('pipe')) {
        description = 'Exhaust gas routing and emission system';
    } else if (lowerName.includes('bumper')) {
        description = 'Impact protection and aerodynamic element';
    }

    return {
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        description,
    };
}

/**
 * Calculate bounding box for a mesh
 */
export function getMeshBounds(mesh: THREE.Mesh): THREE.Box3 {
    const box = new THREE.Box3().setFromObject(mesh);
    return box;
}
