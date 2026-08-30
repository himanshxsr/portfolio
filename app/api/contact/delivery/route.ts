import { NextRequest, NextResponse } from "next/server";
import {
  isSupabaseConfigured,
  SUPABASE_SERVICE_ROLE_KEY,
} from "@/lib/supabase/config";
import { createServiceSupabaseClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: true });
  }

  try {
    const body = (await request.json().catch(() => null)) as {
      id?: string;
      delivered?: boolean;
      error?: string;
    } | null;

    if (!body?.id) {
      return NextResponse.json({ error: "Missing message id." }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    const { error } = await supabase
      .from("contact_messages")
      .update({
        delivery_status: body.delivered ? "sent" : "failed",
        delivery_error: body.delivered ? null : body.error ?? "Web3Forms failed",
      })
      .eq("id", body.id);

    if (error) {
      console.error("Unable to update contact delivery status", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact delivery update error", error);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
