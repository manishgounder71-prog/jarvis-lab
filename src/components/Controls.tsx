import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAppStore } from '../store/useAppStore';
import { SCENE_CONFIG } from '../config/sceneConfig';
import * as THREE from 'three';

export const Controls: React.FC = () => {
    const { gestureEnabled } = useAppStore();
    const { camera, size } = useThree();
    const controlsRef = useRef<any>(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const targetPosition = useRef(new THREE.Vector3());

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

    // Track mouse movement for parallax
    React.useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Normalize mouse position to -1 to 1
            mousePosition.current.x = (event.clientX / size.width) * 2 - 1;
            mousePosition.current.y = -(event.clientY / size.height) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [size]);

    // Use OrbitControls for rotation (drag), disable when gestures are active
    return !gestureEnabled ? (
        <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={SCENE_CONFIG.camera.minDistance}
            maxDistance={SCENE_CONFIG.camera.maxDistance}
            minPolarAngle={SCENE_CONFIG.camera.minPolarAngle}
            maxPolarAngle={SCENE_CONFIG.camera.maxPolarAngle}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
        />
    ) : null;
};
