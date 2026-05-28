import { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import ListingCard from "@/components/listings/ListingCard";
import SearchFilters from "@/components/search/SearchFilters";
import MapWrapper from "@/components/map/MapWrapper";
import type { SearchParams } from "@/types";

export const metadata: Metadata = {
  title: "Browse Pet Hotels & Sitters",
  description: "Search and filter pet hotels and sitters across all 50 US states.",
};

const PAGE_SIZE = 24;

async function getListings(params: SearchParams) {
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const skip = (page - 1) * PAGE_SIZE;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true };
  if (params.state) where.stateSlug = params.state;
  if (params.type) where.type = params.type;
  if (params.tier) where.tier = params.tier;
  if (params.q) {
    where.OR = [
      { name:        { contains: params.q, mode: "insensitive" } },
      { city:        { contains: params.q, mode: "insensitive" } },
      { state:       { contains: params.q, mode: "insensitive" } },
      { stateSlug:   { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      include: { images: true, amenities: true },
      orderBy: [{ tier: "desc" }, { isVerified: "desc" }, { createdAt: "desc" }],
      skip,
      take: PAGE_SIZE,
    }),
    db.listing.count({ where }),
  ]);

  return { listings, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  let data = { listings: [] as any[], total: 0, page: 1, totalPages: 0 };

  try {
    data = await getListings(params);
  } catch {
    // DB not yet connected — show empty state
  }

  const mapListings = data.listings
    .filter((l) => l.lat && l.lng)
    .map((l) => ({ id: l.id, name: l.name, lat: l.lat, lng: l.lng, city: l.city, state: l.state, slug: l.slug, tier: l.tier }));

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Left panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-amber-100 px-4 py-3">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-bold text-stone-800">
                {data.total > 0 ? `${data.total.toLocaleString()} listings found` : "Browse Pet Hotels & Sitters"}
              </h1>
            </div>
            <Suspense>
              <SearchFilters />
            </Suspense>
          </div>
        </div>

        <div className="p-4">
          {data.listings.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <div className="text-5xl mb-4">🐾</div>
              <p className="text-lg font-medium text-stone-600">No listings found</p>
              <p className="text-sm mt-1">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8 pb-8">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => {
                const next = new URLSearchParams();
                if (params.q) next.set("q", params.q);
                if (params.state) next.set("state", params.state);
                if (params.type) next.set("type", params.type);
                if (params.tier) next.set("tier", params.tier);
                next.set("page", String(p));
                return (
                  <a
                    key={p}
                    href={`/search?${next.toString()}`}
                    className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                      p === data.page
                        ? "bg-brand-500 text-white"
                        : "bg-white text-stone-600 border border-amber-200 hover:border-brand-300"
                    }`}
                  >
                    {p}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Map panel — hidden on mobile */}
      <div className="hidden lg:block w-[45%] relative border-l border-amber-100">
        <MapWrapper listings={mapListings} className="h-full w-full" />
      </div>
    </div>
  );
}
