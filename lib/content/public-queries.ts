import "server-only";

import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { ContentType, PublishedContent } from "./types";

export const getPublishedEntries = cache(
  async (contentType: ContentType): Promise<PublishedContent[]> => {
    if (!isSupabaseConfigured()) return [];

    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("published_content")
      .select("*")
      .eq("content_type", contentType)
      .order("sort_order")
      .order("published_at", { ascending: false });

    if (error) {
      console.error(`Unable to load ${contentType} content`, error);
      return [];
    }
    return (data ?? []) as PublishedContent[];
  }
);

export const getPublishedEntry = cache(
  async (contentType: ContentType, slug: string) => {
    if (!isSupabaseConfigured()) return null;

    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("published_content")
      .select("*")
      .eq("content_type", contentType)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(`Unable to load ${contentType}/${slug}`, error);
      return null;
    }
    return data as PublishedContent | null;
  }
);
