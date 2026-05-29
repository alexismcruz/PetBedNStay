import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { US_STATES } from "@/lib/utils";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Pet Boarding in All 50 US States | PetBedNStay",
  description:
    "Browse pet boarding, dog kennels, and pet sitters in all 50 US states. Click your state to find local facilities and read about pet care in your area.",
  alternates: { canonical: "https://petbednstay.com/states" },
  openGraph: {
    title: "Pet Boarding in All 50 US States | PetBedNStay",
    description: "Find trusted pet hotels and sitters in every US state.",
    url: "https://petbednstay.com/states",
  },
};

const STATE_EMOJIS: Record<string, string> = {
  alabama:          "🏈",
  alaska:           "🐻",
  arizona:          "🌵",
  arkansas:         "💎",
  california:       "🌴",
  colorado:         "🏔️",
  connecticut:      "⚓",
  delaware:         "🦅",
  florida:          "🌊",
  georgia:          "🍑",
  hawaii:           "🌺",
  idaho:            "🥔",
  illinois:         "🌆",
  indiana:          "🏎️",
  iowa:             "🌽",
  kansas:           "🌾",
  kentucky:         "🏇",
  louisiana:        "🎷",
  maine:            "🦞",
  maryland:         "🦀",
  massachusetts:    "🦃",
  michigan:         "🚗",
  minnesota:        "🌲",
  mississippi:      "🎸",
  missouri:         "⛵",
  montana:          "🦌",
  nebraska:         "🌾",
  nevada:           "🎰",
  "new-hampshire":  "🍁",
  "new-jersey":     "🏖️",
  "new-mexico":     "🌶️",
  "new-york":       "🗽",
  "north-carolina": "🌲",
  "north-dakota":   "🌾",
  ohio:             "🌽",
  oklahoma:         "🌪️",
  oregon:           "🌲",
  pennsylvania:     "🔔",
  "rhode-island":   "⛵",
  "south-carolina": "🌴",
  "south-dakota":   "🏔️",
  tennessee:        "🎸",
  texas:            "⭐",
  utah:             "🏜️",
  vermont:          "🍁",
  virginia:         "🏛️",
  washington:       "🌧️",
  "west-virginia":  "⛰️",
  wisconsin:        "🧀",
  wyoming:          "🦬",
};

async function getStateCounts(): Promise<Record<string, number>> {
  try {
    const rows = await db.listing.groupBy({
      by: ["stateSlug"],
      where: { isActive: true },
      _count: { _all: true },
    });
    return Object.fromEntries(rows.map((r) => [r.stateSlug, r._count._all]));
  } catch {
    return {};
  }
}

export default async function StatesPage() {
  const counts = await getStateCounts();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",            item: "https://petbednstay.com" },
      { "@type": "ListItem", position: 2, name: "Browse by State", item: "https://petbednstay.com/states" },
    ],
  };

  return (
    <div className="bg-warm-50 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={[
            { label: "Home",  href: "/" },
            { label: "Browse by State" },
          ]} />
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mt-3">
            Pet Boarding in All 50 States
          </h1>
          <p className="mt-2 text-stone-500 text-lg">
            Click your state to browse local facilities, read about pet care in your area, and find the perfect stay for your pet.
          </p>
        </div>
      </div>

      {/* State grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {US_STATES.map((state) => {
            const count = counts[state.slug] ?? 0;
            const emoji = STATE_EMOJIS[state.slug] ?? "🐾";
            return (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className="group flex flex-col items-center gap-2 bg-white hover:bg-brand-50 border border-amber-100 hover:border-brand-300 rounded-2xl p-5 transition-all duration-200 text-center shadow-sm hover:shadow-md"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                  {emoji}
                </span>
                <span className="text-sm font-semibold text-stone-800 group-hover:text-brand-600 leading-tight">
                  {state.name}
                </span>
                <span className="text-xs text-stone-400">
                  {count > 0 ? `${count} ${count === 1 ? "facility" : "facilities"}` : "Browse listings"}
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-stone-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Own a Pet Boarding Business?</h2>
          <p className="text-stone-400 mb-6 max-w-md mx-auto">
            List your kennel, pet hotel, or sitting service for free and reach pet owners searching across the US.
          </p>
          <Link
            href="/list-your-business"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            List Your Business — Free
          </Link>
        </div>
      </div>
    </div>
  );
}
