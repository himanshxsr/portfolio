"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TypeWriterProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypeWriter({
  words,
  className,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypeWriterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const safeWords = words.length ? words : [""];
  const currentWord = safeWords[wordIndex % safeWords.length] ?? "";

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(safeWords[0] ?? "");
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    } else if (displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
      }, deletingSpeed);
    } else {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % safeWords.length);
    }

    return () => clearTimeout(timeout);
  }, [
    currentWord,
    deletingSpeed,
    displayText,
    isDeleting,
    pauseDuration,
    prefersReducedMotion,
    safeWords,
    typingSpeed,
  ]);

  useEffect(() => {
    setWordIndex(0);
    setDisplayText("");
    setIsDeleting(false);
  }, [safeWords.join("|")]);

  return (
    <span className={className}>
      <span className="inline">{displayText}</span>
      <motion.span
        aria-hidden
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  );
}
