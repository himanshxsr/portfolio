import { CONTENT_TEMPLATES } from "./templates";
import type { ContentType, JsonValue } from "./types";

/** Fields used by the home page (`page` entry with slug `home`). */
export const HOME_PAGE_FIELDS: Record<string, JsonValue> = {
  title: "",
  subtitle: "",
  sectionNumber: "",
  heroGreeting: "// Hello, World! I'm",
  heroDescription: "",
  heroSketchUrl: "",
  heroSketchUrlLight: "",
  workCtaLabel: "View My Work",
  resumeCtaLabel: "Download Resume",
  contactCtaLabel: "Get In Touch",
  featuredEyebrow: "// Featured work",
  featuredTitle: "Selected projects",
  aboutTitle: "A bit about me",
  contactEyebrow: "// Let's connect",
  contactTitle: "Have a project in mind?",
  contactDescription: "",
};

export const HOME_PAGE_FIELD_ORDER = [
  "title",
  "subtitle",
  "sectionNumber",
  "heroGreeting",
  "heroDescription",
  "heroSketchUrl",
  "heroSketchUrlLight",
  "workCtaLabel",
  "resumeCtaLabel",
  "contactCtaLabel",
  "featuredEyebrow",
  "featuredTitle",
  "aboutTitle",
  "contactEyebrow",
  "contactTitle",
  "contactDescription",
] as const;

export function mergeContentEditorData(
  contentType: ContentType,
  slug: string,
  data: Record<string, JsonValue>
): Record<string, JsonValue> {
  if (contentType === "page" && slug === "home") {
    return { ...HOME_PAGE_FIELDS, ...data };
  }

  const template = CONTENT_TEMPLATES[contentType] as Record<string, JsonValue>;
  return { ...template, ...data };
}

export function orderedEditorFields(
  contentType: ContentType,
  slug: string,
  data: Record<string, JsonValue>
): Array<[string, JsonValue]> {
  if (contentType === "page" && slug === "home") {
    const merged = mergeContentEditorData(contentType, slug, data);
    const seen = new Set<string>();
    const ordered: Array<[string, JsonValue]> = [];

    for (const key of HOME_PAGE_FIELD_ORDER) {
      if (key in merged) {
        ordered.push([key, merged[key]]);
        seen.add(key);
      }
    }

    for (const [key, value] of Object.entries(merged)) {
      if (!seen.has(key)) ordered.push([key, value]);
    }

    return ordered;
  }

  return Object.entries(mergeContentEditorData(contentType, slug, data));
}
