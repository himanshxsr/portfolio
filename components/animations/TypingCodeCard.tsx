"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";

interface CodeLine {
  text: string;
  color: string;
}

const codeLines: CodeLine[] = [
  { text: "// who am i", color: "text-text-secondary/50" },
  { text: "const developer = {", color: "mixed" },
  { text: '  name: "Himanshu Aashish",', color: "mixed" },
  { text: '  role: "Full-Stack & GenAI Dev",', color: "mixed" },
  { text: '  company: "Elisium Space",', color: "mixed" },
  { text: '  stack: ["MERN", "AWS", "GenAI"],', color: "mixed" },
  { text: '  experience: 2+ years,', color: "mixed" },
  { text: '  passion: "Building things",', color: "mixed" },
  { text: "  available: true", color: "mixed" },
  { text: "}", color: "text-text-secondary" },
];

function colorize(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let i = 0;

  while (i < text.length) {
    // Comments
    if (text.startsWith("//", i)) {
      parts.push(
        <span key={i} className="text-text-secondary/50">
          {text.slice(i)}
        </span>
      );
      break;
    }
    // Keywords
    if (text.startsWith("const ", i)) {
      parts.push(
        <span key={i} className="text-secondary">
          const
        </span>
      );
      i += 5;
      continue;
    }
    if (text.startsWith("true", i)) {
      parts.push(
        <span key={i} className="text-primary font-bold">
          true
        </span>
      );
      i += 4;
      continue;
    }
    // Strings
    if (text[i] === '"') {
      const end = text.indexOf('"', i + 1);
      if (end !== -1) {
        parts.push(
          <span key={i} className="text-green-400">
            {text.slice(i, end + 1)}
          </span>
        );
        i = end + 1;
        continue;
      }
    }
    // Numbers
    if (/\d/.test(text[i]) && (i === 0 || /[\s:[]/.test(text[i - 1]))) {
      let numEnd = i;
      while (numEnd < text.length && /[\d+]/.test(text[numEnd])) numEnd++;
      parts.push(
        <span key={i} className="text-orange-400">
          {text.slice(i, numEnd)}
        </span>
      );
      i = numEnd;
      continue;
    }
    // Variable name after const
    if (text.startsWith("developer", i)) {
      parts.push(
        <span key={i} className="text-primary">
          developer
        </span>
      );
      i += 9;
      continue;
    }
    // Default
    parts.push(
      <span key={i} className="text-text-secondary">
        {text[i]}
      </span>
    );
    i++;
  }

  return parts;
}

export function TypingCodeCard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const totalChars = codeLines.reduce((sum, line) => sum + line.text.length, 0);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTyping = useCallback(() => {
    let chars = 0;
    animationRef.current = setInterval(() => {
      chars += 1;
      setDisplayedChars(chars);
      if (chars >= totalChars) {
        if (animationRef.current) clearInterval(animationRef.current);
        setIsComplete(true);
      }
    }, 30); // 30ms per character = fast but visible typing
  }, [totalChars]);

  useEffect(() => {
    if (isInView) {
      startTyping();
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [isInView, startTyping]);

  // Calculate which characters to show
  const getVisibleContent = () => {
    let charsRemaining = displayedChars;
    const lines: { text: string; complete: boolean }[] = [];

    for (const line of codeLines) {
      if (charsRemaining <= 0) break;
      if (charsRemaining >= line.text.length) {
        lines.push({ text: line.text, complete: true });
        charsRemaining -= line.text.length;
      } else {
        lines.push({ text: line.text.slice(0, charsRemaining), complete: false });
        charsRemaining = 0;
      }
    }

    return lines;
  };

  const visibleContent = getVisibleContent();

  return (
    <div
      ref={ref}
      className={`rounded-2xl bg-surface border border-border-subtle overflow-hidden ${className}`}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border-subtle bg-surface-elevated/50">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs font-mono text-text-secondary">
          about.ts
        </span>
        <div className="flex-1" />
        {isInView && (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] font-mono text-green-400/70">typing...</span>
          </motion.div>
        )}
      </div>

      {/* Code content */}
      <div className="p-5 font-mono text-[13px] leading-[1.8] min-h-[300px]">
        {visibleContent.map((line, i) => (
          <div key={i} className="flex">
            {/* Line number */}
            <span className="w-6 text-right mr-4 text-text-secondary/25 text-xs select-none shrink-0 pt-[2px]">
              {i + 1}
            </span>
            {/* Line content with syntax highlighting */}
            <span className="whitespace-pre">{colorize(line.text)}</span>
            {/* Cursor at end of current line */}
            {!line.complete && !isComplete && (
              <motion.span
                className="inline-block w-[2px] h-[1.1em] bg-primary ml-[1px] translate-y-[2px]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </div>
        ))}

        {/* Final cursor on new line after complete */}
        {isComplete && (
          <motion.div
            className="flex mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="w-6 text-right mr-4 text-text-secondary/25 text-xs select-none shrink-0 pt-[2px]">
              {codeLines.length + 1}
            </span>
            <motion.span
              className="inline-block w-[2px] h-[1.1em] bg-primary translate-y-[2px]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
