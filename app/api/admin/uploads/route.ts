import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "application/pdf",
  ]),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  folder: z.enum(["projects", "posts", "profile", "site", "other"]),
});

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

export async function POST(request: Request) {
  await requireAdmin();

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid upload." },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabaseClient();
  const extension = EXTENSIONS[parsed.data.mimeType];
  const storagePath = `${parsed.data.folder}/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error) {
    return NextResponse.json(
      { error: "Unable to prepare upload." },
      { status: 500 }
    );
  }

  const { data: publicData } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return NextResponse.json({
    path: data.path,
    token: data.token,
    publicUrl: publicData.publicUrl,
  });
}
