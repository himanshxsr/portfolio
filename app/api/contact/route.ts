import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  isSupabaseConfigured,
  SUPABASE_SERVICE_ROLE_KEY,
} from "@/lib/supabase/config";
import { createServiceSupabaseClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    const name = sanitize(body.name, 100);
    const email = sanitize(body.email, 254);
    const message = sanitize(body.message, 5000);
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email." },
        { status: 400 }
      );
    }

    const serviceSupabase =
      isSupabaseConfigured() && SUPABASE_SERVICE_ROLE_KEY
        ? createServiceSupabaseClient()
        : null;
    let messageId: string | null = null;

    if (serviceSupabase) {
      const { data } = await serviceSupabase
        .from("contact_messages")
        .insert({
          name,
          email,
          message,
          ip_hash: ipHash,
          user_agent: request.headers.get("user-agent")?.slice(0, 500),
        })
        .select("id")
        .single();
      messageId = data?.id ?? null;
    }

    const web3formsKey = process.env.WEB3FORMS_KEY;
    if (!web3formsKey) {
      if (messageId) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable." },
        { status: 503 }
      );
    }

    const web3Res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: web3formsKey,
        name,
        email,
        message,
        subject: `Portfolio Contact: ${name}`,
        from_name: "Portfolio Contact Form",
      }),
    });
    const web3Data = (await web3Res.json().catch(() => null)) as {
      success?: boolean;
    } | null;
    const delivered = web3Res.ok && Boolean(web3Data?.success);

    if (serviceSupabase && messageId) {
      await serviceSupabase
        .from("contact_messages")
        .update({
          delivery_status: delivered ? "sent" : "failed",
          delivery_error: delivered ? null : `Web3Forms ${web3Res.status}`,
        })
        .eq("id", messageId);
    }
    if (!delivered) {
      return NextResponse.json(
        { error: "Unable to send your message. Please try again." },
        { status: 502 }
      );
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
