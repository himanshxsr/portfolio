"use client";

import { useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/supabase/config";

type MediaAsset = {
  id: string;
  storage_path: string;
  public_url: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  created_at: string;
};

const UPLOAD_FOLDERS = [
  { value: "projects", label: "Projects" },
  { value: "site", label: "Site / OG images" },
  { value: "profile", label: "Profile / résumé" },
  { value: "posts", label: "Blog" },
  { value: "other", label: "Other" },
] as const;

type UploadFolder = (typeof UPLOAD_FOLDERS)[number]["value"];

export function MediaManager({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [folder, setFolder] = useState<UploadFolder>("projects");
  const [query, setQuery] = useState("");

  const filteredAssets = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return assets;
    return assets.filter((asset) =>
      asset.filename.toLowerCase().includes(needle)
    );
  }, [assets, query]);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const uploadFolder: UploadFolder =
        file.type === "application/pdf" ? "profile" : folder;

      const prepareResponse = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          folder: uploadFolder,
        }),
      });
      const prepared = await prepareResponse.json();
      if (!prepareResponse.ok) throw new Error(prepared.error ?? "Upload failed.");

      const supabase = createBrowserSupabaseClient();
      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .uploadToSignedUrl(prepared.path, prepared.token, file, {
          contentType: file.type,
        });
      if (uploadError) throw uploadError;

      const { data: inserted, error: metadataError } = await supabase
        .from("media_assets")
        .insert({
          storage_path: prepared.path,
          public_url: prepared.publicUrl,
          filename: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          alt_text: "",
        })
        .select("*")
        .single();
      if (metadataError) throw metadataError;

      setAssets((current) => [inserted as MediaAsset, ...current]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function remove(asset: MediaAsset) {
    if (!window.confirm(`Delete ${asset.filename}?`)) return;
    const supabase = createBrowserSupabaseClient();
    const { error: storageError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove([asset.storage_path]);
    if (storageError) {
      setError(storageError.message);
      return;
    }
    await supabase.from("media_assets").delete().eq("id", asset.id);
    setAssets((current) => current.filter((item) => item.id !== asset.id));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Search files</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by filename…"
            className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60"
          />
        </label>
        <label className="block sm:w-48">
          <span className="mb-1.5 block text-sm font-medium">Upload folder</span>
          <select
            value={folder}
            onChange={(event) => setFolder(event.target.value as UploadFolder)}
            className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60"
          >
            {UPLOAD_FOLDERS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-primary/40 bg-primary/5 px-6 py-10 text-center">
        <span className="font-semibold text-primary">
          {uploading ? "Uploading…" : "Upload image or PDF"}
        </span>
        <span className="mt-2 text-sm text-text-secondary">
          PNG, JPG, WebP, GIF, SVG, or PDF · max 10 MB · uses{" "}
          <code className="text-primary">/api/admin/uploads</code>
        </span>
        <input
          type="file"
          className="sr-only"
          disabled={uploading}
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
      </label>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <p className="text-xs text-text-secondary">
        {filteredAssets.length} file{filteredAssets.length === 1 ? "" : "s"} ·
        Copy URL into project images, profile résumé, or home{" "}
        <code className="text-primary">heroSketchUrl</code>
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredAssets.map((asset) => (
          <article
            key={asset.id}
            className="overflow-hidden rounded-xl border border-border-subtle bg-surface"
          >
            <div className="flex aspect-video items-center justify-center bg-background">
              {asset.mime_type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.public_url}
                  alt={asset.alt_text || asset.filename}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="font-mono text-sm text-primary">PDF</span>
              )}
            </div>
            <div className="p-4">
              <p className="truncate text-sm font-medium">{asset.filename}</p>
              <p className="mt-1 text-xs text-text-secondary">
                {(asset.size_bytes / 1024).toFixed(1)} KB ·{" "}
                {asset.storage_path.split("/")[0]}
              </p>
              <div className="mt-4 flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(asset.public_url)}
                  className="text-primary hover:underline"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => void remove(asset)}
                  className="text-red-300 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!filteredAssets.length ? (
        <div className="rounded-xl border border-border-subtle bg-surface px-6 py-14 text-center text-text-secondary">
          {query ? "No files match your search." : "No media uploaded yet."}
        </div>
      ) : null}
    </div>
  );
}
