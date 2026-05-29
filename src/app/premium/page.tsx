"use client";

import { useState, useRef } from "react";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING } from "@/lib/pricing";
import { PayPalSubscriptionButton } from "@/components/PayPalSubscriptionButton";

// Plan IDs — set NEXT_PUBLIC_PAYPAL_FEATURED_PLAN_ID and
// NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID in Vercel env vars
const PLAN_IDS: Record<string, string> = {
  FEATURED: process.env.NEXT_PUBLIC_PAYPAL_FEATURED_PLAN_ID ?? "P-3XH954649X9970221NIMRLII",
  PREMIUM:  process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID  ?? "P-8P733851T85464150NIMR3VA",
};

const PLANS = [
  {
    key: "FREE",
    name: "Free Listing",
    price: "$0",
    period: "forever",
    description: "Get your business found with a basic listing.",
    features: [
      "Listed in search results",
      "Shown on map",
      "City & state pages",
      "Contact info displayed",
      "Basic business info",
    ],
    cta: "List for Free",
    href: "/list-your-business",
    highlight: false,
    color: "border-stone-200",
    btnClass: "bg-stone-800 hover:bg-stone-900 text-white",
  },
  {
    key: "FEATURED",
    name: "Featured",
    price: `$${PRICING.FEATURED.amount}`,
    period: "/ month",
    description: "Stand out with a Featured badge and priority placement.",
    features: [
      "Everything in Free",
      "Featured badge on listing",
      "Priority in search results",
      "Up to 3 photos",
      "Full description",
      "Priority city & state placement",
    ],
    cta: "Get Featured",
    highlight: false,
    color: "border-brand-300",
    btnClass: "bg-brand-500 hover:bg-brand-600 text-white",
  },
  {
    key: "PREMIUM",
    name: "Premium",
    price: `$${PRICING.PREMIUM.amount}`,
    period: "/ month",
    description: "Maximum visibility and the full listing experience.",
    features: [
      "Everything in Featured",
      "⭐ Premium badge",
      "Top of all city & state pages",
      "Full photo gallery (unlimited)",
      "Hours of operation",
      "Amenities list",
      "Highlighted ring on listing card",
      "First in search results",
    ],
    cta: "Go Premium",
    highlight: true,
    color: "border-brand-500 ring-2 ring-brand-400",
    btnClass: "bg-amber-400 hover:bg-amber-500 text-white",
  },
];

export default function PremiumPage() {
  const listingInputRef = useRef<HTMLInputElement>(null);
  const paymentRef      = useRef<HTMLDivElement>(null);

  const [selected,   setSelected]   = useState<"FEATURED" | "PREMIUM" | null>(null);
  const [listingId,  setListingId]  = useState("");
  const [inputError, setInputError] = useState(false);
  const [success,    setSuccess]    = useState(false);

  function handleSelectPlan(tier: "FEATURED" | "PREMIUM") {
    if (!listingId.trim()) {
      setInputError(true);
      listingInputRef.current?.focus();
      listingInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setInputError(false), 2500);
      return;
    }
    setSelected(tier);
    setTimeout(() => {
      paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-5">🎉</div>
        <h1 className="text-2xl font-bold text-stone-800 mb-3">You&apos;re all set!</h1>
        <p className="text-stone-500 text-sm leading-relaxed mb-8">
          Your subscription has been received. Your listing will be upgraded within a few
          minutes once PayPal confirms the first payment.
        </p>
        <a
          href="/"
          className="inline-block bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Star className="h-4 w-4" /> Premium Listings
        </div>
        <h1 className="text-4xl font-bold text-stone-800 mb-3">Reach More Pet Owners</h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto">
          Upgrade your listing to get priority placement, more photos, and a premium badge
          that builds trust with pet owners.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={cn(
              "relative bg-white rounded-2xl border p-6 flex flex-col",
              "transition-all duration-200 hover:scale-105 hover:shadow-xl",
              plan.color,
              plan.highlight && "shadow-xl"
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

            {plan.key === "FREE" ? (
              <a
                href={plan.href}
                className={cn("block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors", plan.btnClass)}
              >
                {plan.cta}
              </a>
            ) : (
              <button
                onClick={() => handleSelectPlan(plan.key as "FEATURED" | "PREMIUM")}
                className={cn("w-full py-2.5 rounded-xl font-semibold text-sm transition-colors", plan.btnClass)}
              >
                {plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Listing ID + PayPal payment section */}
      <div className="max-w-md mx-auto space-y-4">

        {/* Listing ID input */}
        <div className="bg-white border border-amber-100 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-stone-800 mb-1">Already listed? Enter your Listing ID to upgrade.</h3>
          <p className="text-xs text-stone-400 mb-3">
            Your Listing ID was sent in your confirmation email when you submitted your listing.
          </p>
          <input
            ref={listingInputRef}
            type="text"
            value={listingId}
            onChange={(e) => { setListingId(e.target.value); setSelected(null); }}
            placeholder="e.g. clx7ab3..."
            className={cn(
              "w-full border rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-400 mb-2 transition-colors",
              inputError ? "border-red-400 ring-2 ring-red-200" : "border-amber-200"
            )}
          />
          {inputError && (
            <p className="text-xs text-red-500 mb-2">
              Please enter your Listing ID before choosing a plan.
            </p>
          )}
          <p className="text-xs text-stone-400">
            Don&apos;t have a listing yet?{" "}
            <a href="/list-your-business" className="text-brand-600 hover:underline">
              List for free first →
            </a>
          </p>
        </div>

        {/* PayPal button — appears once a plan is selected and listing ID is filled */}
        {selected && listingId.trim() && (
          <div ref={paymentRef} className="bg-white border border-brand-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-semibold text-stone-800">
                  {selected === "FEATURED" ? "Featured" : "⭐ Premium"} —{" "}
                  ${selected === "FEATURED" ? PRICING.FEATURED.amount : PRICING.PREMIUM.amount}/mo
                </p>
                <p className="text-xs text-stone-400 mt-0.5">Listing ID: {listingId}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-stone-400 hover:text-stone-600 underline"
              >
                Change
              </button>
            </div>

            <PayPalSubscriptionButton
              planId={PLAN_IDS[selected]}
              listingId={listingId}
              tier={selected}
              onSuccess={() => setSuccess(true)}
            />
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="mt-12 max-w-2xl mx-auto">
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
              a: "Within a few minutes of payment confirmation — PayPal sends us an instant webhook notification.",
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
