import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Globe, Mail, BadgeCheck, Clock, Star,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatPhone, tierLabel, tierColor, typeLabel, DAYS, cn } from "@/lib/utils";
import MapWrapper from "@/components/map/MapWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const listing = await db.listing.findUnique({ where: { slug } });
    if (!listing) return { title: "Listing Not Found" };
    return {
      title: `${listing.name} — Pet Hotel in ${listing.city}, ${listing.state}`,
      description:
        listing.description ??
        `${listing.name} is a pet boarding facility located in ${listing.city}, ${listing.state}. Find contact info, hours, and more on PetBedNStay.`,
    };
  } catch {
    return { title: "Listing" };
  }
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let listing: any = null;
  try {
    listing = await db.listing.findUnique({
      where: { slug },
      include: { images: true, amenities: true, hours: { orderBy: { dayOfWeek: "asc" } } },
    });
  } catch {
    // DB not connected
  }

  if (!listing) notFound();

  const primaryImage = listing.images.find((i: any) => i.isPrimary) ?? listing.images[0];
  const otherImages = listing.images.filter((i: any) => !i.isPrimary && i !== primaryImage);

  const mapListings = listing.lat && listing.lng
    ? [{ id: listing.id, name: listing.name, lat: listing.lat, lng: listing.lng, city: listing.city, state: listing.state, slug: listing.slug, tier: listing.tier }]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-stone-500 mb-4">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        {" / "}
        <Link href={`/${listing.stateSlug}`} className="hover:text-brand-600">{listing.state}</Link>
        {" / "}
        <Link href={`/${listing.stateSlug}/${listing.citySlug}`} className="hover:text-brand-600">{listing.city}</Link>
        {" / "}
        <span className="text-stone-700">{listing.name}</span>
      </div>

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
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">{listing.name}</h1>
              <div className="flex items-center gap-1 text-stone-500 mt-1">
                <MapPin className="h-4 w-4 text-brand-500" />
                <span>{listing.address ? `${listing.address}, ` : ""}{listing.city}, {listing.state} {listing.zip ?? ""}</span>
              </div>
            </div>
          </div>

          {/* Images */}
          {primaryImage && (
            <div className="rounded-2xl overflow-hidden">
              <div className="relative h-72 sm:h-96 bg-amber-50">
                <Image
                  src={primaryImage.url}
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
          )}

          {/* Description */}
          {listing.description && (
            <div className="bg-white rounded-2xl border border-amber-100 p-6">
              <h2 className="font-semibold text-stone-800 text-lg mb-3">About</h2>
              <p className="text-stone-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>
          )}

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
                <MapWrapper listings={mapListings} zoom={14} center={[listing.lat, listing.lng]} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-stone-800">Contact</h2>

              {listing.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="flex items-center gap-3 text-sm text-stone-700 hover:text-brand-600 transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-500 shrink-0" />
                  {formatPhone(listing.phone)}
                </a>
              )}

              {listing.email && (
                <a
                  href={`mailto:${listing.email}`}
                  className="flex items-center gap-3 text-sm text-stone-700 hover:text-brand-600 transition-colors"
                >
                  <Mail className="h-4 w-4 text-brand-500 shrink-0" />
                  {listing.email}
                </a>
              )}

              {listing.website && (
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <Globe className="h-4 w-4 shrink-0" />
                  Visit Website
                </a>
              )}

              {!listing.phone && !listing.email && !listing.website && (
                <p className="text-sm text-stone-400">No contact info available</p>
              )}
            </div>

            {/* Upgrade prompt for free listings */}
            {listing.tier === "FREE" && (
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 text-center space-y-3">
                <Star className="h-8 w-8 text-brand-500 mx-auto" />
                <p className="text-sm font-semibold text-stone-800">Is this your business?</p>
                <p className="text-xs text-stone-500">
                  Claim and upgrade to Featured or Premium to add photos, a full description, and get priority placement.
                </p>
                <Link
                  href="/premium"
                  className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                >
                  Upgrade Listing
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
