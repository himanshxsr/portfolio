import type { ContentType } from "./types";

export const ADMIN_COLLECTIONS = {
  site: ["site", "page", "navigation", "stat", "education", "ui-copy"],
  profile: ["profile"],
  projects: ["project", "project-category", "technology"],
  experience: ["experience"],
  skills: ["skill-category", "skill"],
  blog: ["blog-post", "blog-tag"],
} satisfies Record<string, ContentType[]>;

export type AdminCollection = keyof typeof ADMIN_COLLECTIONS;

export function isAdminCollection(value: string): value is AdminCollection {
  return value in ADMIN_COLLECTIONS;
}

export const COLLECTION_LABELS: Record<AdminCollection, string> = {
  site: "Site & pages",
  profile: "Profile",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  blog: "Blog",
};

export const DEFAULT_CONTENT_TYPE: Record<AdminCollection, ContentType> = {
  site: "page",
  profile: "profile",
  projects: "project",
  experience: "experience",
  skills: "skill-category",
  blog: "blog-post",
};

export function getCollectionForContentType(
  contentType: string
): AdminCollection | null {
  for (const [collection, types] of Object.entries(ADMIN_COLLECTIONS)) {
    if ((types as readonly string[]).includes(contentType)) {
      return collection as AdminCollection;
    }
  }
  return null;
}
