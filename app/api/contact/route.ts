import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

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
      console.error("WEB3FORMS_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send to Web3Forms (notification to your Gmail)
    const web3Res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: web3formsKey,
        name,
        email,
        message,
        subject: `Portfolio Contact: ${name}`,
      }),
    });

    const web3Data = await web3Res.json();

    if (!web3Data.success) {
      console.error("Web3Forms error:", web3Data);
      return NextResponse.json(
        { error: "Failed to send message: " + (web3Data.message || "Unknown error") },
        { status: 500 }
      );
    }

    // Send auto-reply via Google Apps Script
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      fetch(appsScriptUrl, {
        method: "POST",
        body: JSON.stringify({ name, email }),
      }).catch((err) => console.error("Apps Script error:", err));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
