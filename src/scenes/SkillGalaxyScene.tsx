import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Preload, Text } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { skills } from "../data/portfolio";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type SkillPoint = {
  label: string;
  group: string;
  strength: number;
  position: [number, number, number];
};

function GalaxyNode({ skill, index }: { skill: SkillPoint; index: number }) {
  const [hovered, setHovered] = useState(false);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) {
      return;
    }

    const pulse = Math.sin(clock.elapsedTime * 1.7 + index) * 0.04;
    mesh.current.scale.setScalar((hovered ? 1.2 : 1) + pulse);
  });

  const color = skill.group === "Product" ? "#C4432A" : skill.group === "Tech" ? "#72F2FF" : "#F7F5F0";

  return (
    <group position={skill.position}>
      <Float speed={1.1 + index * 0.02} floatIntensity={0.18} rotationIntensity={0.18}>
        <mesh
          ref={mesh}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.13 + skill.strength * 0.08, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.1 : 0.42}
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[0, -0.34, 0]}
          fontSize={0.1}
          color={hovered ? "#ffffff" : "#b7c2c9"}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.2}
        >
          {skill.label}
        </Text>
      </Float>
    </group>
  );
}

function Galaxy({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo<SkillPoint[]>(() => {
    return skills.map((skill, index) => {
      const angle = index * 2.399963;
      const radius = 1.15 + (index % 5) * 0.24;
      const y = ((index % 7) - 3) * 0.24;

      return {
        ...skill,
        position: [
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius * 0.72
        ] as [number, number, number]
      };
    });
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!group.current || reduced) {
      return;
    }

    group.current.rotation.y = clock.elapsedTime * 0.08 + pointer.x * 0.22;
    group.current.rotation.x = pointer.y * 0.08;
  });

  return (
    <group ref={group}>
      <pointLight color="#72F2FF" intensity={3.4} position={[0, 1.8, 2.4]} />
      <pointLight color="#C4432A" intensity={2.6} position={[2.8, -1.6, 1.4]} />
      <mesh>
        <torusGeometry args={[1.62, 0.004, 8, 180]} />
        <meshBasicMaterial color="#2c6670" transparent opacity={0.34} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.12, 0.004, 8, 180]} />
        <meshBasicMaterial color="#783829" transparent opacity={0.3} />
      </mesh>
      {points.map((skill, index) => (
        <GalaxyNode skill={skill} index={index} key={skill.label} />
      ))}
    </group>
  );
}

export function SkillGalaxyScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="skill-galaxy">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.45} />
        <Galaxy reduced={reduced} />
        <Html position={[0, -1.85, 0]} center className="galaxy-hud">
          Product x AI x Strategy
        </Html>
        <Preload all />
      </Canvas>
    </div>
  );
}
