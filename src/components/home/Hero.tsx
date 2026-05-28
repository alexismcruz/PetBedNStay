"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { US_STATES } from "@/lib/utils";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (state) params.set("state", state);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-amber-700 text-white overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-300/20 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>🐾</span>
          <span>Trusted pet boarding across all 50 states</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
          Find the Perfect
          <span className="block text-amber-200">Bed &amp; Stay for Your Pet</span>
        </h1>

        <p className="text-lg sm:text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
          Discover top-rated pet hotels and trusted sitters near you. Your furry family
          member deserves the very best while you&apos;re away.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
        >
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="h-5 w-5 text-stone-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city, or zip…"
              className="w-full text-stone-800 placeholder-stone-400 text-sm focus:outline-none"
            />
          </div>

          <div className="sm:w-48 flex items-center gap-2 px-3 sm:border-l border-stone-100">
            <MapPin className="h-5 w-5 text-stone-400 shrink-0" />
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full text-stone-700 text-sm bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="">All States</option>
              {US_STATES.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm shrink-0"
          >
            Search
          </button>
        </form>

        {/* Quick state links */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {["california", "texas", "florida", "new-york", "illinois"].map((slug) => {
            const s = US_STATES.find((st) => st.slug === slug);
            if (!s) return null;
            return (
              <a
                key={slug}
                href={`/${slug}`}
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
              >
                {s.name}
              </a>
            );
          })}
          <a
            href="/search"
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
          >
            View all states →
          </a>
        </div>
      </div>
    </section>
  );
}
