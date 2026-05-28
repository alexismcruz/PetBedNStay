"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import Image from "next/image";
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
    <section className="relative min-h-[580px] flex items-center text-white overflow-hidden">
      {/* Background photo */}
      <Image
        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80"
        alt="Happy dog owner with their pet"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Warm dark overlay — keeps text readable, tones down photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900/80 via-brand-900/70 to-stone-900/75" />

      {/* Subtle warm vignette at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-900/60 to-transparent" />

      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>🐾</span>
          <span>Trusted pet boarding directory across all 50 states</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight drop-shadow-md">
          Find the Perfect
          <span className="block text-brand-300">Bed &amp; Stay for Your Pet</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto drop-shadow-sm">
          Discover top-rated pet hotels and trusted sitters near you. Your furry
          family member deserves the very best while you&apos;re away.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
        >
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="h-5 w-5 text-stone-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city, or zip…"
              className="w-full text-stone-800 placeholder-stone-400 text-sm focus:outline-none bg-transparent"
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
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm shrink-0 shadow-sm"
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
                className="text-xs bg-white/15 hover:bg-white/25 border border-white/20 text-white px-3 py-1 rounded-full transition-colors"
              >
                {s.name}
              </a>
            );
          })}
          <a
            href="/search"
            className="text-xs bg-white/15 hover:bg-white/25 border border-white/20 text-white px-3 py-1 rounded-full transition-colors"
          >
            View all states →
          </a>
        </div>
      </div>
    </section>
  );
}
