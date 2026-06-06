import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Send auto-reply via Google Apps Script
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Auto-reply failed: " + String(err) },
      { status: 500 }
    );
  }
}
