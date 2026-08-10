"use client";

import { createContext, useContext } from "react";
import type { BlogPost } from "@/data/blog";
import type { Experience } from "@/data/experience";
import type { Project } from "@/data/projects";
import type { SkillCategory } from "@/data/skills";

type PersonalData = typeof import("@/data/personal").personalData;

export type PortfolioContent = {
  site: {
    title: string;
    description: string;
    baseUrl: string;
    language: string;
    locale: string;
    brandMark?: string;
    keywords: string[];
    ogImage: string;
  };
  profile: PersonalData;
  projects: Project[];
  blogPosts: BlogPost[];
  experiences: Experience[];
  skillCategories: SkillCategory[];
  navigation: Array<{ href: string; label: string }>;
  pages: Record<string, Record<string, unknown>>;
  education: Array<{
    id: string;
    qualification: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
};

const ContentContext = createContext<PortfolioContent | null>(null);

export function ContentProvider({
  value,
  children,
}: {
  value: PortfolioContent;
  children: React.ReactNode;
}) {
  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function usePortfolioContent() {
  const content = useContext(ContentContext);
  if (!content) {
    throw new Error("usePortfolioContent must be used within ContentProvider.");
  }
  return content;
}
