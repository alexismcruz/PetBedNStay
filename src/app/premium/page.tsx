"use client";

import { useState } from "react";
import { Check, Star, Zap, Crown, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { US_STATES } from "@/lib/utils";
import { PRICING } from "@/lib/pricing";
import { PayPalSubscriptionButton } from "@/components/PayPalSubscriptionButton";

const PLAN_IDS: Record<string, string> = {
  FEATURED: process.env.NEXT_PUBLIC_PAYPAL_FEATURED_PLAN_ID ?? "P-3XH954649X9970221NIMRLII",
  PREMIUM:  process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID  ?? "P-8P733851T85464150NIMR3VA",
};

const LISTING_TYPES = [
  { value: "HOTEL",  label: "Pet Hotel / Boarding Facility" },
  { value: "SITTER", label: "Pet Sitter (home-based)" },
  { value: "BOTH",   label: "Both Hotel & Sitter" },
];

const EMPTY_FORM = {
  businessName: "",
  ownerName:    "",
  email:        "",
  phone:        "",
  type:         "",
  address:      "",
  city:         "",
  state:        "",
  website:      "",
  message:      "",
};

// ── Free Listing Modal ────────────────────────────────────────────────────────
function FreeListingModal({ onClose }: { onClose: () => void }) {
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleClose() {
    setForm(EMPTY_FORM);
    setError("");
    setSubmitted(false);
    onClose();
  }

  function set(field: keyof typeof EMPTY_FORM) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/requests", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setForm(EMPTY_FORM);   // clear form
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-amber-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-stone-800">Free Listing Request</h2>
            <p className="text-xs text-stone-400 mt-0.5">We'll get you live within 1–2 business days</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-14 w-14 text-forest-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-800 mb-2">Request Received!</h3>
              <p className="text-stone-500 text-sm mb-6">
                We&apos;ll review your submission and reach out within 1–2 business days to get your listing live.
              </p>
              <button
                onClick={handleClose}
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Business Name *</label>
                  <input required value={form.businessName} onChange={set("businessName")} placeholder="Paws Paradise Hotel" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Owner / Contact Name *</label>
                  <input required value={form.ownerName} onChange={set("ownerName")} placeholder="Jane Smith" className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email Address *</label>
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={set("phone")} placeholder="(555) 123-4567" className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Business Type *</label>
                <select required value={form.type} onChange={set("type")} className={inputCls}>
                  <option value="">Select type…</option>
                  {LISTING_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Street Address</label>
                <input value={form.address} onChange={set("address")} placeholder="123 Main St" className={inputCls} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">City *</label>
                  <input required value={form.city} onChange={set("city")} placeholder="Los Angeles" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">State *</label>
                  <select required value={form.state} onChange={set("state")} className={inputCls}>
                    <option value="">Select state…</option>
                    {US_STATES.map((s) => (
                      <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Website (if any)</label>
                <input type="url" value={form.website} onChange={set("website")} placeholder="https://yourpethotel.com" className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Additional Info</label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  rows={3}
                  placeholder="Tell us about your facility, services, pet types accepted, etc."
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? "Submitting…" : "Submit Free Listing Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Paid plan success screen ──────────────────────────────────────────────────
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
  const [success,     setSuccess]     = useState<"FEATURED" | "PREMIUM" | null>(null);
  const [showFreeModal, setShowFreeModal] = useState(false);

  if (success) return <SuccessScreen tier={success} />;

  return (
    <div className="bg-warm-50 min-h-screen">

      {showFreeModal && <FreeListingModal onClose={() => setShowFreeModal(false)} />}

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            <Star className="h-3.5 w-3.5" /> Listing Plans
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-3 leading-tight">
            Get Found by More Pet Owners
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Start free or upgrade for priority placement, more photos, and a badge
            that instantly builds trust — cancel anytime.
          </p>
        </div>
      </div>

      {/* ── Plans ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* FREE */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 flex flex-col h-full">
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
            <button
              onClick={() => setShowFreeModal(true)}
              className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            >
              List for Free
            </button>
          </div>

          {/* FEATURED */}
          <div className="bg-white rounded-2xl border border-brand-200 shadow-sm p-6 flex flex-col h-full">
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
          <div className="relative bg-stone-900 rounded-2xl shadow-xl p-6 flex flex-col h-full">
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

        {/* Trust bar */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-stone-400">
          <span>✓ Free listings reviewed in 1–2 days</span>
          <span>✓ Cancel paid plans anytime from PayPal</span>
          <span>✓ No contracts</span>
          <span>✓ Secure payment via PayPal</span>
        </div>

        {/* FAQ */}
        <div className="mt-14 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-stone-800 mb-5 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "How do I get my free listing live?",
                a: "Click 'List for Free', fill in your details, and submit. We review all submissions within 1–2 business days.",
              },
              {
                q: "How long does a Featured or Premium subscription last?",
                a: "Subscriptions are 30-day rolling. You're billed monthly through PayPal until you cancel.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel directly from your PayPal account at any time — no need to contact us.",
              },
              {
                q: "When does my paid listing upgrade take effect?",
                a: "Within 24 hours of payment. Email hello@petbednstay.com with your business name and we'll activate it right away.",
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
