import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { US_STATES, getStateName } from "@/lib/utils";
import ListingCard from "@/components/listings/ListingCard";
import MapWrapper from "@/components/map/MapWrapper";
import Breadcrumb from "@/components/ui/Breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state, city } = await params;
  const stateName = getStateName(state);
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Pet Boarding in ${cityName}, ${stateName} | Kennels & Dog Hotels`,
    description: `Find pet boarding in ${cityName}, ${stateName}. Browse kennels, dog hotels, and pet sitters. Compare options and contact facilities directly — free to search.`,
    alternates: { canonical: `https://petbednstay.com/${state}/${city}` },
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

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://petbednstay.com" },
      { "@type": "ListItem", position: 2, name: `Pet Boarding in ${stateName}`, item: `https://petbednstay.com/${state}` },
      { "@type": "ListItem", position: 3, name: `Pet Boarding in ${cityName}`, item: `https://petbednstay.com/${state}/${city}` },
    ],
  };

  const itemListLd = listings.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Pet Boarding in ${cityName}, ${stateName}`,
    numberOfItems: listings.length,
    itemListElement: listings.map((l: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://petbednstay.com/listing/${l.slug}`,
      name: l.name,
    })),
  } : null;

  const faqs = [
    {
      q: `How much does pet boarding cost in ${cityName}, ${stateName}?`,
      a: `Pet boarding rates in ${cityName} typically range from $35–$75 per night for dogs and $20–$45 per night for cats. Pricing depends on the type of accommodation (private suite, shared kennel, or in-home stay), your pet's size, and any add-on services like extra walks, training, or grooming. In-home pet sitters in ${cityName} often charge $30–$60 per visit or overnight stay. Always confirm current rates directly with each facility, as prices can vary seasonally.`,
    },
    {
      q: `What vaccinations are required for pet boarding in ${cityName}?`,
      a: `Most pet boarding facilities in ${cityName} require dogs to be current on Rabies, DHPP (distemper, hepatitis, parvovirus, parainfluenza), and Bordetella (kennel cough) vaccines. Cats typically need Rabies and FVRCP. Some facilities also require a negative fecal exam or proof of recent flea prevention. Vaccination requirements vary by facility — always check with the specific boarding provider before your pet's first stay and bring documentation from your vet.`,
    },
    {
      q: `How do I find a trusted pet boarding facility in ${cityName}?`,
      a: `Start by browsing the listings above — each profile includes contact info, amenities, and facility type. When you've found a few options, call ahead to ask about staff-to-pet ratios, overnight supervision, their emergency protocols, and whether they require a meet-and-greet before your pet's first stay. If possible, schedule a tour before booking. Look for facilities that are clean, transparent about policies, and willing to answer your questions — those are strong indicators of a trustworthy operation.`,
    },
  ];

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
            { label: "Home",                          href: "/" },
            { label: stateName,                        href: `/${state}` },
            { label: `Pet Boarding in ${cityName}` },
          ]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mt-3">
            Pet Boarding in {cityName}, {stateName}
          </h1>
          <p className="mt-2 text-stone-500">
            {listings.length > 0
              ? `${listings.length} pet boarding option${listings.length !== 1 ? "s" : ""} in ${cityName}`
              : `Looking for pet boarding in ${cityName}, ${stateName}`}
          </p>
        </div>
      </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* FAQ */}
      <div className="max-w-3xl mt-12 mb-4">
        <h2 className="text-xl font-bold text-stone-800 mb-6">
          Frequently Asked Questions — Pet Boarding in {cityName}
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
    </div>
    </div>
  );
}
