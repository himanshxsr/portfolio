"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TypeWriter } from "@/components/animations/TypeWriter";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TechMarquee } from "@/components/animations/TechMarquee";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { AnimeGrid } from "@/components/animations/AnimeGrid";
import { personalData } from "@/data/personal";
import { ChevronDown, Download, Send } from "lucide-react";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid">
        {/* 3D Background */}
        <HeroScene />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="text-primary font-mono text-sm md:text-base mb-4"
          >
            {"// Hello, World! I'm"}
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="gradient-text">{personalData.name}</span>
          </motion.h1>

          {/* Typing Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="text-xl md:text-2xl text-text-secondary mb-8 h-8"
          >
            <TypeWriter words={personalData.roles} className="font-body" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.6 }}
            className="text-text-secondary font-body text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            I build scalable web applications, real-time multiplayer systems, and
            AI-powered solutions that drive business impact.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              href="/projects"
              className="bg-primary text-background font-semibold hover:bg-primary/90"
            >
              <Send size={18} />
              View My Work
            </MagneticButton>
            <MagneticButton
              href="/contact"
              className="border border-primary/30 text-primary hover:bg-primary/10"
            >
              <Download size={18} />
              Get In Touch
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <ScrollReveal delay={3.5} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-text-secondary"
          >
            <span className="text-xs font-mono">Scroll</span>
            <ChevronDown size={20} className="text-primary" />
          </motion.div>
        </ScrollReveal>
      </section>

      {/* Tech Marquee */}
      <TechMarquee />

      {/* Quick Stats Section */}
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
                  <AnimatedCounter target={50} suffix="k+" />
                </div>
                <p className="text-text-secondary text-sm font-mono">Lines of Code</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Code Card */}
            <ScrollReveal direction="left">
              <div className="rounded-2xl bg-surface border border-border-subtle overflow-hidden p-6">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-mono text-text-secondary">about.ts</span>
                </div>
                {/* Code */}
                <div className="font-mono text-sm leading-relaxed space-y-1">
                  <p className="text-text-secondary/50">{"// who am i"}</p>
                  <p>
                    <span className="text-secondary">const</span>{" "}
                    <span className="text-primary">developer</span>{" "}
                    <span className="text-text-secondary">= {"{"}</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-text-secondary">name:</span>{" "}
                    <span className="text-green-400">{`"Himanshu Aashish"`}</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-text-secondary">role:</span>{" "}
                    <span className="text-green-400">{`"Full-Stack & GenAI Dev"`}</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-text-secondary">company:</span>{" "}
                    <span className="text-green-400">{`"Elisium Space"`}</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-text-secondary">stack:</span>{" "}
                    <span className="text-text-secondary">[</span>
                    <span className="text-green-400">{`"MERN", "AWS", "GenAI"`}</span>
                    <span className="text-text-secondary">],</span>
                  </p>
                  <p className="pl-4">
                    <span className="text-text-secondary">available:</span>{" "}
                    <span className="text-primary">true</span>
                  </p>
                  <p><span className="text-text-secondary">{"}"}</span></p>
                  <motion.span
                    className="text-primary inline-block"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    █
                  </motion.span>
                </div>
              </div>
            </ScrollReveal>

            {/* Right - About Text */}
            <div className="space-y-6">
              <ScrollReveal direction="right">
                <span className="font-mono text-sm text-primary block mb-2">{"// 01. About"}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                  A bit about me
                </h2>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.1}>
                <p className="text-text-secondary font-body leading-relaxed">
                  {personalData.bio}
                </p>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2}>
                <p className="text-text-secondary font-body leading-relaxed">
                  Currently working as an SDE at <span className="text-primary font-medium">Elisium Space Pvt. Ltd.</span>, 
                  building enterprise-grade applications and integrating AI into development workflows.
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

      {/* CTA / Contact Teaser */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-3xl text-center relative z-10">
          <ScrollReveal>
            <span className="font-mono text-sm text-primary block mb-4">
              {"// Let's connect"}
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Have a project in mind?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-text-secondary font-body text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to bring your vision to life. Let&apos;s build something great together.
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

      {/* Interactive Grid - Click anywhere */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <p className="text-center text-text-secondary/50 text-xs font-mono mb-4">
              {"// click anywhere on the grid"}
            </p>
            <AnimeGrid className="rounded-xl overflow-hidden" />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
