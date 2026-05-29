import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Called by the PayPalSubscriptionButton component immediately after
 * the buyer approves the subscription in the PayPal popup.
 *
 * We record the subscription as PENDING (isActive: false) so the
 * BILLING.SUBSCRIPTION.ACTIVATED webhook can flip it to active once
 * PayPal confirms the first payment cleared.
 */
export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, listingId, tier } = await req.json();

    if (!subscriptionId || !listingId || !tier) {
      return NextResponse.json({ error: "subscriptionId, listingId and tier are required" }, { status: 400 });
    }

    const now    = new Date();
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 30);

    await db.premiumPlan.upsert({
      where:  { listingId },
      create: {
        listingId,
        tier,
        paypalOrderId: subscriptionId, // webhook handler looks up by this field
        startsAt:      now,
        endsAt,
        isActive: false, // BILLING.SUBSCRIPTION.ACTIVATED webhook activates it
      },
      update: {
        tier,
        paypalOrderId: subscriptionId,
        startsAt:      now,
        endsAt,
        isActive: false,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/paypal/save-subscription]", err);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
