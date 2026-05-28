import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * PayPal Webhook handler — manages subscription lifecycle.
 * Register this URL in PayPal Developer → Webhooks:
 *   https://petbednstay.com/api/paypal/webhook
 *
 * Events to subscribe to:
 *   BILLING.SUBSCRIPTION.ACTIVATED
 *   BILLING.SUBSCRIPTION.CANCELLED
 *   BILLING.SUBSCRIPTION.SUSPENDED
 *   BILLING.SUBSCRIPTION.EXPIRED
 *   PAYMENT.SALE.COMPLETED  (each successful monthly charge)
 */
export async function POST(req: NextRequest) {
  let body: string;
  let event: any;

  try {
    body  = await req.text();
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_type, resource } = event;

  try {
    switch (event_type) {
      // Subscription successfully activated (first payment cleared)
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const subscriptionId = resource.id;
        const plan = await db.premiumPlan.findFirst({
          where: { paypalOrderId: subscriptionId },
        });
        if (plan) {
          const endsAt = new Date();
          endsAt.setDate(endsAt.getDate() + 30);
          await db.premiumPlan.update({
            where: { id: plan.id },
            data:  { isActive: true, endsAt },
          });
        }
        break;
      }

      // Monthly payment succeeded — extend the period by 30 days
      case "PAYMENT.SALE.COMPLETED": {
        const subscriptionId = resource.billing_agreement_id;
        if (!subscriptionId) break;
        const plan = await db.premiumPlan.findFirst({
          where: { paypalOrderId: subscriptionId },
        });
        if (plan) {
          const endsAt = new Date();
          endsAt.setDate(endsAt.getDate() + 30);
          await db.premiumPlan.update({
            where: { id: plan.id },
            data:  { isActive: true, endsAt },
          });
        }
        break;
      }

      // Subscription cancelled / suspended / expired — revert to FREE
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.SUSPENDED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        const subscriptionId = resource.id;
        const plan = await db.premiumPlan.findFirst({
          where: { paypalOrderId: subscriptionId },
        });
        if (plan) {
          await db.$transaction([
            db.premiumPlan.update({
              where: { id: plan.id },
              data:  { isActive: false },
            }),
            db.listing.update({
              where: { id: plan.listingId },
              data:  { tier: "FREE" },
            }),
          ]);
        }
        break;
      }

      default:
        // Unhandled event — acknowledge and ignore
        break;
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event_type}:`, err);
    // Return 200 anyway so PayPal doesn't retry endlessly
  }

  return NextResponse.json({ received: true });
}
