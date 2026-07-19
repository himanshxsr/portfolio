"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createParticleBuffers(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  // Deterministic pseudo-random so render stays pure across re-renders.
  let seed = count * 9973 + 1;
  const next = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (next() - 0.5) * 20;
    positions[i * 3 + 1] = (next() - 0.5) * 20;
    positions[i * 3 + 2] = (next() - 0.5) * 20;

    const t = next();
    colors[i * 3] = t * 0.48;
    colors[i * 3 + 1] = 0.94 - t * 0.76;
    colors[i * 3 + 2] = 1 - t * 0.03;
  }

  return { positions, colors };
}

export function ParticleField({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => createParticleBuffers(count), [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03;

    const positions = mesh.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] +=
        Math.sin(state.clock.elapsedTime + positions[i3]) * 0.001;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
