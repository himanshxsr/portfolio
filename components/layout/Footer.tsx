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
              className="p-3 rounded-full border border-border-subtle text-text-secondary hover:text-primary hover:border-primary/30 transition-colors duration-200"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <social.icon size={20} />
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-text-secondary text-sm font-mono">
          <span className="text-primary">{"<"}</span>
          {` Built with passion by ${personalData.name} `}
          <span className="text-primary">{"/>"}</span>
        </p>
        <p className="text-text-secondary/50 text-xs">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
