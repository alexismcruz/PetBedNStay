import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "PetBedNStay <hello@petbednstay.com>";
const ADMIN_EMAIL = "hello@petbednstay.com";

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
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Listing Request: ${data.businessName}`,
    html: `
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
  });

  // 2. Confirmation to submitter
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: `We received your listing request — PetBedNStay`,
    html: `
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
