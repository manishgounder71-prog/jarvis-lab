import * as THREE from 'three';

/**
 * Custom Holographic Shader for Iron Man-style interface
 * Creates the illusion of floating 3D objects with:
 * - Fresnel rim lighting (glowing edges)
 * - Animated scan lines
 * - Transparency with flickering
 * - Chromatic color shifting
 */

export const HologramMaterial = {
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        varying vec2 vUv;
        varying vec3 vViewPosition;
        
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
            
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float fresnelPower;
        uniform float scanlineSpeed;
        uniform float scanlineWidth;
        uniform float opacity;
        uniform float glowIntensity;
        uniform float flickerSpeed;
        uniform float flickerAmount;
        
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        varying vec2 vUv;
        varying vec3 vViewPosition;
        
        // Noise function for holographic interference
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
            // Fresnel effect - makes edges glow
            vec3 viewDirection = normalize(vViewPosition);
            float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), fresnelPower);
            
            // Animated scan lines
            float scanline = sin(vUv.y * 100.0 + time * scanlineSpeed) * 0.5 + 0.5;
            scanline = smoothstep(0.3, 0.7, scanline);
            
            // Horizontal sweep effect
            float sweep = fract(vUv.y + time * 0.2);
            sweep = smoothstep(0.0, scanlineWidth, sweep) * smoothstep(1.0, 1.0 - scanlineWidth, sweep);
            
            // Holographic flicker
            float flicker = sin(time * flickerSpeed) * 0.5 + 0.5;
            flicker = mix(1.0 - flickerAmount, 1.0, flicker);
            
            // Noise-based interference
            float noise = random(vUv + time * 0.1) * 0.1;
            
            // Combine effects
            vec3 glowColor = color * (fresnel * glowIntensity + 0.3);
            glowColor += color * sweep * 0.5;
            glowColor += color * scanline * 0.2;
            
            // Final opacity with flicker and noise
            float finalOpacity = opacity * flicker * (1.0 - noise);
            finalOpacity = mix(finalOpacity, finalOpacity * fresnel, 0.5);
            
            gl_FragColor = vec4(glowColor, finalOpacity);
        }
    `,
    
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00ffff) }, // Cyan default
        fresnelPower: { value: 3.0 },
        scanlineSpeed: { value: 2.0 },
        scanlineWidth: { value: 0.1 },
        opacity: { value: 0.6 },
        glowIntensity: { value: 2.0 },
        flickerSpeed: { value: 3.0 },
        flickerAmount: { value: 0.05 }
    }
};

/**
 * Create a holographic shader material instance
 */
export function createHologramMaterial(colorHex: number = 0x00ffff, options: any = {}) {
    return new THREE.ShaderMaterial({
        vertexShader: HologramMaterial.vertexShader,
        fragmentShader: HologramMaterial.fragmentShader,
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(colorHex) },
            fresnelPower: { value: options.fresnelPower || 3.0 },
            scanlineSpeed: { value: options.scanlineSpeed || 2.0 },
            scanlineWidth: { value: options.scanlineWidth || 0.1 },
            opacity: { value: options.opacity || 0.6 },
            glowIntensity: { value: options.glowIntensity || 2.0 },
            flickerSpeed: { value: options.flickerSpeed || 3.0 },
            flickerAmount: { value: options.flickerAmount || 0.05 }
        },
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
}
