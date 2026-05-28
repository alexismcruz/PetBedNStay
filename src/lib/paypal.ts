const PAYPAL_API =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function createPayPalOrder(amount: string, description: string) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: amount },
          description,
        },
      ],
    }),
  });

  return res.json();
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.json();
}

// Re-export from pricing.ts so existing server-side imports still work
export { PRICING } from "./pricing";

const PAYPAL_API =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

/** Create a recurring subscription for a listing tier */
export async function createSubscription(
  planId: string,
  listingId: string,
  tier: string
) {
  const token = await getAccessToken();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://petbednstay.com";

  const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        brand_name: "PetBedNStay",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${appUrl}/api/paypal/subscription-return?listingId=${listingId}&tier=${tier}`,
        cancel_url: `${appUrl}/list-your-business`,
      },
    }),
  });

  return res.json();
}

/** Cancel an active subscription */
export async function cancelSubscription(subscriptionId: string, reason = "User requested cancellation") {
  const token = await getAccessToken();

  await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });
}

/** Verify a webhook event signature */
export async function verifyWebhookSignature(headers: Record<string, string>, body: string) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo:         headers["paypal-auth-algo"],
      cert_url:          headers["paypal-cert-url"],
      transmission_id:   headers["paypal-transmission-id"],
      transmission_sig:  headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id:        process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body),
    }),
  });

  const data = await res.json();
  return data.verification_status === "SUCCESS";
}
