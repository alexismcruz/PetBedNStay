import type { Metadata } from "next";
import { Mail, BarChart2, MapPin, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise on PetBedNStay",
  description:
    "Reach thousands of pet owners searching for boarding across the US. Advertise your pet products, veterinary services, or pet accessories on PetBedNStay.",
};

const AD_SPOTS = [
  {
    name: "Homepage Banner",
    dimensions: "1200 × 300px",
    placement: "Top of homepage below hero",
    reach: "All US visitors",
    price: "$299 / month",
    icon: "🏠",
  },
  {
    name: "State Page Sidebar",
    dimensions: "300 × 600px",
    placement: "Sidebar on state listing pages",
    reach: "Visitors browsing a specific state",
    price: "$149 / month / state",
    icon: "📍",
  },
  {
    name: "Search Results Banner",
    dimensions: "728 × 90px",
    placement: "Between search result listings",
    reach: "Active pet boarding searchers",
    price: "$199 / month",
    icon: "🔍",
  },
  {
    name: "Listing Page Sidebar",
    dimensions: "300 × 250px",
    placement: "Sidebar on individual listing pages",
    reach: "Pet owners actively evaluating options",
    price: "$99 / month",
    icon: "🐾",
  },
];

const GOOD_FIT = [
  "Pet food and treat brands",
  "Pet toy and accessory retailers",
  "Veterinary clinics & services",
  "Pet insurance providers",
  "Dog grooming products",
  "Pet transportation services",
  "Online pet pharmacies",
  "Pet training services",
];

export default function AdvertisePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-stone-800 mb-3">
          Advertise on PetBedNStay
        </h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto">
          Put your brand in front of pet owners actively searching for pet care across all 50 US states.
          Our audience is highly targeted — these are people spending money on their pets right now.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { icon: <BarChart2 className="h-5 w-5" />, value: "50+", label: "States Covered" },
          { icon: <MapPin className="h-5 w-5" />, value: "1,000+", label: "Active Listings" },
          { icon: <Target className="h-5 w-5" />, value: "100%", label: "Pet Owner Audience" },
          { icon: <BarChart2 className="h-5 w-5" />, value: "Growing", label: "Monthly Traffic" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-amber-100 rounded-2xl p-4 text-center">
            <div className="text-brand-500 flex justify-center mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-stone-800">{s.value}</div>
            <div className="text-xs text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ad Spots */}
      <h2 className="text-2xl font-bold text-stone-800 mb-6">Available Ad Placements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {AD_SPOTS.map((spot) => (
          <div key={spot.name} className="bg-white border border-amber-100 rounded-2xl p-6 hover:border-brand-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-2xl">{spot.icon}</span>
                <h3 className="font-semibold text-stone-800 mt-1">{spot.name}</h3>
              </div>
              <span className="text-brand-600 font-bold text-sm whitespace-nowrap">{spot.price}</span>
            </div>
            <div className="space-y-1.5 text-sm text-stone-500">
              <p><span className="font-medium text-stone-600">Size:</span> {spot.dimensions}</p>
              <p><span className="font-medium text-stone-600">Placement:</span> {spot.placement}</p>
              <p><span className="font-medium text-stone-600">Audience:</span> {spot.reach}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Good fit */}
      <div className="bg-warm-50 border border-amber-100 rounded-2xl p-8 mb-12">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Who Should Advertise Here?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GOOD_FIT.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-stone-600">
              <span className="text-brand-500">✓</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-stone-900 rounded-2xl p-8 text-center text-white">
        <Mail className="h-10 w-10 text-brand-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold mb-2">Ready to Reach Pet Owners?</h2>
        <p className="text-stone-400 mb-6 max-w-md mx-auto">
          Contact us to discuss ad placements, custom packages, or state-targeted campaigns.
          We&apos;ll respond within 24 hours.
        </p>
        <a
          href="mailto:ads@petbednstay.com"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Email ads@petbednstay.com
        </a>
      </div>
    </div>
  );
}
