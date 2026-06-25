import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SwamnBot } from "./SwamnBot";
import { scrollState } from "@/lib/scroll";

/**
 * Pinned scroll showcase: as the user scrolls through this section, the bot
 * rotates 360° and four hotspot labels fade in around it.
 */
const HOTSPOTS = [
  { t: 0.05, label: "Glossy navy hull", side: "left" as const },
  { t: 0.32, label: "Green sensor LED", side: "right" as const },
  { t: 0.58, label: "Twin propellers", side: "left" as const },
  { t: 0.82, label: "AI vision module", side: "right" as const },
];

function ShowcaseBot({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement> }) {
  const root = useRef<THREE.Group>(null);
  const velRef = useRef(0);

  useFrame(() => {
    velRef.current = scrollState.velocity;
    if (!sectionRef.current || !root.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height - vh;
    const local = Math.min(Math.max(-rect.top / total, 0), 1);
    // override bot's idle Y spin with explicit scroll-driven angle
    root.current.rotation.y = local * Math.PI * 2;
    root.current.position.y = Math.sin(local * Math.PI) * 0.15;
  });

  return (
    <group ref={root}>
      <SwamnBot velocityRef={velRef} idleSpin={0} />
    </group>
  );
}

export const BotShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const local = Math.min(Math.max(-rect.top / total, 0), 1);
        setProgress(local);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bot-showcase"
      className="relative"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* deep-water gradient background */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 30%, hsl(200 80% 35%) 0%, hsl(215 75% 12%) 65%, hsl(220 80% 6%) 100%)",
          }}
        />

        {/* Heading */}
        <div className="absolute left-1/2 top-10 z-10 -translate-x-1/2 text-center container-px">
          <div className="text-xs uppercase tracking-[0.32em] text-aqua/80">The Aggregation Bot</div>
          <h2 className="h-display mt-2 text-3xl md:text-5xl text-primary-foreground">
            Engineered to clean rivers.
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/70">Scroll to inspect</p>
        </div>

        {/* Canvas */}
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [4, 1.6, 5], fov: 36 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 4]} intensity={1.6} color="#cfe8ff" castShadow shadow-mapSize={[1024, 1024]} />
            <pointLight position={[-5, -2, 3]} intensity={1.2} color="#22d3ee" />
            <pointLight position={[3, -3, -3]} intensity={0.5} color="#0ea5e9" />
            <Environment preset="city" />
            <ShowcaseBot sectionRef={sectionRef} />
            <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={9} blur={2.6} far={3} color="#020617" />
          </Suspense>
        </Canvas>

        {/* Hotspot labels */}
        {HOTSPOTS.map((h) => {
          const dist = Math.abs(progress - h.t);
          const visible = dist < 0.12;
          const opacity = visible ? 1 - dist / 0.12 : 0;
          return (
            <div
              key={h.label}
              className={`absolute top-1/2 z-10 -translate-y-1/2 transition-all duration-500 ${
                h.side === "left" ? "left-[8%]" : "right-[8%]"
              }`}
              style={{ opacity, transform: `translateY(-50%) translateX(${visible ? 0 : h.side === "left" ? -20 : 20}px)` }}
            >
              <div className="rounded-full border border-aqua/40 bg-navy-deep/70 px-5 py-3 text-sm font-medium text-primary-foreground backdrop-blur-md shadow-glow">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-aqua animate-pulse" />
                {h.label}
              </div>
            </div>
          );
        })}

        {/* progress indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="h-1 w-40 overflow-hidden rounded-full bg-primary-foreground/15">
            <div className="h-full bg-aqua transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
};
