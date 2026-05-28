import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendAdRequestNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { spotName, billing, price, businessName, contactName, email, phone, website, targetState, message } = body;

  if (!spotName || !billing || !businessName || !contactName || !email || !website) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await db.adRequest.create({
      data: {
        spotName,
        billing,
        price: Number(price),
        businessName,
        contactName,
        email,
        phone:       phone || null,
        website,
        targetState: targetState || null,
        message:     message || null,
      },
    });
  } catch (err) {
    console.error("[ad-requests] DB insert failed:", err);
    return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
  }

  await sendAdRequestNotification({ spotName, billing, price: Number(price), businessName, contactName, email, phone, website, targetState, message });

  return NextResponse.json({ ok: true });
}
