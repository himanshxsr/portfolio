"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroSketchPortrait } from "@/components/animations/HeroSketchPortrait";
import { TypeWriter } from "@/components/animations/TypeWriter";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TechMarquee } from "@/components/animations/TechMarquee";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { TypingCodeCard } from "@/components/animations/TypingCodeCard";
import { GlowCard } from "@/components/ui/GlowCard";
import { resolveHeroSketchUrl } from "@/lib/content/hero-sketch";
import { usePortfolioContent } from "@/components/providers/ContentProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ChevronDown, Download, Mail, Send } from "lucide-react";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  { ssr: false }
);

export default function Home() {
  const { profile: personalData, projects, pages } = usePortfolioContent();
  const home = pages.home;
  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 3);
  const prefersReducedMotion = useReducedMotion();
  const delay = (seconds: number) => (prefersReducedMotion ? 0 : seconds);

  const heroSketchUrl = resolveHeroSketchUrl(home?.heroSketchUrl);
  const heroSketchUrlLight =
    typeof home?.heroSketchUrlLight === "string"
      ? home.heroSketchUrlLight.trim()
      : "";

  return (
    <>
      <section className="relative flex min-h-[100dvh] min-h-screen flex-col items-center overflow-hidden dot-grid">
        <div className="pointer-events-none absolute inset-0 z-0">
          <HeroScene />
        </div>

        <div className="relative z-10 flex w-full max-w-4xl flex-1 flex-col items-center px-4 pb-20 pt-[4.75rem] text-center sm:px-6 sm:pb-24">
          <HeroSketchPortrait
            src={heroSketchUrl}
            lightSrc={heroSketchUrlLight || undefined}
            alt={`${personalData.name} sketch`}
          />

          <div className="mt-3 flex w-full flex-1 flex-col items-center justify-center sm:mt-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay(0.2), duration: 0.5 }}
            className="text-primary font-mono text-sm md:text-base mb-4"
          >
            {String(home?.heroGreeting ?? "// Hello, World! I'm")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay(0.35), duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="gradient-text">{personalData.name}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay(0.5), duration: 0.5 }}
            className="text-xl md:text-2xl text-text-secondary mb-8 h-8"
          >
            <TypeWriter words={personalData.roles} className="font-body" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay(0.65), duration: 0.5 }}
            className="text-text-secondary font-body text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {String(
              home?.heroDescription ??
                "I build scalable web applications, real-time multiplayer systems, and AI-powered solutions that drive business impact."
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay(0.8), duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              href="/projects"
              className="bg-primary text-background font-semibold hover:bg-primary/90"
            >
              <Send size={18} />
              {String(home?.workCtaLabel ?? "View My Work")}
            </MagneticButton>
            <MagneticButton
              href={personalData.resumeUrl}
              className="border border-primary/30 text-primary hover:bg-primary/10"
            >
              <Download size={18} />
              {String(home?.resumeCtaLabel ?? "Download Resume")}
            </MagneticButton>
            <MagneticButton
              href="/contact"
              className="border border-primary/30 text-primary hover:bg-primary/10"
            >
              <Mail size={18} />
              {String(home?.contactCtaLabel ?? "Get In Touch")}
            </MagneticButton>
          </motion.div>
          </div>
        </div>

        <ScrollReveal delay={delay(1)} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-text-secondary"
          >
            <span className="text-xs font-mono">Scroll</span>
            <ChevronDown size={20} className="text-primary" />
          </motion.div>
        </ScrollReveal>
      </section>

      <TechMarquee />

      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-surface border border-border-subtle">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter target={personalData.stats.yearsExperience} suffix="+" />
                </div>
                <p className="text-text-secondary text-sm font-mono">Years Exp.</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-surface border border-border-subtle">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter target={personalData.stats.projectsCompleted} suffix="+" />
                </div>
                <p className="text-text-secondary text-sm font-mono">Projects</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-surface border border-border-subtle">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter target={personalData.stats.technologiesUsed} suffix="+" />
                </div>
                <p className="text-text-secondary text-sm font-mono">Technologies</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-surface border border-border-subtle">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter
                    target={Math.round(personalData.stats.linesOfCode / 1000)}
                    suffix="k+"
                  />
                </div>
                <p className="text-text-secondary text-sm font-mono">Lines of Code</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <span className="font-mono text-sm text-primary block mb-2">
                  {String(home?.featuredEyebrow ?? "// Featured work")}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                  {String(home?.featuredTitle ?? "Selected projects")}
                </h2>
              </div>
              <MagneticButton
                href="/projects"
                className="border border-primary/30 text-primary hover:bg-primary/10"
              >
                View all projects →
              </MagneticButton>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.08}>
                <Link href={`/projects/${project.id}`} className="block h-full">
                  <GlowCard className="h-full flex flex-col">
                    <div className="h-36 rounded-lg bg-surface-elevated mb-4 overflow-hidden relative">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-contain p-3"
                      />
                    </div>
                    <span className="text-xs font-mono text-primary uppercase mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-lg font-bold text-text-primary mb-2">
                      {project.title}
                    </h3>
                    <p className="text-text-secondary text-sm font-body flex-1">
                      {project.description}
                    </p>
                  </GlowCard>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <TypingCodeCard />
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal direction="right">
                <span className="font-mono text-sm text-primary block mb-2">{"// 01. About"}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                  {String(home?.aboutTitle ?? "A bit about me")}
                </h2>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.1}>
                <p className="text-text-secondary font-body leading-relaxed">
                  {personalData.bio}
                </p>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2}>
                <p className="text-text-secondary font-body leading-relaxed">
                  Currently working as an SDE at{" "}
                  <span className="text-primary font-medium">Elisium Space Pvt. Ltd.</span>,
                  building enterprise-grade applications and integrating AI into development
                  workflows.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.3}>
                <MagneticButton
                  href="/about"
                  className="border border-primary/30 text-primary hover:bg-primary/10"
                >
                  Learn More About Me →
                </MagneticButton>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-3xl text-center relative z-10">
          <ScrollReveal>
            <span className="font-mono text-sm text-primary block mb-4">
              {String(home?.contactEyebrow ?? "// Let's connect")}
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {String(home?.contactTitle ?? "Have a project in mind?")}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-text-secondary font-body text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              {String(
                home?.contactDescription ??
                  "I'm always open to discussing new projects, creative ideas, or opportunities to bring your vision to life. Let's build something great together."
              )}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton
                href="/contact"
                className="bg-primary text-background font-semibold hover:bg-primary/90"
              >
                <Send size={18} />
                Get In Touch
              </MagneticButton>
              <MagneticButton
                href={`mailto:${personalData.social.email}`}
                className="border border-primary/30 text-primary hover:bg-primary/10"
              >
                {personalData.social.email}
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
