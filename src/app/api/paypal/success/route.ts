import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { db } from "@/lib/db";

// PayPal redirects here after user approves the order
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("token");
  const listingId = searchParams.get("listingId");
  const tier = searchParams.get("tier");

  if (!orderId || !listingId || !tier) {
    return NextResponse.redirect(new URL("/premium?error=missing_params", req.url));
  }

  try {
    const capture = await capturePayPalOrder(orderId);

    if (capture.status === "COMPLETED") {
      const now = new Date();
      const endsAt = new Date(now);
      endsAt.setDate(endsAt.getDate() + 30);

      await db.$transaction([
        db.listing.update({
          where: { id: listingId },
          data: { tier: tier as "FEATURED" | "PREMIUM" },
        }),
        db.premiumPlan.upsert({
          where: { listingId },
          create: { listingId, tier: tier as "FEATURED" | "PREMIUM", paypalOrderId: orderId, startsAt: now, endsAt, isActive: true },
          update: { tier: tier as "FEATURED" | "PREMIUM", paypalOrderId: orderId, startsAt: now, endsAt, isActive: true },
        }),
      ]);

      return NextResponse.redirect(new URL("/premium?success=true", req.url));
    }

    return NextResponse.redirect(new URL("/premium?error=payment_failed", req.url));
  } catch {
    return NextResponse.redirect(new URL("/premium?error=server_error", req.url));
  }
}
