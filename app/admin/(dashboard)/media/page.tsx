import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaManager } from "@/components/admin/MediaManager";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminMediaPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[
          { label: "Overview", href: "/admin" },
          { label: "Media library" },
        ]}
      />

      <AdminPageHeader
        eyebrow="Library"
        title="Media library"
        description="Upload images and PDFs to Supabase Storage. Copy URLs into content fields, or use Pick from media in the content editor."
      />

      <MediaManager initialAssets={data ?? []} />
    </div>
  );
}
