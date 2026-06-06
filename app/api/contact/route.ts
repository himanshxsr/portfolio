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

    // Send to Web3Forms (notification to your Gmail)
    const web3Res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        name,
        email,
        message,
        subject: `Portfolio Contact: ${name}`,
      }),
    });

    const web3Data = await web3Res.json();

    if (!web3Data.success) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    // Send auto-reply via Google Apps Script
    fetch(process.env.GOOGLE_APPS_SCRIPT_URL!, {
      method: "POST",
      body: JSON.stringify({ name, email }),
    }).catch(() => {}); // Fire and forget

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
