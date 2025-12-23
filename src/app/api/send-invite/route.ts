import { NextResponse } from "next/server";
import { ServerClient } from "postmark";

const client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await client.sendEmail({
      From: "invite@kalidate.com",
      To: email,
      Subject: "You’re invited to Kalidate 💜",
      HtmlBody: `
        <h2>You're invited to Kalidate</h2>
        <p>Someone thinks you’re worth the time.</p>
        <p>
          <a href="https://kalidate.com">
            Accept your invite
          </a>
        </p>
      `,
      MessageStream: "outbound",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    );
  }
}