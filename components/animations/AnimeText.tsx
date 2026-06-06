"use client";

import { useEffect, useRef } from "react";
import { animate, utils } from "animejs";
import { useInView } from "framer-motion";

interface AnimeTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimeText({ text, className = "", delay = 0 }: AnimeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current || !containerRef.current) return;
    hasAnimated.current = true;

    const letters = containerRef.current.querySelectorAll(".anime-letter");

    animate(letters, {
      translateY: [40, 0],
      opacity: [0, 1],
      rotateX: [90, 0],
      ease: "outExpo",
      duration: 1200,
      delay: utils.stagger(40, { start: delay }),
    });
  }, [isInView, delay]);

  return (
    <div ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="anime-letter inline-block opacity-0"
          style={{ transformOrigin: "bottom" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
