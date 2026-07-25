import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Floating plastic-debris particles that drift on the water surface.
 * Instanced for performance.
 */
export function Debris({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 40,
        speed: 0.1 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        scale: 0.05 + Math.random() * 0.12,
      })),
    [count]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    seeds.forEach((s, i) => {
      const bob = Math.sin(t * s.speed * 2 + s.offset) * 0.08;
      dummy.position.set(s.x + Math.sin(t * s.speed + s.offset) * 0.4, bob, s.z + Math.cos(t * s.speed) * 0.3);
      dummy.rotation.set(t * s.speed, s.offset, t * s.speed * 0.5);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[1, 0.3, 0.6]} />
      <meshStandardMaterial color="#dbeafe" metalness={0.2} roughness={0.6} transparent opacity={0.85} />
    </instancedMesh>
  );
}
