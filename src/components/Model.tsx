import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useAppStore } from '../store/useAppStore';
import { parseModelParts, getPartMetadata } from '../utils/modelParser';
import { SCENE_CONFIG } from '../config/sceneConfig';
import { createHologramMaterial } from '../shaders/hologramShader';


export const Model: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    const [hoveredPart, setHoveredPart] = useState<string | null>(null);

    const {
        setSelectedPart,
        setHighlightedPartName,
        setIsLoading,
        setLoadingProgress
    } = useAppStore();

    const { camera, raycaster, pointer } = useThree();

    // Create Iron Man suit model
    useEffect(() => {
        setLoadingProgress(50);

        const model = createIronManSuit();

        if (groupRef.current) {
            groupRef.current.add(model);
            parseModelParts(model);

            setLoadingProgress(100);
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }, [setIsLoading, setLoadingProgress]);

    // Subtle idle motion for depth illusion
    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating motion
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            
            // Subtle rotation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
            
            // Update hologram shader time uniforms
            groupRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
                    child.material.uniforms.time.value = state.clock.elapsedTime;
                }
            });
        }
    });


    // Handle part highlighting on hover
    useFrame(() => {
        if (!groupRef.current) return;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(groupRef.current.children, true);

        if (intersects.length > 0) {
            const intersected = intersects[0].object as THREE.Mesh;
            if (intersected.isMesh) {
                const partName = intersected.name;

                if (hoveredPart !== partName) {
                    setHoveredPart(partName);
                    setHighlightedPartName(partName);

                    // Highlight effect - increase glow
                    if (intersected.material instanceof THREE.ShaderMaterial) {
                        gsap.to(intersected.material.uniforms.glowIntensity, {
                            value: 3.5,
                            duration: 0.2,
                        });
                    }
                }
            }
        } else if (hoveredPart) {
            // Remove highlight
            const previouslyHovered = groupRef.current.getObjectByName(hoveredPart) as THREE.Mesh;
            if (previouslyHovered && previouslyHovered.material instanceof THREE.ShaderMaterial) {
                gsap.to(previouslyHovered.material.uniforms.glowIntensity, {
                    value: 2.0,
                    duration: 0.2,
                });
            }
            setHoveredPart(null);
            setHighlightedPartName(null);
        }
    });

    // Handle part selection on click
    const handleClick = (event: any) => {
        event.stopPropagation();

        if (hoveredPart) {
            const metadata = getPartMetadata(hoveredPart);
            setSelectedPart(metadata);
        } else {
            setSelectedPart(null);
        }
    };

    return (
        <group
            ref={groupRef}
            onClick={handleClick}
            position={SCENE_CONFIG.model.position}
            scale={SCENE_CONFIG.model.scale}
        />
    );
};

/**
 * Create Iron Man suit with holographic shader materials
 */
function createIronManSuit(): THREE.Group {
    const group = new THREE.Group();

    // Helmet/Head
    const helmetGeo = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const helmetMat = createHologramMaterial(0x00ffff, { glowIntensity: 2.5 });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.name = 'Helmet';
    helmet.position.y = 2.2;
    group.add(helmet);

    // Faceplate
    const faceplateGeo = new THREE.BoxGeometry(0.4, 0.3, 0.1);
    const faceplateMat = createHologramMaterial(0xffaa00, { glowIntensity: 3.0 });
    const faceplate = new THREE.Mesh(faceplateGeo, faceplateMat);
    faceplate.name = 'Faceplate';
    faceplate.position.set(0, 2.2, 0.45);
    group.add(faceplate);

    // Torso/Chest
    const chestGeo = new THREE.BoxGeometry(1.2, 1.5, 0.6);
    const chestMat = createHologramMaterial(0x00ccff, { glowIntensity: 2.0 });
    const chest = new THREE.Mesh(chestGeo, chestMat);
    chest.name = 'Chest_Arc_Reactor';
    chest.position.y = 1.0;
    group.add(chest);

    // Arc Reactor (glowing core)
    const arcGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const arcMat = createHologramMaterial(0x00ffff, { 
        glowIntensity: 4.0, 
        opacity: 0.9,
        flickerSpeed: 5.0
    });
    const arc = new THREE.Mesh(arcGeo, arcMat);
    arc.name = 'Arc_Reactor';
    arc.position.set(0, 1.2, 0.35);
    arc.rotation.x = Math.PI / 2;
    group.add(arc);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.15, 0.12, 1.2, 16);
    const armMat = createHologramMaterial(0x0099ff, { glowIntensity: 1.8 });
    
    // Left arm
    const leftArm = new THREE.Mesh(armGeo, armMat.clone());
    leftArm.name = 'Arm_Left';
    leftArm.position.set(-0.7, 0.8, 0);
    leftArm.rotation.z = Math.PI / 6;
    group.add(leftArm);

    // Right arm
    const rightArm = new THREE.Mesh(armGeo, armMat.clone());
    rightArm.name = 'Arm_Right';
    rightArm.position.set(0.7, 0.8, 0);
    rightArm.rotation.z = -Math.PI / 6;
    group.add(rightArm);

    // Repulsor hands
    const repulsorGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const repulsorMat = createHologramMaterial(0xffff00, { 
        glowIntensity: 3.5,
        flickerSpeed: 4.0
    });
    
    const leftRepulsor = new THREE.Mesh(repulsorGeo, repulsorMat.clone());
    leftRepulsor.name = 'Repulsor_Left';
    leftRepulsor.position.set(-1.0, 0.2, 0);
    group.add(leftRepulsor);

    const rightRepulsor = new THREE.Mesh(repulsorGeo, repulsorMat.clone());
    rightRepulsor.name = 'Repulsor_Right';
    rightRepulsor.position.set(1.0, 0.2, 0);
    group.add(rightRepulsor);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.8, 16);
    const legMat = createHologramMaterial(0x0088ff, { glowIntensity: 1.7 });
    
    const leftLeg = new THREE.Mesh(legGeo, legMat.clone());
    leftLeg.name = 'Leg_Left';
    leftLeg.position.set(-0.3, -0.6, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat.clone());
    rightLeg.name = 'Leg_Right';
    rightLeg.position.set(0.3, -0.6, 0);
    group.add(rightLeg);

    // Boots/Jets
    const bootGeo = new THREE.BoxGeometry(0.3, 0.4, 0.4);
    const bootMat = createHologramMaterial(0xff6600, { 
        glowIntensity: 2.8,
        flickerSpeed: 6.0
    });
    
    const leftBoot = new THREE.Mesh(bootGeo, bootMat.clone());
    leftBoot.name = 'Boot_Left_Jets';
    leftBoot.position.set(-0.3, -1.6, 0);
    group.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, bootMat.clone());
    rightBoot.name = 'Boot_Right_Jets';
    rightBoot.position.set(0.3, -1.6, 0);
    group.add(rightBoot);

    // Shoulder pads
    const shoulderGeo = new THREE.BoxGeometry(0.3, 0.3, 0.5);
    const shoulderMat = createHologramMaterial(0x00aaff, { glowIntensity: 2.2 });
    
    const leftShoulder = new THREE.Mesh(shoulderGeo, shoulderMat.clone());
    leftShoulder.name = 'Shoulder_Left';
    leftShoulder.position.set(-0.75, 1.6, 0);
    group.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(shoulderGeo, shoulderMat.clone());
    rightShoulder.name = 'Shoulder_Right';
    rightShoulder.position.set(0.75, 1.6, 0);
    group.add(rightShoulder);

    return group;
}
