import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const accessKey =
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ??
    process.env.WEB3FORMS_ACCESS_KEY ??
    process.env.WEB3FORMS_KEY ??
    "";

  if (!accessKey) {
    return NextResponse.json(
      { error: "Web3Forms is not configured." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { accessKey },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
