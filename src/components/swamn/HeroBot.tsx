import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { SwamnBot } from "./SwamnBot";
import { scrollState } from "@/lib/scroll";

/** Cursor parallax — tilts the bot toward the pointer. */
function PointerRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      target.current.x * 0.3,
      0.06
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -target.current.y * 0.15,
      0.06
    );
  });
  return <group ref={group}>{children}</group>;
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
    <div className={`relative ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 5.2], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[4, 6, 5]}
            intensity={1.8}
            color="#ffffff"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-5, 3, -2]} intensity={0.7} color="#bfe0ff" />
          <hemisphereLight args={["#eaf4ff", "#5a7a9a", 0.7]} />

          <PointerRig>
            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
              <SwamnBot velocityRef={velRef} idleSpin={0.12} />
            </Float>
          </PointerRig>

          <ContactShadows
            position={[0, -1.7, 0]}
            opacity={0.5}
            scale={9}
            blur={2.4}
            far={3}
            color="#0a2a4a"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
