import { GestureType } from './gestureRecognition';
import { useAppStore } from '../store/useAppStore';
import { clamp } from './performance';

// Camera zoom control
let currentZoom = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

export function applyZoomGesture(distance: number, camera: any): void {
    // Normalize distance to zoom factor
    const zoomDelta = (distance - 0.1) * 2;
    currentZoom = clamp(currentZoom + zoomDelta * 0.01, MIN_ZOOM, MAX_ZOOM);

    if (camera) {
        camera.zoom = currentZoom;
        camera.updateProjectionMatrix();
    }
}

// Model rotation control
let rotationY = 0;

export function applyRotationGesture(velocity: number, modelRef: any): void {
    rotationY += velocity * 5; // Amplify velocity

    if (modelRef && modelRef.current) {
        modelRef.current.rotation.y = rotationY;
    }
}

// Explosion control
export function applyExplodeGesture(): void {
    const { setIsExploded } = useAppStore.getState();
    setIsExploded(true);
}

export function applyAssembleGesture(): void {
    const { setIsExploded } = useAppStore.getState();
    setIsExploded(false);
}

/**
 * Main gesture action dispatcher
 * Maps gesture types to corresponding actions
 */
export function executeGestureAction(
    gestureType: GestureType,
    data: any,
    camera?: any,
    modelRef?: any
): void {
    switch (gestureType) {
        case 'ZOOM_IN':
        case 'ZOOM_OUT':
            if (data?.distance !== undefined && camera) {
                applyZoomGesture(data.distance, camera);
            }
            break;

        case 'ROTATE_LEFT':
        case 'ROTATE_RIGHT':
            if (data?.velocity !== undefined && modelRef) {
                applyRotationGesture(data.velocity, modelRef);
            }
            break;

        case 'EXPLODE':
            applyExplodeGesture();
            break;

        case 'ASSEMBLE':
            applyAssembleGesture();
            break;

        case 'NONE':
        default:
            break;
    }
}

// Reset gesture state
export function resetGestureActions(): void {
    currentZoom = 1;
    rotationY = 0;
}
