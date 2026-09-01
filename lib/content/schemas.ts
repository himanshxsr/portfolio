import { z } from "zod";
import { CONTENT_TYPES } from "./types";

export const contentTypeSchema = z.enum(CONTENT_TYPES);

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[a-z0-9][a-z0-9-]*$/, "Use lowercase letters, numbers, and hyphens.");

const contentDataSchemas: Partial<
  Record<(typeof CONTENT_TYPES)[number], z.ZodType>
> = {
  site: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    baseUrl: z.string().url(),
    locale: z.string().min(2),
    keywords: z.array(z.string()),
    ogImage: z.string().min(1),
  }),
  profile: z.object({
    name: z.string().min(1),
    roles: z.array(z.string().min(1)).min(1),
    bio: z.string().min(1),
    resumeUrl: z.string().min(1),
    social: z.object({
      github: z.string().url(),
      linkedin: z.string().url(),
      email: z.string().email(),
    }),
    stats: z.object({
      yearsExperience: z.number().nonnegative(),
      projectsCompleted: z.number().nonnegative(),
      technologiesUsed: z.number().nonnegative(),
      linesOfCode: z.number().nonnegative(),
    }),
  }),
  page: z.object({
    title: z.string().min(1),
    subtitle: z.string(),
    sectionNumber: z.string(),
  }),
  navigation: z.object({
    label: z.string().min(1),
    href: z.string().startsWith("/"),
    enabled: z.boolean(),
  }),
  project: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    longDescription: z.string().min(1),
    category: z.string().min(1),
    tech: z.array(z.string()),
    image: z.string(),
    liveUrl: z.string(),
    githubUrl: z.string(),
    downloadUrl: z.string().optional(),
    featured: z.boolean(),
  }),
  experience: z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    period: z.string().min(1),
    description: z.string().min(1),
    achievements: z.array(z.string()),
    tech: z.array(z.string()),
  }),
  "skill-category": z.object({
    label: z.string().min(1),
    skills: z
      .array(
        z.object({
          name: z.string().min(1),
          icon: z.string(),
          level: z.number().min(0).max(100),
        })
      )
      .min(1),
  }),
  "blog-post": z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    content: z.string().min(1),
    tags: z.array(z.string()),
    date: z.string().min(1),
    readTime: z.string().min(1),
  }),
  education: z.object({
    qualification: z.string().min(1),
    institution: z.string().min(1),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
  }),
};

export const contentEntryInputSchema = z.object({
    id: z.string().uuid().optional(),
    contentType: contentTypeSchema,
    slug: slugSchema,
    sortOrder: z.coerce.number().int().min(-10000).max(10000).default(0),
    revision: z.coerce.number().int().positive().optional(),
    data: z
      .string()
      .min(2)
      .transform((value, context) => {
        try {
          const parsed = JSON.parse(value);
          if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
            context.addIssue({
              code: "custom",
              message: "Content must be an object.",
            });
            return z.NEVER;
          }
          return parsed as Record<string, unknown>;
        } catch {
          context.addIssue({
            code: "custom",
            message: "Content contains invalid data.",
          });
          return z.NEVER;
        }
      }),
  });

export function validateContentForPublish(
  contentType: (typeof CONTENT_TYPES)[number],
  data: unknown
) {
  const schema = contentDataSchemas[contentType];
  if (!schema) return { success: true as const };
  const result = schema.safeParse(data);
  if (result.success) return { success: true as const };
  const issue = result.error.issues[0];
  return {
    success: false as const,
    error: `${issue.path.join(".") || "Content"}: ${issue.message}`,
  };
}

export const mediaMetadataSchema = z.object({
  storagePath: z.string().min(1).max(500),
  publicUrl: z.string().url(),
  filename: z.string().min(1).max(255),
  mimeType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "application/pdf",
  ]),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
  altText: z.string().max(500).default(""),
  caption: z.string().max(1000).default(""),
});
