"use client";

import { useState } from "react";
import { Check, Star, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING } from "@/lib/pricing";
import { PayPalSubscriptionButton } from "@/components/PayPalSubscriptionButton";

const PLAN_IDS: Record<string, string> = {
  FEATURED: process.env.NEXT_PUBLIC_PAYPAL_FEATURED_PLAN_ID ?? "P-3XH954649X9970221NIMRLII",
  PREMIUM:  process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID  ?? "P-8P733851T85464150NIMR3VA",
};

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ tier }: { tier: "FEATURED" | "PREMIUM" }) {
  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PremiumPage() {
  const [success, setSuccess] = useState<"FEATURED" | "PREMIUM" | null>(null);

  if (success) return <SuccessScreen tier={success} />;

  return (
    <div className="bg-warm-50 min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            <Star className="h-3.5 w-3.5" /> Premium Listings
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3 leading-tight">
            Get Found by More Pet Owners
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Upgrade your listing for priority placement, more photos, and a badge
            that instantly builds trust — cancel anytime from your PayPal account.
          </p>
        </div>
      </div>

      {/* ── Plans ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* FREE */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 flex flex-col">
            <div className="mb-5">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Free</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-stone-800">$0</span>
                <span className="text-stone-400 text-sm">/ forever</span>
              </div>
              <p className="text-stone-500 text-sm mt-2">
                Get your business found with a basic listing at no cost.
              </p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {[
                "Listed in search results",
                "Shown on map",
                "City & state pages",
                "Contact info displayed",
                "Basic business info",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                  <Check className="h-4 w-4 text-forest-500 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <a
              href="/list-your-business"
              className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              List for Free
            </a>
          </div>

          {/* FEATURED */}
          <div className="bg-white rounded-2xl border border-brand-200 shadow-sm p-6 flex flex-col">
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="h-4 w-4 text-brand-500" />
                <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Featured</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-stone-800">${PRICING.FEATURED.amount}</span>
                <span className="text-stone-400 text-sm">/ month</span>
              </div>
              <p className="text-stone-500 text-sm mt-2">
                Stand out with a badge and priority placement above free listings.
              </p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {[
                "Everything in Free",
                "Featured badge on listing",
                "Priority in search results",
                "Up to 3 photos",
                "Full description",
                "Priority city & state placement",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                  <Check className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" /> {f}
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
          <div className="relative bg-stone-900 rounded-2xl shadow-xl p-6 flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              Most Popular
            </div>
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-1">
                <Crown className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Premium</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">${PRICING.PREMIUM.amount}</span>
                <span className="text-stone-400 text-sm">/ month</span>
              </div>
              <p className="text-stone-400 text-sm mt-2">
                Maximum visibility — first on every page, unlimited photos, full amenities list.
              </p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {[
                "Everything in Featured",
                "⭐ Premium badge",
                "Top of all city & state pages",
                "Full photo gallery (unlimited)",
                "Hours of operation",
                "Amenities list",
                "Highlighted ring on listing card",
                "First in search results",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-300">
                  <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> {f}
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

        {/* ── Trust bar ────────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-stone-400">
          <span>✓ Cancel anytime from PayPal</span>
          <span>✓ No contracts</span>
          <span>✓ Secure payment via PayPal</span>
          <span>✓ Activates within 24 hours</span>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div className="mt-14 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-5 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "How long does a Featured or Premium subscription last?",
                a: "Subscriptions are 30-day rolling. You're billed monthly through PayPal until you cancel.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel directly from your PayPal account at any time — no need to contact us.",
              },
              {
                q: "When does my listing upgrade take effect?",
                a: "Within 24 hours of payment. Email hello@petbednstay.com with your business name and we'll activate it right away.",
              },
              {
                q: "What payment methods are accepted?",
                a: "PayPal — and through PayPal you can also pay with any major credit or debit card.",
              },
            ].map((item) => (
              <div key={item.q} className="bg-white border border-amber-100 rounded-xl p-5">
                <h3 className="font-semibold text-stone-800 text-sm mb-1">{item.q}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
