import Hero from "@/components/home/Hero";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import HappyPawrents from "@/components/home/HappyPawrents";
import StateGrid from "@/components/home/StateGrid";
import TrustBand from "@/components/home/TrustBand";
import { db } from "@/lib/db";
import Link from "next/link";

export const revalidate = 3600;

async function getFeaturedListings() {
  try {
    return await db.listing.findMany({
      where: { isActive: true, tier: { in: ["FEATURED", "PREMIUM"] } },
      include: { images: true, amenities: true, reviews: { where: { isApproved: true }, select: { rating: true } } },
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
    return { listings: 800, states: 49 };
  }
}

export default async function HomePage() {
  const [featured, counts] = await Promise.all([getFeaturedListings(), getCounts()]);

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

      {/* Hero with stats built-in */}
      <Hero listingCount={counts.listings || 800} stateCount={counts.states || 49} />

      {/* Wave divider */}
      <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        className="block -mt-px w-full" style={{ background: "#2D6A4F" }}>
        <path d="M0 48 C360 0 1080 0 1440 48 L1440 48 L0 48Z" fill="#FAFAF5"/>
      </svg>

      {/* Browse by State */}
      <StateGrid />

      {/* Featured listings */}
      <FeaturedListings listings={featured as any[]} />

      {/* How it works */}
      <HowItWorks />

      {/* Trust band */}
      <TrustBand />

      {/* Testimonials */}
      <HappyPawrents />

      {/* Business CTA */}
      <div className="py-[60px] px-6 text-center" style={{ background: "linear-gradient(135deg, #F4845F 0%, #F9A87A 100%)" }}>
        <h2 className="font-[family-name:var(--font-nunito)] font-black text-white mb-3" style={{ fontSize: "clamp(1.6rem,3vw,2rem)" }}>
          Own a Pet Boarding Business? 🏡
        </h2>
        <p className="text-white/88 text-[1rem] mb-7">
          Join 800+ businesses already listed. It&apos;s free to get started — upgrade anytime for premium placement.
        </p>
        <Link
          href="/list-your-business"
          className="inline-block bg-white text-o-dark font-extrabold text-[.95rem] px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,.15)] hover:shadow-[0_8px_28px_rgba(0,0,0,.2)] hover:-translate-y-0.5 transition-all"
        >
          List Your Business — It&apos;s Free →
        </Link>
      </div>
    </>
  );
}
