"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { US_STATES } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { CheckCircle, Check, Crown, Zap, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING } from "@/lib/pricing";
import { PayPalSubscriptionButton } from "@/components/PayPalSubscriptionButton";

const PLAN_IDS: Record<string, string> = {
  FEATURED: process.env.NEXT_PUBLIC_PAYPAL_FEATURED_PLAN_ID ?? "P-3XH954649X9970221NIMRLII",
  PREMIUM:  process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID  ?? "P-8P733851T85464150NIMR3VA",
};

const LISTING_TYPES = [
  { value: "HOTEL", label: "Pet Hotel / Boarding Facility" },
  { value: "SITTER", label: "Pet Sitter (home-based)" },
  { value: "BOTH", label: "Both Hotel & Sitter" },
];

function SuccessScreen({ tier }: { tier: "FEATURED" | "PREMIUM" }) {
  return (
    <div className="bg-warm-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-stone-800 mb-2">
          You&apos;re subscribed to {tier === "FEATURED" ? "Featured" : "Premium"}!
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed mb-6">
          Payment confirmed. Email us your business name or listing URL and we&apos;ll
          upgrade your listing within 24 hours.
        </p>
        <a
          href="mailto:hello@petbednstay.com?subject=Listing%20Upgrade%20Request"
          className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
        >
          Email hello@petbednstay.com
        </a>
        <a href="/" className="text-sm text-stone-400 hover:text-brand-600 transition-colors">
          Return to home →
        </a>
      </div>
    </div>
  );
}

export default function ListYourBusinessPage() {
  return (
    <Suspense fallback={null}>
      <ListYourBusinessForm />
    </Suspense>
  );
}

function ListYourBusinessForm() {
  const searchParams = useSearchParams();
  const claimName  = searchParams.get("claim")  ?? "";
  const claimCity  = searchParams.get("city")   ?? "";
  const claimStateRaw = searchParams.get("state") ?? "";
  // Incoming state may be a display name ("California") — resolve to slug for the select
  const claimStateSlug =
    US_STATES.find((s) => s.slug === claimStateRaw || s.name === claimStateRaw)?.slug ?? "";

  const [submitted,    setSubmitted]    = useState(false);
  const [paidSuccess,  setPaidSuccess]  = useState<"FEATURED" | "PREMIUM" | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      businessName: (form.elements.namedItem("businessName") as HTMLInputElement).value,
      ownerName:    (form.elements.namedItem("ownerName")    as HTMLInputElement).value,
      email:        (form.elements.namedItem("email")        as HTMLInputElement).value,
      phone:        (form.elements.namedItem("phone")        as HTMLInputElement).value,
      address:      (form.elements.namedItem("address")      as HTMLInputElement).value,
      city:         (form.elements.namedItem("city")         as HTMLInputElement).value,
      state:        (form.elements.namedItem("state")        as HTMLSelectElement).value,
      type:         (form.elements.namedItem("type")         as HTMLSelectElement).value,
      website:      (form.elements.namedItem("website")      as HTMLInputElement).value,
      message:      (form.elements.namedItem("message")      as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/requests", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      trackEvent("listing_request_submitted", { plan: claimName ? "claim" : "free" });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (paidSuccess) return <SuccessScreen tier={paidSuccess} />;

  if (submitted) {
    return (
      <div className="bg-warm-50 min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <CheckCircle className="h-16 w-16 text-forest-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Request Received!</h1>
          <p className="text-stone-500">
            We&apos;ll review your submission and reach out within 1–2 business days to get your listing live.
          </p>
          <a
            href="/"
            className="inline-block mt-6 bg-brand-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-600 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-50 min-h-screen">
      {/* White hero header */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">List Your Business</h1>
          <p className="mt-3 text-stone-500 text-lg max-w-xl mx-auto">
            Get your pet hotel or boarding service in front of thousands of pet owners. Free to start — upgrade anytime.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Pricing tiers */}
        <div id="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* FREE */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-stone-800">Free Listing</h2>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-stone-900">$0</span>
                <span className="text-stone-400 text-sm">/ forever</span>
              </div>
              <p className="text-stone-500 text-sm mt-1">Get your business found with a basic listing.</p>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              {["Listed in search results", "Shown on map", "City & state pages", "Contact info displayed"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                  <Check className="h-4 w-4 text-forest-500 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <a
              href="#form"
              className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors bg-stone-800 hover:bg-stone-900 text-white"
            >
              List for Free
            </a>
          </div>

          {/* FEATURED */}
          <div className="bg-white rounded-2xl border border-brand-300 p-6 flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="h-4 w-4 text-brand-500" />
                <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Featured</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-stone-900">${PRICING.FEATURED.amount}</span>
                <span className="text-stone-400 text-sm">/ month</span>
              </div>
              <p className="text-stone-500 text-sm mt-1">Stand out with a Featured badge and priority placement.</p>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              {["Everything in Free", "Featured badge", "Priority search placement", "Up to 3 photos", "Full description"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                  <Check className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <PayPalSubscriptionButton
              planId={PLAN_IDS.FEATURED}
              tier="FEATURED"
              onSuccess={() => { trackEvent("subscription_started", { plan: "featured" }); setPaidSuccess("FEATURED"); }}
            />
          </div>

          {/* PREMIUM */}
          <div className={cn("relative bg-stone-900 rounded-2xl shadow-xl p-6 flex flex-col")}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              Most Popular
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Crown className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Premium</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">${PRICING.PREMIUM.amount}</span>
                <span className="text-stone-400 text-sm">/ month</span>
              </div>
              <p className="text-stone-400 text-sm mt-1">Maximum visibility — top of every page, unlimited photos.</p>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              {["Everything in Featured", "⭐ Premium badge", "Top of all city & state pages", "Unlimited photos", "Hours & amenities"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-300">
                  <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <PayPalSubscriptionButton
              planId={PLAN_IDS.PREMIUM}
              tier="PREMIUM"
              onSuccess={() => { trackEvent("subscription_started", { plan: "premium" }); setPaidSuccess("PREMIUM"); }}
            />
          </div>

        </div>

        {/* Trust bar */}
        <div className="mb-12 flex flex-wrap justify-center gap-6 text-xs text-stone-400">
          <span>✓ Free listings reviewed in 1–2 days</span>
          <span>✓ Cancel paid plans anytime from PayPal</span>
          <span>✓ No contracts</span>
          <span>✓ Secure payment via PayPal</span>
        </div>

        {/* Free listing form */}
        <div id="form" className="max-w-2xl mx-auto">
          {claimName && (
            <div className="mb-6 bg-forest-50 border border-forest-200 rounded-2xl p-4 flex items-start gap-3">
              <BadgeCheck className="h-5 w-5 text-forest-600 shrink-0 mt-0.5" />
              <p className="text-sm text-stone-700 leading-relaxed">
                You&apos;re claiming <span className="font-semibold">{claimName}</span>. We&apos;ve pre-filled
                what we have — just add your contact details and anything you&apos;d like pet owners to see.
                Once verified, you can add photos, prices, and hours.
              </p>
            </div>
          )}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-stone-800">
              {claimName ? "Claim Your Listing" : "Submit Your Free Listing"}
            </h2>
            <p className="mt-2 text-stone-500">Fill in your details and we'll get you live within 1–2 business days.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Business Name *"        name="businessName" required placeholder="Paws Paradise Hotel" defaultValue={claimName} />
              <Field label="Owner / Contact Name *" name="ownerName"    required placeholder="Jane Smith" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Email Address *" name="email" type="email" required placeholder="jane@example.com" />
              <Field label="Phone Number"   name="phone" type="tel"               placeholder="(555) 123-4567" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Business Type *</label>
              <select
                name="type"
                required
                className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">Select type…</option>
                {LISTING_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <Field label="Street Address" name="address" placeholder="123 Main St" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="City *" name="city" required placeholder="Los Angeles" defaultValue={claimCity} />
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">State *</label>
                <select
                  name="state"
                  required
                  defaultValue={claimStateSlug}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  <option value="">Select state…</option>
                  {US_STATES.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <Field label="Website (if any)" name="website" type="url" placeholder="https://yourpethotel.com" />

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Additional Info</label>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us about your facility, services, capacity, pet types accepted, etc."
                className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? "Submitting…" : "Submit Listing Request — Free"}
            </button>

            <p className="text-xs text-stone-400 text-center">
              We review all submissions within 1–2 business days. Want faster placement?{" "}
              <a href="#pricing" className="text-brand-600 hover:underline">See paid plans ↑</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", required, placeholder, defaultValue,
}: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
    </div>
  );
}
