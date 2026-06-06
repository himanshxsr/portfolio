"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { personalData } from "@/data/personal";
import { Download } from "lucide-react";

const stats = [
  { label: "Years Experience", value: personalData.stats.yearsExperience, suffix: "+" },
  { label: "Projects Completed", value: personalData.stats.projectsCompleted, suffix: "+" },
  { label: "Technologies", value: personalData.stats.technologiesUsed, suffix: "+" },
  { label: "Lines of Code", value: personalData.stats.linesOfCode, suffix: "+" },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <section className="min-h-screen py-20 px-6 dot-grid">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            number="01"
            title="About Me"
            subtitle="Get to know the developer behind the code"
          />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image / Visual */}
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-surface-elevated border border-border-subtle overflow-hidden relative">
                  {/* Terminal-style code card */}
                  <div className="absolute inset-0 flex flex-col p-6">
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-xs font-mono text-text-secondary">about.ts</span>
                    </div>
                    {/* Code content */}
                    <div className="flex-1 font-mono text-sm leading-relaxed space-y-1">
                      <p className="text-text-secondary/60">{"// who am i"}</p>
                      <p>
                        <span className="text-secondary">const</span>{" "}
                        <span className="text-primary">developer</span>{" "}
                        <span className="text-text-secondary">=</span>{" "}
                        <span className="text-text-secondary">{"{"}</span>
                      </p>
                      <p className="pl-4">
                        <span className="text-text-secondary">name:</span>{" "}
                        <span className="text-green-400">{'"Himanshu Aashish"'}</span>,
                      </p>
                      <p className="pl-4">
                        <span className="text-text-secondary">role:</span>{" "}
                        <span className="text-green-400">{'"Full-Stack Dev"'}</span>,
                      </p>
                      <p className="pl-4">
                        <span className="text-text-secondary">location:</span>{" "}
                        <span className="text-green-400">{'"India 🇮🇳"'}</span>,
                      </p>
                      <p className="pl-4">
                        <span className="text-text-secondary">stack:</span>{" "}
                        <span className="text-text-secondary">[</span>
                      </p>
                      <motion.p
                        className="pl-8 text-green-400"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {'"Next.js", "Node.js", "AWS"'}
                      </motion.p>
                      <motion.p
                        className="pl-8 text-green-400"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        {'"LangChain", "MongoDB"'}
                      </motion.p>
                      <p className="pl-4">
                        <span className="text-text-secondary">],</span>
                      </p>
                      <p className="pl-4">
                        <span className="text-text-secondary">passion:</span>{" "}
                        <span className="text-green-400">{'"Building things"'}</span>
                      </p>
                      <p>
                        <span className="text-text-secondary">{"}"}</span>
                      </p>
                      <motion.p
                        className="text-primary mt-2"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        █
                      </motion.p>
                    </div>
                  </div>
                </div>
                {/* Floating decoration */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full border border-primary/30"
                  animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 rounded-lg bg-primary/10 border border-primary/20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </ScrollReveal>

            {/* Bio */}
            <div className="space-y-6">
              <ScrollReveal direction="right">
                <h3 className="text-2xl font-bold text-text-primary">
                  A passionate builder of digital experiences
                </h3>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.1}>
                <p className="text-text-secondary font-body leading-relaxed">
                  {personalData.bio}
                </p>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2}>
                <p className="text-text-secondary font-body leading-relaxed">
                  Currently working as an SDE at Elisium Space Pvt. Ltd., I specialize in
                  building enterprise-grade applications with modern web technologies and
                  integrating Generative AI into development workflows. I&apos;m pursuing my
                  B.Tech in Electronics and Communication Engineering from RJIT, BSF Academy.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.3}>
                <motion.a
                  href={personalData.resumeUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={18} />
                  Download Resume
                </motion.a>
              </ScrollReveal>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center p-6 rounded-xl bg-surface border border-border-subtle">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-text-secondary text-sm font-mono">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Education */}
          <div className="mt-20">
            <ScrollReveal>
              <h3 className="text-2xl font-bold text-text-primary mb-8 text-center">
                <span className="font-mono text-primary text-sm block mb-2">{"// Education"}</span>
                Academic Background
              </h3>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 gap-6">
              <ScrollReveal delay={0.1}>
                <div className="p-6 rounded-xl bg-surface border border-border-subtle">
                  <span className="text-xs font-mono text-primary mb-2 block">
                    Graduation: 2026
                  </span>
                  <h4 className="text-lg font-bold text-text-primary mb-1">
                    B.Tech – Electronics & Communication Engineering
                  </h4>
                  <p className="text-text-secondary text-sm">
                    Rustam Ji Institute of Technology (RJIT), BSF Academy, Gwalior, MP
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="p-6 rounded-xl bg-surface border border-border-subtle">
                  <span className="text-xs font-mono text-primary mb-2 block">
                    Class XII – Intermediate
                  </span>
                  <h4 className="text-lg font-bold text-text-primary mb-1">
                    All India Senior School Certificate Examination
                  </h4>
                  <p className="text-text-secondary text-sm">
                    Shree Krishna International School, Bhubaneswar, Odisha
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
