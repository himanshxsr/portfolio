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
      <div>
        <p className="font-mono text-sm text-primary">Assets</p>
        <h1 className="mt-2 text-3xl font-bold">Media library</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Upload project images, blog covers, social images, and résumé PDFs.
        </p>
      </div>
      <MediaManager initialAssets={data ?? []} />
    </div>
  );
}
