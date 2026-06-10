import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const LIST_ID = process.env.BREVO_NEWSLETTER_LIST_ID
      ? Number(process.env.BREVO_NEWSLETTER_LIST_ID)
      : null;

    if (BREVO_API_KEY && LIST_ID) {
      // Create or update contact in Brevo and add to newsletter list
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          listIds: [LIST_ID],
          updateEnabled: true, // update if contact already exists
          attributes: {
            SIGNUP_SOURCE: "website_newsletter_banner",
          },
        }),
      });

      // 204 = created, 400 with "Contact already exist" is also fine
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // Brevo returns 400 "Contact already exist in list" — treat as success
        if (body?.code !== "duplicate_parameter") {
          console.error("Brevo newsletter error:", body);
          return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
