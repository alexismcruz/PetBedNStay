import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { getPlaceholderPhoto, typeLabel } from "@/lib/utils";

interface Listing {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  tier: string;
  images: { url: string; isPrimary?: boolean }[];
  amenities: { id: string; name: string }[];
  reviews?: { rating: number }[];
  priceMin?: number | null;
  description?: string | null;
}

interface Props {
  listings: Listing[];
}

export default function FeaturedListings({ listings }: Props) {
  if (listings.length === 0) return null;

  return (
    <section className="bg-white py-[72px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[.75rem] font-bold uppercase tracking-[.1em] text-o mb-2.5">Featured Stays</span>
          <h2 className="font-[family-name:var(--font-nunito)] font-black text-ptext" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
            Top-Rated Boarding Spots 🏅
          </h2>
          <p className="text-ptext-mid mt-2.5">Handpicked businesses with outstanding reviews from fellow pawrents</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const primary = listing.images.find((i) => i.isPrimary) ?? listing.images[0];
            const photo   = primary?.url ?? getPlaceholderPhoto(listing.id, listing.type);
            const isFeatured = listing.tier === "FEATURED" || listing.tier === "PREMIUM";
            const reviews = listing.reviews ?? [];
            const avg = reviews.length > 0
              ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
              : null;
            const stars = avg ? Math.round(parseFloat(avg)) : 0;

            return (
              <Link
                key={listing.id}
                href={`/listing/${listing.slug}`}
                className={`flex flex-col rounded-[14px] overflow-hidden border-[1.5px] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(45,106,79,.14)] hover:-translate-y-[3px] hover:border-g-light no-underline text-inherit ${
                  isFeatured ? "border-o shadow-[0_0_0_3px_rgba(244,132,95,.12),0_2px_12px_rgba(45,106,79,.10)]" : "border-pborder"
                }`}
              >
                {isFeatured && (
                  <div className="bg-o text-white text-[.72rem] font-bold uppercase tracking-[.06em] px-3.5 py-1.5 flex items-center gap-1">
                    ⭐ Featured Partner
                  </div>
                )}

                <div className="relative h-[190px] bg-g-pale">
                  <Image
                    src={photo}
                    alt={listing.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1 bg-white">
                  <div className="text-[.72rem] font-bold uppercase tracking-[.08em] text-g-light mb-1.5">{typeLabel(listing.type)}</div>
                  <h3 className="font-[family-name:var(--font-nunito)] font-extrabold text-[1.1rem] text-ptext mb-1.5">{listing.name}</h3>
                  <div className="flex items-center gap-1 text-[.85rem] text-ptext-soft mb-3">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {listing.city}, {listing.state}
                  </div>

                  {listing.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {listing.amenities.slice(0, 3).map((a) => (
                        <span key={a.id} className="bg-g-pale text-g text-[.73rem] font-semibold px-2.5 py-1 rounded-full">{a.name}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-t border-pborder flex items-center gap-2 text-[.85rem] font-semibold text-ptext">
                    {avg ? (
                      <>
                        <span className="text-y">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
                        <span>{avg}</span>
                        <span className="text-ptext-soft font-normal">({reviews.length})</span>
                      </>
                    ) : null}
                    {listing.priceMin ? (
                      <span className="ml-auto font-bold text-g">from ${listing.priceMin}/night</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 border-2 border-g text-g font-bold px-8 py-3.5 rounded-full hover:bg-g hover:text-white transition-all text-[.95rem]"
          >
            View All Listings →
          </Link>
        </div>
      </div>
    </section>
  );
}
