import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Float, MeshDistortMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { hologramFragmentShader, hologramVertexShader } from "../shaders/hologram";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

function ParticleField({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 18;
      values[index * 3 + 1] = (Math.random() - 0.5) * 10;
      values[index * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    return values;
  }, [count]);

  useFrame(({ clock, pointer }) => {
    if (!points.current) {
      return;
    }

    points.current.rotation.y = clock.elapsedTime * 0.025 + pointer.x * 0.08;
    points.current.rotation.x = pointer.y * 0.045;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#72F2FF"
        size={0.018}
        opacity={0.62}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function HologramCore() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#72F2FF") }
        },
        vertexShader: hologramVertexShader,
        fragmentShader: hologramFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }),
    []
  );

  useFrame(({ clock, pointer }) => {
    material.uniforms.uTime.value = clock.elapsedTime;

    if (mesh.current) {
      mesh.current.rotation.x = clock.elapsedTime * 0.18 + pointer.y * 0.22;
      mesh.current.rotation.y = clock.elapsedTime * 0.26 + pointer.x * 0.32;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.55}>
      <mesh ref={mesh} position={[1.85, 0.2, -0.2]}>
        <icosahedronGeometry args={[1.2, 4]} />
        <primitive object={material} attach="material" />
      </mesh>
    </Float>
  );
}

function SceneObjects({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={0.34} />
      <pointLight color="#72F2FF" intensity={5} position={[-3, 2, 3]} />
      <pointLight color="#C4432A" intensity={3} position={[4, -2, 2]} />
      <ParticleField count={reduced ? 90 : 360} />
      <HologramCore />
      <Float speed={1} rotationIntensity={0.35} floatIntensity={0.3}>
        <mesh position={[-2.1, -1.25, -0.6]} rotation={[0.4, 0.5, 0.1]}>
          <torusKnotGeometry args={[0.58, 0.07, 120, 10]} />
          <MeshDistortMaterial
            color="#C4432A"
            emissive="#C4432A"
            emissiveIntensity={0.32}
            roughness={0.25}
            metalness={0.78}
            distort={0.22}
            speed={1.6}
          />
        </mesh>
      </Float>
      <gridHelper
        args={[24, 34, "#1a5967", "#132029"]}
        position={[0, -2.4, -2]}
        rotation={[0, 0, 0]}
      />
    </>
  );
}

export function HeroScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 1.65]}
      camera={{ position: [0, 0, 6], fov: 43 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <SceneObjects reduced={reduced} />
      {!reduced ? (
        <EffectComposer>
          <Bloom intensity={0.55} luminanceThreshold={0.2} luminanceSmoothing={0.55} />
          <Vignette eskil={false} offset={0.18} darkness={0.78} />
        </EffectComposer>
      ) : null}
      <Preload all />
    </Canvas>
  );
}
