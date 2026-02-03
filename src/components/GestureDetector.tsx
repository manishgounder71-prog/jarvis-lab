import React, { useRef, useEffect, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { useAppStore } from '../store/useAppStore';
import { recognizeGesture, GestureType } from '../utils/gestureRecognition';
import { executeGestureAction } from '../utils/gestureActions';
import { throttle } from '../utils/performance';
import { SCENE_CONFIG } from '../config/sceneConfig';
import './GestureDetector.css';

export const GestureDetector: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [currentGesture, setCurrentGesture] = useState<GestureType>('NONE');
    const [error, setError] = useState<string | null>(null);

    const { gestureEnabled } = useAppStore();
    const handsRef = useRef<Hands | null>(null);
    const cameraRef = useRef<Camera | null>(null);

    useEffect(() => {
        if (!gestureEnabled) {
            // Clean up when gesture is disabled
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
            setIsActive(false);
            return;
        }

        // Initialize MediaPipe Hands
        const initializeGestureDetection = async () => {
            try {
                if (!videoRef.current || !canvasRef.current) return;

                // Create MediaPipe Hands instance
                const hands = new Hands({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                    },
                });

                hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.7,
                    minTrackingConfidence: 0.7,
                });

                // Throttled gesture processing
                const processGesture = throttle((results: Results) => {
                    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                        const landmarks = results.multiHandLandmarks[0];
                        const gesture = recognizeGesture(landmarks);

                        if (gesture.type !== 'NONE') {
                            setCurrentGesture(gesture.type);
                            executeGestureAction(gesture.type, gesture.data);

                            // Reset after a short delay
                            setTimeout(() => setCurrentGesture('NONE'), 1000);
                        }
                    }

                    // Draw hand landmarks on canvas
                    if (canvasRef.current) {
                        const ctx = canvasRef.current.getContext('2d');
                        if (ctx && results.image) {
                            ctx.save();
                            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                            ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

                            if (results.multiHandLandmarks) {
                                for (const landmarks of results.multiHandLandmarks) {
                                    drawLandmarks(ctx, landmarks);
                                }
                            }
                            ctx.restore();
                        }
                    }
                }, SCENE_CONFIG.gestures.throttleMs);

                hands.onResults(processGesture);
                handsRef.current = hands;

                // Initialize camera
                const camera = new Camera(videoRef.current, {
                    onFrame: async () => {
                        if (videoRef.current && handsRef.current) {
                            await handsRef.current.send({ image: videoRef.current });
                        }
                    },
                    width: 640,
                    height: 480,
                });

                await camera.start();
                cameraRef.current = camera;
                setIsActive(true);
                setError(null);

            } catch (err) {
                console.error('Gesture detection initialization failed:', err);
                setError('Failed to initialize webcam. Please check permissions.');
                setIsActive(false);
            }
        };

        initializeGestureDetection();

        // Cleanup
        return () => {
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
        };
    }, [gestureEnabled]);

    if (!gestureEnabled) {
        return null;
    }

    return (
        <div className="gesture-detector">
            <video
                ref={videoRef}
                className="gesture-video"
                playsInline
                style={{ display: 'none' }}
            />
            <canvas
                ref={canvasRef}
                className="gesture-canvas"
                width={320}
                height={240}
            />

            {isActive && (
                <div className="gesture-status glass">
                    <div className="status-indicator active"></div>
                    <span>Gesture Detection Active</span>
                </div>
            )}

            {currentGesture !== 'NONE' && (
                <div className="gesture-feedback glass">
                    {getGestureEmoji(currentGesture)} {currentGesture.replace(/_/g, ' ')}
                </div>
            )}

            {error && (
                <div className="gesture-error glass">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
};

/**
 * Draw hand landmarks on canvas
 */
function drawLandmarks(ctx: CanvasRenderingContext2D, landmarks: any[]): void {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // Draw connections
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
        [0, 5], [5, 6], [6, 7], [7, 8], // Index
        [0, 9], [9, 10], [10, 11], [11, 12], // Middle
        [0, 13], [13, 14], [14, 15], [15, 16], // Ring
        [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
        [5, 9], [9, 13], [13, 17], // Palm
    ];

    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
        const startPoint = landmarks[start];
        const endPoint = landmarks[end];

        ctx.beginPath();
        ctx.moveTo(startPoint.x * canvasWidth, startPoint.y * canvasHeight);
        ctx.lineTo(endPoint.x * canvasWidth, endPoint.y * canvasHeight);
        ctx.stroke();
    });

    // Draw landmarks
    ctx.fillStyle = '#ff00ff';
    landmarks.forEach((landmark) => {
        ctx.beginPath();
        ctx.arc(
            landmark.x * canvasWidth,
            landmark.y * canvasHeight,
            5,
            0,
            2 * Math.PI
        );
        ctx.fill();
    });
}

/**
 * Get emoji for gesture type
 */
function getGestureEmoji(gesture: GestureType): string {
    switch (gesture) {
        case 'ZOOM_IN': return '🔍+';
        case 'ZOOM_OUT': return '🔍-';
        case 'EXPLODE': return '💥';
        case 'ASSEMBLE': return '🔄';
        case 'ROTATE_LEFT': return '↶';
        case 'ROTATE_RIGHT': return '↷';
        default: return '✋';
    }
}
