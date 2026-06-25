import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * Procedural SWAMN bot modelled to match the user's CAD renders:
 * - Deep-navy rounded rectangular hull, one end rounded
 * - Top antenna module: black housing + green LED + brass lens
 * - "SWAMN" wordmark embossed on the side
 * - Two angled struts holding twin spinning propeller pods
 *
 * Props let it react to global scroll velocity (faster spin, slight tilt).
 */
type Props = {
  velocityRef?: React.MutableRefObject<number>;
  /** extra rotation per frame on Y, in addition to physics */
  idleSpin?: number;
};

const NAVY = "#161c44";
const NAVY_DEEP = "#0c1130";
const BRASS = "#d4a437";
const LED = "#7cf07c";
const PROP = "#6ec3e4";

export const SwamnBot = ({ velocityRef, idleSpin = 0.15 }: Props) => {
  const root = useRef<THREE.Group>(null);
  const leftProp = useRef<THREE.Group>(null);
  const rightProp = useRef<THREE.Group>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const v = velocityRef?.current ?? 0;
    const speedNorm = Math.min(Math.abs(v) / 1200, 1);

    if (root.current) {
      // gentle bob + slight forward tilt when scrolling fast
      root.current.position.y = Math.sin(t * 1.1) * 0.05;
      root.current.rotation.y += dt * (idleSpin + speedNorm * 1.4);
      root.current.rotation.x = THREE.MathUtils.lerp(
        root.current.rotation.x,
        -Math.sign(v) * speedNorm * 0.18,
        0.08
      );
      root.current.rotation.z = Math.sin(t * 0.7) * 0.025;
    }

    // propellers spin — fast baseline + scroll boost
    const propSpeed = 8 + speedNorm * 40;
    if (leftProp.current) leftProp.current.rotation.z += dt * propSpeed;
    if (rightProp.current) rightProp.current.rotation.z -= dt * propSpeed;

    // LED breathing
    if (led.current) {
      led.current.emissiveIntensity = 1.6 + Math.sin(t * 3) * 0.5;
    }
  });

  return (
    <group ref={root} scale={1}>
      {/* ===== Hull — rounded rectangular body ===== */}
      <group>
        {/* Main rounded box */}
        <RoundedBox args={[2.6, 1.05, 1.8]} radius={0.42} smoothness={6} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={NAVY}
            metalness={0.55}
            roughness={0.28}
            clearcoat={0.9}
            clearcoatRoughness={0.18}
            envMapIntensity={1.2}
          />
        </RoundedBox>

        {/* Subtle top deck plate (slightly lighter) */}
        <mesh position={[0, 0.53, 0]} receiveShadow>
          <boxGeometry args={[2.45, 0.02, 1.65]} />
          <meshStandardMaterial color={NAVY_DEEP} metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Embossed SWAMN wordmark — both sides */}
        <Text
          position={[0.05, -0.05, 0.92]}
          fontSize={0.38}
          letterSpacing={0.04}
          font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIA2A.woff"
          color={NAVY_DEEP}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#3a4480"
        >
          SWAMN
        </Text>
        <Text
          position={[0.05, -0.05, -0.92]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.38}
          letterSpacing={0.04}
          font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIA2A.woff"
          color={NAVY_DEEP}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#3a4480"
        >
          SWAMN
        </Text>
      </group>

      {/* ===== Antenna / sensor module on top ===== */}
      <group position={[-0.55, 0.62, 0]}>
        {/* black housing */}
        <RoundedBox args={[0.55, 0.22, 0.4]} radius={0.06} smoothness={4} castShadow>
          <meshStandardMaterial color="#0a0e1f" metalness={0.7} roughness={0.25} />
        </RoundedBox>
        {/* brass lens (camera) */}
        <mesh position={[0, 0, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 24]} />
          <meshStandardMaterial color={BRASS} metalness={0.95} roughness={0.18} emissive={BRASS} emissiveIntensity={0.15} />
        </mesh>
        {/* green LED stalk */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.12, 0.22, 0.12]} />
          <meshStandardMaterial ref={led} color={LED} emissive={LED} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* small accessory cube on the side near the wordmark (from CAD) */}
      <mesh position={[-0.9, 0.45, 0.91]}>
        <boxGeometry args={[0.16, 0.16, 0.06]} />
        <meshStandardMaterial color={NAVY_DEEP} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* ===== Twin angled struts + propeller pods ===== */}
      {[-0.85, 0.85].map((x, i) => {
        const propRef = i === 0 ? leftProp : rightProp;
        return (
          <group key={i} position={[x, -0.45, 0.15]}>
            {/* vertical strut plate */}
            <mesh castShadow>
              <boxGeometry args={[0.12, 0.7, 0.55]} />
              <meshStandardMaterial color={NAVY_DEEP} metalness={0.5} roughness={0.45} />
            </mesh>
            {/* angled prop housing arm */}
            <group position={[0, -0.38, -0.05]} rotation={[0.45, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.09, 0.11, 0.55, 16]} />
                <meshStandardMaterial color={NAVY_DEEP} metalness={0.6} roughness={0.3} />
              </mesh>
              {/* prop nacelle (bulb) */}
              <mesh position={[0, -0.3, 0]} castShadow>
                <sphereGeometry args={[0.13, 24, 24]} />
                <meshStandardMaterial color="#1c2247" metalness={0.7} roughness={0.25} />
              </mesh>
              {/* spinning propeller */}
              <group ref={propRef} position={[0, -0.42, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
                  <meshStandardMaterial color="#0a0e1f" metalness={0.8} roughness={0.2} />
                </mesh>
                {[0, 1, 2].map((b) => (
                  <mesh key={b} rotation={[0, 0, (b * Math.PI * 2) / 3]} position={[0, 0, 0]}>
                    <boxGeometry args={[0.34, 0.02, 0.09]} />
                    <meshPhysicalMaterial
                      color={PROP}
                      metalness={0.7}
                      roughness={0.25}
                      clearcoat={0.6}
                      transmission={0.05}
                    />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        );
      })}
    </group>
  );
};
