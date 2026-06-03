import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Preload } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import arthakramLogo from "../assets/logos/arthakram-logo.png";

function FloatingLogo() {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, arthakramLogo);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y =
      Math.sin(clock.elapsedTime * 0.4) * 0.15 + pointer.x * 0.18;
    mesh.current.rotation.x =
      Math.sin(clock.elapsedTime * 0.3) * 0.06 + pointer.y * 0.1;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.35}>
      <mesh ref={mesh} position={[0, 0, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.05}
          side={THREE.DoubleSide}
          emissive="#C4432A"
          emissiveIntensity={0.08}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function OrbitalRing({
  radius,
  color,
  speed,
  tilt,
}: {
  radius: number;
  color: string;
  speed: number;
  tilt: [number, number, number];
}) {
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    ring.current.rotation.z = clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ring} rotation={tilt}>
      <torusGeometry args={[radius, 0.005, 8, 180]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

function GlowParticles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1.2;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      values[i * 3 + 2] = Math.sin(angle) * radius * 0.6;
    }
    return values;
  }, [count]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.06;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#C4432A"
        size={0.025}
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SceneContent({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight color="#C4432A" intensity={4} position={[-2, 2, 3]} />
      <pointLight color="#72F2FF" intensity={2} position={[3, -1, 2]} />
      <directionalLight intensity={0.4} position={[0, 3, 5]} />
      <FloatingLogo />
      <GlowParticles count={reduced ? 40 : 120} />
      <OrbitalRing
        radius={1.8}
        color="#5e2a1e"
        speed={0.12}
        tilt={[0.4, 0, 0]}
      />
      <OrbitalRing
        radius={2.1}
        color="#1a5967"
        speed={-0.08}
        tilt={[0.8, 0.3, 0.2]}
      />
    </>
  );
}

export function ArthakramScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="arthakram-scene">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 46 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <SceneContent reduced={reduced} />
        {!reduced ? (
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.5}
            />
          </EffectComposer>
        ) : null}
        <Preload all />
      </Canvas>
    </div>
  );
}
