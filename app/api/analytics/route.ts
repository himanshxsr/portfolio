import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

const eventSchema = z.object({
  path: z.string().startsWith("/").max(512),
  referrerHost: z.string().max(255).optional(),
  deviceClass: z
    .enum(["desktop", "mobile", "tablet", "bot", "unknown"])
    .default("unknown"),
  sessionHash: z.string().max(128).optional(),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return new NextResponse(null, { status: 204 });
  }

  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }

  const country = request.headers.get("x-vercel-ip-country") ?? undefined;
  const supabase = createPublicSupabaseClient();
  const { error } = await supabase.rpc("track_page_view", {
    input_path: parsed.data.path,
    input_referrer_host: parsed.data.referrerHost ?? null,
    input_device_class: parsed.data.deviceClass,
    input_country_code: country ?? null,
    input_session_hash: parsed.data.sessionHash ?? null,
  });

  if (error) {
    return NextResponse.json({ error: "Unable to record event." }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
