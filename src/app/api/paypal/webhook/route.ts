import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendSubscriptionAlert } from "@/lib/email";

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

function getTier(planId: string): string {
  if (planId === process.env.PAYPAL_FEATURED_PLAN_ID) return "FEATURED";
  if (planId === process.env.PAYPAL_PREMIUM_PLAN_ID)  return "PREMIUM";
  return planId; // fallback: show raw plan ID in email
}

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

      // ── New subscription activated (first payment cleared) ─────────────────
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const subscriptionId    = resource.id as string;
        const planId            = resource.plan_id as string;
        const subscriberEmail   = resource.subscriber?.email_address as string | undefined;
        const subscriberName    = resource.subscriber?.name
          ? `${resource.subscriber.name.given_name ?? ""} ${resource.subscriber.name.surname ?? ""}`.trim()
          : undefined;

        // Alert admin to manually upgrade the listing
        await sendSubscriptionAlert({
          eventType:       "activated",
          subscriptionId,
          planId,
          tier:            getTier(planId),
          subscriberEmail,
          subscriberName,
        });

        // Also try DB update if a PremiumPlan was pre-linked
        const plan = await db.premiumPlan.findFirst({ where: { paypalOrderId: subscriptionId } });
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

      // ── Monthly payment succeeded — extend the period by 30 days ──────────
      case "PAYMENT.SALE.COMPLETED": {
        const subscriptionId = resource.billing_agreement_id as string | undefined;
        if (!subscriptionId) break;
        const plan = await db.premiumPlan.findFirst({ where: { paypalOrderId: subscriptionId } });
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

      // ── Subscription cancelled / suspended / expired ───────────────────────
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.SUSPENDED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        const subscriptionId  = resource.id as string;
        const planId          = resource.plan_id as string;
        const subscriberEmail = resource.subscriber?.email_address as string | undefined;
        const subscriberName  = resource.subscriber?.name
          ? `${resource.subscriber.name.given_name ?? ""} ${resource.subscriber.name.surname ?? ""}`.trim()
          : undefined;
        const eventType = event_type.split(".")[2].toLowerCase() as "cancelled" | "suspended" | "expired";

        // Alert admin to manually revert the listing to FREE
        await sendSubscriptionAlert({
          eventType,
          subscriptionId,
          planId,
          tier:            getTier(planId),
          subscriberEmail,
          subscriberName,
        });

        // Also try DB update if a PremiumPlan was pre-linked
        const plan = await db.premiumPlan.findFirst({ where: { paypalOrderId: subscriptionId } });
        if (plan) {
          await db.$transaction([
            db.premiumPlan.update({ where: { id: plan.id }, data: { isActive: false } }),
            db.listing.update({ where: { id: plan.listingId }, data: { tier: "FREE" } }),
          ]);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event_type}:`, err);
    // Return 200 so PayPal doesn't retry endlessly
  }

  return NextResponse.json({ received: true });
}
