"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TypingCodeCard } from "@/components/animations/TypingCodeCard";
import { usePortfolioContent } from "@/components/providers/ContentProvider";
import { Download } from "lucide-react";

export default function AboutPage() {
  const { profile: personalData, education, pages } = usePortfolioContent();
  const page = pages.about;
  const stats = [
    { label: "Years Experience", value: personalData.stats.yearsExperience, suffix: "+" },
    { label: "Projects Completed", value: personalData.stats.projectsCompleted, suffix: "+" },
    { label: "Technologies", value: personalData.stats.technologiesUsed, suffix: "+" },
    { label: "Lines of Code", value: personalData.stats.linesOfCode, suffix: "+" },
  ];
  return (
    <PageTransition>
      <section className="min-h-screen py-20 px-6 dot-grid">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            number={String(page?.sectionNumber ?? "01")}
            title={String(page?.title ?? "About Me")}
            subtitle={String(
              page?.subtitle ?? "Get to know the developer behind the code"
            )}
          />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image / Visual */}
            <ScrollReveal direction="left">
              <div className="relative">
                <TypingCodeCard />
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
              {education.map((item, index) => (
                <ScrollReveal key={item.id} delay={(index + 1) * 0.1}>
                  <div className="p-6 rounded-xl bg-surface border border-border-subtle">
                    <span className="text-xs font-mono text-primary mb-2 block">
                      {item.description ||
                        (item.endDate ? `Graduation: ${item.endDate}` : "")}
                    </span>
                    <h4 className="text-lg font-bold text-text-primary mb-1">
                      {item.qualification}
                    </h4>
                    <p className="text-text-secondary text-sm">
                      {[item.institution, item.location]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
