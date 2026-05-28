import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { orderId, listingId, tier } = await req.json();

    if (!orderId || !listingId || !tier) {
      return NextResponse.json({ error: "orderId, listingId, and tier are required" }, { status: 400 });
    }

    const capture = await capturePayPalOrder(orderId);

    if (capture.status === "COMPLETED") {
      const now = new Date();
      const endsAt = new Date(now);
      endsAt.setDate(endsAt.getDate() + 30);

      await db.$transaction([
        db.listing.update({
          where: { id: listingId },
          data: { tier },
        }),
        db.premiumPlan.upsert({
          where: { listingId },
          create: {
            listingId,
            tier,
            paypalOrderId: orderId,
            startsAt: now,
            endsAt,
            isActive: true,
          },
          update: {
            tier,
            paypalOrderId: orderId,
            startsAt: now,
            endsAt,
            isActive: true,
          },
        }),
      ]);

      return NextResponse.json({ success: true, status: "COMPLETED" });
    }

    return NextResponse.json({ success: false, status: capture.status }, { status: 400 });
  } catch (err) {
    console.error("[POST /api/paypal/capture-order]", err);
    return NextResponse.json({ error: "Failed to capture order" }, { status: 500 });
  }
}
