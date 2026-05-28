import Hero from "@/components/home/Hero";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import HappyPawrents from "@/components/home/HappyPawrents";
import Stats from "@/components/home/Stats";
import StateGrid from "@/components/home/StateGrid";
import { db } from "@/lib/db";

export const revalidate = 3600;

async function getFeaturedListings() {
  try {
    return await db.listing.findMany({
      where: { isActive: true, tier: { in: ["FEATURED", "PREMIUM"] } },
      include: { images: true, amenities: true },
      orderBy: [{ tier: "desc" }, { createdAt: "desc" }],
      take: 6,
    });
  } catch {
    return [];
  }
}

async function getCounts() {
  try {
    const [listings, states] = await Promise.all([
      db.listing.count({ where: { isActive: true } }),
      db.listing.groupBy({ by: ["stateSlug"], where: { isActive: true } }),
    ]);
    return { listings, states: states.length };
  } catch {
    return { listings: 0, states: 0 };
  }
}

export default async function HomePage() {
  const [featured, counts] = await Promise.all([getFeaturedListings(), getCounts()]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const featuredTyped = featured as any[];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PetBedNStay",
    url: "https://petbednstay.com",
    description: "Find trusted pet boarding, dog kennels, and pet hotels across all 50 US states.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://petbednstay.com/search?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Hero />
      <Stats listingCount={counts.listings} stateCount={counts.states} />
      <HowItWorks />
      <HappyPawrents />
      <FeaturedListings listings={featuredTyped} />
      <StateGrid />

      {/* CTA Banner */}
      <section className="bg-stone-900 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Own a Pet Hotel or Boarding Facility?
          </h2>
          <p className="text-stone-400 mb-6 text-lg">
            List your business for free and reach thousands of pet owners searching for boarding near them.
            Upgrade to Featured or Premium for priority placement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/list-your-business"
              className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              List Your Business — Free
            </a>
            <a
              href="/list-your-business#pricing"
              className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/20"
            >
              See Premium Plans
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
