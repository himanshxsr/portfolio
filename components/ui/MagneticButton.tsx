"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      ref.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const isInternal = Boolean(href?.startsWith("/") && !href.startsWith("//"));
  const isExternal = Boolean(href && !isInternal);
  const sharedClassName = `relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium transition-all duration-200 active:scale-95 ${className}`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.5 }}
      className="inline-block"
    >
      {isInternal && href ? (
        <Link href={href} onClick={onClick} className={sharedClassName}>
          {children}
        </Link>
      ) : href ? (
        <a
          href={href}
          onClick={onClick}
          className={sharedClassName}
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={sharedClassName}>
          {children}
        </button>
      )}
    </motion.div>
  );
}
