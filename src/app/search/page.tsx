import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { haversineDistance, getBoundingBox } from "@/lib/geo";
import { toSlug, typeLabel, getPlaceholderPhoto, US_STATES } from "@/lib/utils";
import SearchFilters from "@/components/search/SearchFilters";
import type { SearchParams } from "@/types";

export const metadata: Metadata = {
  title: "Browse Pet Hotels & Sitters",
  description: "Search and filter pet hotels and sitters across all 50 US states.",
  robots: { index: false, follow: true },
};

const PAGE_SIZE = 24;

async function getListings(params: SearchParams) {
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const skip = (page - 1) * PAGE_SIZE;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true };
  if (params.state)              where.stateSlug = params.state;
  if (params.type)               where.type       = params.type;
  if (params.tier)               where.tier       = params.tier;
  if (params.hasReviews === "1") where.reviews    = { some: { isApproved: true } };
  if (params.petType)            where.amenities  = { some: { name: { contains: params.petType, mode: "insensitive" } } };
  if (params.priceMax) {
    const max = parseFloat(params.priceMax);
    where.OR = [{ priceMin: null }, { priceMin: { lte: max } }];
  }
  if (params.q) {
    where.OR = [
      { name:        { contains: params.q, mode: "insensitive" } },
      { city:        { contains: params.q, mode: "insensitive" } },
      { state:       { contains: params.q, mode: "insensitive" } },
      { stateSlug:   { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.lat && params.lng) {
    const userLat = parseFloat(params.lat);
    const userLng = parseFloat(params.lng);
    const radius  = parseInt(params.radius ?? "25");
    const box     = getBoundingBox(userLat, userLng, radius);
    where.lat = { gte: box.latMin, lte: box.latMax };
    where.lng = { gte: box.lngMin, lte: box.lngMax };

    const all = await db.listing.findMany({
      where,
      include: { images: true, amenities: true, reviews: { where: { isApproved: true }, select: { rating: true } } },
      orderBy: [{ tier: "desc" }, { isVerified: "desc" }],
    });

    const withDist = all
      .filter((l) => l.lat != null && l.lng != null)
      .map((l) => ({ ...l, distanceMiles: haversineDistance(userLat, userLng, l.lat!, l.lng!) }))
      .sort((a, b) => a.distanceMiles - b.distanceMiles);

    return { listings: withDist.slice(skip, skip + PAGE_SIZE), total: withDist.length, page, totalPages: Math.ceil(withDist.length / PAGE_SIZE) };
  }

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      include: { images: true, amenities: true, reviews: { where: { isApproved: true }, select: { rating: true } } },
      orderBy: [{ tier: "desc" }, { isVerified: "desc" }, { createdAt: "desc" }],
      skip,
      take: PAGE_SIZE,
    }),
    db.listing.count({ where }),
  ]);

  return { listings, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params    = await searchParams;
  const isNearMe  = !!(params.lat && params.lng);
  const stateLabel = params.state ? (US_STATES.find((s) => s.slug === params.state)?.name ?? params.state) : null;

  if (params.q && params.state && !params.lat) {
    const citySlug = toSlug(params.q.trim());
    try {
      const cityExists = await db.listing.findFirst({
        where: { isActive: true, stateSlug: params.state, citySlug },
        select: { id: true },
      });
      if (cityExists) redirect(`/${params.state}/${citySlug}`);
    } catch { /* fall through */ }
  }

  let data = { listings: [] as any[], total: 0, page: 1, totalPages: 0 };
  try { data = await getListings(params); } catch { /* DB not connected */ }

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

  // Featured listings (tier FEATURED/PREMIUM) for spotlight row
  const featuredSpotlight = data.listings.filter((l: any) => l.tier === "FEATURED" || l.tier === "PREMIUM").slice(0, 3);

  return (
    <div className="bg-cream min-h-screen">
      {/* Green search header */}
      <div className="bg-g px-6 py-7">
        <div className="max-w-[1300px] mx-auto">
          <h1 className="font-[family-name:var(--font-nunito)] font-black text-[1.5rem] text-white mb-4">
            🔍 Find Pet Boarding & Sitters
          </h1>
          <Suspense>
            <SearchFilters />
          </Suspense>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1300px] mx-auto px-6 py-7 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-7 items-start">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-4 sticky top-[80px]">
          {/* Filter panel — visual only; actual filtering via SearchFilters in header */}
          <div className="bg-white border-[1.5px] border-pborder rounded-[14px] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-nunito)] font-extrabold text-[.95rem] text-ptext">Filters</h3>
              <Link href="/search" className="text-[.75rem] font-semibold text-o">Clear all</Link>
            </div>

            <FilterGroup label="Listing Type" options={["Pet Hotels","Kennels","In-Home Sitters","Doggy Daycare","Cat-Only Boarding","Pet Resorts"]} />
            <hr className="border-pborder my-4" />
            <FilterGroup label="Pet Type" options={["Dogs 🐕","Cats 🐈","Small Animals 🐹","Birds 🦜"]} />
            <hr className="border-pborder my-4" />
            <div>
              <span className="block text-[.78rem] font-bold uppercase tracking-[.07em] text-ptext-soft mb-2.5">Minimum Rating</span>
              {["Any rating","4.0+ ★★★★","4.5+ ★★★★½","5.0 only ★★★★★"].map((o) => (
                <label key={o} className="flex items-center gap-2 text-[.88rem] text-ptext-mid py-1 cursor-pointer">
                  <input type="radio" name="rating" className="accent-g" /> {o}
                </label>
              ))}
            </div>
            <hr className="border-pborder my-4" />
            <div>
              <span className="block text-[.78rem] font-bold uppercase tracking-[.07em] text-ptext-soft mb-2.5">Price Range (per night)</span>
              <div className="flex items-center gap-2">
                <input type="text" placeholder="$20" className="flex-1 text-center bg-cream border-[1.5px] border-pborder rounded-lg px-3 py-2 text-[.85rem] text-ptext outline-none focus:border-g" />
                <span className="text-ptext-soft">–</span>
                <input type="text" placeholder="$150" className="flex-1 text-center bg-cream border-[1.5px] border-pborder rounded-lg px-3 py-2 text-[.85rem] text-ptext outline-none focus:border-g" />
              </div>
            </div>
          </div>

          {/* Sponsored ad */}
          <div className="bg-gradient-to-br from-[#FFF8F5] to-[#FFF0EA] border-[1.5px] border-[#FFD5C7] rounded-[14px] p-5 text-center">
            <span className="block text-[.68rem] font-bold uppercase tracking-[.08em] text-[#C97A5A] mb-2.5">Sponsored</span>
            <div className="text-[2rem] mb-2">🏥</div>
            <h4 className="font-[family-name:var(--font-nunito)] font-extrabold text-[.95rem] text-ptext mb-1.5">Austin Animal Clinic</h4>
            <p className="text-[.8rem] text-ptext-mid leading-[1.6] mb-3.5">Full-service vet clinic. New patients welcome. Just 2 miles from downtown.</p>
            <a href="#" className="block bg-o hover:bg-o-dark text-white font-bold text-[.82rem] py-2.5 rounded-lg transition-colors">Book a Visit →</a>
          </div>
        </aside>

        {/* Results */}
        <main>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="text-[.92rem] text-ptext-mid">
              Showing <strong className="text-ptext">{data.total.toLocaleString()} listings</strong>
              {stateLabel ? ` in ${stateLabel}` : ""}
              {isNearMe ? ` within ${params.radius ?? "25"} miles` : ""}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[.85rem] text-ptext-soft">Sort by:</span>
              <select className="bg-white border-[1.5px] border-pborder rounded-lg px-3 py-1.5 text-[.85rem] text-ptext outline-none cursor-pointer">
                <option>Best Match</option>
                <option>Highest Rated</option>
                <option>Most Reviews</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Featured spotlight */}
          {featuredSpotlight.length > 0 && (
            <div className="bg-gradient-to-br from-[#FFF8F5] to-[#FFFAF7] border-[1.5px] border-[#FFD5C7] rounded-[14px] p-5 mb-5">
              <div className="flex items-center gap-2 mb-3.5">
                <span className="bg-o text-white text-[.7rem] font-bold uppercase tracking-[.08em] px-2.5 py-1 rounded">Featured</span>
                <span className="text-[.82rem] text-ptext-soft">Top-rated businesses{stateLabel ? ` in ${stateLabel}` : ""}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {featuredSpotlight.map((l: any) => {
                  const photo = l.images?.[0]?.url ?? getPlaceholderPhoto(l.id, l.type);
                  return (
                    <Link key={l.id} href={`/listing/${l.slug}`}
                      className="bg-white border border-[#FFD5C7] rounded-[10px] p-3.5 flex gap-3 items-start hover:shadow-[0_4px_16px_rgba(244,132,95,.15)] hover:-translate-y-px transition-all no-underline text-inherit">
                      <div className="w-11 h-11 rounded-lg bg-g-pale relative shrink-0 overflow-hidden">
                        <Image src={photo} alt={l.name} fill className="object-cover" sizes="44px" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[.85rem] text-ptext truncate">{l.name}</div>
                        <div className="text-[.75rem] text-ptext-soft mt-0.5">{l.city}, {l.state}</div>
                        <div className="text-[.72rem] font-bold text-o mt-1">⭐ Featured · {typeLabel(l.type)}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Listing rows */}
          {data.listings.length === 0 ? (
            <div className="text-center py-20 text-ptext-soft">
              <div className="text-5xl mb-4">🐾</div>
              <p className="text-lg font-semibold text-ptext">No listings found</p>
              <p className="text-sm mt-1">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {data.listings.map((l: any) => {
                const photo = l.images?.[0]?.url ?? getPlaceholderPhoto(l.id, l.type);
                const isFeatured = l.tier === "FEATURED" || l.tier === "PREMIUM";
                const reviews = l.reviews ?? [];
                const avg = reviews.length > 0
                  ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
                  : null;

                return (
                  <Link
                    key={l.id}
                    href={`/listing/${l.slug}`}
                    className={`bg-white rounded-[14px] border-[1.5px] grid grid-cols-[180px_1fr_auto] overflow-hidden hover:shadow-[0_8px_32px_rgba(45,106,79,.14)] hover:-translate-y-0.5 transition-all no-underline text-inherit ${
                      isFeatured ? "border-o shadow-[0_0_0_3px_rgba(244,132,95,.10)]" : "border-pborder hover:border-g-light"
                    }`}
                  >
                    {/* Photo */}
                    <div className="relative bg-g-pale self-stretch">
                      <Image src={photo} alt={l.name} fill className="object-cover" sizes="180px" />
                      {isFeatured && (
                        <div className="absolute top-2 left-2 bg-o text-white text-[.65rem] font-bold uppercase px-2 py-0.5 rounded">⭐ Featured</div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col justify-center">
                      <div className="text-[.72rem] font-bold uppercase tracking-[.08em] text-g-light mb-1">{typeLabel(l.type)}</div>
                      <div className="font-[family-name:var(--font-nunito)] font-extrabold text-[1.05rem] text-ptext mb-1">{l.name}</div>
                      <div className="flex items-center gap-1 text-[.83rem] text-ptext-soft mb-2.5">
                        <MapPin className="h-3 w-3" />
                        {l.city}, {l.state}
                        {(l as any).distanceMiles && <span> · {(l as any).distanceMiles.toFixed(1)} mi</span>}
                      </div>
                      {l.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {l.amenities.slice(0, 4).map((a: any) => (
                            <span key={a.id} className="bg-g-pale text-g text-[.71rem] font-semibold px-2 py-0.5 rounded-full">{a.name}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right */}
                    <div className="px-5 py-4 flex flex-col items-end justify-center gap-2.5 border-l border-pborder shrink-0">
                      {avg ? (
                        <div className="text-right">
                          <div className="text-y text-[.88rem]">{"★".repeat(Math.round(parseFloat(avg)))}{"☆".repeat(5 - Math.round(parseFloat(avg)))}</div>
                          <div className="font-bold text-[.92rem] text-ptext">{avg}</div>
                          <div className="text-[.75rem] text-ptext-soft">{reviews.length} reviews</div>
                        </div>
                      ) : null}
                      {l.priceMin ? (
                        <div className="font-[family-name:var(--font-nunito)] font-black text-[1.05rem] text-g">
                          ${l.priceMin}<span className="text-[.72rem] font-normal text-ptext-soft font-[family-name:var(--font-inter)]">/night</span>
                        </div>
                      ) : null}
                      <div className="bg-g text-white text-[.82rem] font-bold px-4 py-2 rounded-lg">View →</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (() => {
            const cur   = data.page;
            const total = data.totalPages;

            function getPages(): (number | null)[] {
              if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
              if (cur <= 4)         return [1, 2, 3, 4, 5, null, total];
              if (cur >= total - 3) return [1, null, total - 4, total - 3, total - 2, total - 1, total];
              return [1, null, cur - 1, cur, cur + 1, null, total];
            }

            return (
              <div className="flex justify-center items-center gap-1.5 mt-9 pb-9">
                {cur > 1
                  ? <a href={buildUrl(cur - 1)} className="w-9 h-9 flex items-center justify-center rounded-lg border-[1.5px] border-pborder bg-white text-[.88rem] font-semibold text-ptext-mid hover:bg-g hover:border-g hover:text-white transition-colors">‹</a>
                  : <span className="w-9 h-9 flex items-center justify-center rounded-lg border border-pborder/50 text-[.88rem] text-ptext-soft/40">‹</span>}

                {getPages().map((p, i) =>
                  p === null
                    ? <span key={`e${i}`} className="px-1 text-ptext-soft text-sm select-none">…</span>
                    : <a key={p} href={buildUrl(p)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg border-[1.5px] text-[.88rem] font-semibold transition-colors ${
                          p === cur ? "bg-g border-g text-white font-extrabold" : "border-pborder bg-white text-ptext-mid hover:bg-g hover:border-g hover:text-white"
                        }`}>
                        {p}
                      </a>
                )}

                {cur < total
                  ? <a href={buildUrl(cur + 1)} className="w-9 h-9 flex items-center justify-center rounded-lg border-[1.5px] border-pborder bg-white text-[.88rem] font-semibold text-ptext-mid hover:bg-g hover:border-g hover:text-white transition-colors">›</a>
                  : <span className="w-9 h-9 flex items-center justify-center rounded-lg border border-pborder/50 text-[.88rem] text-ptext-soft/40">›</span>}
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}

function FilterGroup({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="mb-0">
      <span className="block text-[.78rem] font-bold uppercase tracking-[.07em] text-ptext-soft mb-2.5">{label}</span>
      <div className="flex flex-col gap-1.5">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2 text-[.88rem] text-ptext-mid py-1 cursor-pointer hover:text-g">
            <input type="checkbox" className="accent-g w-[15px] h-[15px]" /> {o}
          </label>
        ))}
      </div>
    </div>
  );
}
