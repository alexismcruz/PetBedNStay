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

export function buildListingSlug(name: string, city: string, id: string): string {
  return `${toSlug(name)}-${toSlug(city)}-${id.slice(-6)}`;
}
