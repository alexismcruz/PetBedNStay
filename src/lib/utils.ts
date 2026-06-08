import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(str: string): string {
  return slugify(str, { lower: true, strict: true });
}

export const US_STATES: { name: string; slug: string; abbr: string }[] = [
  { name: "Alabama", slug: "alabama", abbr: "AL" },
  { name: "Alaska", slug: "alaska", abbr: "AK" },
  { name: "Arizona", slug: "arizona", abbr: "AZ" },
  { name: "Arkansas", slug: "arkansas", abbr: "AR" },
  { name: "California", slug: "california", abbr: "CA" },
  { name: "Colorado", slug: "colorado", abbr: "CO" },
  { name: "Connecticut", slug: "connecticut", abbr: "CT" },
  { name: "Delaware", slug: "delaware", abbr: "DE" },
  { name: "Florida", slug: "florida", abbr: "FL" },
  { name: "Georgia", slug: "georgia", abbr: "GA" },
  { name: "Hawaii", slug: "hawaii", abbr: "HI" },
  { name: "Idaho", slug: "idaho", abbr: "ID" },
  { name: "Illinois", slug: "illinois", abbr: "IL" },
  { name: "Indiana", slug: "indiana", abbr: "IN" },
  { name: "Iowa", slug: "iowa", abbr: "IA" },
  { name: "Kansas", slug: "kansas", abbr: "KS" },
  { name: "Kentucky", slug: "kentucky", abbr: "KY" },
  { name: "Louisiana", slug: "louisiana", abbr: "LA" },
  { name: "Maine", slug: "maine", abbr: "ME" },
  { name: "Maryland", slug: "maryland", abbr: "MD" },
  { name: "Massachusetts", slug: "massachusetts", abbr: "MA" },
  { name: "Michigan", slug: "michigan", abbr: "MI" },
  { name: "Minnesota", slug: "minnesota", abbr: "MN" },
  { name: "Mississippi", slug: "mississippi", abbr: "MS" },
  { name: "Missouri", slug: "missouri", abbr: "MO" },
  { name: "Montana", slug: "montana", abbr: "MT" },
  { name: "Nebraska", slug: "nebraska", abbr: "NE" },
  { name: "Nevada", slug: "nevada", abbr: "NV" },
  { name: "New Hampshire", slug: "new-hampshire", abbr: "NH" },
  { name: "New Jersey", slug: "new-jersey", abbr: "NJ" },
  { name: "New Mexico", slug: "new-mexico", abbr: "NM" },
  { name: "New York", slug: "new-york", abbr: "NY" },
  { name: "North Carolina", slug: "north-carolina", abbr: "NC" },
  { name: "North Dakota", slug: "north-dakota", abbr: "ND" },
  { name: "Ohio", slug: "ohio", abbr: "OH" },
  { name: "Oklahoma", slug: "oklahoma", abbr: "OK" },
  { name: "Oregon", slug: "oregon", abbr: "OR" },
  { name: "Pennsylvania", slug: "pennsylvania", abbr: "PA" },
  { name: "Rhode Island", slug: "rhode-island", abbr: "RI" },
  { name: "South Carolina", slug: "south-carolina", abbr: "SC" },
  { name: "South Dakota", slug: "south-dakota", abbr: "SD" },
  { name: "Tennessee", slug: "tennessee", abbr: "TN" },
  { name: "Texas", slug: "texas", abbr: "TX" },
  { name: "Utah", slug: "utah", abbr: "UT" },
  { name: "Vermont", slug: "vermont", abbr: "VT" },
  { name: "Virginia", slug: "virginia", abbr: "VA" },
  { name: "Washington", slug: "washington", abbr: "WA" },
  { name: "West Virginia", slug: "west-virginia", abbr: "WV" },
  { name: "Wisconsin", slug: "wisconsin", abbr: "WI" },
  { name: "Wyoming", slug: "wyoming", abbr: "WY" },
];

export function getStateName(slug: string): string {
  return US_STATES.find((s) => s.slug === slug)?.name ?? slug;
}

export function getStateAbbr(slug: string): string {
  return US_STATES.find((s) => s.slug === slug)?.abbr ?? slug.toUpperCase();
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function tierLabel(tier: string): string {
  return { FREE: "Free", FEATURED: "Featured", PREMIUM: "Premium" }[tier] ?? tier;
}

export function tierColor(tier: string): string {
  return (
    {
      FREE: "bg-gray-100 text-gray-600",
      FEATURED: "bg-brand-100 text-brand-700",
      PREMIUM: "bg-amber-400 text-white",
    }[tier] ?? "bg-gray-100 text-gray-600"
  );
}

export function typeLabel(type: string): string {
  return { HOTEL: "Pet Hotel", SITTER: "Pet Sitter", BOTH: "Hotel & Sitter" }[type] ?? type;
}

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Curated Unsplash photos used as placeholders, grouped by facility type so that
// listings of the same kind don't all show the identical image.
const PHOTOS_HOTEL = [
  // kennels, boarding facilities, dogs at play / daycare
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1558929996-da64ba858215?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=75",
];
const PHOTOS_SITTER = [
  // cozy in-home, dog on couch / with person at home
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1494947665470-20322015e3a8?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=75",
];
const PHOTOS_GENERIC = [
  // mixed cats + dogs, works for "Both" / cat boarding / luxury
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=75",
  "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=800&q=75",
];

/**
 * Returns a consistent placeholder photo URL for a listing that has no uploaded images.
 * Pool is chosen by facility type so the directory doesn't look auto-generated.
 */
export function getPlaceholderPhoto(seed: string, type?: string | null): string {
  const pool =
    type === "HOTEL"  ? PHOTOS_HOTEL  :
    type === "SITTER" ? PHOTOS_SITTER :
                        PHOTOS_GENERIC;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length];
}

/** Builds a Google Maps URL using coordinates if available, otherwise falls back to a name search */
export function googleMapsUrl(listing: {
  name: string; city: string; state: string; lat?: number | null; lng?: number | null; address?: string | null;
}): string {
  if (listing.lat && listing.lng) {
    return `https://www.google.com/maps?q=${listing.lat},${listing.lng}`;
  }
  const query = [listing.name, listing.address, listing.city, listing.state].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildListingSlug(name: string, city: string, id: string): string {
  return `${toSlug(name)}-${toSlug(city)}-${id.slice(-6)}`;
}

/** Generates a unique, keyword-rich fallback description for listings that have no description */
export function generateListingDescription(listing: {
  name: string;
  city: string;
  state: string;
  type?: string | null;
  amenities?: { name: string }[];
  phone?: string | null;
}): string {
  const typeWord =
    listing.type === "SITTER" ? "pet sitter" :
    listing.type === "BOTH"   ? "pet boarding and sitting service" :
                                "pet boarding facility";
  const amenityPart =
    listing.amenities && listing.amenities.length > 0
      ? ` Services include ${listing.amenities.slice(0, 3).map((a) => a.name.toLowerCase()).join(", ")}.`
      : "";
  const contactPart = listing.phone ? " Call to book your pet's stay." : "";
  return `${listing.name} is a ${typeWord} in ${listing.city}, ${listing.state}.${amenityPart}${contactPart} Browse more pet boarding options across ${listing.state} on PetBedNStay.`;
}
