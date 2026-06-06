"use client";

import { TextReveal } from "@/components/animations/TextReveal";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-16 text-center">
      <ScrollReveal>
        <span className="font-mono text-sm text-primary mb-2 block">
          {`// ${number}`}
        </span>
      </ScrollReveal>
      <TextReveal
        text={title}
        as="h2"
        className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
      />
      {subtitle && (
        <ScrollReveal delay={0.2}>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
