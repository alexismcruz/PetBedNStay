import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, ownerName, email, phone, address, city, state, website, message } = body;

    if (!businessName || !ownerName || !email || !city || !state) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = await db.listingRequest.create({
      data: { businessName, ownerName, email, phone, address, city, state, website, message },
    });

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
