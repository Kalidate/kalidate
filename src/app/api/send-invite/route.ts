import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN;

    if (!POSTMARK_TOKEN) {
      console.error("Missing POSTMARK_SERVER_TOKEN");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Runtime-only import (correct)
    const postmark = await import("postmark");

    const client = new postmark.ServerClient(POSTMARK_TOKEN);

    await client.sendEmail({
      From: "Kalidate <invite@kalidate.com>",
      To: email,
      Subject: "You’re invited to Kalidate",
      HtmlBody: `
        <h2>You’ve been invited to Kalidate</h2>
        <p>Click the link below to get started:</p>
        <p>
          <a href="https://www.kalidate.com"
             style="display:inline-block;padding:10px 16px;
                    background:#000;color:#fff;text-decoration:none;
                    border-radius:6px;">
            Accept invitation
          </a>
        </p>
      `,
      TextBody:
        "You’ve been invited to Kalidate. Visit https://www.kalidate.com to accept the invitation.",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Send invite failed:", error);

    if (error?.response?.data) {
      console.error("Postmark response:", error.response.data);
    }

    return NextResponse.json(
      {
        error: "Send invite failed",
        details:
          error?.response?.data ??
          error?.message ??
          "Unknown error",
      },
      { status: 500 }
    );
  }
}