import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { db } from "@/lib/db";
import { typeLabel, DAYS, getPlaceholderPhoto, googleMapsUrl, generateListingDescription, getStateAbbr } from "@/lib/utils";
import MapWrapper from "@/components/map/MapWrapper";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ReviewSection from "@/components/listings/ReviewSection";
import ListingContactSidebar from "@/components/listings/ListingContactSidebar";
import UnclaimedBanner from "@/components/listings/UnclaimedBanner";
import AffiliateWidget from "@/components/listings/AffiliateWidget";
import ShareButton from "@/components/listings/ShareButton";
import ListingCard from "@/components/listings/ListingCard";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const listings = await db.listing.findMany({
      where: { isActive: true, tier: { in: ["FEATURED", "PREMIUM"] } },
      select: { slug: true },
    });
    return listings.map((l) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

const getListing = cache(async (slug: string) => {
  try {
    return await db.listing.findUnique({
      where: { slug },
      include: {
        images: true,
        amenities: true,
        hours: { orderBy: { dayOfWeek: "asc" } },
        reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
      },
    });
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) return { title: "Listing Not Found" };
  const stateAbbr = getStateAbbr(listing.stateSlug);
  const description =
    listing.description ??
    generateListingDescription({ name: listing.name, city: listing.city, state: listing.state, type: listing.type, phone: listing.phone });
  const ogImage = listing.images.find((i: any) => i.isPrimary)?.url ?? listing.images[0]?.url;
  return {
    title: `${listing.name} — Pet Boarding in ${listing.city}, ${stateAbbr}`,
    description,
    alternates: { canonical: `https://petbednstay.com/listing/${slug}` },
    openGraph: {
      title: `${listing.name} — Pet Boarding in ${listing.city}, ${stateAbbr}`,
      description,
      url: `https://petbednstay.com/listing/${slug}`,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: listing.name }] } : {}),
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListing(slug);
  if (!listing) notFound();

  let similarListings: any[] = [];
  try {
    similarListings = await db.listing.findMany({
      where: { isActive: true, citySlug: listing.citySlug, id: { not: listing.id } },
      include: { images: true, amenities: true },
      orderBy: [{ tier: "desc" }, { isVerified: "desc" }],
      take: 3,
    });
  } catch {
    /* ignore */
  }

  const primaryImage = listing.images.find((i: any) => i.isPrimary) ?? listing.images[0];
  const otherImages = listing.images.filter((i: any) => i !== primaryImage).slice(0, 2);
  const photoUrl = primaryImage?.url ?? getPlaceholderPhoto(listing.id, listing.type);
  const isLogo = photoUrl.includes("logo");
  const mapsUrl = googleMapsUrl(listing);
  const stateAbbr = getStateAbbr(listing.stateSlug);
  const isFeatured = listing.tier === "FEATURED" || listing.tier === "PREMIUM";

  const googleReviewUrl =
    listing.googleUrl ??
    `https://www.google.com/search?q=${encodeURIComponent(`${listing.name} ${listing.city} ${listing.state} reviews`)}`;
  const yelpReviewUrl =
    listing.yelpUrl ??
    `https://www.yelp.com/search?find_desc=${encodeURIComponent(listing.name)}&find_loc=${encodeURIComponent(`${listing.city}, ${listing.state}`)}`;

  const mapListings =
    listing.lat && listing.lng
      ? [{ id: listing.id, name: listing.name, lat: listing.lat, lng: listing.lng, city: listing.city, state: listing.state, slug: listing.slug, tier: listing.tier }]
      : [];

  const avgRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((s: number, r: any) => s + r.rating, 0) / listing.reviews.length
      : null;
  const avgStr = avgRating ? avgRating.toFixed(1) : null;
  const starsFull = avgRating ? Math.round(avgRating) : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name,
    description: listing.description ?? undefined,
    url: `https://petbednstay.com/listing/${listing.slug}`,
    image: primaryImage?.url ?? undefined,
    telephone: listing.phone ?? undefined,
    email: listing.email ?? undefined,
    ...(listing.website ? { sameAs: [listing.website] } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address ?? undefined,
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip ?? undefined,
      addressCountry: "US",
    },
    ...(listing.lat && listing.lng
      ? { geo: { "@type": "GeoCoordinates", latitude: listing.lat, longitude: listing.lng } }
      : {}),
    ...(avgStr
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgStr,
            reviewCount: listing.reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return (
    <div className="bg-cream min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Gallery */}
      <div className="h-[420px] grid grid-cols-[2fr_1fr] gap-1 overflow-hidden bg-g-dark">
        <div className="relative bg-g-pale">
          <Image
            src={photoUrl}
            alt={listing.name}
            fill
            className={isLogo ? "object-contain p-6" : "object-cover"}
            sizes="66vw"
            priority
          />
          {isFeatured && (
            <div className="absolute top-5 left-5 bg-o text-white text-[.75rem] font-bold uppercase tracking-[.07em] px-3.5 py-1.5 rounded-lg">
              ⭐ Featured Partner
            </div>
          )}
        </div>
        <div className="grid grid-rows-2 gap-1">
          {otherImages.length > 0 ? (
            otherImages.map((img: any) => (
              <div key={img.id} className="relative bg-g-pale/80">
                <Image src={img.url} alt={listing.name} fill className="object-cover" sizes="33vw" />
              </div>
            ))
          ) : (
            <>
              <div className="bg-g-pale/60" />
              <div className="bg-g-pale/40" />
            </>
          )}
        </div>
      </div>

      {/* Page body */}
      <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        <main className="space-y-5">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: listing.state, href: `/${listing.stateSlug}` },
              { label: listing.city, href: `/${listing.stateSlug}/${listing.citySlug}` },
              { label: listing.name },
            ]}
          />

          {/* Header */}
          <div>
            <div className="text-[.75rem] font-bold uppercase tracking-[.1em] text-g-light mb-2">
              {typeLabel(listing.type)} · {listing.city}, {stateAbbr}
            </div>
            <h1 className="font-[family-name:var(--font-nunito)] font-black text-[2rem] text-ptext leading-[1.2] mb-3">
              {listing.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-5">
              {avgStr && (
                <div className="flex items-center gap-1.5 bg-g-pale px-3 py-1.5 rounded-full">
                  <span className="text-y text-[.9rem]">
                    {"★".repeat(starsFull)}
                    {"☆".repeat(5 - starsFull)}
                  </span>
                  <strong className="font-bold text-[.88rem] text-ptext">{avgStr}</strong>
                  <span className="text-[.8rem] text-ptext-soft">{listing.reviews.length} reviews</span>
                </div>
              )}
              {listing.address && (
                <div className="flex items-center gap-1.5 text-[.88rem] text-ptext-mid">
                  <MapPin className="h-3.5 w-3.5 text-ptext-soft shrink-0" />
                  {listing.address}, {listing.city}, {stateAbbr} {listing.zip ?? ""}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {listing.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="inline-flex items-center gap-2 bg-g hover:bg-g-dark text-white font-bold text-[.95rem] px-7 py-3 rounded-[10px] transition-colors"
                >
                  <Phone className="h-4 w-4" /> Call {listing.phone}
                </a>
              )}
              {listing.email && (
                <a
                  href={`mailto:${listing.email}`}
                  className="inline-flex items-center gap-2 bg-white text-g border-2 border-g hover:bg-g-pale font-bold text-[.92rem] px-6 py-3 rounded-[10px] transition-colors"
                >
                  <Mail className="h-4 w-4" /> Email Business
                </a>
              )}
              <ShareButton
                title={`${listing.name} — Pet Boarding in ${listing.city}, ${listing.state}`}
                url={`https://petbednstay.com/listing/${listing.slug}`}
              />
            </div>
          </div>

          {!listing.claimedAt && (
            <UnclaimedBanner listingName={listing.name} city={listing.city} state={listing.state} />
          )}

          <InfoCard title="About This Stay">
            <p className="text-[.93rem] text-ptext-mid leading-[1.8]">
              {listing.description ?? generateListingDescription(listing)}
            </p>
          </InfoCard>

          {listing.amenities.length > 0 && (
            <InfoCard title="Amenities & Services">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {listing.amenities.map((a: any) => (
                  <div key={a.id} className="flex items-center gap-2 bg-g-pale rounded-[10px] px-3.5 py-2.5 text-[.85rem] font-semibold text-g">
                    {a.name}
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {listing.hours.length > 0 && (
            <InfoCard title="Hours of Operation">
              <div className="space-y-2">
                {listing.hours.map((h: any) => (
                  <div key={h.id} className="flex justify-between text-sm">
                    <span className="text-ptext-mid w-20">{DAYS[h.dayOfWeek]}</span>
                    <span className={h.isClosed ? "text-red-500" : "text-ptext"}>
                      {h.isClosed ? "Closed" : `${h.openTime} – ${h.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          {mapListings.length > 0 && (
            <InfoCard title="Location">
              <div className="rounded-[10px] overflow-hidden h-56 mb-4">
                <MapWrapper listings={mapListings} zoom={14} center={[listing.lat!, listing.lng!]} />
              </div>
              {listing.address && (
                <div className="flex items-start gap-2.5 text-[.9rem] text-ptext-mid">
                  <MapPin className="h-4 w-4 text-o shrink-0 mt-0.5" />
                  <div>
                    <strong>{listing.address}</strong>
                    <br />
                    {listing.city}, {stateAbbr} {listing.zip ?? ""}
                    <br />
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-g font-semibold text-[.83rem] hover:underline">
                      Get directions →
                    </a>
                  </div>
                </div>
              )}
            </InfoCard>
          )}

          <ReviewSection
            listingId={listing.id}
            listingName={listing.name}
            initialReviews={listing.reviews.map((r: any) => ({
              id: r.id,
              authorName: r.authorName,
              rating: r.rating,
              body: r.body,
              createdAt: r.createdAt.toISOString(),
            }))}
          />
        </main>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-[80px] flex flex-col gap-4">
          <ListingContactSidebar
            listingName={listing.name}
            phone={listing.phone}
            email={listing.email}
            website={listing.website}
            mapsUrl={mapsUrl}
            googleReviewUrl={googleReviewUrl}
            yelpReviewUrl={yelpReviewUrl}
            tier={listing.tier}
          />

          <div className="bg-gradient-to-br from-[#FFF8F5] to-[#FFF0EA] border-[1.5px] border-[#FFD5C7] rounded-[14px] p-5 text-center">
            <span className="block text-[.68rem] font-bold uppercase tracking-[.08em] text-[#C97A5A] mb-2.5">
              Sponsored · Nearby Business
            </span>
            <div className="text-[2rem] mb-2">🏥</div>
            <h4 className="font-[family-name:var(--font-nunito)] font-extrabold text-[.9rem] text-ptext mb-1.5">
              Nearby Animal Clinic
            </h4>
            <p className="text-[.78rem] text-ptext-mid leading-[1.6] mb-3">Full-service vet nearby. New patients welcome.</p>
            <a href="/advertise" className="block bg-o hover:bg-o-dark text-white font-bold text-[.8rem] py-2.5 rounded-lg transition-colors">
              Advertise Here →
            </a>
          </div>

          <AffiliateWidget />
        </aside>
      </div>

      {/* Similar listings */}
      {similarListings.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-6 pb-12">
          <h2 className="font-[family-name:var(--font-nunito)] font-black text-[1.25rem] text-ptext mb-5">
            More Pet Boarding in {listing.city}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similarListings.map((s: any) => (
              <ListingCard key={s.id} listing={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-[1.5px] border-pborder rounded-[14px] p-7">
      <h2 className="font-[family-name:var(--font-nunito)] font-extrabold text-[1.15rem] text-ptext mb-4 pb-3.5 border-b border-pborder">
        {title}
      </h2>
      {children}
    </div>
  );
}
