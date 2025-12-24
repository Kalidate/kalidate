export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ServerClient } from "postmark";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = new ServerClient(process.env.POSTMARK_API_TOKEN!);

    await client.sendEmail({
      From: `Kalidate <${process.env.POSTMARK_FROM_EMAIL}>`,
      To: email,
      Subject: "Kalidate test invite",
      TextBody: "This is a test invite from Kalidate."
    });

    return NextResponse.json({ success: true });
    catch (error: any) {
    console.error("POSTMARK ERROR FULL:", error);
    console.error("POSTMARK ERROR RESPONSE:", error?.response?.data);

  return NextResponse.json(
    {
      message: "Postmark error",
      error: error?.message,
      details: error?.response?.data,
    },
    { status: 500 }
  );
}
