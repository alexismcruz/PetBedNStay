import { NextRequest, NextResponse } from "next/server";
import { createSubscription } from "@/lib/paypal";

const PLAN_IDS: Record<string, string | undefined> = {
  FEATURED: process.env.PAYPAL_FEATURED_PLAN_ID,
  PREMIUM:  process.env.PAYPAL_PREMIUM_PLAN_ID,
};

export async function POST(req: NextRequest) {
  try {
    const { tier, listingId } = await req.json();

    if (!tier || !listingId) {
      return NextResponse.json({ error: "tier and listingId are required" }, { status: 400 });
    }

    const planId = PLAN_IDS[tier as string];
    if (!planId) {
      return NextResponse.json(
        { error: `No PayPal plan configured for tier: ${tier}. Add PAYPAL_${tier}_PLAN_ID to env vars.` },
        { status: 400 }
      );
    }

    const subscription = await createSubscription(planId, listingId, tier);
    return NextResponse.json(subscription);
  } catch (err) {
    console.error("[POST /api/paypal/create-subscription]", err);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
