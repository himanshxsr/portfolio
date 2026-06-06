"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { experiences } from "@/data/experience";

export default function ExperiencePage() {
  return (
    <PageTransition>
      <section className="min-h-screen py-20 px-6 dot-grid">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            number="04"
            title="Experience"
            subtitle="My professional journey so far"
          />

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border-subtle md:-translate-x-px">
              <motion.div
                className="w-full bg-gradient-to-b from-primary via-secondary to-primary"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{ position: "absolute", top: 0 }}
              />
              {/* Glow on the line */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 bg-primary/30 blur-sm"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {experiences.map((exp, i) => (
                <div
                  key={exp.id}
                  className={`relative flex items-start gap-8 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      className="w-4 h-4 rounded-full bg-primary border-4 border-background"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, type: "spring" }}
                    />
                    <motion.div
                      className="absolute inset-0 w-4 h-4 rounded-full bg-primary"
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Content Card */}
                  <div className="ml-12 md:ml-0 md:w-[calc(50%-2rem)]">
                    <ScrollReveal
                      direction={i % 2 === 0 ? "left" : "right"}
                      delay={i * 0.1}
                    >
                      <div className="p-6 rounded-xl bg-surface border border-border-subtle hover:border-primary/20 transition-colors">
                        {/* Period */}
                        <span className="text-xs font-mono text-primary mb-2 block">
                          {exp.period}
                        </span>

                        {/* Role & Company */}
                        <h3 className="text-xl font-bold text-text-primary mb-1">
                          {exp.role}
                        </h3>
                        <p className="text-text-secondary font-medium mb-3">
                          {exp.company}
                        </p>

                        {/* Description */}
                        <p className="text-text-secondary text-sm font-body mb-4">
                          {exp.description}
                        </p>

                        {/* Achievements */}
                        <ul className="space-y-2 mb-4">
                          {exp.achievements.map((achievement, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.3 + j * 0.1 }}
                              className="text-sm text-text-secondary font-body flex items-start gap-2"
                            >
                              <span className="text-primary mt-1 shrink-0">▹</span>
                              {achievement}
                            </motion.li>
                          ))}
                        </ul>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2">
                          {exp.tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-xs font-mono rounded bg-primary/10 text-primary"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
