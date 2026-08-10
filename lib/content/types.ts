export const CONTENT_TYPES = [
  "site",
  "profile",
  "page",
  "navigation",
  "stat",
  "education",
  "project",
  "project-category",
  "technology",
  "experience",
  "skill-category",
  "skill",
  "blog-post",
  "blog-tag",
  "ui-copy",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];
export type ContentStatus = "draft" | "published" | "archived";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ContentEntry<T extends Record<string, JsonValue> = Record<string, JsonValue>> = {
  id: string;
  content_type: ContentType;
  slug: string;
  draft_data: T;
  published_data: T | null;
  status: ContentStatus;
  sort_order: number;
  revision: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PublishedContent<T extends Record<string, JsonValue> = Record<string, JsonValue>> = {
  id: string;
  content_type: ContentType;
  slug: string;
  data: T;
  sort_order: number;
  published_at: string | null;
  updated_at: string;
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  site: "Site settings",
  profile: "Profile",
  page: "Pages",
  navigation: "Navigation",
  stat: "Statistics",
  education: "Education",
  project: "Projects",
  "project-category": "Project categories",
  technology: "Technologies",
  experience: "Experience",
  "skill-category": "Skill categories",
  skill: "Skills",
  "blog-post": "Blog posts",
  "blog-tag": "Blog tags",
  "ui-copy": "Interface copy",
};
