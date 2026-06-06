"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillCategories } from "@/data/skills";

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].id);

  const currentSkills =
    skillCategories.find((c) => c.id === activeCategory)?.skills ?? [];

  return (
    <PageTransition>
      <section className="min-h-screen py-20 px-6 dot-grid">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            number="02"
            title="Skills & Technologies"
            subtitle="The tools and technologies I use to bring ideas to life"
          />

          {/* Category Tabs */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {skillCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeCategory === category.id
                      ? "text-background"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="skill-tab"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Skills Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentSkills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <motion.div
                    className="p-6 rounded-xl bg-surface border border-border-subtle hover:border-primary/30 transition-all h-full group cursor-default relative overflow-hidden"
                    whileHover={{
                      y: -6,
                      boxShadow: "0 12px 40px rgba(0, 240, 255, 0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Hover glow background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        {/* Animated icon */}
                        <motion.span
                          className="text-2xl"
                          animate={{ y: [0, -3, 0] }}
                          transition={{
                            duration: 2 + i * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {skill.icon}
                        </motion.span>
                        <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                          {skill.name}
                        </h3>
                      </div>

                      {/* Progress Bar with shimmer */}
                      <div className="w-full h-2.5 bg-surface-elevated rounded-full overflow-hidden relative">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full relative"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{
                            delay: i * 0.08 + 0.3,
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{ backgroundSize: "200% 100%" }}
                        >
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3,
                              ease: "easeInOut",
                            }}
                          />
                        </motion.div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <motion.span
                          className="text-xs text-text-secondary font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ opacity: 0 }}
                        >
                          proficiency
                        </motion.span>
                        <span className="text-xs text-primary font-mono font-bold">
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
}
