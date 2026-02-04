import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useAppStore } from '../store/useAppStore';
import { SCENE_CONFIG } from '../config/sceneConfig';

export const Controls: React.FC = () => {
    const { setOrbitControls } = useAppStore();
    const controlsRef = useRef<any>(null);

    // Camera parallax effect - DISABLED to allow full 360 Orbit Control
    // The user wants full manual control ("360 movable"), so we rely entirely on OrbitControls.
    /*
    useFrame(() => {
        if (!gestureEnabled && camera) {
            // Calculate target position based on mouse
            const parallaxStrength = 0.5;
            targetPosition.current.x = mousePosition.current.x * parallaxStrength;
            targetPosition.current.y = mousePosition.current.y * parallaxStrength;
            targetPosition.current.z = camera.position.z;

            // Smoothly lerp camera position for parallax effect
            camera.position.x += (targetPosition.current.x - camera.position.x) * 0.05;
            camera.position.y += (targetPosition.current.y - camera.position.y) * 0.05;
        }
    });
    */

    // Store controls reference in global store
    React.useEffect(() => {
        if (controlsRef.current) {
            setOrbitControls(controlsRef.current);
        }
    }, [setOrbitControls]);

    const handleControlsChange = () => {
        // Controls updated
    };

    // OrbitControls - always render but disable manual control when gestures are active
    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            enabled={true}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={SCENE_CONFIG.camera.minDistance}
            maxDistance={SCENE_CONFIG.camera.maxDistance}
            minPolarAngle={SCENE_CONFIG.camera.minPolarAngle}
            maxPolarAngle={SCENE_CONFIG.camera.maxPolarAngle}
            enableDamping={true}
            dampingFactor={0.06} // Reduced from 0.1 for more fluid "weight"
            rotateSpeed={0.8}    // Slightly reduced for preciseness
            zoomSpeed={1.2}      // Slightly increased for snappier feel
            onChange={handleControlsChange}
        />
    );
};
