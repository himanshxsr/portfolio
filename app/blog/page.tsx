"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { blogPosts } from "@/data/blog";
import { Calendar, Clock } from "lucide-react";

export default function BlogPage() {
  return (
    <PageTransition>
      <section className="min-h-screen py-20 px-6 dot-grid">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            number="06"
            title="Blog"
            subtitle="Thoughts on development, architecture, and AI"
          />

          <div className="space-y-6">
            {blogPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.1}>
                <Link href={`/blog/${post.id}`}>
                  <GlowCard className="block">
                    <div className="flex flex-col gap-3">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs font-mono text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-text-secondary font-body text-sm leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read more */}
                      <motion.span
                        className="text-primary text-sm font-medium mt-2 inline-flex items-center gap-1"
                        whileHover={{ x: 4 }}
                      >
                        Read more →
                      </motion.span>
                    </div>
                  </GlowCard>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
