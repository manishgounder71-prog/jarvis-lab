import React, { useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createHologramMaterial } from '../shaders/hologramShader';
import { useAppStore } from '../store/useAppStore';

interface HolographicImageProps {
    imageUrl: string;
    rotation?: [number, number, number];
}

export const HolographicImage: React.FC<HolographicImageProps> = ({ imageUrl, rotation }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const texture = useLoader(THREE.TextureLoader, imageUrl);
    
    // 4K ENHANCEMENT: Configure texture for maximum sharpness
    React.useLayoutEffect(() => {
        if (texture) {
            texture.anisotropy = 16; // Maximum sharpness for angled views
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.generateMipmaps = true;
            texture.needsUpdate = true;
        }
    }, [texture]);

    const { setIsLoading, setLoadingProgress } = useAppStore();
    const { viewport } = useThree();

    // Calculate responsive scale (maintain aspect ratio but fit screen)
    const responsiveScale = React.useMemo(() => {
        const targetWidth = viewport.width * 0.4; // Occupy 40% of screen width (Smaller for clarity)
        const imageAspect = (texture && texture.image) ? texture.image.width / texture.image.height : 16 / 9;
        return [targetWidth, targetWidth / imageAspect, 1] as [number, number, number];
    }, [viewport, texture]);

    React.useEffect(() => {
        setLoadingProgress(100);
        setTimeout(() => setIsLoading(false), 500);
    }, [setIsLoading, setLoadingProgress]);

    useFrame((state) => {
        if (meshRef.current) {
            // Interactive/Idle Rotation
            // Apply base rotation if provided
            const baseRotX = rotation ? rotation[0] : 0;
            const baseRotY = rotation ? rotation[1] : 0;
            const baseRotZ = rotation ? rotation[2] : 0;
            
            
            // We removed the 'mouse' driven rotation here because we now use
            // ORBIT CONTROLS for full 360 camera movement around the object.
            
            // Smoothly interpolate to the new rotation target (just the base rotation)
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, baseRotX, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, baseRotY, 0.1);
            meshRef.current.rotation.z = baseRotZ;

            // Update shader time
            if (meshRef.current.material instanceof THREE.ShaderMaterial) {
                meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
            }
        }
    });

    // SIMPLIFIED MATERIAL FOR GUARANTEED VISIBILITY
    // ToneMapped=false makes it ignore scene lighting exposure, keeping it 100% bright.
    
    return (
        <mesh ref={meshRef} position={[0, 0, 0]} scale={responsiveScale}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
                map={texture} 
                transparent={true} 
                opacity={1.0} // Fully Visible
                side={THREE.DoubleSide} 
                depthWrite={true} // Enable depth write for solid look
                toneMapped={false} // Max Brightness/Color Accuracy
                blending={THREE.NormalBlending} // "Normal" image rendering (No hologram add) 
            />
        </mesh>
    );
};
