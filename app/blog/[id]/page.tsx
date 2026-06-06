"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { blogPosts } from "@/data/blog";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const post = blogPosts.find((p) => p.id === params.id);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Post Not Found
          </h1>
          <Link
            href="/blog"
            className="text-primary hover:underline font-mono"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={i}
            className="text-2xl font-bold text-text-primary mt-8 mb-4"
          >
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="text-xl font-bold text-text-primary mt-6 mb-3"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li
            key={i}
            className="text-text-secondary font-body ml-4 mb-1 list-disc"
          >
            {line.replace("- ", "")}
          </li>
        );
      }
      if (line.match(/^\d+\. /)) {
        return (
          <li
            key={i}
            className="text-text-secondary font-body ml-4 mb-1 list-decimal"
          >
            {line.replace(/^\d+\. /, "")}
          </li>
        );
      }
      if (line.trim() === "") {
        return <br key={i} />;
      }
      return (
        <p key={i} className="text-text-secondary font-body leading-relaxed mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <PageTransition>
      {/* Reading Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-secondary z-[101] origin-left"
        style={{ scaleX }}
      />

      <article className="min-h-screen py-20 px-6 dot-grid">
        <div className="mx-auto max-w-3xl">
          {/* Back */}
          <ScrollReveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8 font-mono text-sm"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
          </ScrollReveal>

          {/* Header */}
          <ScrollReveal>
            <header className="mb-12">
              <div className="flex items-center gap-4 text-xs font-mono text-text-secondary mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-mono rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal delay={0.2}>
            <div className="prose-custom">{renderContent(post.content)}</div>
          </ScrollReveal>
        </div>
      </article>
    </PageTransition>
  );
}
