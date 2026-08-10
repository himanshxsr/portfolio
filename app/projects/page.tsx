"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { usePortfolioContent } from "@/components/providers/ContentProvider";
import { ExternalLink, CodeXml } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { id: "all", label: "All" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "ai", label: "AI / ML" },
  { id: "backend", label: "Backend" },
];

export default function ProjectsPage() {
  const { projects, pages } = usePortfolioContent();
  const page = pages.projects;
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <PageTransition>
      <section className="min-h-screen py-20 px-6 dot-grid">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            number={String(page?.sectionNumber ?? "03")}
            title={String(page?.title ?? "Projects")}
            subtitle={String(page?.subtitle ?? "A selection of things I've built")}
          />

          <ScrollReveal>
            <div
              className="flex flex-wrap justify-center gap-2 mb-12"
              role="group"
              aria-label="Filter projects by category"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveFilter(cat.id)}
                  aria-pressed={activeFilter === cat.id}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeFilter === cat.id
                      ? "text-background"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {activeFilter === cat.id && (
                    <motion.div
                      layoutId="project-filter"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              ))}
            </div>
          </ScrollReveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  layout
                >
                  <GlowCard className="h-full flex flex-col">
                    <div className="h-40 rounded-lg bg-surface-elevated mb-4 overflow-hidden relative">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-contain p-3"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="text-4xl font-mono font-bold text-primary/40">
                            {"</>"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <Link
                        href={`/projects/${project.id}`}
                        className="group"
                      >
                        <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="text-text-secondary text-sm font-body mb-4 flex-1">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 text-xs font-mono rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-surface-elevated text-text-secondary">
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border-subtle">
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-sm font-mono text-primary hover:underline"
                        >
                          Case study
                        </Link>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-mono text-text-secondary hover:text-primary transition-colors"
                          >
                            <ExternalLink size={14} />
                            Live
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-mono text-text-secondary hover:text-primary transition-colors"
                          >
                            <CodeXml size={14} />
                            Source
                          </a>
                        )}
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
}
