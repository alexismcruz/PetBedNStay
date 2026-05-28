import Link from "next/link";
import ListingCard from "@/components/listings/ListingCard";
import type { Listing } from "@/types";

interface Props {
  listings: Listing[];
}

export default function FeaturedListings({ listings }: Props) {
  if (listings.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">
              Featured Pet Hotels
            </h2>
            <p className="mt-2 text-stone-500">
              Top-rated boarding facilities across the US
            </p>
          </div>
          <Link
            href="/search?tier=FEATURED"
            className="hidden sm:inline-flex items-center gap-1 text-brand-600 font-semibold text-sm hover:text-brand-700 transition-colors"
          >
            View all featured →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/search?tier=FEATURED"
            className="inline-flex items-center gap-1 text-brand-600 font-semibold text-sm hover:text-brand-700"
          >
            View all featured listings →
          </Link>
        </div>
      </div>
    </section>
  );
}
