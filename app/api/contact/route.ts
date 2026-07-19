import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

type RateBucket = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateBucket>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitStore.get(ip);

  if (!bucket || now > bucket.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function sanitize(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // Honeypot — bots fill hidden fields; humans leave it empty.
    if (sanitize(body.website, 200)) {
      return NextResponse.json({ success: true });
    }

    const name = sanitize(body.name, MAX_NAME);
    const email = sanitize(body.email, MAX_EMAIL);
    const message = sanitize(body.message, MAX_MESSAGE);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
    }

    const web3formsKey = process.env.WEB3FORMS_KEY;
    if (!web3formsKey) {
      console.error("WEB3FORMS_KEY is not configured");
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable." },
        { status: 503 }
      );
    }

    const web3Res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
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

    if (!web3Res.ok || !web3Data?.success) {
      console.error("Web3Forms submission failed", {
        status: web3Res.status,
        ok: web3Data?.success,
      });
      return NextResponse.json(
        { error: "Unable to send your message. Please try again." },
        { status: 502 }
      );
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });
      } catch (autoReplyErr) {
        // Message already delivered; auto-reply is best-effort.
        console.error("Auto-reply failed", autoReplyErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
