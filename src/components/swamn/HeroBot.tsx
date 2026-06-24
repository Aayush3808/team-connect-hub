import { Canvas, useFrame } from "@react-three/fiber";
// useFrame is used inside PointerRig
import { Environment, ContactShadows, Float } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { SwamnBot } from "./SwamnBot";
import { scrollState } from "@/lib/scroll";

/** Cursor parallax — tilts the bot toward the pointer for a premium feel. */
function PointerRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current.x = nx;
      target.current.y = ny;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, target.current.x * 0.35, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -target.current.y * 0.2, 0.06);
  });
  return <group ref={group}>{children}</group>;
}

/** Drifting bubbles inside the showcase canvas. */
function Bubbles({ count = 90 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>();
  if (!positions.current) {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 9;
      a[i * 3 + 1] = Math.random() * 7 - 3.5;
      a[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    positions.current = a;
  }
  useFrame((_, dt) => {
    if (!ref.current || !positions.current) return;
    const p = positions.current;
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] += dt * (0.25 + (i % 5) * 0.07);
      if (p[i * 3 + 1] > 4) p[i * 3 + 1] = -4;
    }
    (ref.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#cfeeff" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export const HeroBot = ({ className = "" }: { className?: string }) => {
  const velRef = useRef(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      velRef.current = scrollState.velocity;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{
        background:
          "radial-gradient(120% 80% at 50% 20%, hsl(198 85% 78%) 0%, hsl(205 70% 50%) 45%, hsl(215 70% 16%) 100%)",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [3.4, 1.4, 4.6], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#06122a"]} />
          <fog attach="fog" args={["#0c2647", 6, 16]} />

          <ambientLight intensity={0.45} />
          <directionalLight
            position={[5, 7, 4]}
            intensity={1.6}
            color="#cfe8ff"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-4, -2, 3]} intensity={1.1} color="#22d3ee" />
          <pointLight position={[3, -3, -3]} intensity={0.6} color="#0ea5e9" />

          <Environment preset="city" />

          <PointerRig>
            <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
              <SwamnBot velocityRef={velRef} idleSpin={0.25} />
            </Float>
          </PointerRig>

          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.45}
            scale={8}
            blur={2.6}
            far={3}
            color="#020617"
          />

          <Bubbles />
        </Suspense>
      </Canvas>

      {/* surface caustic gradient veil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, hsl(198 90% 90% / 0.35) 0%, transparent 60%), linear-gradient(180deg, transparent 60%, hsl(215 70% 10% / 0.35) 100%)",
        }}
      />
    </div>
  );
};
