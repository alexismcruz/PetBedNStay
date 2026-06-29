"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { US_STATES, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { CheckCircle, BadgeCheck } from "lucide-react";
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

const BENEFITS = [
  { icon: "🔍", title: "Be Found in Search", body: "Pet owners search by city and state. Your listing appears directly in results — no SEO expertise required on your end." },
  { icon: "📊", title: "Profile That Converts", body: "Showcase your photos, amenities, pricing, hours, and reviews. Give pet owners everything they need to choose you with confidence." },
  { icon: "📞", title: "Direct Contact", body: "Inquiries go straight to you — no middleman, no booking fees, no commission. Your business, your relationship." },
  { icon: "⭐", title: "Build Social Proof", body: "Collect reviews from real clients. A strong rating signals trust immediately and converts browsing pawrents into bookings." },
  { icon: "🗺️", title: "Statewide Visibility", body: "Your listing is discoverable across your entire state — not just your immediate neighborhood. Great for travelers and relocators." },
  { icon: "🚀", title: "Go Live in Minutes", body: "Fill out a simple form, submit your details, and you're live. No tech skills needed. Updates are easy anytime." },
];

const STEPS = [
  { n: 1, title: "Fill Out the Listing Form", body: "Share your business name, location, contact info, the types of pets you accept, and the services you offer. Takes about 5 minutes." },
  { n: 2, title: "We Review & Verify", body: "Our team reviews every submission to keep the directory high quality. Standard listings are typically approved within 1–2 business days." },
  { n: 3, title: "Go Live & Get Found", body: "Your listing appears in search results for pet owners looking in your state and city. We'll email you a direct link to share with clients." },
  { n: 4, title: "Collect Reviews & Grow", body: "Ask happy clients to leave reviews. Ratings build trust and push your listing higher. Upgrade to Premium anytime to accelerate growth." },
];

const BIZ_REVIEWS = [
  { text: '"We started getting calls from new clients within the first week of listing. The premium spotlight placement was absolutely worth it — our bookings are up 30% this summer."', name: "Jenny & Mark, Paws & Relax Suites", sub: "Austin, TX · Featured Listing" },
  { text: '"I was skeptical at first since we already had Google, but the targeted traffic from PetBedNStay is different — these are people specifically looking for boarding, not just searching \'dogs near me.\'"', name: "Roberto G., Hill Country Pet Resort", sub: "Austin, TX · Standard Listing" },
  { text: '"The free listing alone drove enough business to justify upgrading to premium. The analytics are helpful — I can see exactly how many people viewed my profile each month."', name: "Lisa T., Cozy Paws Sitter Service", sub: "Nashville, TN · Premium Listing" },
];

function SuccessScreen({ tier }: { tier: "FEATURED" | "PREMIUM" }) {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-[14px] border-[1.5px] border-pborder shadow-[0_8px_32px_rgba(45,106,79,.14)] p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-[family-name:var(--font-nunito)] font-black text-2xl text-ptext mb-2">
          You&apos;re subscribed to {tier === "FEATURED" ? "Featured" : "Premium"}!
        </h1>
        <p className="text-ptext-mid text-sm leading-relaxed mb-6">
          Payment confirmed. Email us your business name or listing URL and we&apos;ll
          upgrade your listing within 24 hours.
        </p>
        <a
          href="mailto:hello@petbednstay.com?subject=Listing%20Upgrade%20Request"
          className="block w-full bg-g hover:bg-g-dark text-white font-bold py-3 rounded-[10px] transition-colors mb-3"
        >
          Email hello@petbednstay.com
        </a>
        <a href="/" className="text-sm text-ptext-soft hover:text-g transition-colors">
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
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <CheckCircle className="h-16 w-16 text-g mx-auto mb-4" />
          <h1 className="font-[family-name:var(--font-nunito)] font-black text-2xl text-ptext mb-2">Request Received!</h1>
          <p className="text-ptext-mid">
            We&apos;ll review your submission and reach out within 1–2 business days to get your listing live.
          </p>
          <a
            href="/"
            className="inline-block mt-6 bg-g text-white font-bold px-6 py-2.5 rounded-[10px] hover:bg-g-dark transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-20 text-center" style={{ background: "linear-gradient(135deg, #1B4D35 0%, #2D6A4F 100%)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/12 border border-white/20 text-white text-[.8rem] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-[.06em]">
            🏡 For Pet Boarding Businesses
          </div>
          <h1 className="font-[family-name:var(--font-nunito)] font-black text-white leading-[1.15] mb-4.5" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)" }}>
            Get Your Business in Front of<br />
            <em className="not-italic text-y">Thousands of Pawrents</em>
          </h1>
          <p className="text-white/82 text-[1.05rem] max-w-[520px] mx-auto mb-8 leading-[1.7]">
            PetBedNStay is the #1 US pet boarding directory. List your kennel, hotel, or sitter service and start getting found by pet owners across your state — for free.
          </p>
          <div className="flex justify-center gap-3.5 flex-wrap">
            <a href="#get-listed" className="bg-o hover:bg-o-dark text-white font-extrabold text-[1rem] px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(244,132,95,.4)]">
              🐾 List My Business — Free
            </a>
            <a href="#pricing" className="bg-white/12 border-2 border-white/40 text-white font-bold text-[.95rem] px-7 py-3 rounded-full transition-all hover:bg-white/20 backdrop-blur-sm">
              See Premium Options
            </a>
          </div>
          <div className="mt-10 flex justify-center gap-9 flex-wrap">
            {[
              { strong: "800+", span: "Active Listings" },
              { strong: "49",   span: "States Covered" },
              { strong: "Free", span: "Standard Listing" },
              { strong: "~12k", span: "Monthly Searches" },
            ].map((p) => (
              <div key={p.span} className="text-center">
                <strong className="block font-[family-name:var(--font-nunito)] font-black text-[1.6rem] text-white">{p.strong}</strong>
                <span className="text-[.78rem] text-white/70">{p.span}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 px-6 max-w-[1100px] mx-auto">
        <div className="text-center mb-13">
          <span className="inline-block text-[.75rem] font-bold uppercase tracking-[.1em] text-o mb-2.5">Why List on PetBedNStay?</span>
          <h2 className="font-[family-name:var(--font-nunito)] font-black text-ptext" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Built to Fill Your Kennel Runs 🐶</h2>
          <p className="text-ptext-mid mt-2.5 text-[1rem]">Pet owners are actively searching for places to board their pets. We put your business in front of them.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white border-[1.5px] border-pborder rounded-[14px] p-7 transition-all hover:shadow-[0_8px_32px_rgba(45,106,79,.14)] hover:-translate-y-0.5 hover:border-g-light">
              <div className="w-[60px] h-[60px] rounded-2xl bg-g-pale flex items-center justify-center text-[1.8rem] mb-4.5">{b.icon}</div>
              <h3 className="font-[family-name:var(--font-nunito)] font-extrabold text-[1.05rem] text-ptext mb-2.5">{b.title}</h3>
              <p className="text-[.88rem] text-ptext-mid leading-[1.75]">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-white py-20 px-6">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-[.75rem] font-bold uppercase tracking-[.1em] text-o mb-2.5">Simple Pricing</span>
            <h2 className="font-[family-name:var(--font-nunito)] font-black text-ptext" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Two Tiers. Zero Surprises.</h2>
            <p className="text-ptext-mid mt-2.5">Start free. Upgrade when you&apos;re ready to stand out.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FREE */}
            <div className="border-2 border-pborder rounded-[14px] p-9 bg-white flex flex-col">
              <div className="text-[.75rem] font-bold uppercase tracking-[.1em] text-ptext-soft mb-2.5">Standard Listing</div>
              <div className="font-[family-name:var(--font-nunito)] font-black text-[2.4rem] text-ptext leading-none">
                $0 <span className="text-[1rem] font-normal font-[family-name:var(--font-inter)] text-ptext-soft">/ forever</span>
              </div>
              <p className="text-[.88rem] text-ptext-mid mt-2.5 mb-6 leading-[1.6]">Everything you need to be discovered by pet owners searching in your area.</p>
              <hr className="border-pborder mb-5" />
              <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                {[
                  ["Business name, address & phone", true],
                  ["Business type & pet types accepted", true],
                  ["Hours of operation", true],
                  ["Up to 3 amenity tags", true],
                  ["Link to your own website", true],
                  ["Appears in state search results", true],
                  ["Featured badge & highlight", false],
                  ["Spotlight in search results", false],
                  ["Priority placement in results", false],
                ].map(([label, on]) => (
                  <li key={label as string} className={cn("flex items-start gap-2.5 text-[.88rem]", on ? "text-ptext-mid" : "text-ptext-soft")}>
                    <span className={cn("font-extrabold shrink-0", on ? "text-g" : "text-ptext-soft")}>{on ? "✓" : "–"}</span>
                    {label}
                  </li>
                ))}
              </ul>
              <a href="#get-listed" className="block text-center py-3.5 rounded-[10px] font-bold text-[.95rem] bg-g-pale text-g border-2 border-g-pale hover:bg-g hover:text-white hover:border-g transition-all">
                Get Listed Free →
              </a>
            </div>

            {/* PREMIUM / FEATURED */}
            <div className="relative border-2 border-o rounded-[14px] p-9 flex flex-col" style={{ background: "linear-gradient(160deg, #FFFAF8 0%, #FFF8F5 100%)", boxShadow: "0 0 0 4px rgba(244,132,95,.08), 0 8px 32px rgba(45,106,79,.14)" }}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-o text-white text-[.72rem] font-bold uppercase tracking-[.08em] px-4.5 py-1.5 rounded-full whitespace-nowrap">⭐ Most Popular</div>
              <div className="text-[.75rem] font-bold uppercase tracking-[.1em] text-ptext-soft mb-2.5">Premium / Featured</div>
              <div className="font-[family-name:var(--font-nunito)] font-black text-[2.4rem] text-ptext leading-none">
                ${PRICING.FEATURED.amount} <span className="text-[1rem] font-normal font-[family-name:var(--font-inter)] text-ptext-soft">/ month</span>
              </div>
              <p className="text-[.88rem] text-ptext-mid mt-2.5 mb-6 leading-[1.6]">Maximum visibility. Your business stands out from the crowd and converts more leads.</p>
              <hr className="border-pborder mb-5" />
              <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                {[
                  "Everything in Standard, plus:",
                  "Featured badge on your listing card",
                  "Top-of-results spotlight placement",
                  "Up to 20 photos in gallery",
                  "Full amenities list (unlimited tags)",
                  "Detailed pricing table on profile",
                  "Priority placement in search results",
                  "Review response capability",
                  "Monthly visibility analytics report",
                ].map((label) => (
                  <li key={label} className="flex items-start gap-2.5 text-[.88rem] text-ptext-mid">
                    <span className="text-g font-extrabold shrink-0">✓</span>
                    {label}
                  </li>
                ))}
              </ul>
              <PayPalSubscriptionButton
                planId={PLAN_IDS.FEATURED}
                tier="FEATURED"
                onSuccess={() => { trackEvent("subscription_started", { plan: "featured" }); setPaidSuccess("FEATURED"); }}
              />
              <div className="mt-3">
                <PayPalSubscriptionButton
                  planId={PLAN_IDS.PREMIUM}
                  tier="PREMIUM"
                  onSuccess={() => { trackEvent("subscription_started", { plan: "premium" }); setPaidSuccess("PREMIUM"); }}
                />
              </div>
            </div>
          </div>
          <p className="text-center text-[.82rem] text-ptext-soft mt-5">No long-term contracts. Cancel anytime. First month free for new premium listings.</p>
        </div>
      </section>

      {/* HOW TO LIST */}
      <section className="py-20 px-6 max-w-[900px] mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-[.75rem] font-bold uppercase tracking-[.1em] text-o mb-2.5">Super Simple Process</span>
          <h2 className="font-[family-name:var(--font-nunito)] font-black text-ptext" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>Live in 4 Easy Steps 🐾</h2>
          <p className="text-ptext-mid mt-2.5">From sign-up to appearing in search results — it really is this straightforward.</p>
        </div>
        <div className="relative flex flex-col">
          <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-pborder" />
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-6 items-start py-7">
              <div className="w-12 h-12 rounded-full bg-g text-white flex items-center justify-center font-[family-name:var(--font-nunito)] font-black text-[1.1rem] shrink-0 relative z-[1] shadow-[0_0_0_4px_#FAFAF5]">{s.n}</div>
              <div className="flex-1 pt-2.5">
                <h3 className="font-[family-name:var(--font-nunito)] font-extrabold text-[1.05rem] text-ptext mb-2">{s.title}</h3>
                <p className="text-[.88rem] text-ptext-mid leading-[1.7]">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESS TESTIMONIALS */}
      <section className="bg-g py-18 px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-[family-name:var(--font-nunito)] font-black text-[1.8rem] text-white text-center mb-10">What Business Owners Are Saying 🐾</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BIZ_REVIEWS.map((r) => (
              <div key={r.name} className="bg-white/10 border border-white/15 rounded-[14px] p-6.5">
                <div className="text-y text-[.9rem] mb-3">★★★★★</div>
                <p className="text-[.88rem] text-white/88 leading-[1.75] italic mb-4">{r.text}</p>
                <div className="font-bold text-[.85rem] text-white">
                  {r.name}
                  <span className="block font-normal text-white/65 text-[.78rem] mt-0.5">{r.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LISTING FORM */}
      <section id="get-listed" className="py-20 px-6 max-w-[720px] mx-auto">
        {claimName && (
          <div className="mb-6 bg-g-pale border border-g-light/40 rounded-[14px] p-4 flex items-start gap-3">
            <BadgeCheck className="h-5 w-5 text-g shrink-0 mt-0.5" />
            <p className="text-sm text-ptext leading-relaxed">
              You&apos;re claiming <span className="font-semibold">{claimName}</span>. We&apos;ve pre-filled
              what we have — just add your contact details and anything you&apos;d like pet owners to see.
              Once verified, you can add photos, prices, and hours.
            </p>
          </div>
        )}
        <h2 className="font-[family-name:var(--font-nunito)] font-black text-[1.8rem] text-ptext mb-2">
          {claimName ? "Claim Your Listing 🐾" : "List Your Business 🐾"}
        </h2>
        <p className="text-ptext-mid mb-9">Fill out the form below and we&apos;ll review your listing within 1–2 business days. It&apos;s free to get started.</p>

        <form onSubmit={handleSubmit} className="bg-white border-[1.5px] border-pborder rounded-[14px] p-10 shadow-[0_8px_32px_rgba(45,106,79,.14)] space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Business Name *"        name="businessName" required placeholder="e.g. Paws & Relax Pet Hotel" defaultValue={claimName} />
            <Field label="Owner / Contact Name *" name="ownerName"    required placeholder="Jane Smith" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[.78rem] font-bold uppercase tracking-[.07em] text-ptext-soft mb-1.5">Business Type *</label>
              <select name="type" required className="form-field appearance-none cursor-pointer">
                <option value="">Select type…</option>
                {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[.78rem] font-bold uppercase tracking-[.07em] text-ptext-soft mb-1.5">State *</label>
              <select name="state" required defaultValue={claimStateSlug} className="form-field appearance-none cursor-pointer">
                <option value="">Select state…</option>
                {US_STATES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="City *" name="city" required placeholder="e.g. Austin" defaultValue={claimCity} />
            <Field label="Phone Number *" name="phone" type="tel" placeholder="(512) 555-0100" />
          </div>

          <Field label="Street Address" name="address" placeholder="e.g. 2415 S Lamar Blvd" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email Address *" name="email" type="email" required placeholder="you@yourbusiness.com" />
            <Field label="Website URL" name="website" type="url" placeholder="https://yourbusiness.com" />
          </div>

          <div>
            <label className="block text-[.78rem] font-bold uppercase tracking-[.07em] text-ptext-soft mb-1.5">Brief Description (optional)</label>
            <textarea
              name="message"
              rows={3}
              placeholder="Tell pet owners what makes your business special…"
              className="form-field resize-y"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-o hover:bg-o-dark disabled:opacity-50 text-white font-extrabold py-4 rounded-[10px] transition-all hover:-translate-y-px text-[1rem]"
          >
            {loading ? "Submitting…" : "🐾 Submit My Listing →"}
          </button>

          <p className="text-center text-[.78rem] text-ptext-soft">
            🔒 We never share your information. Want faster placement?{" "}
            <a href="#pricing" className="text-g hover:underline">See premium plans ↑</a>.
          </p>
        </form>
      </section>
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
      <label className="block text-[.78rem] font-bold uppercase tracking-[.07em] text-ptext-soft mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="form-field"
      />
    </div>
  );
}
