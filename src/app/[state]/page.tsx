import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { US_STATES, getStateName } from "@/lib/utils";
import ListingCard from "@/components/listings/ListingCard";
import MapWrapper from "@/components/map/MapWrapper";
import Breadcrumb from "@/components/ui/Breadcrumb";

const RESERVED = new Set([
  "search", "list-your-business", "premium", "advertise",
  "privacy", "terms", "contact", "api", "favicon.ico",
]);

// Neighboring / nearby states for cross-linking
const NEIGHBORS: Record<string, string[]> = {
  alabama:          ["georgia", "florida", "tennessee", "mississippi"],
  alaska:           ["washington", "oregon"],
  arizona:          ["california", "nevada", "utah", "new-mexico"],
  arkansas:         ["tennessee", "missouri", "oklahoma", "texas"],
  california:       ["oregon", "nevada", "arizona"],
  colorado:         ["utah", "wyoming", "nebraska", "new-mexico"],
  connecticut:      ["new-york", "rhode-island", "massachusetts"],
  delaware:         ["maryland", "pennsylvania", "new-jersey"],
  florida:          ["georgia", "alabama"],
  georgia:          ["florida", "tennessee", "south-carolina", "alabama"],
  hawaii:           ["california"],
  idaho:            ["washington", "oregon", "montana", "utah"],
  illinois:         ["wisconsin", "iowa", "indiana", "missouri"],
  indiana:          ["illinois", "ohio", "michigan", "kentucky"],
  iowa:             ["minnesota", "wisconsin", "illinois", "missouri"],
  kansas:           ["nebraska", "missouri", "oklahoma", "colorado"],
  kentucky:         ["tennessee", "indiana", "ohio", "virginia"],
  louisiana:        ["texas", "arkansas", "mississippi"],
  maine:            ["new-hampshire", "vermont"],
  maryland:         ["virginia", "pennsylvania", "delaware", "west-virginia"],
  massachusetts:    ["connecticut", "rhode-island", "new-york", "new-hampshire"],
  michigan:         ["indiana", "ohio", "wisconsin"],
  minnesota:        ["wisconsin", "iowa", "north-dakota", "south-dakota"],
  mississippi:      ["tennessee", "alabama", "louisiana", "arkansas"],
  missouri:         ["illinois", "kentucky", "kansas", "tennessee"],
  montana:          ["idaho", "north-dakota", "south-dakota", "wyoming"],
  nebraska:         ["iowa", "kansas", "south-dakota", "colorado"],
  nevada:           ["california", "oregon", "arizona", "utah"],
  "new-hampshire":  ["maine", "vermont", "massachusetts"],
  "new-jersey":     ["new-york", "delaware", "pennsylvania"],
  "new-mexico":     ["colorado", "texas", "arizona", "oklahoma"],
  "new-york":       ["pennsylvania", "connecticut", "massachusetts", "new-jersey"],
  "north-carolina": ["virginia", "tennessee", "south-carolina", "georgia"],
  "north-dakota":   ["minnesota", "south-dakota", "montana"],
  ohio:             ["pennsylvania", "west-virginia", "kentucky", "indiana"],
  oklahoma:         ["kansas", "missouri", "arkansas", "texas"],
  oregon:           ["washington", "california", "nevada", "idaho"],
  pennsylvania:     ["new-york", "new-jersey", "ohio", "maryland"],
  "rhode-island":   ["connecticut", "massachusetts"],
  "south-carolina": ["north-carolina", "georgia"],
  "south-dakota":   ["north-dakota", "minnesota", "iowa", "nebraska"],
  tennessee:        ["kentucky", "virginia", "north-carolina", "georgia"],
  texas:            ["oklahoma", "arkansas", "louisiana", "new-mexico"],
  utah:             ["idaho", "wyoming", "colorado", "nevada"],
  vermont:          ["new-york", "new-hampshire", "massachusetts"],
  virginia:         ["maryland", "west-virginia", "north-carolina", "tennessee"],
  washington:       ["oregon", "idaho"],
  "west-virginia":  ["ohio", "pennsylvania", "maryland", "virginia"],
  wisconsin:        ["minnesota", "iowa", "illinois", "michigan"],
  wyoming:          ["montana", "idaho", "utah", "colorado"],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateName = getStateName(state);
  return {
    title: `Pet Boarding in ${stateName} | Kennels, Dog Hotels & Sitters`,
    description: `Find trusted pet boarding in ${stateName}. Browse kennels, dog hotels, and pet sitters across the state. Free to search — contact facilities directly.`,
    alternates: { canonical: `https://petbednstay.com/${state}` },
  };
}

async function getStateData(stateSlug: string) {
  const [listings, content, cityCounts] = await Promise.all([
    db.listing.findMany({
      where: { stateSlug, isActive: true },
      include: { images: true, amenities: true },
      orderBy: [{ tier: "desc" }, { isVerified: "desc" }],
      take: 48,
    }),
    db.stateContent.findUnique({ where: { stateSlug } }),
    db.listing.groupBy({
      by: ["city", "citySlug"],
      where: { stateSlug, isActive: true },
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  return { listings, content, cityCounts };
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
  let data = {
    listings:   [] as any[],
    content:    null as any,
    cityCounts: [] as any[],
  };

  try {
    data = await getStateData(state);
  } catch {
    // DB not connected yet
  }

  const mapListings = data.listings
    .filter((l) => l.lat && l.lng)
    .map((l) => ({ id: l.id, name: l.name, lat: l.lat, lng: l.lng, city: l.city, state: l.state, slug: l.slug, tier: l.tier }));

  const shownListings = data.listings.length;
  const totalCount    = data.cityCounts.reduce((acc: number, c: any) => acc + c._count._all, 0);
  const isCapped      = shownListings >= 48 && totalCount > shownListings;
  const totalCities   = data.cityCounts.length;
  const topCities     = data.cityCounts.slice(0, 24);
  const extraCities   = data.cityCounts.length - topCities.length;
  const neighborSlugs = NEIGHBORS[state] ?? [];
  const nearbyStates  = neighborSlugs.map((slug) => US_STATES.find((s) => s.slug === slug)).filter(Boolean) as { name: string; slug: string; abbr: string }[];

  const faqs = [
    {
      q: `What vaccinations are required for pet boarding in ${stateName}?`,
      a: `Most boarding facilities in ${stateName} require proof of current vaccinations before accepting your pet. Dogs typically need Rabies, DHPP (distemper, hepatitis, parvovirus, parainfluenza), and Bordetella (kennel cough) — especially for group boarding. Cats usually need Rabies and FVRCP. Some facilities also require a current flea treatment or negative fecal exam. Always confirm the specific requirements with each facility before your pet's first stay.`,
    },
    {
      q: `How much does pet boarding cost in ${stateName}?`,
      a: `Daily boarding rates in ${stateName} typically range from $30–$75 per night for dogs and $20–$40 per night for cats. Premium facilities and major metro areas tend to be on the higher end, while rural kennels are often more affordable. In-home pet sitters generally charge $25–$55 per night. Rates vary based on your pet's size, type of accommodation (private suite vs. shared kennel), and add-on services like extra walks, grooming, or training sessions.`,
    },
    {
      q: `What should I look for when choosing a pet boarding facility in ${stateName}?`,
      a: `When evaluating boarding options in ${stateName}, look for a clean and odor-free environment, appropriate staff-to-pet ratios, secure outdoor areas, clear vaccination and health policies, and transparent pricing with no hidden fees. Check that staff are on-site overnight or on-call. If possible, schedule a tour before your pet's first stay — a reputable facility will welcome this. Reading recent reviews and looking for PCSA (Pet Care Services Association) accreditation are also strong indicators of consistent quality.`,
    },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",                                item: "https://petbednstay.com" },
      { "@type": "ListItem", position: 2, name: `Pet Boarding in ${stateName}`, item: `https://petbednstay.com/${state}` },
    ],
  };

  const itemListLd = data.listings.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Pet Boarding Facilities in ${stateName}`,
    numberOfItems: data.listings.length,
    itemListElement: data.listings.map((l: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://petbednstay.com/listing/${l.slug}`,
      name: l.name,
    })),
  } : null;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-warm-50 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* White hero header */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: `Pet Boarding in ${stateName}` },
          ]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mt-3">
            Pet Boarding in {stateName}
          </h1>
          {totalCount > 0 && (
            <p className="mt-2 text-stone-500">
              {totalCount}+ boarding {totalCount === 1 ? "facility" : "facilities"} and pet sitters across {totalCities} {totalCities === 1 ? "city" : "cities"} in {stateName}
            </p>
          )}
        </div>
      </div>

      {/* State tagline banner */}
      {data.content?.tagline && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-center text-amber-900 text-sm font-semibold">
              {data.content.tagline}
            </p>
          </div>
        </div>
      )}

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Writeup */}
      {data.content?.writeup && (
        <div className="max-w-3xl mb-8 text-stone-600 leading-relaxed text-sm sm:text-base space-y-3">
          {data.content.writeup.split("\n\n").map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {/* City cards */}
      {topCities.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-stone-700 mb-4">Browse by City</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {topCities.map((c: any) => (
              <Link
                key={c.citySlug}
                href={`/${state}/${c.citySlug}`}
                className="bg-white border border-amber-100 hover:border-brand-400 hover:shadow-sm rounded-xl p-3 sm:p-4 transition-all group"
              >
                <div className="font-medium text-stone-800 text-sm group-hover:text-brand-600 transition-colors truncate">{c.city}</div>
                <div className="text-xs text-stone-400 mt-0.5">{c._count._all} {c._count._all === 1 ? "facility" : "facilities"}</div>
              </Link>
            ))}
          </div>
          {extraCities > 0 && (
            <p className="text-xs text-stone-400 mt-3">+{extraCities} more {extraCities === 1 ? "city" : "cities"} with listings</p>
          )}
        </div>
      )}

      {/* Listings + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
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
            <>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-700">All Facilities in {stateName}</h2>
                {isCapped && (
                  <span className="text-xs text-stone-400">
                    Showing {shownListings} of {totalCount} — browse by city above for more
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {data.listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 h-[450px] rounded-2xl overflow-hidden border border-amber-100 shadow-sm">
            <MapWrapper listings={mapListings} zoom={7} />
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-xl font-bold text-stone-800 mb-6">
          Frequently Asked Questions — Pet Boarding in {stateName}
        </h2>
        <div className="space-y-5">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-amber-100 rounded-2xl p-6">
              <h3 className="font-semibold text-stone-800 mb-2">{faq.q}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-stone-900 rounded-2xl p-8 text-center text-white mb-12">
        <h2 className="text-2xl font-bold mb-2">Own a Pet Boarding Business in {stateName}?</h2>
        <p className="text-stone-400 mb-6 max-w-md mx-auto">
          List your kennel, pet hotel, or sitting service for free and reach pet owners searching in {stateName}.
        </p>
        <Link
          href="/list-your-business"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          List Your Business — Free
        </Link>
      </div>

      {/* Nearby / neighboring states */}
      {nearbyStates.length > 0 && (
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-stone-700 mb-4">Pet Boarding in Nearby States</h2>
          <div className="flex flex-wrap gap-3">
            {nearbyStates.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="bg-white border border-amber-100 hover:border-brand-400 hover:shadow-sm rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-brand-600 transition-all"
              >
                Pet Boarding in {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
