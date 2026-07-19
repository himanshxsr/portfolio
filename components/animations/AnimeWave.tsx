"use client";

import { useEffect, useRef } from "react";
import { animate, utils } from "animejs";

export function AnimeWave({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const bars = containerRef.current.querySelectorAll(".wave-bar");

    const animation = animate(bars, {
      height: [
        { to: "20%", duration: 500 },
        { to: "80%", duration: 500 },
      ],
      ease: "inOutSine",
      delay: utils.stagger(80),
      loop: true,
      alternate: true,
    });

    return () => {
      if (typeof animation?.pause === "function") {
        animation.pause();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex items-end justify-center gap-0.5 sm:gap-1 h-10 sm:h-16 w-full max-w-[12rem] sm:max-w-none ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="wave-bar w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-primary to-secondary"
          style={{ height: "20%" }}
        />
      ))}
    </div>
  );
}
