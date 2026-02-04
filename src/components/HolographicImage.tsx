import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';

interface HolographicImageProps {
    imageUrl: string;
    rotation?: [number, number, number];
}

export const HolographicImage: React.FC<HolographicImageProps> = ({ imageUrl, rotation }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
    
    const { setIsLoading, setLoadingProgress } = useAppStore();
    const { viewport } = useThree();

    // Detect if this is a video file
    const isVideo = imageUrl.endsWith('.webm') || imageUrl.endsWith('.mp4');

    // Load texture based on file type
    React.useEffect(() => {
        if (isVideo) {
            // Create video element
            const video = document.createElement('video');
            video.src = imageUrl;
            video.crossOrigin = 'anonymous';
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.autoplay = true;

            videoRef.current = video;

            // Create video texture
            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.format = THREE.RGBAFormat;
            videoTexture.needsUpdate = true;

            // Play video
            video.play().catch(err => console.error('Video play error:', err));

            setTexture(videoTexture);
            setLoadingProgress(100);
            setTimeout(() => setIsLoading(false), 500);

            return () => {
                video.pause();
                video.src = '';
                videoRef.current = null;
            };
        } else {
            // Load as image
            const loader = new THREE.TextureLoader();
            loader.load(
                imageUrl,
                (loadedTexture) => {
                    loadedTexture.anisotropy = 16;
                    loadedTexture.magFilter = THREE.LinearFilter;
                    loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
                    loadedTexture.generateMipmaps = true;
                    loadedTexture.needsUpdate = true;
                    setTexture(loadedTexture);
                    setLoadingProgress(100);
                    setTimeout(() => setIsLoading(false), 500);
                },
                undefined,
                (error) => console.error('Image load error:', error)
            );
        }
    }, [imageUrl, isVideo, setIsLoading, setLoadingProgress]);

    // Calculate responsive scale (maintain aspect ratio but fit screen)
    const responsiveScale = React.useMemo(() => {
        const targetWidth = viewport.width * 0.4;
        let imageAspect = 16 / 9;
        
        if (texture) {
            if (isVideo && videoRef.current) {
                imageAspect = videoRef.current.videoWidth / videoRef.current.videoHeight || 16 / 9;
            } else if (texture.image) {
                imageAspect = texture.image.width / texture.image.height;
            }
        }
        
        return [targetWidth, targetWidth / imageAspect, 1] as [number, number, number];
    }, [viewport, texture, isVideo]);

    useFrame((state) => {
        if (meshRef.current) {
            // Apply base rotation if provided
            const baseRotX = rotation ? rotation[0] : 0;
            const baseRotY = rotation ? rotation[1] : 0;
            const baseRotZ = rotation ? rotation[2] : 0;
            
            // Smoothly interpolate to the new rotation target
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, baseRotX, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, baseRotY, 0.1);
            meshRef.current.rotation.z = baseRotZ;

            // Update shader time
            if (meshRef.current.material instanceof THREE.ShaderMaterial) {
                meshRef.current.material.uniforms.time.value = state.clock.elapsedTime;
            }
        }
    });

    if (!texture) return null;

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} scale={responsiveScale}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
                map={texture} 
                transparent={true} 
                opacity={1.0}
                side={THREE.DoubleSide} 
                depthWrite={true}
                toneMapped={false}
                blending={THREE.NormalBlending}
            />
        </mesh>
    );
};
