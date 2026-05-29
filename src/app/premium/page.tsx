"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING } from "@/lib/pricing";
import { PayPalSubscriptionButton } from "@/components/PayPalSubscriptionButton";

const PLAN_IDS: Record<string, string> = {
  FEATURED: process.env.NEXT_PUBLIC_PAYPAL_FEATURED_PLAN_ID ?? "P-3XH954649X9970221NIMRLII",
  PREMIUM:  process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID  ?? "P-8P733851T85464150NIMR3VA",
};

const FEATURES = {
  FREE: [
    "Listed in search results",
    "Shown on map",
    "City & state pages",
    "Contact info displayed",
    "Basic business info",
  ],
  FEATURED: [
    "Everything in Free",
    "Featured badge on listing",
    "Priority in search results",
    "Up to 3 photos",
    "Full description",
    "Priority city & state placement",
  ],
  PREMIUM: [
    "Everything in Featured",
    "⭐ Premium badge",
    "Top of all city & state pages",
    "Full photo gallery (unlimited)",
    "Hours of operation",
    "Amenities list",
    "Highlighted ring on listing card",
    "First in search results",
  ],
};

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ tier }: { tier: "FEATURED" | "PREMIUM" }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-5">🎉</div>
      <h1 className="text-2xl font-bold text-stone-800 mb-3">
        You&apos;re subscribed to {tier === "FEATURED" ? "Featured" : "Premium"}!
      </h1>
      <p className="text-stone-500 text-sm leading-relaxed mb-6">
        Your payment was confirmed by PayPal. To activate your listing upgrade,
        email us with your business name or listing URL and we&apos;ll upgrade
        it within 24 hours.
      </p>
      <a
        href="mailto:hello@petbednstay.com?subject=Listing%20Upgrade%20Request"
        className="inline-block bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors mb-3"
      >
        Email hello@petbednstay.com
      </a>
      <p className="text-xs text-stone-400">
        Or{" "}
        <a href="/" className="text-brand-600 hover:underline">
          return to home
        </a>
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PremiumPage() {
  const [success, setSuccess] = useState<"FEATURED" | "PREMIUM" | null>(null);

  if (success) return <SuccessScreen tier={success} />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Star className="h-4 w-4" /> Premium Listings
        </div>
        <h1 className="text-4xl font-bold text-stone-800 mb-3">Reach More Pet Owners</h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto">
          Upgrade your listing to get priority placement, more photos, and a badge
          that builds trust with pet owners.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        {/* FREE */}
        <div className="relative bg-white rounded-2xl border border-stone-200 p-6 flex flex-col transition-all duration-200 hover:scale-105 hover:shadow-xl">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-stone-800">Free Listing</h2>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-stone-900">$0</span>
              <span className="text-stone-400 text-sm">forever</span>
            </div>
            <p className="text-stone-500 text-sm mt-1">Get your business found with a basic listing.</p>
          </div>
          <ul className="space-y-2 flex-1 mb-6">
            {FEATURES.FREE.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                <Check className="h-4 w-4 text-forest-500 shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
          <a
            href="/list-your-business"
            className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-stone-800 hover:bg-stone-900 text-white transition-colors"
          >
            List for Free
          </a>
        </div>

        {/* FEATURED */}
        <div className="relative bg-white rounded-2xl border border-brand-300 p-6 flex flex-col transition-all duration-200 hover:scale-105 hover:shadow-xl">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-stone-800">Featured</h2>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-stone-900">${PRICING.FEATURED.amount}</span>
              <span className="text-stone-400 text-sm">/ month</span>
            </div>
            <p className="text-stone-500 text-sm mt-1">Stand out with a Featured badge and priority placement.</p>
          </div>
          <ul className="space-y-2 flex-1 mb-6">
            {FEATURES.FEATURED.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                <Check className="h-4 w-4 text-forest-500 shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
          <PayPalSubscriptionButton
            planId={PLAN_IDS.FEATURED}
            tier="FEATURED"
            onSuccess={() => setSuccess("FEATURED")}
          />
        </div>

        {/* PREMIUM */}
        <div className={cn(
          "relative bg-white rounded-2xl border border-brand-500 ring-2 ring-brand-400 p-6 flex flex-col",
          "transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-xl"
        )}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            Most Popular
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-stone-800">Premium</h2>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-stone-900">${PRICING.PREMIUM.amount}</span>
              <span className="text-stone-400 text-sm">/ month</span>
            </div>
            <p className="text-stone-500 text-sm mt-1">Maximum visibility and the full listing experience.</p>
          </div>
          <ul className="space-y-2 flex-1 mb-6">
            {FEATURES.PREMIUM.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                <Check className="h-4 w-4 text-forest-500 shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
          <PayPalSubscriptionButton
            planId={PLAN_IDS.PREMIUM}
            tier="PREMIUM"
            onSuccess={() => setSuccess("PREMIUM")}
          />
        </div>

      </div>

      {/* FAQ */}
      <div className="mt-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-stone-800 mb-4 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How long does a Premium or Featured subscription last?",
              a: "Subscriptions are 30-day rolling. You'll be billed monthly through PayPal until you cancel.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel from your PayPal account at any time. Your listing reverts to Free at the end of the billing period.",
            },
            {
              q: "When does my listing upgrade take effect?",
              a: "Within 24 hours of payment. Email hello@petbednstay.com with your business name and we'll activate it right away.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept PayPal, and through PayPal you can also pay with any major credit or debit card.",
            },
          ].map((item) => (
            <div key={item.q} className="bg-white border border-amber-100 rounded-xl p-5">
              <h3 className="font-semibold text-stone-800 text-sm mb-1">{item.q}</h3>
              <p className="text-stone-500 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
