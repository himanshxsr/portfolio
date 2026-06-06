"use client";

import { motion } from "framer-motion";

const techStack = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "AWS",
  "Socket.io",
  "LangChain",
  "Tailwind CSS",
  "Three.js",
  "Docker",
  "PostgreSQL",
  "Express.js",
  "Python",
  "OpenAI",
];

export function TechMarquee() {
  return (
    <div className="overflow-hidden py-8 border-y border-border-subtle">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...techStack, ...techStack].map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="text-text-secondary/40 text-lg font-mono flex items-center gap-2"
          >
            <span className="text-primary/40">●</span>
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
