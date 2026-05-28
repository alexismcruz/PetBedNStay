import Link from "next/link";
import { PawPrint } from "lucide-react";
import { US_STATES } from "@/lib/utils";

const FEATURED_STATES = [
  "california", "texas", "florida", "new-york", "illinois",
  "pennsylvania", "ohio", "georgia", "north-carolina", "michigan",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-brand-500 rounded-xl p-1.5">
                <PawPrint className="h-4 w-4 text-white" />
              </span>
              <span className="font-bold text-white text-lg">
                PetBed<span className="text-brand-400">NStay</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              The US directory for trusted pet hotels and sitters. Find the perfect home
              away from home for your furry family member.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/search", label: "Browse Listings" },
                { href: "/list-your-business", label: "List Your Business" },
                { href: "/premium", label: "Premium Listings" },
                { href: "/advertise", label: "Advertise With Us" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top States */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Browse by State</h3>
            <ul className="space-y-2 text-sm columns-2">
              {FEATURED_STATES.map((slug) => {
                const state = US_STATES.find((s) => s.slug === slug);
                if (!state) return null;
                return (
                  <li key={slug}>
                    <Link href={`/${slug}`} className="hover:text-brand-400 transition-colors">
                      {state.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white mb-3 text-sm">Own a Pet Hotel?</h3>
            <p className="text-sm text-stone-400">
              Get your business in front of thousands of pet owners searching for boarding near them.
            </p>
            <Link
              href="/list-your-business"
              className="inline-block bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              List for Free
            </Link>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-500">
          <p>&copy; {year} PetBedNStay. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-stone-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-stone-300">Terms of Use</Link>
            <Link href="/contact" className="hover:text-stone-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
