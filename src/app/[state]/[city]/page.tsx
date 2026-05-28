import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { US_STATES, getStateName } from "@/lib/utils";
import ListingCard from "@/components/listings/ListingCard";
import MapWrapper from "@/components/map/MapWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state, city } = await params;
  const stateName = getStateName(state);
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Pet Hotels & Sitters in ${cityName}, ${stateName}`,
    description: `Find pet hotels, boarding facilities, and pet sitters in ${cityName}, ${stateName}. Browse listings and contact them directly.`,
  };
}

async function getCityData(stateSlug: string, citySlug: string) {
  return db.listing.findMany({
    where: { stateSlug, citySlug, isActive: true },
    include: { images: true, amenities: true },
    orderBy: [{ tier: "desc" }, { isVerified: "desc" }],
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;

  if (!US_STATES.find((s) => s.slug === state)) notFound();

  const stateName = getStateName(state);
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  let listings: any[] = [];
  try {
    listings = await getCityData(state, city);
  } catch {
    // DB not connected
  }

  const mapListings = listings
    .filter((l) => l.lat && l.lng)
    .map((l) => ({ id: l.id, name: l.name, lat: l.lat, lng: l.lng, city: l.city, state: l.state, slug: l.slug, tier: l.tier }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-stone-500 mb-4">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        {" / "}
        <Link href={`/${state}`} className="hover:text-brand-600">{stateName}</Link>
        {" / "}
        <span className="text-stone-700">{cityName}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-2">
        Pet Hotels & Sitters in {cityName}, {stateName}
      </h1>
      <p className="text-stone-500 mb-8">
        {listings.length > 0
          ? `${listings.length} pet boarding option${listings.length !== 1 ? "s" : ""} in ${cityName}`
          : `Looking for pet boarding in ${cityName}, ${stateName}`}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {listings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-amber-100">
              <div className="text-5xl mb-4">🐾</div>
              <p className="text-stone-600 font-medium">No listings yet in {cityName}</p>
              <Link
                href="/list-your-business"
                className="inline-block mt-4 bg-brand-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors"
              >
                List Your Business Here
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 h-[400px] rounded-2xl overflow-hidden border border-amber-100 shadow-sm">
            <MapWrapper listings={mapListings} zoom={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
