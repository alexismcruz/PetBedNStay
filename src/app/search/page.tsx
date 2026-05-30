import { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { haversineDistance, getBoundingBox, formatDistance } from "@/lib/geo";
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
  const page  = Math.max(1, parseInt(params.page ?? "1"));
  const skip  = (page - 1) * PAGE_SIZE;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true };
  if (params.state)                where.stateSlug = params.state;
  if (params.type)                 where.type       = params.type;
  if (params.tier)                 where.tier       = params.tier;
  if (params.hasReviews === "1")   where.reviews    = { some: { isApproved: true } };
  if (params.q) {
    where.OR = [
      { name:        { contains: params.q, mode: "insensitive" } },
      { city:        { contains: params.q, mode: "insensitive" } },
      { state:       { contains: params.q, mode: "insensitive" } },
      { stateSlug:   { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  // ── Near-me mode ────────────────────────────────────────────────────────────
  if (params.lat && params.lng) {
    const userLat = parseFloat(params.lat);
    const userLng = parseFloat(params.lng);
    const radius  = parseInt(params.radius ?? "25");
    const box     = getBoundingBox(userLat, userLng, radius);

    where.lat = { gte: box.latMin, lte: box.latMax };
    where.lng = { gte: box.lngMin, lte: box.lngMax };

    // Fetch ALL listings in the bounding box, sort by distance in JS, paginate
    const all = await db.listing.findMany({
      where,
      include: { images: true, amenities: true },
      orderBy: [{ tier: "desc" }, { isVerified: "desc" }],
    });

    const withDist = all
      .filter((l) => l.lat != null && l.lng != null)
      .map((l) => ({
        ...l,
        distanceMiles: haversineDistance(userLat, userLng, l.lat!, l.lng!),
      }))
      .sort((a, b) => a.distanceMiles - b.distanceMiles);

    const total    = withDist.length;
    const listings = withDist.slice(skip, skip + PAGE_SIZE);
    return { listings, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
  }

  // ── Normal mode ─────────────────────────────────────────────────────────────
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
  const isNearMe = !!(params.lat && params.lng);

  let data = { listings: [] as any[], total: 0, page: 1, totalPages: 0 };
  try {
    data = await getListings(params);
  } catch {
    // DB not yet connected — show empty state
  }

  const mapListings = data.listings
    .filter((l) => l.lat && l.lng)
    .map((l) => ({ id: l.id, name: l.name, lat: l.lat, lng: l.lng, city: l.city, state: l.state, slug: l.slug, tier: l.tier }));

  function buildUrl(p: number) {
    const qs = new URLSearchParams();
    if (params.q)          qs.set("q",          params.q);
    if (params.state)      qs.set("state",      params.state);
    if (params.type)       qs.set("type",       params.type);
    if (params.tier)       qs.set("tier",       params.tier);
    if (params.hasReviews) qs.set("hasReviews", params.hasReviews);
    if (params.lat)        qs.set("lat",        params.lat);
    if (params.lng)        qs.set("lng",        params.lng);
    if (params.radius)     qs.set("radius",     params.radius);
    qs.set("page", String(p));
    return `/search?${qs.toString()}`;
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-warm-50">
      {/* Left panel */}
      <div className="flex-1 overflow-y-auto bg-warm-50">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-amber-100 px-4 py-3">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-bold text-stone-800">
                {data.total > 0
                  ? `${data.total.toLocaleString()} listing${data.total === 1 ? "" : "s"} found${isNearMe ? ` within ${params.radius ?? "25"} miles` : ""}`
                  : "Browse Pet Hotels & Sitters"}
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
              <p className="text-sm mt-1">
                {isNearMe ? "Try increasing the radius or clearing Near me" : "Try adjusting your search filters"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  distanceMiles={(listing as any).distanceMiles}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (() => {
            const cur   = data.page;
            const total = data.totalPages;

            function getPages(): (number | null)[] {
              if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
              if (cur <= 4)          return [1, 2, 3, 4, 5, null, total];
              if (cur >= total - 3)  return [1, null, total - 4, total - 3, total - 2, total - 1, total];
              return [1, null, cur - 1, cur, cur + 1, null, total];
            }

            const btn      = "w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors";
            const active   = "bg-brand-500 text-white";
            const idle     = "bg-white text-stone-600 border border-amber-200 hover:border-brand-300";
            const disabled = "text-stone-300 border border-stone-100";

            return (
              <div className="flex justify-center items-center gap-1.5 mt-8 pb-8">
                {cur > 1
                  ? <a href={buildUrl(cur - 1)} className={`${btn} ${idle}`}>‹</a>
                  : <span className={`${btn} ${disabled}`}>‹</span>}

                {getPages().map((p, i) =>
                  p === null
                    ? <span key={`ell-${i}`} className="w-6 text-center text-stone-400 text-sm select-none">…</span>
                    : <a key={p} href={buildUrl(p)} className={`${btn} ${p === cur ? active : idle}`}>{p}</a>
                )}

                {cur < total
                  ? <a href={buildUrl(cur + 1)} className={`${btn} ${idle}`}>›</a>
                  : <span className={`${btn} ${disabled}`}>›</span>}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Map panel — hidden on mobile */}
      <div className="hidden lg:block w-[45%] relative border-l border-amber-100">
        <MapWrapper listings={mapListings} className="h-full w-full" />
      </div>
    </div>
  );
}
