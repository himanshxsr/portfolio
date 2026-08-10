import type { ContentType, JsonValue } from "./types";

type Template = Record<string, JsonValue>;

export const CONTENT_TEMPLATES: Record<ContentType, Template> = {
  site: {
    title: "Portfolio",
    description: "",
    baseUrl: "https://example.com",
    language: "en",
    locale: "en_US",
    brandMark: "<dev />",
    seoTitle: "",
    seoDescription: "",
    keywords: [],
    ogImage: "",
    theme: {
      primary: "#00f0ff",
      secondary: "#7b2ff7",
      background: "#0a0a0f",
    },
  },
  profile: {
    name: "",
    roles: [],
    bio: "",
    location: "",
    resumeUrl: "",
    social: {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      email: "",
    },
    stats: {
      yearsExperience: 0,
      projectsCompleted: 0,
      technologiesUsed: 0,
      linesOfCode: 0,
    },
  },
  page: {
    title: "",
    subtitle: "",
    sectionNumber: "",
    seoTitle: "",
    seoDescription: "",
    sections: [
      {
        key: "intro",
        heading: "",
        body: "",
        enabled: true,
      },
    ],
  },
  navigation: {
    label: "",
    href: "/",
    enabled: true,
  },
  stat: {
    label: "",
    value: 0,
    prefix: "",
    suffix: "",
    displayScale: 1,
  },
  education: {
    qualification: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  },
  project: {
    title: "",
    description: "",
    longDescription: "",
    category: "fullstack",
    tech: [],
    image: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
  },
  "project-category": {
    label: "",
    enabled: true,
  },
  technology: {
    name: "",
    icon: "",
    url: "",
  },
  experience: {
    company: "",
    role: "",
    period: "",
    description: "",
    achievements: [],
    tech: [],
  },
  "skill-category": {
    label: "",
    skills: [
      {
        name: "",
        icon: "",
        level: 80,
      },
    ],
  },
  skill: {
    name: "",
    category: "",
    icon: "",
    proficiency: 80,
    description: "",
    featured: false,
  },
  "blog-post": {
    title: "",
    excerpt: "",
    content: "",
    tags: [],
    date: "",
    readTime: "",
  },
  "blog-tag": {
    name: "",
    description: "",
  },
  "ui-copy": {
    key: "",
    value: "",
  },
};
