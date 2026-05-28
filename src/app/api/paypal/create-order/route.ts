import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder, PRICING } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const { tier, listingId } = await req.json();

    if (!tier || !listingId) {
      return NextResponse.json({ error: "tier and listingId are required" }, { status: 400 });
    }

    const plan = PRICING[tier as keyof typeof PRICING];
    if (!plan) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const order = await createPayPalOrder(
      plan.amount,
      `${plan.description} — Listing: ${listingId}`
    );

    return NextResponse.json(order);
  } catch (err) {
    console.error("[POST /api/paypal/create-order]", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
