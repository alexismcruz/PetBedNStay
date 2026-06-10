"use client";

import { useState } from "react";
import { PawPrint } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      trackEvent("newsletter_signup", { location: "homepage_banner" });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-brand-500 py-14">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-3">
          <span className="bg-white/20 rounded-full p-2">
            <PawPrint className="h-6 w-6 text-white" />
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Get Pet Boarding Tips &amp; Local Deals
        </h2>
        <p className="text-amber-100 mb-6 text-sm sm:text-base">
          Join pet owners across the US. We&apos;ll send you boarding guides, local deals, and pet care tips — no spam, ever.
        </p>

        {status === "success" ? (
          <div className="bg-white/20 rounded-xl px-6 py-4 inline-block">
            <p className="text-white font-semibold">🎉 You&apos;re in! Check your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe Free"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-amber-200 text-sm">Something went wrong — please try again.</p>
        )}

        <p className="mt-4 text-amber-200 text-xs">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
