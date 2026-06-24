import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useEffect, useRef, useState, Suspense } from "react";
import * as THREE from "three";

/* ---------- scroll progress (0..1) ---------- */
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setP(h > 0 ? window.scrollY / h : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}

/* ---------- procedural SWAMN bot ---------- */
function Bot({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const leftProp = useRef<THREE.Mesh>(null);
  const rightProp = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = scroll.current;
    if (group.current) {
      // path across the river as you scroll
      const x = THREE.MathUtils.lerp(-3.2, 3.2, s) + Math.sin(t * 0.6) * 0.15;
      const y = Math.sin(t * 0.9) * 0.18 + Math.sin(s * Math.PI) * 0.4;
      const z = THREE.MathUtils.lerp(0, -1.5, s);
      group.current.position.set(x, y, z);
      group.current.rotation.y = Math.sin(t * 0.4) * 0.18 + s * Math.PI * 0.4;
      group.current.rotation.z = Math.sin(t * 0.7) * 0.06;
    }
    if (leftProp.current) leftProp.current.rotation.x = t * 12;
    if (rightProp.current) rightProp.current.rotation.x = -t * 12;
  });

  return (
    <group ref={group}>
      {/* main hull */}
      <mesh castShadow>
        <capsuleGeometry args={[0.42, 1.1, 12, 24]} />
        <meshStandardMaterial
          color="#dfe9ef"
          metalness={0.85}
          roughness={0.22}
          envMapIntensity={1.1}
        />
      </mesh>
      {/* aqua accent band */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.43, 0.04, 12, 48]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.4}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      {/* glowing eye */}
      <mesh position={[0, 0.05, 0.78]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      {/* side pontoons */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, -0.05, 0]}>
          <capsuleGeometry args={[0.12, 0.9, 6, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* twin propellers */}
      <mesh ref={leftProp} position={[-0.55, -0.05, -0.55]}>
        <torusGeometry args={[0.14, 0.02, 6, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh ref={rightProp} position={[0.55, -0.05, -0.55]}>
        <torusGeometry args={[0.14, 0.02, 6, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* trailing boom (U-shape) */}
      <group position={[0, -0.1, -1.0]}>
        {[-0.8, 0.8].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0, -0.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- containment pods drifting in depth ---------- */
function Pods() {
  const data = Array.from({ length: 6 }).map((_, i) => ({
    pos: [
      Math.sin(i * 1.7) * 5 + (i % 2 ? 2 : -2),
      Math.cos(i * 2.1) * 1.2 - 0.5,
      -3 - i * 1.5,
    ] as [number, number, number],
    speed: 0.3 + (i % 3) * 0.1,
  }));
  return (
    <>
      {data.map((d, i) => (
        <Float key={i} speed={d.speed} rotationIntensity={0.4} floatIntensity={0.8}>
          <mesh position={d.pos}>
            <torusGeometry args={[0.35, 0.09, 10, 32]} />
            <meshStandardMaterial
              color="#0891b2"
              emissive="#06b6d4"
              emissiveIntensity={0.5}
              metalness={0.6}
              roughness={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/* ---------- bubbles ---------- */
function Bubbles() {
  const ref = useRef<THREE.Points>(null);
  const count = 220;
  const positions = useRef<Float32Array>();
  if (!positions.current) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = Math.random() * 12 - 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    positions.current = arr;
  }
  useFrame((_, dt) => {
    if (!ref.current || !positions.current) return;
    const p = positions.current;
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] += dt * (0.2 + (i % 5) * 0.08);
      if (p[i * 3 + 1] > 6) p[i * 3 + 1] = -6;
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
      <pointsMaterial
        size={0.06}
        color="#bae6fd"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---------- caustic light beams from surface ---------- */
function GodRays() {
  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (group.current) group.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.1) * 0.15;
  });
  return (
    <group ref={group} position={[0, 5, -3]}>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[(i - 3) * 1.6, 0, 0]} rotation={[0, 0, 0.1]}>
          <coneGeometry args={[0.6, 10, 8, 1, true]} />
          <meshBasicMaterial
            color="#7dd3fc"
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- camera that responds to scroll ---------- */
function CameraRig({ scroll }: { scroll: React.MutableRefObject<number> }) {
  useFrame((state) => {
    const s = scroll.current;
    const cam = state.camera;
    const targetX = Math.sin(s * Math.PI * 2) * 1.2;
    const targetY = -s * 1.2 + 0.3;
    const targetZ = 6 - s * 2;
    cam.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export const UnderwaterScene = () => {
  const progress = useScrollProgress();
  const scrollRef = useRef(0);
  scrollRef.current = progress;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "linear-gradient(180deg, hsl(198 90% 88%) 0%, hsl(200 80% 70%) 18%, hsl(205 70% 45%) 55%, hsl(215 70% 18%) 100%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0.3, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0e3a5f", 6, 22]} />
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 8, 4]} intensity={1.4} color="#bae6fd" />
          <pointLight position={[-4, -2, 2]} intensity={0.6} color="#22d3ee" />
          <Environment preset="sunset" />
          <CameraRig scroll={scrollRef} />
          <Bot scroll={scrollRef} />
          <Pods />
          <Bubbles />
          <GodRays />
        </Suspense>
      </Canvas>
      {/* readability veil so text on top stays crisp */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background) / 0.55) 0%, hsl(var(--background) / 0.75) 40%, hsl(var(--background) / 0.85) 100%)",
        }}
      />
    </div>
  );
};
