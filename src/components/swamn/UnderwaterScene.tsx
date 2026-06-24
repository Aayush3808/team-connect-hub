import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, Suspense } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";

/* ---------- bubbles ---------- */
function Bubbles({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>();
  if (!positions.current) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = Math.random() * 14 - 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    positions.current = arr;
  }
  useFrame((_, dt) => {
    if (!ref.current || !positions.current) return;
    const p = positions.current;
    const boost = 1 + Math.min(Math.abs(scrollState.velocity) / 600, 3);
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] += dt * (0.25 + (i % 5) * 0.09) * boost;
      if (p[i * 3 + 1] > 7) p[i * 3 + 1] = -7;
    }
    (ref.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#cfeeff" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ---------- god rays ---------- */
function GodRays() {
  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (group.current) group.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.1) * 0.18;
  });
  return (
    <group ref={group} position={[0, 5, -3]}>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[(i - 4) * 1.5, 0, 0]} rotation={[0, 0, 0.1]}>
          <coneGeometry args={[0.7, 12, 8, 1, true]} />
          <meshBasicMaterial
            color="#9fd9ff"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- scroll-reactive fog ---------- */
function ScrollFog() {
  useFrame((state) => {
    const p = scrollState.progress;
    const target = new THREE.Color().setHSL(0.58 - p * 0.05, 0.55, 0.18 - p * 0.1);
    state.scene.background = null;
    if (state.scene.fog && (state.scene.fog as THREE.Fog).color) {
      (state.scene.fog as THREE.Fog).color.lerp(target, 0.05);
      (state.scene.fog as THREE.Fog).far = 22 - p * 8;
    }
  });
  return null;
}

export const UnderwaterScene = () => {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Background gradient shifts with scroll (no React state — direct CSS update)
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = scrollState.progress;
      if (wrapRef.current) {
        const topL = 88 - p * 30;
        const midL = 50 - p * 25;
        const botL = 18 - p * 10;
        wrapRef.current.style.background = `linear-gradient(180deg,
          hsl(198 90% ${topL}%) 0%,
          hsl(205 75% ${midL}%) 45%,
          hsl(218 75% ${botL}%) 100%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.3, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0e3a5f", 6, 22]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 8, 4]} intensity={1.0} color="#bae6fd" />
          <ScrollFog />
          <Bubbles />
          <GodRays />
        </Suspense>
      </Canvas>

      {/* readability veil — much lighter so colors and motion show through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0.25) 0%, hsl(var(--background) / 0.45) 40%, hsl(var(--background) / 0.6) 100%)",
        }}
      />
    </div>
  );
};
