"use client";

import { useState } from "react";
import { BarChart2, MapPin, Target, CheckCircle } from "lucide-react";
import { US_STATES } from "@/lib/utils";

const AD_SPOTS = [
  {
    id: "homepage-banner",
    name: "Homepage Banner",
    dimensions: "1200 × 300px",
    placement: "Top of homepage, below hero",
    audience: "All US visitors",
    icon: "🏠",
    monthlyPrice: 299,
    oneTimePrice: 349,
    stateTargeted: false,
  },
  {
    id: "search-banner",
    name: "Search Results Banner",
    dimensions: "728 × 90px",
    placement: "Between search result listings",
    audience: "Active pet boarding searchers",
    icon: "🔍",
    monthlyPrice: 199,
    oneTimePrice: 229,
    stateTargeted: false,
  },
  {
    id: "state-sidebar",
    name: "State Page Sidebar",
    dimensions: "300 × 600px",
    placement: "Sidebar on state listing pages",
    audience: "Visitors browsing a specific state",
    icon: "📍",
    monthlyPrice: 149,
    oneTimePrice: 175,
    stateTargeted: true,
  },
  {
    id: "listing-sidebar",
    name: "Listing Page Sidebar",
    dimensions: "300 × 250px",
    placement: "Sidebar on individual listing pages",
    audience: "Pet owners actively evaluating options",
    icon: "🐾",
    monthlyPrice: 99,
    oneTimePrice: 115,
    stateTargeted: false,
  },
];

const GOOD_FIT = [
  "Pet food & treat brands",
  "Pet toy & accessory retailers",
  "Veterinary clinics & services",
  "Pet insurance providers",
  "Dog grooming products",
  "Pet transportation services",
  "Online pet pharmacies",
  "Pet training services",
];

type BillingType = "monthly" | "onetime";

export default function AdvertisePage() {
  const [billing, setBilling] = useState<BillingType>("monthly");
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetState, setTargetState] = useState("");

  const selectedSpot = AD_SPOTS.find((s) => s.id === selected);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSpot) return;
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      spotName:     selectedSpot.name,
      billing,
      price:        billing === "monthly" ? selectedSpot.monthlyPrice : selectedSpot.oneTimePrice,
      businessName: (form.elements.namedItem("businessName") as HTMLInputElement).value,
      contactName:  (form.elements.namedItem("contactName") as HTMLInputElement).value,
      email:        (form.elements.namedItem("email") as HTMLInputElement).value,
      phone:        (form.elements.namedItem("phone") as HTMLInputElement).value,
      website:      (form.elements.namedItem("website") as HTMLInputElement).value,
      targetState:  selectedSpot.stateTargeted ? targetState : "",
      message:      (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/ad-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email ads@petbednstay.com");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle className="h-16 w-16 text-forest-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Request Received!</h1>
        <p className="text-stone-500 mb-2">
          We'll review your ad request and reach out within 24 hours with next steps and a payment link.
        </p>
        <a href="/" className="inline-block mt-6 bg-brand-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-600 transition-colors">
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-stone-800 mb-3">Advertise on PetBedNStay</h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Put your brand in front of pet owners actively searching for pet care across all 50 US states.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <BarChart2 className="h-5 w-5" />, value: "50", label: "States Covered" },
          { icon: <MapPin className="h-5 w-5" />, value: "1,014", label: "Active Listings" },
          { icon: <Target className="h-5 w-5" />, value: "100%", label: "Pet Owner Audience" },
          { icon: <BarChart2 className="h-5 w-5" />, value: "Growing", label: "Monthly Traffic" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-amber-100 rounded-2xl p-4 text-center">
            <div className="text-brand-500 flex justify-center mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-stone-800">{s.value}</div>
            <div className="text-xs text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-stone-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              billing === "monthly" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Monthly Subscription
          </button>
          <button
            onClick={() => setBilling("onetime")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              billing === "onetime" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            One-Time (30 days)
          </button>
        </div>
      </div>

      {/* Ad Spots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {AD_SPOTS.map((spot) => {
          const price = billing === "monthly" ? spot.monthlyPrice : spot.oneTimePrice;
          const isSelected = selected === spot.id;
          return (
            <button
              key={spot.id}
              onClick={() => setSelected(isSelected ? null : spot.id)}
              className={`text-left bg-white border-2 rounded-2xl p-6 hover:border-brand-400 transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                isSelected ? "border-brand-500 shadow-md ring-2 ring-brand-200" : "border-amber-100"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-2xl">{spot.icon}</span>
                  <h3 className="font-semibold text-stone-800 mt-1">{spot.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-brand-600 font-bold text-lg">${price}</div>
                  <div className="text-xs text-stone-400">{billing === "monthly" ? "/ month" : "30 days"}</div>
                </div>
              </div>
              <div className="space-y-1 text-sm text-stone-500">
                <p><span className="font-medium text-stone-600">Size:</span> {spot.dimensions}</p>
                <p><span className="font-medium text-stone-600">Placement:</span> {spot.placement}</p>
                <p><span className="font-medium text-stone-600">Audience:</span> {spot.audience}</p>
                {spot.stateTargeted && <p className="text-brand-600 font-medium text-xs mt-1">📍 You choose the target state</p>}
              </div>
              {isSelected && (
                <div className="mt-3 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-lg text-center">
                  ✓ Selected — fill in the form below
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Booking form — shown when a spot is selected */}
      {selected && selectedSpot && (
        <div className="bg-white rounded-2xl border border-brand-200 shadow-sm p-6 sm:p-8 mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-800">
              Book: {selectedSpot.name}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {billing === "monthly"
                ? `$${selectedSpot.monthlyPrice}/month — recurring monthly subscription`
                : `$${selectedSpot.oneTimePrice} one-time — active for 30 days`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Business Name *" name="businessName" required placeholder="Pawsome Pet Foods" />
              <Field label="Contact Name *" name="contactName" required placeholder="Jane Smith" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Email Address *" name="email" type="email" required placeholder="jane@example.com" />
              <Field label="Phone Number" name="phone" type="tel" placeholder="(555) 123-4567" />
            </div>
            <Field label="Your Website / Landing Page URL *" name="website" type="url" required placeholder="https://pawsomepetfoods.com" />

            {selectedSpot.stateTargeted && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Target State *</label>
                <select
                  value={targetState}
                  onChange={(e) => setTargetState(e.target.value)}
                  required
                  className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  <option value="">Select state…</option>
                  {US_STATES.map((s) => (
                    <option key={s.slug} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Additional Notes</label>
              <textarea
                name="message"
                rows={3}
                placeholder="Tell us about your brand, campaign goals, or any special requirements."
                className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Submitting…" : `Request ${selectedSpot.name} — $${billing === "monthly" ? selectedSpot.monthlyPrice + "/mo" : selectedSpot.oneTimePrice + " one-time"}`}
            </button>
            <p className="text-xs text-stone-400 text-center">
              We'll follow up within 24 hours with a payment link and ad specs. No charge until you confirm.
            </p>
          </form>
        </div>
      )}

      {/* Good fit */}
      <div className="bg-warm-50 border border-amber-100 rounded-2xl p-8 mb-12">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Who Should Advertise Here?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GOOD_FIT.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-stone-600">
              <span className="text-brand-500">✓</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* Email fallback */}
      <div className="bg-stone-900 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Have Questions First?</h2>
        <p className="text-stone-400 mb-6 max-w-md mx-auto">
          We're happy to discuss custom packages, bulk state buys, or long-term campaigns.
        </p>
        <a
          href="mailto:ads@petbednstay.com"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Email ads@petbednstay.com
        </a>
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
        name={name} type={type} required={required} placeholder={placeholder}
        className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
    </div>
  );
}
