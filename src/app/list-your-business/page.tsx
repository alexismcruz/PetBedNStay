"use client";

import { useState } from "react";
import { US_STATES } from "@/lib/utils";
import { CheckCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING } from "@/lib/paypal";

const PLANS = [
  {
    key: "FREE",
    name: "Free Listing",
    price: "$0",
    period: "forever",
    description: "Get your business found with a basic listing.",
    features: ["Listed in search results", "Shown on map", "City & state pages", "Contact info displayed"],
    cta: "List for Free",
    color: "border-stone-200",
    btnClass: "bg-stone-800 hover:bg-stone-900 text-white",
    highlight: false,
  },
  {
    key: "FEATURED",
    name: "Featured",
    price: `$${PRICING.FEATURED.amount}`,
    period: "/ month",
    description: "Stand out with a Featured badge and priority placement.",
    features: ["Everything in Free", "Featured badge", "Priority search placement", "Up to 3 photos", "Full description"],
    cta: "Get Featured",
    color: "border-brand-300",
    btnClass: "bg-brand-500 hover:bg-brand-600 text-white",
    highlight: false,
  },
  {
    key: "PREMIUM",
    name: "Premium",
    price: `$${PRICING.PREMIUM.amount}`,
    period: "/ month",
    description: "Maximum visibility and the full listing experience.",
    features: ["Everything in Featured", "⭐ Premium badge", "Top of all city & state pages", "Unlimited photos", "Hours & amenities"],
    cta: "Go Premium",
    color: "border-brand-500 ring-2 ring-brand-400",
    btnClass: "bg-amber-400 hover:bg-amber-500 text-white",
    highlight: true,
  },
];

const LISTING_TYPES = [
  { value: "HOTEL", label: "Pet Hotel / Boarding Facility" },
  { value: "SITTER", label: "Pet Sitter (home-based)" },
  { value: "BOTH", label: "Both Hotel & Sitter" },
];

export default function ListYourBusinessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      businessName: (form.elements.namedItem("businessName") as HTMLInputElement).value,
      ownerName: (form.elements.namedItem("ownerName") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      address: (form.elements.namedItem("address") as HTMLInputElement).value,
      city: (form.elements.namedItem("city") as HTMLInputElement).value,
      state: (form.elements.namedItem("state") as HTMLSelectElement).value,
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle className="h-16 w-16 text-forest-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Request Received!</h1>
        <p className="text-stone-500">
          We&apos;ll review your submission and reach out within 1-2 business days to get your listing live.
        </p>
        <a
          href="/"
          className="inline-block mt-6 bg-brand-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-600 transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">List Your Business</h1>
        <p className="mt-3 text-stone-500 text-lg max-w-xl mx-auto">
          Get your pet hotel or boarding service in front of thousands of pet owners. Free to start — upgrade anytime.
        </p>
      </div>

      {/* Pricing tiers */}
      <div id="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={cn(
              "relative bg-white rounded-2xl border p-6 flex flex-col cursor-pointer",
              "transition-all duration-200 hover:scale-105 hover:shadow-xl",
              plan.color,
              plan.highlight && "shadow-lg"
            )}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-stone-800">{plan.name}</h2>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-stone-900">{plan.price}</span>
                <span className="text-stone-400 text-sm">{plan.period}</span>
              </div>
              <p className="text-stone-500 text-sm mt-1">{plan.description}</p>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                  <Check className="h-4 w-4 text-forest-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={plan.key === "FREE" ? "#form" : "/premium"}
              className={cn("block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors", plan.btnClass)}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      {/* Form section */}
      <div id="form" className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-stone-800">Submit Your Free Listing</h2>
        <p className="mt-2 text-stone-500">Fill in your details and we'll get you live within 1–2 business days.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Business Name *" name="businessName" required placeholder="Paws Paradise Hotel" />
          <Field label="Owner / Contact Name *" name="ownerName" required placeholder="Jane Smith" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Email Address *" name="email" type="email" required placeholder="jane@example.com" />
          <Field label="Phone Number" name="phone" type="tel" placeholder="(555) 123-4567" />
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
          <Field label="City *" name="city" required placeholder="Los Angeles" />
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">State *</label>
            <select
              name="state"
              required
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
          <a href="#pricing" className="text-brand-600 hover:underline">See Premium plans ↑</a>.
        </p>
      </form>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", required, placeholder,
}: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
    </div>
  );
}
