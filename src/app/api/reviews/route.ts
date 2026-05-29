import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { listingId, authorName, rating, body } = await req.json();

    // Validate required fields
    if (!listingId || !authorName?.trim() || !body?.trim() || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (body.trim().length < 10) {
      return NextResponse.json({ error: "Review must be at least 10 characters" }, { status: 400 });
    }

    // Verify listing exists
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const review = await db.review.create({
      data: {
        listingId,
        authorName: authorName.trim(),
        rating,
        body: body.trim(),
        isApproved: true,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error("[reviews] POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
