"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { personalData } from "@/data/personal";

const socialIcons = [
  { icon: FaGithub, href: personalData.social.github, label: "GitHub" },
  { icon: FaLinkedinIn, href: personalData.social.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${personalData.social.email}`, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col items-center gap-6">
        {/* Social Links */}
        <div className="flex items-center gap-4">
          {socialIcons.map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-3 rounded-full border border-border-subtle text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
              whileHover={{ scale: 1.2, y: -4, rotate: [0, -10, 10, 0] }}
              whileTap={{ scale: 0.9 }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <social.icon size={20} />
            </motion.a>
          ))}
        </div>

        {/* Animated divider */}
        <motion.div
          className="w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Copyright */}
        <motion.p
          className="text-text-secondary text-sm font-mono"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-primary">{"<"}</span>
          {` Built with passion by ${personalData.name} `}
          <span className="text-primary">{"/>"}</span>
        </motion.p>
        <p className="text-text-secondary/50 text-xs">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
