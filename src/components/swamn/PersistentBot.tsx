import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { SwamnBot } from "./SwamnBot";
import { scrollState } from "@/lib/scroll";

/**
 * PersistentBot — a fixed, full-viewport 3D layer that keeps the SWAMN bot
 * on screen at all times and choreographs its position/rotation/scale to the
 * page scroll progress.
 *
 *  progress  0.00 → hero:            right side, large, facing camera
 *  progress  0.20 → problem:         drifts left, tilts down
 *  progress  0.40 → about/arch:      centers, slow orbit
 *  progress  0.60 → workflow:        moves right, props fast
 *  progress  0.80 → team/roadmap:    pulls back small, top-right
 *  progress  1.00 → footer:          exits upward
 */

type Keyframe = {
  p: number;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
};

const TIMELINE: Keyframe[] = [
  { p: 0.0,  pos: [ 2.2,  0.0,  0.0], rot: [ 0.0, -0.3, 0.0], scale: 1.15 },
  { p: 0.2,  pos: [-2.2, -0.4, -0.5], rot: [ 0.2,  0.6, 0.0], scale: 1.0  },
  { p: 0.4,  pos: [ 0.0,  0.2,  0.5], rot: [-0.1,  1.4, 0.0], scale: 1.1  },
  { p: 0.6,  pos: [ 2.4,  0.0,  0.0], rot: [ 0.1,  2.4, 0.05], scale: 1.0 },
  { p: 0.8,  pos: [ 2.6,  1.3, -1.5], rot: [-0.2,  3.2, 0.0], scale: 0.75 },
  { p: 1.0,  pos: [ 0.0,  3.5, -2.0], rot: [-0.4,  3.6, 0.0], scale: 0.6  },
];

function sample(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  let a = TIMELINE[0], b = TIMELINE[TIMELINE.length - 1];
  for (let i = 0; i < TIMELINE.length - 1; i++) {
    if (p >= TIMELINE[i].p && p <= TIMELINE[i + 1].p) {
      a = TIMELINE[i]; b = TIMELINE[i + 1]; break;
    }
  }
  const span = b.p - a.p || 1;
  const t = (p - a.p) / span;
  // smoothstep
  const s = t * t * (3 - 2 * t);
  return {
    pos: [
      a.pos[0] + (b.pos[0] - a.pos[0]) * s,
      a.pos[1] + (b.pos[1] - a.pos[1]) * s,
      a.pos[2] + (b.pos[2] - a.pos[2]) * s,
    ] as [number, number, number],
    rot: [
      a.rot[0] + (b.rot[0] - a.rot[0]) * s,
      a.rot[1] + (b.rot[1] - a.rot[1]) * s,
      a.rot[2] + (b.rot[2] - a.rot[2]) * s,
    ] as [number, number, number],
    scale: a.scale + (b.scale - a.scale) * s,
  };
}

function ScrollRig({ velocityRef }: { velocityRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const k = sample(scrollState.progress);
    const g = group.current;

    // position lerp
    g.position.x = THREE.MathUtils.lerp(g.position.x, k.pos[0] + pointer.current.x * 0.25, 0.08);
    g.position.y = THREE.MathUtils.lerp(g.position.y, k.pos[1] - pointer.current.y * 0.15, 0.08);
    g.position.z = THREE.MathUtils.lerp(g.position.z, k.pos[2], 0.08);

    // rotation lerp (base pose from timeline; SwamnBot adds its own spin on top)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, k.rot[0], 0.06);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, k.rot[2], 0.06);

    // scale lerp
    const s = THREE.MathUtils.lerp(g.scale.x, k.scale, 0.08);
    g.scale.set(s, s, s);

    // camera parallax dolly on scroll
    const targetZ = 5.8 - scrollState.progress * 0.6;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <SwamnBot velocityRef={velocityRef} idleSpin={0.15} />
      </Float>
    </group>
  );
}

export const PersistentBot = () => {
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
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ mixBlendMode: "normal" }}
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.4, 5.8], fov: 36 }}
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

          <ScrollRig velocityRef={velRef} />

          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.35}
            scale={9}
            blur={2.6}
            far={3}
            color="#0a2a4a"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
