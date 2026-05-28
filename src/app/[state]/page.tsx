import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { US_STATES, getStateName } from "@/lib/utils";
import ListingCard from "@/components/listings/ListingCard";
import MapWrapper from "@/components/map/MapWrapper";

const RESERVED = new Set([
  "search", "list-your-business", "premium", "advertise",
  "privacy", "terms", "contact", "api", "favicon.ico",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateName = getStateName(state);
  return {
    title: `Pet Hotels & Sitters in ${stateName}`,
    description: `Browse trusted pet hotels, boarding facilities, and pet sitters across ${stateName}. Find the perfect care for your pet.`,
  };
}

async function getStateData(stateSlug: string) {
  const [listings, content] = await Promise.all([
    db.listing.findMany({
      where: { stateSlug, isActive: true },
      include: { images: true, amenities: true },
      orderBy: [{ tier: "desc" }, { isVerified: "desc" }],
      take: 48,
    }),
    db.stateContent.findUnique({ where: { stateSlug } }),
  ]);

  const cities = [...new Set(listings.map((l) => l.city))].sort();

  return { listings, content, cities };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;

  if (RESERVED.has(state)) notFound();
  if (!US_STATES.find((s) => s.slug === state)) notFound();

  const stateName = getStateName(state);
  let data = { listings: [] as any[], content: null as any, cities: [] as string[] };

  try {
    data = await getStateData(state);
  } catch {
    // DB not connected yet
  }

  const mapListings = data.listings
    .filter((l) => l.lat && l.lng)
    .map((l) => ({ id: l.id, name: l.name, lat: l.lat, lng: l.lng, city: l.city, state: l.state, slug: l.slug, tier: l.tier }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-stone-500 mb-2">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          {" / "}
          <span className="text-stone-700">{stateName}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
          Pet Hotels & Sitters in {stateName}
        </h1>
        <p className="mt-2 text-stone-500">
          {data.listings.length > 0
            ? `${data.listings.length}+ boarding facilities and pet sitters in ${stateName}`
            : `Find trusted pet boarding in ${stateName}`}
        </p>
      </div>

      {/* Writeup */}
      {data.content?.writeup && (
        <div className="prose prose-stone max-w-3xl mb-8 text-stone-600 leading-relaxed">
          <p>{data.content.writeup}</p>
        </div>
      )}

      {/* Cities */}
      {data.cities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-stone-700 mb-3">Browse by City</h2>
          <div className="flex flex-wrap gap-2">
            {data.cities.map((city) => (
              <Link
                key={city}
                href={`/${state}/${city.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm bg-white border border-amber-200 hover:border-brand-400 text-stone-700 hover:text-brand-600 px-3 py-1.5 rounded-full transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listings */}
        <div className="lg:col-span-2">
          {data.listings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-amber-100">
              <div className="text-5xl mb-4">🐾</div>
              <p className="text-stone-600 font-medium">No listings yet in {stateName}</p>
              <p className="text-sm text-stone-400 mt-1">Be the first to list your business here</p>
              <Link
                href="/list-your-business"
                className="inline-block mt-4 bg-brand-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors"
              >
                List Your Business
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 h-[450px] rounded-2xl overflow-hidden border border-amber-100 shadow-sm">
            <MapWrapper listings={mapListings} zoom={7} />
          </div>
        </div>
      </div>
    </div>
  );
}
