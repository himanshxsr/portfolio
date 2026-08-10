"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimeWave } from "@/components/animations/AnimeWave";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePortfolioContent } from "@/components/providers/ContentProvider";

export function Preloader() {
  const { site, pages } = usePortfolioContent();
  const uiCopy = pages.loading;
  const prefersReducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setElapsed(true),
      prefersReducedMotion ? 0 : 1200
    );
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  const isLoading = !elapsed;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background px-4 sm:px-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex w-full max-w-[min(100%,22rem)] sm:max-w-md flex-col items-center gap-3 sm:gap-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full text-center font-mono font-bold text-primary whitespace-nowrap text-[clamp(1.35rem,7.2vw,3rem)] leading-none tracking-tight"
            >
              {site.brandMark ?? "<dev_himansh />"}
            </motion.div>

            <motion.div className="w-full max-w-48 h-0.5 bg-surface-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </motion.div>

            {!prefersReducedMotion && <AnimeWave className="mt-2 sm:mt-4" />}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-text-secondary text-xs sm:text-sm font-mono"
            >
              {String(uiCopy?.label ?? "Initializing...")}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
