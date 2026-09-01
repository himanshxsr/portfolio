import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  isSupabaseConfigured,
  SUPABASE_SERVICE_ROLE_KEY,
} from "@/lib/supabase/config";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { validateContactForm } from "@/lib/contact/validation";
import { verifyContactEmail } from "@/lib/contact/verify-email";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function hashIp(ip: string) {
  const secret = process.env.CONTACT_HASH_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(ip).digest("hex");
}

function localRateLimited(key: string) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);
  if (!bucket || now > bucket.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function sanitize(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function passesRateLimit(ipHash: string | null) {
  if (
    ipHash &&
    isSupabaseConfigured() &&
    SUPABASE_SERVICE_ROLE_KEY
  ) {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      input_key_hash: `contact:${ipHash}`,
      window_seconds: 60,
      max_requests: RATE_LIMIT_MAX,
    });
    if (!error) return Boolean(data);
  }

  return !localRateLimited(ipHash ?? "unknown");
}

export async function POST(request: NextRequest) {
  try {
    const ipHash = hashIp(getClientIp(request));
    if (!(await passesRateLimit(ipHash))) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    if (sanitize(body.website, 200)) {
      return NextResponse.json({ success: true });
    }

    const validation = validateContactForm({
      name: sanitize(body.name, 100),
      email: sanitize(body.email, 254),
      message: sanitize(body.message, 5000),
      website: sanitize(body.website, 200),
    });

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, email, message } = validation.data;

    const emailCheck = await verifyContactEmail(email);
    if (!emailCheck.ok) {
      return NextResponse.json(
        {
          error: emailCheck.error,
          field: emailCheck.field,
          suggestion: emailCheck.suggestion,
        },
        { status: 400 }
      );
    }

    const serviceSupabase =
      isSupabaseConfigured() && SUPABASE_SERVICE_ROLE_KEY
        ? createServiceSupabaseClient()
        : null;
    let messageId: string | null = null;

    if (serviceSupabase) {
      const { data, error } = await serviceSupabase
        .from("contact_messages")
        .insert({
          name,
          email,
          message,
          ip_hash: ipHash,
          user_agent: request.headers.get("user-agent")?.slice(0, 500),
          delivery_status: "pending",
        })
        .select("id")
        .single();

      if (error) {
        console.error("Unable to store contact message", error);
      } else {
        messageId = data?.id ?? null;
      }
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      fetch(appsScriptUrl, {
        method: "POST",
        signal: AbortSignal.timeout(8_000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      }).catch((error) => console.error("Auto-reply failed", error));
    }

    if (!messageId && !(isSupabaseConfigured() && SUPABASE_SERVICE_ROLE_KEY)) {
      return NextResponse.json({ success: true, stored: false });
    }

    return NextResponse.json({ success: true, stored: Boolean(messageId), id: messageId });
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
