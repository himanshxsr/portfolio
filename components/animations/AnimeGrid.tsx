"use client";

import { useEffect, useRef } from "react";
import { animate, utils } from "animejs";

interface AnimeGridProps {
  className?: string;
}

export function AnimeGrid({ className = "" }: AnimeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const grid = gridRef.current;
    const cols = 15;
    const rows = 10;

    const handleClick = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const tileW = rect.width / cols;
      const tileH = rect.height / rows;
      const col = Math.floor(x / tileW);
      const row = Math.floor(y / tileH);
      const index = row * cols + col;

      animate(grid.querySelectorAll(".anime-tile"), {
        scale: [
          { to: 0.1, ease: "outSine", duration: 500 },
          { to: 1, ease: "inOutQuad", duration: 1200 },
        ],
        delay: utils.stagger(50, { grid: [cols, rows], from: index }),
      });
    };

    grid.addEventListener("click", handleClick);
    return () => grid.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      ref={gridRef}
      className={`grid grid-cols-[repeat(15,1fr)] gap-[2px] cursor-pointer ${className}`}
    >
      {Array.from({ length: 150 }).map((_, i) => (
        <div
          key={i}
          className="anime-tile aspect-square rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"
        />
      ))}
    </div>
  );
}
