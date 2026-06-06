import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const web3formsKey = process.env.WEB3FORMS_KEY;
    if (!web3formsKey) {
      return NextResponse.json(
        { error: "CONFIG: WEB3FORMS_KEY not set" },
        { status: 500 }
      );
    }

    // Send to Web3Forms (notification to your Gmail)
    let web3Data;
    try {
      const web3Res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: web3formsKey,
          name,
          email,
          message,
          subject: `Portfolio Contact: ${name}`,
        }),
      });

      const responseText = await web3Res.text();
      try {
        web3Data = JSON.parse(responseText);
      } catch {
        return NextResponse.json(
          { error: "WEB3FORMS_INVALID_RESPONSE: status=" + web3Res.status + " body=" + responseText.slice(0, 200) },
          { status: 500 }
        );
      }
    } catch (fetchErr) {
      return NextResponse.json(
        { error: "FETCH_FAILED: " + String(fetchErr) },
        { status: 500 }
      );
    }

    if (!web3Data.success) {
      return NextResponse.json(
        { error: "WEB3FORMS_REJECTED: " + (web3Data.message || JSON.stringify(web3Data)) },
        { status: 500 }
      );
    }

    // Send auto-reply via Google Apps Script (fire and forget)
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "UNCAUGHT: " + String(err) },
      { status: 500 }
    );
  }
}
