import { NextResponse } from "next/server";
import Postmark from "postmark";

// Force Node.js runtime (required for Postmark)
export const runtime = "nodejs";

const client = new Postmark.ServerClient(
  process.env.POSTMARK_SERVER_TOKEN as string
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await client.sendEmail({
      From: "Kalidate <invite@kalidate.com>",
      To: email,
      Subject: "You’re invited to Kalidate",
      HtmlBody: `
        <h2>Welcome to Kalidate</h2>
        <p>You’ve been invited to try Kalidate.</p>
        <p>More coming soon 🚀</p>
      `,
      TextBody:
        "You’ve been invited to try Kalidate. More coming soon.",
      MessageStream: "outbound",
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    // 🔴 CRITICAL: log full Postmark error
    console.error("POSTMARK ERROR FULL:", error);
    console.error("POSTMARK ERROR RESPONSE:", error?.response?.data);

    return NextResponse.json(
      {
        message: "Postmark send failed",
        error: error?.message,
        details: error?.response?.data,
      },
      { status: 500 }
    );
  }
}