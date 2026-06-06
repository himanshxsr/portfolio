"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { projects } from "@/data/projects";
import { ExternalLink, CodeXml, ArrowLeft } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Project Not Found
          </h1>
          <Link
            href="/projects"
            className="text-primary hover:underline font-mono"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <section className="min-h-screen py-20 px-6 dot-grid">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <ScrollReveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8 font-mono text-sm"
            >
              <ArrowLeft size={16} />
              Back to Projects
            </Link>
          </ScrollReveal>

          {/* Project Header */}
          <ScrollReveal>
            <div className="mb-8">
              <span className="text-xs font-mono text-primary mb-2 block uppercase">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {project.title}
              </h1>
            </div>
          </ScrollReveal>

          {/* Project Image */}
          <ScrollReveal delay={0.1}>
            <div className="w-full h-64 md:h-80 rounded-2xl bg-surface-elevated border border-border-subtle mb-8 overflow-hidden relative">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-contain p-6"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <motion.span
                    className="text-6xl font-mono font-bold text-primary/30"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    {"</>"}
                  </motion.span>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={0.2}>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                About This Project
              </h2>
              <p className="text-text-secondary font-body leading-relaxed text-lg">
                {project.longDescription}
              </p>
            </div>
          </ScrollReveal>

          {/* Tech Stack */}
          <ScrollReveal delay={0.3}>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.tech.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="px-4 py-2 text-sm font-mono rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Links */}
          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap gap-4">
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-background font-semibold hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink size={18} />
                  Live Demo
                </motion.a>
              )}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CodeXml size={18} />
                  Source Code
                </motion.a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}
