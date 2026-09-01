import { z } from "zod";

import { EMAIL_ERRORS } from "@/lib/contact/verify-email";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Email is too long.")
    .email(EMAIL_ERRORS.invalid),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(5000, "Message is too long."),
  website: z.string().max(200).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function validateContactForm(input: {
  name: string;
  email: string;
  message: string;
  website?: string;
}) {
  const result = contactFormSchema.safeParse(input);
  if (result.success) {
    return { ok: true as const, data: result.data };
  }

  const issue = result.error.issues[0];
  return {
    ok: false as const,
    error: issue?.message ?? "Please check the form and try again.",
    field: typeof issue?.path[0] === "string" ? issue.path[0] : undefined,
  };
}
