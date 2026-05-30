"use client";

import Link from "next/link";
import { Phone, Globe, Mail, Star, Navigation } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { formatPhone } from "@/lib/utils";

interface Props {
  listingName: string;
  phone:           string | null;
  email:           string | null;
  website:         string | null;
  mapsUrl:         string;
  googleReviewUrl: string;
  yelpReviewUrl:   string;
  tier:            string;
}

export default function ListingContactSidebar({
  listingName, phone, email, website,
  mapsUrl, googleReviewUrl, yelpReviewUrl, tier,
}: Props) {
  function track(method: string) {
    trackEvent("contact_click", { method, listing_name: listingName });
  }

  return (
    <div className="sticky top-24 space-y-4">

      {/* Contact card */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-stone-800">Contact</h2>

        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={() => track("phone")}
            className="flex items-center gap-3 text-sm text-stone-700 hover:text-brand-600 transition-colors"
          >
            <Phone className="h-4 w-4 text-brand-500 shrink-0" />
            {formatPhone(phone)}
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            onClick={() => track("email")}
            className="flex items-center gap-3 text-sm text-stone-700 hover:text-brand-600 transition-colors"
          >
            <Mail className="h-4 w-4 text-brand-500 shrink-0" />
            {email}
          </a>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("website")}
            className="flex items-center gap-3 text-sm text-brand-600 hover:text-brand-700 transition-colors"
          >
            <Globe className="h-4 w-4 shrink-0" />
            Visit Website
          </a>
        )}

        {!phone && !email && !website && (
          <p className="text-sm text-stone-400">No contact info available</p>
        )}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("maps")}
          className="flex items-center gap-3 text-sm text-white bg-brand-500 hover:bg-brand-600 transition-colors px-4 py-2.5 rounded-xl font-semibold mt-2"
        >
          <Navigation className="h-4 w-4 shrink-0" />
          Open in Google Maps
        </a>
      </div>

      {/* External reviews */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 space-y-3">
        <h2 className="font-semibold text-stone-800">Reviews Elsewhere</h2>
        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("google_reviews")}
          className="flex items-center gap-3 w-full border border-stone-200 hover:border-brand-400 hover:shadow-sm text-stone-700 hover:text-brand-600 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
        >
          <span className="text-base">🔍</span>
          Read Google Reviews
        </a>
        <a
          href={yelpReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("yelp_reviews")}
          className="flex items-center gap-3 w-full border border-stone-200 hover:border-red-300 hover:shadow-sm text-stone-700 hover:text-red-600 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
        >
          <span className="text-base">⭐</span>
          Read Yelp Reviews
        </a>
      </div>

      {/* Upgrade prompt for free listings */}
      {tier === "FREE" && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 text-center space-y-3">
          <Star className="h-8 w-8 text-brand-500 mx-auto" />
          <p className="text-sm font-semibold text-stone-800">Is this your business?</p>
          <p className="text-xs text-stone-500">
            Claim and upgrade to Featured or Premium to add photos, a full description, and get priority placement.
          </p>
          <Link
            href="/list-your-business#pricing"
            className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
          >
            Upgrade Listing
          </Link>
        </div>
      )}
    </div>
  );
}
