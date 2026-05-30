"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LocateFixed, Loader2, X } from "lucide-react";
import { US_STATES } from "@/lib/utils";

export default function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(false);

  const isNearMe = !!(params.get("lat") && params.get("lng"));

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
    next.delete("lat");
    next.delete("lng");
    next.delete("radius");
    next.delete("page");
    router.push(`/search?${next.toString()}`);
  }

  const hasFilters =
    params.get("state") || params.get("type") || params.get("tier") ||
    params.get("q")     || params.get("hasReviews") || isNearMe;

  return (
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
          <button onClick={clearNearMe} className="ml-1 hover:opacity-75">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleNearMe}
          disabled={locating}
          className="flex items-center gap-1.5 text-sm border border-amber-200 bg-white text-stone-700 hover:border-brand-400 hover:text-brand-600 px-3 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {locating
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <LocateFixed className="h-3.5 w-3.5" />}
          {locating ? "Locating…" : "Near me"}
        </button>
      )}

      {locError && (
        <span className="text-xs text-red-500">Location unavailable</span>
      )}

      {/* State */}
      <select
        value={params.get("state") ?? ""}
        onChange={(e) => update("state", e.target.value)}
        className="text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-stone-700"
      >
        <option value="">All States</option>
        {US_STATES.map((s) => (
          <option key={s.slug} value={s.slug}>{s.name}</option>
        ))}
      </select>

      {/* Type */}
      <select
        value={params.get("type") ?? ""}
        onChange={(e) => update("type", e.target.value)}
        className="text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-stone-700"
      >
        <option value="">All Types</option>
        <option value="HOTEL">🏨 Hotel / Kennel</option>
        <option value="SITTER">🏠 Pet Sitter</option>
        <option value="BOTH">🐾 Both</option>
      </select>

      {/* Tier */}
      <select
        value={params.get("tier") ?? ""}
        onChange={(e) => update("tier", e.target.value)}
        className="text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-stone-700"
      >
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
        <button
          onClick={() => router.push("/search")}
          className="text-sm text-stone-500 hover:text-brand-600 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
