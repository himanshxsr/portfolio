import "server-only";

import { blogPosts as staticBlogPosts, type BlogPost } from "@/data/blog";
import {
  experiences as staticExperiences,
  type Experience,
} from "@/data/experience";
import { personalData as staticPersonalData } from "@/data/personal";
import { projects as staticProjects, type Project } from "@/data/projects";
import {
  skillCategories as staticSkillCategories,
  type SkillCategory,
} from "@/data/skills";
import { NAV_LINKS } from "@/lib/constants";
import { getPublishedEntries, getPublishedEntry } from "./public-queries";

export async function getProjects(): Promise<Project[]> {
  const entries = await getPublishedEntries("project");
  if (!entries.length) return staticProjects;
  return entries.map((entry) => ({
    ...(entry.data as unknown as Project),
    id: entry.slug,
  }));
}

export async function getProject(slug: string): Promise<Project | null> {
  const entry = await getPublishedEntry("project", slug);
  if (entry) {
    return { ...(entry.data as unknown as Project), id: entry.slug };
  }
  return staticProjects.find((project) => project.id === slug) ?? null;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await getPublishedEntries("blog-post");
  if (!entries.length) return staticBlogPosts;
  return entries.map((entry) => ({
    ...(entry.data as unknown as BlogPost),
    id: entry.slug,
  }));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const entry = await getPublishedEntry("blog-post", slug);
  if (entry) {
    return { ...(entry.data as unknown as BlogPost), id: entry.slug };
  }
  return staticBlogPosts.find((post) => post.id === slug) ?? null;
}

export async function getExperiences(): Promise<Experience[]> {
  const entries = await getPublishedEntries("experience");
  if (!entries.length) return staticExperiences;
  return entries.map((entry) => ({
    ...(entry.data as unknown as Experience),
    id: entry.slug,
  }));
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const entries = await getPublishedEntries("skill-category");
  if (!entries.length) return staticSkillCategories;
  return entries.map((entry) => ({
    ...(entry.data as unknown as SkillCategory),
    id: entry.slug,
  }));
}

export async function getProfile() {
  const entry = await getPublishedEntry("profile", "main");
  if (!entry) return staticPersonalData;
  return entry.data as unknown as typeof staticPersonalData;
}

export async function getNavigation() {
  const entries = await getPublishedEntries("navigation");
  if (!entries.length) return [...NAV_LINKS];
  return entries.map((entry) => ({
    href: String(entry.data.href ?? "/"),
    label: String(entry.data.label ?? entry.slug),
  }));
}

export async function getSiteSettings() {
  const entry = await getPublishedEntry("site", "main");
  if (!entry) {
    return {
      title: "Himanshu Aashish | Full-Stack & GenAI Developer",
      description:
        "Full-Stack Developer & Generative AI Engineer building scalable web applications, real-time systems, and AI-powered solutions. Explore my portfolio.",
      baseUrl: "https://himansh.co.in",
      language: "en",
      locale: "en_US",
      brandMark: "<dev_himansh />",
      keywords: [
        "Full-Stack Developer",
        "Generative AI",
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "AWS",
        "LangChain",
        "Portfolio",
      ],
      ogImage: "",
    };
  }
  return entry.data as {
    title: string;
    description: string;
    baseUrl: string;
    language: string;
    locale: string;
    brandMark?: string;
    keywords: string[];
    ogImage: string;
  };
}

export async function getPages() {
  const entries = await getPublishedEntries("page");
  return Object.fromEntries(
    entries.map((entry) => [entry.slug, entry.data])
  ) as Record<string, Record<string, unknown>>;
}

export async function getEducation() {
  const entries = await getPublishedEntries("education");
  if (!entries.length) {
    return [
      {
        id: "education-1",
        qualification: "B.Tech – Electronics & Communication Engineering",
        institution:
          "Rustam Ji Institute of Technology (RJIT), BSF Academy",
        location: "Gwalior, Madhya Pradesh",
        startDate: "",
        endDate: "2026",
        description: "",
      },
      {
        id: "education-2",
        qualification:
          "All India Senior School Certificate Examination",
        institution: "Shree Krishna International School",
        location: "Bhubaneswar, Odisha",
        startDate: "",
        endDate: "",
        description: "Class XII – Intermediate",
      },
    ];
  }
  return entries.map((entry) => ({
    id: entry.slug,
    qualification: String(entry.data.qualification ?? ""),
    institution: String(entry.data.institution ?? ""),
    location: String(entry.data.location ?? ""),
    startDate: String(entry.data.startDate ?? ""),
    endDate: String(entry.data.endDate ?? ""),
    description: String(entry.data.description ?? ""),
  }));
}
