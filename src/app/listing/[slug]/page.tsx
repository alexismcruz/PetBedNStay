import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, BadgeCheck, Clock,
} from "lucide-react";
import { db } from "@/lib/db";
import { tierLabel, tierColor, typeLabel, DAYS, cn, getPlaceholderPhoto, googleMapsUrl, generateListingDescription, getStateAbbr } from "@/lib/utils";
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

// Single cached DB fetch — shared between generateMetadata and the page component
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const listing = await getListing(slug);

  if (!listing) notFound();

  // Similar listings — same city, exclude self, up to 3
  let similarListings: any[] = [];
  try {
    similarListings = await db.listing.findMany({
      where: { isActive: true, citySlug: listing.citySlug, id: { not: listing.id } },
      include: { images: true, amenities: true },
      orderBy: [{ tier: "desc" }, { isVerified: "desc" }],
      take: 3,
    });
  } catch { /* ignore */ }

  const primaryImage = listing.images.find((i: any) => i.isPrimary) ?? listing.images[0];
  const otherImages = listing.images.filter((i: any) => !i.isPrimary && i !== primaryImage);
  const photoUrl = primaryImage?.url ?? getPlaceholderPhoto(listing.id, listing.type);
  const mapsUrl = googleMapsUrl(listing);

  // External review links — use stored URL or fall back to search
  const googleReviewUrl = listing.googleUrl
    ?? `https://www.google.com/search?q=${encodeURIComponent(`${listing.name} ${listing.city} ${listing.state} reviews`)}`;
  const yelpReviewUrl = listing.yelpUrl
    ?? `https://www.yelp.com/search?find_desc=${encodeURIComponent(listing.name)}&find_loc=${encodeURIComponent(`${listing.city}, ${listing.state}`)}`;

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
    ...(listing.reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (listing.reviews.reduce((s: number, r: any) => s + r.rating, 0) / listing.reviews.length).toFixed(1),
            reviewCount: listing.reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  const mapListings = listing.lat && listing.lng
    ? [{ id: listing.id, name: listing.name, lat: listing.lat, lng: listing.lng, city: listing.city, state: listing.state, slug: listing.slug, tier: listing.tier }]
    : [];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",                                          item: "https://petbednstay.com" },
      { "@type": "ListItem", position: 2, name: `Pet Boarding in ${listing.state}`,               item: `https://petbednstay.com/${listing.stateSlug}` },
      { "@type": "ListItem", position: 3, name: listing.city,                                     item: `https://petbednstay.com/${listing.stateSlug}/${listing.citySlug}` },
      { "@type": "ListItem", position: 4, name: listing.name,                                     item: `https://petbednstay.com/listing/${listing.slug}` },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Breadcrumb items={[
        { label: "Home",         href: "/" },
        { label: listing.state,  href: `/${listing.stateSlug}` },
        { label: listing.city,   href: `/${listing.stateSlug}/${listing.citySlug}` },
        { label: listing.name },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", tierColor(listing.tier))}>
                  {listing.tier !== "FREE" ? "⭐ " : ""}
                  {tierLabel(listing.tier)}
                </span>
                <span className="text-xs bg-forest-50 text-forest-700 px-2.5 py-1 rounded-full font-medium">
                  {typeLabel(listing.type)}
                </span>
                {listing.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-forest-600">
                    <BadgeCheck className="h-4 w-4" /> Verified
                  </span>
                )}
                {listing.verifiedAt && (
                  <span className="text-xs text-stone-400">
                    Active as of {new Date(listing.verifiedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">{listing.name}</h1>
              <div className="flex items-center gap-1 text-stone-500 mt-1">
                <MapPin className="h-4 w-4 text-brand-500" />
                <span>{listing.address ? `${listing.address}, ` : ""}{listing.city}, {listing.state} {listing.zip ?? ""}</span>
              </div>
            </div>
            <ShareButton
              title={`${listing.name} — Pet Boarding in ${listing.city}, ${listing.state}`}
              url={`https://petbednstay.com/listing/${listing.slug}`}
            />
          </div>

          {/* Unclaimed notice — honest signal + owner lead-gen */}
          {!listing.claimedAt && (
            <UnclaimedBanner listingName={listing.name} city={listing.city} state={listing.state} />
          )}

          {/* Images */}
          <div className="rounded-2xl overflow-hidden">
            <div className="relative h-72 sm:h-96 bg-amber-50">
              <Image
                src={photoUrl}
                alt={listing.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>
            {otherImages.length > 0 && (
              <div className="grid grid-cols-3 gap-1 mt-1">
                {otherImages.slice(0, 3).map((img: any) => (
                  <div key={img.id} className="relative h-24 bg-amber-50">
                    <Image src={img.url} alt={listing.name} fill className="object-cover" sizes="33vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-amber-100 p-6">
            <h2 className="font-semibold text-stone-800 text-lg mb-3">About</h2>
            <p className="text-stone-600 leading-relaxed whitespace-pre-line">
              {listing.description ?? generateListingDescription(listing)}
            </p>
          </div>

          {/* Amenities */}
          {listing.amenities.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-100 p-6">
              <h2 className="font-semibold text-stone-800 text-lg mb-3">Amenities & Features</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a: any) => (
                  <span key={a.id} className="text-sm bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hours */}
          {listing.hours.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-100 p-6">
              <h2 className="font-semibold text-stone-800 text-lg mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-500" /> Hours of Operation
              </h2>
              <div className="space-y-2">
                {listing.hours.map((h: any) => (
                  <div key={h.id} className="flex justify-between text-sm">
                    <span className="text-stone-600 w-16">{DAYS[h.dayOfWeek]}</span>
                    <span className={h.isClosed ? "text-red-500" : "text-stone-700"}>
                      {h.isClosed ? "Closed" : `${h.openTime} – ${h.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {mapListings.length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-100 p-4">
              <h2 className="font-semibold text-stone-800 text-lg mb-3">Location</h2>
              <div className="h-64 rounded-xl overflow-hidden">
                <MapWrapper listings={mapListings} zoom={14} center={[listing.lat!, listing.lng!]} />
              </div>
            </div>
          )}

          {/* Reviews */}
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
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
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
          <AffiliateWidget />
        </div>
      </div>

      {/* Similar listings */}
      {similarListings.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-stone-800 mb-5">
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
