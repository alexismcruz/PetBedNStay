import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendListingRequestNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, ownerName, email, phone, address, city, state, type, website, message } = body;

    if (!businessName || !ownerName || !email || !city || !state) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await db.listingRequest.create({
      data: { businessName, ownerName, email, phone, address, city, state, website, message },
    });

    // Send email notifications (fire-and-forget — don't fail the request if email fails)
    sendListingRequestNotification({ businessName, ownerName, email, phone, city, state, type, website, message })
      .catch((err) => console.error("[email] Failed to send listing request notification:", err));

    return NextResponse.json({ id: request.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/requests]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await db.listingRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
