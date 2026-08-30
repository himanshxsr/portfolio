import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";

const MIME_TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

export function resolveSeedAssetPath(filename: string) {
  return path.join(process.cwd(), "seed", "assets", filename);
}

export async function uploadSeedAsset(
  supabase: SupabaseClient,
  bucket: string,
  filename: string,
  folder: "site" | "projects" | "profile"
) {
  const localPath = resolveSeedAssetPath(filename);
  if (!existsSync(localPath)) {
    console.warn(`Skipping missing seed asset: ${filename}`);
    return null;
  }

  const mimeType = MIME_TYPES[path.extname(filename).toLowerCase()];
  if (!mimeType) {
    throw new Error(`Unsupported seed asset type: ${filename}`);
  }

  const storagePath = `${folder}/${filename}`;
  const body = readFileSync(localPath);
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, body, { upsert: true, contentType: mimeType });

  if (uploadError) {
    console.warn(`Failed to upload ${filename}: ${uploadError.message}`);
    return null;
  }

  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(storagePath);

  const sizeBytes = statSync(localPath).size;
  await supabase.from("media_assets").upsert(
    {
      storage_path: storagePath,
      public_url: publicData.publicUrl,
      filename,
      mime_type: mimeType,
      size_bytes: sizeBytes,
      alt_text: "",
    },
    { onConflict: "storage_path" }
  );

  return publicData.publicUrl;
}

export async function uploadSeedAssets(
  supabase: SupabaseClient,
  bucket: string,
  filenames: string[],
  folder: "site" | "projects" | "profile"
) {
  const urls: Record<string, string> = {};
  for (const filename of filenames) {
    const url = await uploadSeedAsset(supabase, bucket, filename, folder);
    if (url) urls[filename] = url;
  }
  return urls;
}
