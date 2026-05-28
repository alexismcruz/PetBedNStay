import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Globe, BadgeCheck, Star } from "lucide-react";
import { cn, tierColor, tierLabel, typeLabel, formatPhone } from "@/lib/utils";
import type { Listing } from "@/types";

interface Props {
  listing: Listing;
  className?: string;
}

export default function ListingCard({ listing, className }: Props) {
  const primaryImage = listing.images.find((i) => i.isPrimary) ?? listing.images[0];

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className={cn(
        "group bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col",
        listing.tier === "PREMIUM" && "ring-2 ring-brand-400",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-44 bg-amber-50 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={listing.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-5xl">🐾</span>
          </div>
        )}

        {/* Tier badge */}
        {listing.tier !== "FREE" && (
          <div className="absolute top-3 left-3">
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full shadow-sm", tierColor(listing.tier))}>
              {listing.tier === "PREMIUM" ? "⭐ " : ""}
              {tierLabel(listing.tier)}
            </span>
          </div>
        )}

        {/* Verified badge */}
        {listing.isVerified && (
          <div className="absolute top-3 right-3">
            <BadgeCheck className="h-5 w-5 text-forest-600 bg-white rounded-full shadow-sm" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-stone-800 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
            {listing.name}
          </h3>
          <span className="shrink-0 text-xs font-medium bg-forest-50 text-forest-700 px-2 py-0.5 rounded-full">
            {typeLabel(listing.type)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-stone-500 text-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-500" />
          <span className="line-clamp-1">
            {listing.city}, {listing.state}
          </span>
        </div>

        {listing.description && (
          <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        )}

        {listing.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {listing.amenities.slice(0, 3).map((a) => (
              <span key={a.id} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                {a.name}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-xs text-stone-400">+{listing.amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-stone-100 mt-auto">
          {listing.phone && (
            <span className="flex items-center gap-1 text-xs text-stone-500">
              <Phone className="h-3 w-3" />
              {formatPhone(listing.phone)}
            </span>
          )}
          {listing.website && (
            <span className="flex items-center gap-1 text-xs text-brand-600 ml-auto">
              <Globe className="h-3 w-3" />
              Website
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
