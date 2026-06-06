"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CodeLine {
  content: React.ReactNode;
  indent?: number;
}

export function TypingCodeCard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState(0);

  const codeLines: CodeLine[] = [
    {
      indent: 0,
      content: <span className="text-text-secondary/50">{"// who am i"}</span>,
    },
    {
      indent: 0,
      content: (
        <>
          <span className="text-secondary">const</span>{" "}
          <span className="text-primary">developer</span>{" "}
          <span className="text-text-secondary">= {"{"}</span>
        </>
      ),
    },
    {
      indent: 1,
      content: (
        <>
          <span className="text-text-secondary">name:</span>{" "}
          <span className="text-green-400">{`"Himanshu Aashish"`}</span>,
        </>
      ),
    },
    {
      indent: 1,
      content: (
        <>
          <span className="text-text-secondary">role:</span>{" "}
          <span className="text-green-400">{`"Full-Stack & GenAI Dev"`}</span>,
        </>
      ),
    },
    {
      indent: 1,
      content: (
        <>
          <span className="text-text-secondary">company:</span>{" "}
          <span className="text-green-400">{`"Elisium Space"`}</span>,
        </>
      ),
    },
    {
      indent: 1,
      content: (
        <>
          <span className="text-text-secondary">stack:</span>{" "}
          <span className="text-text-secondary">[</span>
          <span className="text-green-400">{`"MERN", "AWS", "GenAI"`}</span>
          <span className="text-text-secondary">],</span>
        </>
      ),
    },
    {
      indent: 1,
      content: (
        <>
          <span className="text-text-secondary">experience:</span>{" "}
          <span className="text-orange-400">{`2`}</span>
          <span className="text-text-secondary">{` + " years",`}</span>
        </>
      ),
    },
    {
      indent: 1,
      content: (
        <>
          <span className="text-text-secondary">passion:</span>{" "}
          <span className="text-green-400">{`"Building things"`}</span>,
        </>
      ),
    },
    {
      indent: 1,
      content: (
        <>
          <span className="text-text-secondary">available:</span>{" "}
          <span className="text-primary font-bold">true</span>
        </>
      ),
    },
    {
      indent: 0,
      content: <span className="text-text-secondary">{"}"}</span>,
    },
  ];

  useEffect(() => {
    if (!isInView) return;

    let line = 0;
    const interval = setInterval(() => {
      line++;
      setVisibleLines(line);
      if (line >= codeLines.length) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, [isInView, codeLines.length]);

  return (
    <div
      ref={ref}
      className={`rounded-2xl bg-surface border border-border-subtle overflow-hidden ${className}`}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border-subtle">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs font-mono text-text-secondary">
          about.ts
        </span>
        <div className="flex-1" />
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Code content */}
      <div className="p-5 font-mono text-sm leading-relaxed min-h-[280px]">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={
              i < visibleLines
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -10 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Line number */}
            <span className="w-6 text-right mr-4 text-text-secondary/30 text-xs select-none">
              {i + 1}
            </span>
            {/* Line content */}
            <span style={{ paddingLeft: `${(line.indent || 0) * 20}px` }}>
              {line.content}
            </span>
          </motion.div>
        ))}

        {/* Blinking cursor */}
        {visibleLines >= codeLines.length && (
          <motion.div
            className="flex items-center mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="w-6 text-right mr-4 text-text-secondary/30 text-xs select-none">
              {codeLines.length + 1}
            </span>
            <motion.span
              className="inline-block w-2 h-4 bg-primary rounded-sm"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
