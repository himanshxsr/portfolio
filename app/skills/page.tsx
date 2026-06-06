"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TiltCard } from "@/components/ui/TiltCard";
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
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeCategory === category.id
                      ? "text-background"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="skill-tab"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Skills Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentSkills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <TiltCard className="h-full">
                    <div className="p-6 rounded-xl bg-surface border border-border-subtle hover:border-primary/20 transition-colors h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{skill.icon}</span>
                        <h3 className="text-lg font-semibold text-text-primary">
                          {skill.name}
                        </h3>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{
                            delay: i * 0.08 + 0.3,
                            duration: 1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </div>
                      <p className="text-right text-xs text-text-secondary mt-1 font-mono">
                        {skill.level}%
                      </p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
}
