"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";

const KEY = "pbs_favorites";

export default function SavedPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const ids: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
        if (ids.length === 0) { setLoading(false); return; }
        const res  = await fetch(`/api/listings?ids=${ids.join(",")}`);
        const data = await res.json();
        setListings(data.listings ?? []);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function remove(id: string) {
    const ids: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    localStorage.setItem(KEY, JSON.stringify(ids.filter((i) => i !== id)));
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="bg-warm-50 min-h-screen">
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Saved Listings</h1>
          </div>
          <p className="mt-1 text-stone-500">
            {listings.length > 0
              ? `${listings.length} saved ${listings.length === 1 ? "facility" : "facilities"}`
              : "Your shortlist for your pet's next stay"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-amber-100" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="h-14 w-14 text-stone-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-stone-700 mb-2">No saved listings yet</h2>
            <p className="text-stone-400 mb-6">
              Tap the ❤️ on any listing to save it here for easy comparison.
            </p>
            <Link
              href="/search"
              className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((listing) => (
                <div key={listing.id} className="relative group/saved">
                  <ListingCard listing={listing} />
                  <button
                    onClick={() => remove(listing.id)}
                    className="absolute top-3 left-3 z-10 text-xs bg-white/90 text-red-500 hover:bg-red-50 border border-red-200 px-2 py-1 rounded-full opacity-0 group-hover/saved:opacity-100 transition-opacity font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => { localStorage.removeItem(KEY); setListings([]); }}
                className="text-sm text-stone-400 hover:text-red-500 underline transition-colors"
              >
                Clear all saved listings
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
