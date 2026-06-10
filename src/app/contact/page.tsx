"use client";

import { useState } from "react";
import { Mail, MessageSquare, Building2, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      name:    (form.elements.namedItem("name")    as HTMLInputElement).value,
      email:   (form.elements.namedItem("email")   as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      trackEvent("contact_form_submitted", { subject: data.subject });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us directly at hello@petbednstay.com");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-warm-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-10 max-w-md w-full text-center">
          <CheckCircle className="h-14 w-14 text-forest-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Message Sent!</h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Thanks for reaching out. We typically reply within 1–2 business days.
          </p>
          <a
            href="/"
            className="inline-block mt-6 bg-brand-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-600 transition-colors text-sm"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-warm-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-center">
          <h1 className="text-3xl font-bold text-stone-800">Contact Us</h1>
          <p className="mt-2 text-stone-500 text-lg max-w-lg mx-auto">
            Got a question, listing issue, or partnership inquiry? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Contact options */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-50 rounded-xl p-2">
                  <Mail className="h-5 w-5 text-brand-500" />
                </div>
                <h2 className="font-semibold text-stone-800">Email Us</h2>
              </div>
              <p className="text-sm text-stone-500 mb-2">For general inquiries and support.</p>
              <a href="mailto:hello@petbednstay.com" className="text-sm text-brand-600 font-medium hover:underline">
                hello@petbednstay.com
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-50 rounded-xl p-2">
                  <Building2 className="h-5 w-5 text-brand-500" />
                </div>
                <h2 className="font-semibold text-stone-800">Business Owners</h2>
              </div>
              <p className="text-sm text-stone-500 mb-3">
                Want to claim, update, or remove your listing?
              </p>
              <a
                href="/list-your-business"
                className="inline-block text-sm bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Claim Your Listing
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-amber-50 rounded-xl p-2">
                  <MessageSquare className="h-5 w-5 text-brand-500" />
                </div>
                <h2 className="font-semibold text-stone-800">Response Time</h2>
              </div>
              <p className="text-sm text-stone-500">
                We reply to all messages within <strong className="text-stone-700">1–2 business days</strong>.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-8 space-y-5"
            >
              <h2 className="text-lg font-semibold text-stone-800">Send us a message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your Name *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Jane Smith"
                    className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Subject *</label>
                <select
                  name="subject"
                  required
                  className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  <option value="">Select a topic…</option>
                  <option value="claim-listing">Claim or update my listing</option>
                  <option value="remove-listing">Remove my listing</option>
                  <option value="incorrect-info">Report incorrect information</option>
                  <option value="partnership">Partnership or advertising inquiry</option>
                  <option value="technical">Technical issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="How can we help you?"
                  className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? "Sending…" : "Send Message"}
              </button>

              <p className="text-xs text-stone-400 text-center">
                Or email us directly at{" "}
                <a href="mailto:hello@petbednstay.com" className="text-brand-600 hover:underline">
                  hello@petbednstay.com
                </a>
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
