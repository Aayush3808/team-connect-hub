import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Stars, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Bot } from "./Bot";
import { Ocean } from "./Ocean";
import { Debris } from "./Debris";

/**
 * Full-viewport cinematic 3D hero: bot on ocean with volumetric lighting.
 */
export function HeroScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [3.2, 1.6, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#020817"]} />
      <fog attach="fog" args={["#020817", 10, 32]} />

      <Suspense fallback={null}>
        {/* Key light (sun) */}
        <directionalLight
          position={[6, 10, 4]}
          intensity={2.4}
          color="#dff4ff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* Rim aqua */}
        <directionalLight position={[-6, 4, -3]} intensity={1.6} color="#00e5ff" />
        {/* Fill */}
        <ambientLight intensity={0.35} color="#0a2540" />

        <Stars radius={60} depth={30} count={1500} factor={2} fade speed={0.5} />
        <Environment preset="sunset" background={false} />

        <group position={[0, 0.3, 0]}>
          <Bot scale={1.15} />
        </group>

        <Ocean />
        <Debris count={45} />

        <ContactShadows position={[0, -0.28, 0]} opacity={0.5} scale={12} blur={2.4} far={4} />

        <EffectComposer>
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={0.9} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
