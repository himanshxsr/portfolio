"use client";

import { useEffect, useRef } from "react";
import { animate, utils } from "animejs";
import { useInView } from "framer-motion";

interface AnimeStaggerCardsProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimeStaggerCards({
  children,
  className = "",
}: AnimeStaggerCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current || !containerRef.current) return;
    hasAnimated.current = true;

    const cards = containerRef.current.querySelectorAll(".anime-card");

    animate(cards, {
      translateY: [60, 0],
      opacity: [0, 1],
      scale: [0.9, 1],
      ease: "outExpo",
      duration: 800,
      delay: utils.stagger(100),
    });
  }, [isInView]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
