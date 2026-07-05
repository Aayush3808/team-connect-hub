import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * SWAMN bot — rebuilt to match the user's reference render exactly:
 * - Off-white / light-grey rounded rectangular hull with a big embossed navy "SWAMN" wordmark
 * - Small navy top module carrying a brass camera lens + a bright green LED cube
 * - Two vertical dark-navy strut pillars descending from the hull
 * - Blue 3-blade propellers mounted at the base of each strut
 *
 * The SWAMN wordmark uses a CanvasTexture (no remote font, so the canvas never hangs).
 */

type Props = {
  velocityRef?: React.MutableRefObject<number>;
  /** extra rotation per frame on Y */
  idleSpin?: number;
};

const HULL = "#e9edf2";
const HULL_DEEP = "#c9d2dc";
const NAVY = "#161c44";
const NAVY_DEEP = "#0c1130";
const BRASS = "#d4a437";
const LED = "#7cf07c";
const PROP = "#3a8fd8";

/** Canvas-based SWAMN wordmark texture — reliable, no remote font fetch. */
function useWordmarkTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 320;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = HULL;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = NAVY;
    ctx.font = "900 220px Impact, 'Arial Black', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "12px";
    // subtle shadow to fake embossing
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 4;
    ctx.fillText("SWAMN", c.width / 2, c.height / 2 + 8);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

export const SwamnBot = ({ velocityRef, idleSpin = 0.15 }: Props) => {
  const root = useRef<THREE.Group>(null);
  const leftProp = useRef<THREE.Group>(null);
  const rightProp = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const wordmark = useWordmarkTexture();

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const v = velocityRef?.current ?? 0;
    const speedNorm = Math.min(Math.abs(v) / 1200, 1);

    if (root.current) {
      root.current.position.y = Math.sin(t * 1.1) * 0.05;
      root.current.rotation.y += dt * (idleSpin + speedNorm * 1.4);
      root.current.rotation.x = THREE.MathUtils.lerp(
        root.current.rotation.x,
        -Math.sign(v) * speedNorm * 0.15,
        0.08
      );
      root.current.rotation.z = Math.sin(t * 0.7) * 0.02;
    }

    const propSpeed = 10 + speedNorm * 45;
    if (leftProp.current) leftProp.current.rotation.y += dt * propSpeed;
    if (rightProp.current) rightProp.current.rotation.y -= dt * propSpeed;

    if (led.current) {
      led.current.emissiveIntensity = 1.8 + Math.sin(t * 3) * 0.6;
    }
  });

  return (
    <group ref={root} scale={1}>
      {/* ===== Main hull — off-white rounded rectangle ===== */}
      <group>
        <RoundedBox args={[3.0, 1.05, 1.55]} radius={0.35} smoothness={6} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={HULL}
            metalness={0.15}
            roughness={0.32}
            clearcoat={0.85}
            clearcoatRoughness={0.2}
            envMapIntensity={1}
          />
        </RoundedBox>

        {/* Slight upper deck seam */}
        <mesh position={[0, 0.53, 0]}>
          <boxGeometry args={[2.85, 0.015, 1.42]} />
          <meshStandardMaterial color={HULL_DEEP} metalness={0.3} roughness={0.5} />
        </mesh>

        {/* SWAMN wordmark — front face */}
        <mesh position={[0, -0.02, 0.781]}>
          <planeGeometry args={[2.35, 0.72]} />
          <meshStandardMaterial
            map={wordmark}
            metalness={0.2}
            roughness={0.55}
            color="#ffffff"
          />
        </mesh>
        {/* SWAMN wordmark — back face (mirrored) */}
        <mesh position={[0, -0.02, -0.781]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.35, 0.72]} />
          <meshStandardMaterial
            map={wordmark}
            metalness={0.2}
            roughness={0.55}
            color="#ffffff"
          />
        </mesh>

        {/* small accessory notch on left corner */}
        <mesh position={[-1.35, 0.4, 0.5]}>
          <boxGeometry args={[0.18, 0.24, 0.55]} />
          <meshStandardMaterial color={HULL_DEEP} metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* ===== Top sensor / antenna module ===== */}
      <group position={[-0.6, 0.62, 0]}>
        {/* navy housing */}
        <RoundedBox args={[0.7, 0.34, 0.55]} radius={0.05} smoothness={4} castShadow>
          <meshStandardMaterial color={NAVY} metalness={0.5} roughness={0.35} />
        </RoundedBox>
        {/* brass camera lens on the front */}
        <mesh position={[0.15, -0.02, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.06, 24]} />
          <meshStandardMaterial
            color={BRASS}
            metalness={0.95}
            roughness={0.2}
            emissive={BRASS}
            emissiveIntensity={0.25}
          />
        </mesh>
        {/* brass lens ring */}
        <mesh position={[0.15, -0.02, 0.305]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.012, 12, 32]} />
          <meshStandardMaterial color={BRASS} metalness={0.95} roughness={0.25} />
        </mesh>
        {/* green LED cube on top */}
        <mesh position={[-0.2, 0.28, 0]} castShadow>
          <boxGeometry args={[0.16, 0.22, 0.16]} />
          <meshStandardMaterial
            ref={led}
            color={LED}
            emissive={LED}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ===== Two vertical dark struts + blue propellers ===== */}
      {[-0.95, 0.95].map((x, i) => {
        const propRef = i === 0 ? leftProp : rightProp;
        return (
          <group key={i} position={[x, -0.98, 0]}>
            {/* vertical strut pillar */}
            <mesh castShadow>
              <boxGeometry args={[0.42, 0.95, 0.55]} />
              <meshStandardMaterial color={NAVY_DEEP} metalness={0.55} roughness={0.4} />
            </mesh>
            {/* propeller nacelle (bulb below strut) */}
            <mesh position={[0, -0.55, 0]} castShadow>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshStandardMaterial color={NAVY} metalness={0.7} roughness={0.3} />
            </mesh>
            {/* spinning 3-blade prop (spinning around vertical Y) */}
            <group ref={propRef} position={[0, -0.72, 0]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
                <meshStandardMaterial color={NAVY_DEEP} metalness={0.8} roughness={0.25} />
              </mesh>
              {[0, 1, 2].map((b) => (
                <mesh
                  key={b}
                  rotation={[0, (b * Math.PI * 2) / 3, 0]}
                  position={[0, 0, 0]}
                >
                  <boxGeometry args={[0.42, 0.02, 0.11]} />
                  <meshPhysicalMaterial
                    color={PROP}
                    metalness={0.6}
                    roughness={0.28}
                    clearcoat={0.55}
                  />
                </mesh>
              ))}
            </group>
          </group>
        );
      })}
    </group>
  );
};
