"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroScene() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useReducedMotion();

  // Skip 3D on mobile or when user prefers reduced motion
  if (isMobile || prefersReducedMotion) {
    return (
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <ParticleField count={1500} />
        </Suspense>
      </Canvas>
    </div>
  );
}
