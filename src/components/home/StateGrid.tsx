import Link from "next/link";
import { US_STATES } from "@/lib/utils";

const TOP_STATES = [
  { slug: "california",    count: 94 },
  { slug: "texas",         count: 72 },
  { slug: "florida",       count: 61 },
  { slug: "new-york",      count: 58 },
  { slug: "georgia",       count: 44 },
  { slug: "illinois",      count: 39 },
  { slug: "north-carolina",count: 36 },
  { slug: "arizona",       count: 33 },
  { slug: "washington",    count: 31 },
  { slug: "colorado",      count: 28 },
  { slug: "ohio",          count: 27 },
  { slug: "pennsylvania",  count: 26 },
  { slug: "tennessee",     count: 24 },
  { slug: "virginia",      count: 22 },
  { slug: "michigan",      count: 21 },
  { slug: "massachusetts", count: 20 },
];

export default function StateGrid() {
  return (
    <section className="bg-cream py-[72px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[.75rem] font-bold uppercase tracking-[.1em] text-o mb-2.5">Browse by State</span>
          <h2 className="font-[family-name:var(--font-nunito)] font-black text-ptext" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
            Find Boarding Near You 🗺️
          </h2>
          <p className="text-ptext-mid mt-2.5">Listings in all 50 states — click to explore your area</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {TOP_STATES.map(({ slug, count }) => {
            const state = US_STATES.find((s) => s.slug === slug);
            if (!state) return null;
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="bg-white border-[1.5px] border-pborder rounded-lg py-3.5 px-3 text-center hover:border-g hover:bg-g-pale hover:-translate-y-0.5 hover:shadow-sm transition-all"
              >
                <div className="font-bold text-[.85rem] text-ptext">{state.name}</div>
                <div className="text-[.75rem] text-ptext-soft mt-0.5">{count} listings</div>
              </Link>
            );
          })}
          <Link
            href="/states"
            className="bg-white border-[1.5px] border-pborder rounded-lg py-3.5 px-3 text-center hover:border-g hover:bg-g-pale hover:-translate-y-0.5 hover:shadow-sm transition-all"
          >
            <div className="font-bold text-[.85rem] text-ptext">+ All States</div>
            <div className="text-[.75rem] text-ptext-soft mt-0.5">View all 49 →</div>
          </Link>
        </div>
      </div>
    </section>
  );
}
