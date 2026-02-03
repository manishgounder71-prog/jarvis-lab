import { NormalizedLandmarkList } from '@mediapipe/hands';
import { SCENE_CONFIG } from '../config/sceneConfig';

export type GestureType =
    | 'ZOOM_IN'      // Two fingers spread
    | 'ZOOM_OUT'     // Two fingers pinch
    | 'EXPLODE'      // Open fist
    | 'ASSEMBLE'     // Closed fist
    | 'ROTATE_LEFT'  // Swipe left
    | 'ROTATE_RIGHT' // Swipe right
    | 'NONE';

export interface GestureResult {
    type: GestureType;
    confidence: number;
    data?: any;
}

// Calculate distance between two landmarks
function distance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Check if finger is extended
function isFingerExtended(
    landmarks: NormalizedLandmarkList,
    fingerTipIndex: number,
    fingerPipIndex: number
): boolean {
    const tip = landmarks[fingerTipIndex];
    const pip = landmarks[fingerPipIndex];
    return tip.y < pip.y; // Tip is above PIP joint
}

// Recognize two-finger pinch/spread gesture
function recognizeTwoFingerGesture(landmarks: NormalizedLandmarkList): GestureResult {
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const thumbTip = landmarks[4];

    // Check if index and middle fingers are extended
    const indexExtended = isFingerExtended(landmarks, 8, 6);
    const middleExtended = isFingerExtended(landmarks, 12, 10);

    if (!indexExtended || !middleExtended) {
        return { type: 'NONE', confidence: 0 };
    }

    const fingerDistance = distance(indexTip, middleTip);

    if (fingerDistance > SCENE_CONFIG.gestures.spreadThreshold) {
        return { type: 'ZOOM_IN', confidence: 0.8, data: { distance: fingerDistance } };
    } else if (fingerDistance < SCENE_CONFIG.gestures.pinchThreshold) {
        return { type: 'ZOOM_OUT', confidence: 0.8, data: { distance: fingerDistance } };
    }

    return { type: 'NONE', confidence: 0 };
}

// Recognize open fist gesture (all fingers extended)
function recognizeOpenFist(landmarks: NormalizedLandmarkList): GestureResult {
    const fingersExtended = [
        isFingerExtended(landmarks, 8, 6),   // Index
        isFingerExtended(landmarks, 12, 10), // Middle
        isFingerExtended(landmarks, 16, 14), // Ring
        isFingerExtended(landmarks, 20, 18), // Pinky
    ];

    const allExtended = fingersExtended.every(extended => extended);

    if (allExtended) {
        return { type: 'EXPLODE', confidence: 0.9 };
    }

    return { type: 'NONE', confidence: 0 };
}

// Recognize closed fist gesture (all fingers curled)
function recognizeClosedFist(landmarks: NormalizedLandmarkList): GestureResult {
    const wrist = landmarks[0];
    const fingertips = [
        landmarks[8],  // Index
        landmarks[12], // Middle
        landmarks[16], // Ring
        landmarks[20], // Pinky
    ];

    // All fingertips should be close to wrist
    const avgDistance = fingertips.reduce((sum, tip) => sum + distance(tip, wrist), 0) / fingertips.length;

    if (avgDistance < SCENE_CONFIG.gestures.fistThreshold) {
        return { type: 'ASSEMBLE', confidence: 0.9 };
    }

    return { type: 'NONE', confidence: 0 };
}

// Track hand movement for swipe detection
let previousWristX: number | null = null;
let swipeVelocity = 0;

function recognizeSwipe(landmarks: NormalizedLandmarkList): GestureResult {
    const wrist = landmarks[0];

    if (previousWristX !== null) {
        const deltaX = wrist.x - previousWristX;
        swipeVelocity = deltaX;

        if (Math.abs(deltaX) > SCENE_CONFIG.gestures.swipeThreshold) {
            previousWristX = wrist.x;

            if (deltaX > 0) {
                return { type: 'ROTATE_RIGHT', confidence: 0.7, data: { velocity: deltaX } };
            } else {
                return { type: 'ROTATE_LEFT', confidence: 0.7, data: { velocity: deltaX } };
            }
        }
    }

    previousWristX = wrist.x;
    return { type: 'NONE', confidence: 0 };
}

/**
 * Main gesture recognition function
 * Analyzes hand landmarks and returns detected gesture
 */
export function recognizeGesture(landmarks: NormalizedLandmarkList): GestureResult {
    if (!landmarks || landmarks.length < 21) {
        return { type: 'NONE', confidence: 0 };
    }

    // Priority order: closed fist > open fist > two-finger gestures > swipe

    // Check for closed fist (assemble)
    const closedFist = recognizeClosedFist(landmarks);
    if (closedFist.type !== 'NONE') {
        return closedFist;
    }

    // Check for open fist (explode)
    const openFist = recognizeOpenFist(landmarks);
    if (openFist.type !== 'NONE') {
        return openFist;
    }

    // Check for two-finger gestures (zoom)
    const twoFinger = recognizeTwoFingerGesture(landmarks);
    if (twoFinger.type !== 'NONE') {
        return twoFinger;
    }

    // Check for swipe (rotate)
    const swipe = recognizeSwipe(landmarks);
    if (swipe.type !== 'NONE') {
        return swipe;
    }

    return { type: 'NONE', confidence: 0 };
}

// Reset gesture tracking state
export function resetGestureTracking(): void {
    previousWristX = null;
    swipeVelocity = 0;
}
