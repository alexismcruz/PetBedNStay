"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LocateFixed, Loader2, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { US_STATES } from "@/lib/utils";

const PET_TYPES = [
  { value: "",            label: "All Pets" },
  { value: "dog",        label: "🐕 Dogs" },
  { value: "cat",        label: "🐈 Cats" },
  { value: "small dog",  label: "🐩 Small Dogs" },
  { value: "large dog",  label: "🦮 Large Dogs" },
  { value: "puppy",      label: "🐾 Puppies" },
];

const PRICE_OPTIONS = [
  { value: "",    label: "Any Price" },
  { value: "40",  label: "Under $40/night" },
  { value: "60",  label: "Under $60/night" },
  { value: "80",  label: "Under $80/night" },
  { value: "100", label: "Under $100/night" },
];

export default function SearchFilters() {
  const router    = useRouter();
  const params    = useSearchParams();
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isNearMe = !!(params.get("lat") && params.get("lng"));

  const activeCount = [
    params.get("state"), params.get("type"), params.get("tier"),
    params.get("hasReviews"), params.get("priceMax"), params.get("petType"),
  ].filter(Boolean).length + (isNearMe ? 1 : 0);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    router.push(`/search?${next.toString()}`);
  }

  function handleNearMe() {
    if (!navigator.geolocation) { setLocError(true); return; }
    setLocating(true);
    setLocError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const next = new URLSearchParams(params.toString());
        next.set("lat",    pos.coords.latitude.toFixed(6));
        next.set("lng",    pos.coords.longitude.toFixed(6));
        next.set("radius", params.get("radius") ?? "25");
        next.delete("page");
        router.push(`/search?${next.toString()}`);
      },
      () => { setLocating(false); setLocError(true); },
      { timeout: 8000 },
    );
  }

  function clearNearMe() {
    const next = new URLSearchParams(params.toString());
    ["lat","lng","radius"].forEach((k) => next.delete(k));
    next.delete("page");
    router.push(`/search?${next.toString()}`);
  }

  function clearAll() { router.push("/search"); }

  const hasFilters = activeCount > 0 || !!params.get("q");

  const filterRows = (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Near me */}
      {isNearMe ? (
        <div className="flex items-center gap-1 bg-brand-500 text-white text-sm font-medium px-3 py-2 rounded-lg">
          <LocateFixed className="h-3.5 w-3.5 shrink-0" />
          <select
            value={params.get("radius") ?? "25"}
            onChange={(e) => update("radius", e.target.value)}
            className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
          >
            <option value="10"  className="text-stone-800">Within 10 mi</option>
            <option value="25"  className="text-stone-800">Within 25 mi</option>
            <option value="50"  className="text-stone-800">Within 50 mi</option>
            <option value="100" className="text-stone-800">Within 100 mi</option>
          </select>
          <button onClick={clearNearMe} className="ml-1 hover:opacity-75"><X className="h-3.5 w-3.5" /></button>
        </div>
      ) : (
        <button
          onClick={handleNearMe}
          disabled={locating}
          className="flex items-center gap-1.5 text-sm border border-amber-200 bg-white text-stone-700 hover:border-brand-400 hover:text-brand-600 px-3 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
          {locating ? "Locating…" : "Near me"}
        </button>
      )}
      {locError && <span className="text-xs text-red-500">Location unavailable</span>}

      {/* State */}
      <select value={params.get("state") ?? ""} onChange={(e) => update("state", e.target.value)}
        className="text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-stone-700">
        <option value="">All States</option>
        {US_STATES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
      </select>

      {/* Type */}
      <select value={params.get("type") ?? ""} onChange={(e) => update("type", e.target.value)}
        className="text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-stone-700">
        <option value="">All Types</option>
        <option value="HOTEL">🏨 Hotel / Kennel</option>
        <option value="SITTER">🏠 Pet Sitter</option>
        <option value="BOTH">🐾 Both</option>
      </select>

      {/* Pet type */}
      <select value={params.get("petType") ?? ""} onChange={(e) => update("petType", e.target.value)}
        className="text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-stone-700">
        {PET_TYPES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {/* Price */}
      <select value={params.get("priceMax") ?? ""} onChange={(e) => update("priceMax", e.target.value)}
        className="text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-stone-700">
        {PRICE_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {/* Tier */}
      <select value={params.get("tier") ?? ""} onChange={(e) => update("tier", e.target.value)}
        className="text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-stone-700">
        <option value="">All Listings</option>
        <option value="PREMIUM">⭐ Premium</option>
        <option value="FEATURED">✨ Featured</option>
      </select>

      {/* Has Reviews */}
      <button
        onClick={() => update("hasReviews", params.get("hasReviews") ? "" : "1")}
        className={`text-sm border rounded-lg px-3 py-2 transition-colors ${
          params.get("hasReviews")
            ? "bg-brand-500 text-white border-brand-500"
            : "bg-white text-stone-700 border-amber-200 hover:border-brand-400"
        }`}
      >
        ★ Has Reviews
      </button>

      {/* Clear all */}
      {hasFilters && (
        <button onClick={clearAll} className="text-sm text-stone-500 hover:text-brand-600 underline">
          Clear all
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: collapsed toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-sm border border-amber-200 bg-white text-stone-700 px-3 py-2 rounded-lg w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters{activeCount > 0 ? ` (${activeCount} active)` : ""}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
        </button>
        {mobileOpen && (
          <div className="mt-2 p-3 bg-white border border-amber-100 rounded-xl shadow-sm">
            {filterRows}
          </div>
        )}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden md:block">{filterRows}</div>
    </>
  );
}
