"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 dot-grid">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.h1
          className="text-8xl md:text-9xl font-bold gradient-text mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          404
        </motion.h1>
        <p className="text-text-secondary text-lg font-body mb-2">
          Page not found
        </p>
        <p className="text-text-secondary/60 text-sm font-mono mb-8">
          {"// The route you're looking for doesn't exist"}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-background font-semibold hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
