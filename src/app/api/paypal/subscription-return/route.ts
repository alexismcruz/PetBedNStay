import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PayPal redirects here after user approves the subscription
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subscriptionId = searchParams.get("subscription_id");
  const listingId      = searchParams.get("listingId");
  const tier           = searchParams.get("tier");

  if (!subscriptionId || !listingId || !tier) {
    return NextResponse.redirect(new URL("/list-your-business?error=missing_params", req.url));
  }

  try {
    const now    = new Date();
    const endsAt = new Date(now);
    endsAt.setDate(endsAt.getDate() + 30);

    await db.$transaction([
      db.listing.update({
        where: { id: listingId },
        data:  { tier: tier as "FEATURED" | "PREMIUM" },
      }),
      db.premiumPlan.upsert({
        where:  { listingId },
        create: {
          listingId,
          tier:            tier as "FEATURED" | "PREMIUM",
          paypalOrderId:   subscriptionId,
          startsAt:        now,
          endsAt,
          isActive:        true,
        },
        update: {
          tier:          tier as "FEATURED" | "PREMIUM",
          paypalOrderId: subscriptionId,
          startsAt:      now,
          endsAt,
          isActive:      true,
        },
      }),
    ]);

    return NextResponse.redirect(new URL("/list-your-business?success=true", req.url));
  } catch (err) {
    console.error("[subscription-return]", err);
    return NextResponse.redirect(new URL("/list-your-business?error=server_error", req.url));
  }
}
