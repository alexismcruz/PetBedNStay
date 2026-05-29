"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { US_STATES } from "@/lib/utils";

export default function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/search?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
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

      <select
        value={params.get("tier") ?? ""}
        onChange={(e) => update("tier", e.target.value)}
        className="text-sm border border-amber-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-stone-700"
      >
        <option value="">All Listings</option>
        <option value="PREMIUM">⭐ Premium</option>
        <option value="FEATURED">✨ Featured</option>
      </select>

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

      {(params.get("state") || params.get("type") || params.get("tier") || params.get("q") || params.get("hasReviews")) && (
        <button
          onClick={() => router.push("/search")}
          className="text-sm text-stone-500 hover:text-brand-600 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
