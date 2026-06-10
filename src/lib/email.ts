// All transactional email goes through Brevo — same API key used everywhere else.
// No separate Resend account needed.

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const SENDER = { name: "PetBedNStay", email: "hello@petbednstay.com" };
const ADMIN_EMAIL = "hello@petbednstay.com";

async function sendBrevoEmail(payload: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}) {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.warn("[email] BREVO_API_KEY not set — skipping email");
    return;
  }
  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": key },
    body: JSON.stringify({ sender: SENDER, ...payload }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[email] Brevo error:", res.status, text);
  }
}

export async function sendListingRequestNotification(data: {
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  city: string;
  state: string;
  type?: string;
  website?: string;
  message?: string;
}) {
  // 1. Notify admin
  await sendBrevoEmail({
    to: [{ email: ADMIN_EMAIL, name: "Alexis" }],
    subject: `New Listing Request: ${data.businessName}`,
    htmlContent: `
      <h2>New Listing Request</h2>
      <table cellpadding="6" style="font-family:sans-serif;font-size:14px;">
        <tr><td><strong>Business:</strong></td><td>${data.businessName}</td></tr>
        <tr><td><strong>Owner:</strong></td><td>${data.ownerName}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${data.phone ?? "—"}</td></tr>
        <tr><td><strong>Location:</strong></td><td>${data.city}, ${data.state}</td></tr>
        <tr><td><strong>Type:</strong></td><td>${data.type ?? "—"}</td></tr>
        <tr><td><strong>Website:</strong></td><td>${data.website ?? "—"}</td></tr>
        <tr><td><strong>Message:</strong></td><td>${data.message ?? "—"}</td></tr>
      </table>
    `,
    replyTo: { email: data.email, name: data.ownerName },
  });

  // 2. Auto-confirmation to the business owner
  await sendBrevoEmail({
    to: [{ email: data.email, name: data.ownerName }],
    subject: `We received your listing request — PetBedNStay`,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2 style="color:#c96b2c;">Thanks, ${data.ownerName}! 🐾</h2>
        <p>We've received your listing request for <strong>${data.businessName}</strong> and will review it within <strong>1–2 business days</strong>.</p>
        <p>Once approved, your listing will appear on PetBedNStay for pet owners in ${data.city}, ${data.state} to find.</p>
        <p style="margin-top:24px;">Want to get to the top of search results faster?<br/>
          <a href="https://petbednstay.com/list-your-business#pricing" style="color:#c96b2c;">Upgrade to Featured or Premium →</a>
        </p>
        <hr style="margin:24px 0;border:none;border-top:1px solid #eee;"/>
        <p style="color:#999;font-size:12px;">PetBedNStay — Trusted pet boarding directory across all 50 states</p>
      </div>
    `,
  });
}

export async function sendSubscriptionAlert(data: {
  eventType: "activated" | "cancelled" | "suspended" | "expired";
  subscriptionId: string;
  planId: string;
  tier: string;
  subscriberEmail?: string;
  subscriberName?: string;
}) {
  const isNew = data.eventType === "activated";
  const subject = isNew
    ? `🎉 New ${data.tier} subscription — ${data.subscriberEmail ?? data.subscriptionId}`
    : `⚠️ Subscription ${data.eventType} — ${data.subscriberEmail ?? data.subscriptionId}`;

  const actionNote = isNew
    ? `<p style="background:#fef3c7;padding:12px 16px;border-radius:8px;border-left:4px solid #f59e0b;">
        <strong>Action needed:</strong> Find their listing and upgrade the tier to <strong>${data.tier}</strong>.
       </p>`
    : `<p style="background:#fee2e2;padding:12px 16px;border-radius:8px;border-left:4px solid #ef4444;">
        <strong>Action needed:</strong> Find their listing and revert the tier back to <strong>FREE</strong>.
       </p>`;

  await sendBrevoEmail({
    to: [{ email: ADMIN_EMAIL, name: "Alexis" }],
    subject,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2 style="color:#c96b2c;">PayPal Subscription ${data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1)}</h2>
        <table cellpadding="6" style="font-size:14px;width:100%;">
          <tr><td><strong>Plan:</strong></td><td>${data.tier}</td></tr>
          <tr><td><strong>Subscriber:</strong></td><td>${data.subscriberName ?? "—"}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${data.subscriberEmail ?? "—"}</td></tr>
          <tr><td><strong>Subscription ID:</strong></td><td><code>${data.subscriptionId}</code></td></tr>
          <tr><td><strong>Plan ID:</strong></td><td><code>${data.planId}</code></td></tr>
        </table>
        <br/>
        ${actionNote}
        <hr style="margin:24px 0;border:none;border-top:1px solid #eee;"/>
        <p style="color:#999;font-size:12px;">PetBedNStay — PayPal webhook notification</p>
      </div>
    `,
  });
}

export async function sendAdRequestNotification(data: {
  spotName: string;
  billing: string;
  price: number;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  website: string;
  targetState?: string;
  message?: string;
}) {
  const billingLabel = data.billing === "monthly" ? `$${data.price}/month (recurring)` : `$${data.price} one-time (30 days)`;

  await sendBrevoEmail({
    to: [{ email: ADMIN_EMAIL, name: "Alexis" }],
    subject: `New Ad Request: ${data.spotName} — ${data.businessName}`,
    htmlContent: `
      <h2>New Ad Space Request</h2>
      <table cellpadding="6" style="font-family:sans-serif;font-size:14px;">
        <tr><td><strong>Ad Spot:</strong></td><td>${data.spotName}</td></tr>
        <tr><td><strong>Billing:</strong></td><td>${billingLabel}</td></tr>
        <tr><td><strong>Business:</strong></td><td>${data.businessName}</td></tr>
        <tr><td><strong>Contact:</strong></td><td>${data.contactName}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${data.phone ?? "—"}</td></tr>
        <tr><td><strong>Website:</strong></td><td>${data.website}</td></tr>
        <tr><td><strong>Target State:</strong></td><td>${data.targetState || "—"}</td></tr>
        <tr><td><strong>Notes:</strong></td><td>${data.message || "—"}</td></tr>
      </table>
    `,
    replyTo: { email: data.email, name: data.contactName },
  });

  await sendBrevoEmail({
    to: [{ email: data.email, name: data.contactName }],
    subject: `We received your ad request — PetBedNStay`,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2 style="color:#c96b2c;">Thanks, ${data.contactName}!</h2>
        <p>We've received your request to advertise on <strong>${data.spotName}</strong> at <strong>${billingLabel}</strong>.</p>
        <p>Our team will review and reach out within <strong>24 hours</strong> with a payment link and your ad creative specs.</p>
        <p>No charge until you confirm.</p>
        <hr style="margin:24px 0;border:none;border-top:1px solid #eee;"/>
        <p style="color:#999;font-size:12px;">Questions? Reply to this email or write to <a href="mailto:ads@petbednstay.com" style="color:#c96b2c;">ads@petbednstay.com</a></p>
        <p style="color:#999;font-size:12px;">PetBedNStay — Trusted pet boarding directory across all 50 states</p>
      </div>
    `,
  });
}
