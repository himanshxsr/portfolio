"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { ADMIN_COLLECTIONS } from "@/lib/content/admin-collections";
import {
  contentEntryInputSchema,
  contentTypeSchema,
  validateContentForPublish,
} from "@/lib/content/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ContentActionState = {
  error?: string;
  success?: string;
};

function revalidatePublicContent() {
  [
    "/",
    "/about",
    "/skills",
    "/projects",
    "/experience",
    "/blog",
    "/contact",
    "/sitemap.xml",
  ].forEach((path) => revalidatePath(path));
}

export async function saveContentEntry(
  _previousState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  await requireAdmin();
  const parsed = contentEntryInputSchema.safeParse({
    id: formData.get("id") || undefined,
    contentType: formData.get("contentType"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    revision: formData.get("revision") || undefined,
    data: formData.get("data"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid content." };
  }

  const supabase = await createServerSupabaseClient();
  const { id, contentType, slug, sortOrder, revision, data } = parsed.data;

  if (id) {
    let query = supabase
      .from("content_entries")
      .update({
        content_type: contentType,
        slug,
        sort_order: sortOrder,
        draft_data: data,
      })
      .eq("id", id);

    if (revision) query = query.eq("revision", revision);
    const { data: updated, error } = await query.select("id").maybeSingle();

    if (error) {
      return { error: error.code === "23505" ? "That slug is already used." : "Unable to save content." };
    }
    if (!updated) {
      return {
        error:
          "This content changed in another tab. Refresh before saving again.",
      };
    }

    revalidatePath(`/admin/content/${id}`);
    return { success: "Draft saved." };
  }

  const { data: created, error } = await supabase
    .from("content_entries")
    .insert({
      content_type: contentType,
      slug,
      sort_order: sortOrder,
      draft_data: data,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.code === "23505" ? "That slug is already used." : "Unable to create content." };
  }

  redirect(`/admin/content/${created.id}`);
}

export async function publishContentEntry(
  previousState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  const saved = await saveContentEntry(previousState, formData);
  if (saved.error) return saved;
  return publishContent(previousState, formData);
}

export async function publishContent(
  _previousState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing content id." };

  const supabase = await createServerSupabaseClient();
  const { data: entry, error: readError } = await supabase
    .from("content_entries")
    .select("content_type,draft_data")
    .eq("id", id)
    .single();
  const contentType = contentTypeSchema.safeParse(entry?.content_type);
  if (readError || !contentType.success) {
    return { error: "Unable to validate content before publishing." };
  }
  const validation = validateContentForPublish(
    contentType.data,
    entry.draft_data
  );
  if (!validation.success) {
    return { error: `Cannot publish: ${validation.error}` };
  }
  const { error } = await supabase.rpc("publish_content", { entry_id: id });
  if (error) {
    console.error("publish_content failed", error);
    return {
      error: `Unable to publish content: ${error.message || "unknown error"}`,
    };
  }

  revalidatePublicContent();
  revalidatePath(`/admin/content/${id}`);
  return { success: "Published. Live site updated." };
}

export async function unpublishContent(
  _previousState: ContentActionState,
  formData: FormData
): Promise<ContentActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing content id." };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("content_entries")
    .update({ status: "draft", published_data: null, published_at: null })
    .eq("id", id);
  if (error) {
    return { error: "Unable to unpublish content." };
  }

  revalidatePublicContent();
  revalidatePath(`/admin/content/${id}`);
  return { success: "Unpublished. Entry is draft-only again." };
}

export async function deleteContent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const contentType = String(formData.get("contentType") ?? "");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("content_entries")
    .delete()
    .eq("id", id);
  if (error) throw new Error("Unable to delete content.");

  revalidatePublicContent();
  const collection =
    Object.entries(ADMIN_COLLECTIONS).find(([, types]) =>
      (types as readonly string[]).includes(contentType)
    )?.[0] ?? "";
  redirect(collection ? `/admin/${collection}` : "/admin");
}
