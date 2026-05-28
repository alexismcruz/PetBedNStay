export type ListingType = "HOTEL" | "SITTER" | "BOTH";
export type ListingTier = "FREE" | "FEATURED" | "PREMIUM";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AdPlacement = "BANNER" | "SIDEBAR";

export interface ListingImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ListingAmenity {
  id: string;
  name: string;
}

export interface ListingHour {
  id: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface Listing {
  id: string;
  slug: string;
  name: string;
  type: ListingType;
  description: string | null;
  address: string | null;
  city: string;
  state: string;
  stateSlug: string;
  citySlug: string;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  tier: ListingTier;
  isVerified: boolean;
  isActive: boolean;
  source: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: ListingImage[];
  amenities: ListingAmenity[];
  hours?: ListingHour[];
}

export interface ListingRequest {
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  city: string;
  state: string;
  website?: string;
  message?: string;
}

export interface USState {
  name: string;
  slug: string;
  abbr: string;
}

export interface SearchParams {
  q?: string;
  state?: string;
  city?: string;
  type?: string;
  tier?: string;
  page?: string;
}

export interface AdSpot {
  id: string;
  name: string;
  imageUrl: string;
  targetUrl: string;
  placement: AdPlacement;
  targetState: string | null;
}
