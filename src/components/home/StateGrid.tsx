import Link from "next/link";
import { US_STATES } from "@/lib/utils";

const TOP_STATES = [
  { slug: "california", emoji: "🌴" },
  { slug: "texas", emoji: "⭐" },
  { slug: "florida", emoji: "🌊" },
  { slug: "new-york", emoji: "🗽" },
  { slug: "illinois", emoji: "🌆" },
  { slug: "pennsylvania", emoji: "🔔" },
  { slug: "ohio", emoji: "🌽" },
  { slug: "georgia", emoji: "🍑" },
  { slug: "north-carolina", emoji: "🌲" },
  { slug: "michigan", emoji: "🚗" },
  { slug: "washington", emoji: "🌧️" },
  { slug: "colorado", emoji: "🏔️" },
];

export default function StateGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">
            Browse by State
          </h2>
          <p className="mt-2 text-stone-500">
            Find pet hotels and sitters in every corner of the US
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {TOP_STATES.map(({ slug, emoji }) => {
            const state = US_STATES.find((s) => s.slug === slug);
            if (!state) return null;
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="group flex flex-col items-center gap-2 bg-warm-50 hover:bg-brand-50 border border-amber-100 hover:border-brand-300 rounded-2xl p-4 transition-all duration-200 text-center"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{emoji}</span>
                <span className="text-sm font-semibold text-stone-700 group-hover:text-brand-600 leading-tight">
                  {state.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm hover:text-brand-700"
          >
            Browse all 50 states →
          </Link>
        </div>
      </div>
    </section>
  );
}
