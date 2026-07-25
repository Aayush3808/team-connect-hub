import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Animated ocean surface using a custom vertex shader for waves
 * and a fresnel-tinted fragment shader for a deep, glossy look.
 */
export function Ocean() {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color("#020b1a") },
      uShallow: { value: new THREE.Color("#0a4a7a") },
      uCrest: { value: new THREE.Color("#3ec5ff") },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
      <planeGeometry args={[80, 80, 220, 220]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        vertexShader={/* glsl */ `
          uniform float uTime;
          varying float vElev;
          varying vec2 vUv;
          varying vec3 vNormal;

          float wave(vec2 p, vec2 dir, float freq, float speed, float amp) {
            return sin(dot(p, dir) * freq + uTime * speed) * amp;
          }

          void main() {
            vUv = uv;
            vec3 pos = position;
            float e = 0.0;
            e += wave(pos.xy, vec2(1.0, 0.3), 0.8, 1.1, 0.18);
            e += wave(pos.xy, vec2(-0.4, 0.9), 1.3, 1.6, 0.11);
            e += wave(pos.xy, vec2(0.7, -0.5), 2.2, 2.3, 0.06);
            e += wave(pos.xy, vec2(0.2, 1.0), 3.4, 2.9, 0.035);
            pos.z += e;
            vElev = e;
            vNormal = normalize(vec3(-e * 0.6, 1.0, -e * 0.6));
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uDeep;
          uniform vec3 uShallow;
          uniform vec3 uCrest;
          varying float vElev;
          varying vec2 vUv;
          varying vec3 vNormal;

          void main() {
            float t = smoothstep(-0.2, 0.35, vElev);
            vec3 base = mix(uDeep, uShallow, t);
            float crest = smoothstep(0.18, 0.35, vElev);
            base = mix(base, uCrest, crest * 0.6);

            // vignette to horizon
            float d = distance(vUv, vec2(0.5));
            float fade = smoothstep(0.55, 0.2, d);

            gl_FragColor = vec4(base, mix(0.55, 0.95, fade));
          }
        `}
      />
    </mesh>
  );
}
