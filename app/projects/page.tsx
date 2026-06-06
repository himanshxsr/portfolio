"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { projects } from "@/data/projects";
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
            number="03"
            title="Projects"
            subtitle="A selection of things I've built"
          />

          {/* Filter Buttons */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
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

          {/* Projects Grid */}
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
                  <Link href={`/projects/${project.id}`}>
                  <GlowCard className="h-full flex flex-col">
                    {/* Project Image */}
                    <div className="h-40 rounded-lg bg-surface-elevated mb-4 overflow-hidden relative group">
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
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        {project.liveUrl && (
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(project.liveUrl, "_blank");
                            }}
                            className="p-2 rounded-full bg-primary text-background hover:scale-110 transition-transform cursor-pointer"
                            role="button"
                            aria-label="Live demo"
                          >
                            <ExternalLink size={18} />
                          </span>
                        )}
                        {project.githubUrl && (
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(project.githubUrl, "_blank");
                            }}
                            className="p-2 rounded-full bg-surface-elevated text-text-primary border border-border-subtle hover:scale-110 transition-transform cursor-pointer"
                            role="button"
                            aria-label="Source code"
                          >
                            <CodeXml size={18} />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-text-primary mb-2">
                        {project.title}
                      </h3>
                      <p className="text-text-secondary text-sm font-body mb-4 flex-1">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2">
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
                    </div>
                  </GlowCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
}
