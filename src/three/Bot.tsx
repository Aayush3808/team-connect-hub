import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Stylized SWAMN Autonomous Surface Bot (ASB) built from primitives.
 * Twin catamaran hull, solar deck, camera mast, mesh collection net.
 * Placeholder until AI-generated GLB is wired in.
 */
export function Bot({ scale = 1 }: { scale?: number }) {
  const group = useRef<THREE.Group>(null);
  const propL = useRef<THREE.Mesh>(null);
  const propR = useRef<THREE.Mesh>(null);
  const beacon = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = Math.sin(t * 0.6) * 0.04;
      group.current.rotation.x = Math.cos(t * 0.5) * 0.03;
    }
    if (propL.current) propL.current.rotation.x = t * 8;
    if (propR.current) propR.current.rotation.x = t * 8;
    if (beacon.current) beacon.current.intensity = 1.4 + Math.sin(t * 3) * 0.6;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <group ref={group} scale={scale} position={[0, 0.15, 0]}>
        {/* Left hull */}
        <mesh position={[-0.55, 0, 0]} castShadow>
          <capsuleGeometry args={[0.22, 1.6, 8, 16]} />
          <meshStandardMaterial color="#e8f4ff" metalness={0.35} roughness={0.35} />
        </mesh>
        {/* Right hull */}
        <mesh position={[0.55, 0, 0]} castShadow>
          <capsuleGeometry args={[0.22, 1.6, 8, 16]} />
          <meshStandardMaterial color="#e8f4ff" metalness={0.35} roughness={0.35} />
        </mesh>
        {/* Hull orientation fix */}
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh position={[0, -0.55, 0]} castShadow visible={false}>
            <capsuleGeometry args={[0.22, 1.6, 8, 16]} />
          </mesh>
        </group>

        {/* Deck platform */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[1.5, 0.08, 1.8]} />
          <meshStandardMaterial color="#0a2540" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Solar panel */}
        <mesh position={[0, 0.34, 0]} castShadow>
          <boxGeometry args={[1.3, 0.03, 1.55]} />
          <meshStandardMaterial
            color="#0b2a4a"
            emissive="#1a4d7a"
            emissiveIntensity={0.15}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
        {/* Panel cell grid lines */}
        {[-0.5, -0.25, 0, 0.25, 0.5].map((x) => (
          <mesh key={`gx${x}`} position={[x, 0.36, 0]}>
            <boxGeometry args={[0.008, 0.005, 1.55]} />
            <meshBasicMaterial color="#3aa8ff" />
          </mesh>
        ))}
        {[-0.7, -0.35, 0, 0.35, 0.7].map((z) => (
          <mesh key={`gz${z}`} position={[0, 0.36, z]}>
            <boxGeometry args={[1.3, 0.005, 0.008]} />
            <meshBasicMaterial color="#3aa8ff" />
          </mesh>
        ))}

        {/* Camera mast */}
        <mesh position={[0, 0.65, -0.4]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Camera housing */}
        <mesh position={[0, 1.0, -0.4]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.14]} />
          <meshStandardMaterial color="#0a2540" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Camera lens */}
        <mesh position={[0, 1.0, -0.32]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.05, 24]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={1.4}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>

        {/* Beacon */}
        <mesh position={[0, 1.15, -0.4]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ff3860" />
        </mesh>
        <pointLight ref={beacon} position={[0, 1.15, -0.4]} color="#ff3860" intensity={1.4} distance={2} />

        {/* Aqua running lights along deck */}
        {[-0.6, 0, 0.6].map((x) => (
          <mesh key={`rl${x}`} position={[x, 0.33, 0.85]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
        ))}
        <pointLight position={[0, 0.35, 0.9]} color="#00e5ff" intensity={2} distance={2.5} />
        <pointLight position={[0, 0.35, -0.9]} color="#00e5ff" intensity={1.2} distance={2} />

        {/* Collection net frame (front) */}
        <group position={[0, 0, 1.15]}>
          <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
            <meshStandardMaterial color="#0a2540" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
            <meshStandardMaterial color="#0a2540" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Net mesh (translucent) */}
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[1.1, 0.35, 0.02]} />
            <meshStandardMaterial
              color="#00e5ff"
              transparent
              opacity={0.25}
              metalness={0.2}
              roughness={0.7}
              wireframe
            />
          </mesh>
        </group>

        {/* Propellers */}
        <mesh ref={propL} position={[-0.55, -0.05, -0.85]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.09, 0.015, 8, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh ref={propR} position={[0.55, -0.05, -0.85]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.09, 0.015, 8, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* SWAMN wordmark strip on deck side */}
        <mesh position={[0, 0.29, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.51, 0.02, 0.05]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}
