import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // ⬅️ critical

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Import Postmark ONLY at runtime
    const postmark = await import("postmark");
    const client = new postmark.ServerClient(POSTMARK_TOKEN);

    await client.sendEmail({
      From: "Kalidate <invitey@kalidate.com>",
      To: email,
      Subject: "You’re invited to Kalidate",
      HtmlBody: `
        <h2>You’ve been invited to Kalidate</h2>
        <p>Click the link below to get started:</p>
        <p><a href="https://www.kalidate.com">Accept invitation</a></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
  console.error("Send invite failed:", error);

  if (error?.response?.data) {
    console.error("Postmark response data:", error.response.data);
  }

  return new Response(
    JSON.stringify({
      error: "Send invite failed",
      details: error?.response?.data ?? error?.message ?? "Unknown error"
    }),
    { status: 500 }
   );
  }
}