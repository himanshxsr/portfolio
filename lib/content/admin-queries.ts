import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ADMIN_COLLECTIONS, type AdminCollection } from "./admin-collections";
import type { ContentEntry, ContentType } from "./types";

export async function getAdminContentEntriesForCollection(
  collection: AdminCollection
) {
  const types = ADMIN_COLLECTIONS[collection];
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("*")
    .in("content_type", [...types])
    .order("sort_order")
    .order("updated_at", { ascending: false });

  if (error) throw new Error("Unable to load content.");
  return (data ?? []) as ContentEntry[];
}

export async function getAdminContentEntries(contentType?: ContentType) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("content_entries")
    .select("*")
    .order("sort_order")
    .order("updated_at", { ascending: false });

  if (contentType) {
    query = query.eq("content_type", contentType);
  }

  const { data, error } = await query;
  if (error) throw new Error("Unable to load content.");
  return (data ?? []) as ContentEntry[];
}

export async function getAdminContentEntry(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("content_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Unable to load content.");
  return data as ContentEntry;
}

export async function getAdminDashboardStats() {
  const supabase = await createServerSupabaseClient();
  const [content, messages, views] = await Promise.all([
    supabase.from("content_entries").select("status"),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte(
        "viewed_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      ),
  ]);

  const rows = content.data ?? [];
  return {
    total: rows.length,
    drafts: rows.filter((row) => row.status === "draft").length,
    published: rows.filter((row) => row.status === "published").length,
    unreadMessages: messages.count ?? 0,
    views30d: views.count ?? 0,
  };
}
