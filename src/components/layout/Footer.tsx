import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-g-dark text-white/80">
      <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 bg-white/15 rounded-[10px] flex items-center justify-center">
                <PawPrint className="h-5 w-5 text-white" />
              </span>
              <span className="font-[family-name:var(--font-nunito)] font-black text-[1.1rem] text-white">
                PetBed<span className="text-o">N</span>Stay
              </span>
            </Link>
            <p className="text-[.85rem] leading-[1.7] text-white/60">
              The US&apos;s most comprehensive pet boarding directory. Find verified kennels,
              hotels, and in-home sitters across all 50 states.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="font-[family-name:var(--font-nunito)] font-extrabold text-white text-[.9rem] uppercase tracking-[.06em] mb-4">Browse</h4>
            <ul className="space-y-2">
              {[
                { href: "/search",           label: "All Listings" },
                { href: "/search?type=HOTEL", label: "Pet Hotels" },
                { href: "/search?type=SITTER",label: "In-Home Sitters" },
                { href: "/states",           label: "Browse by State" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[.85rem] text-white/65 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="font-[family-name:var(--font-nunito)] font-extrabold text-white text-[.9rem] uppercase tracking-[.06em] mb-4">For Businesses</h4>
            <ul className="space-y-2">
              {[
                { href: "/list-your-business",          label: "List Free" },
                { href: "/list-your-business#pricing",  label: "Premium Listing" },
                { href: "/list-your-business",          label: "Claim Listing" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[.85rem] text-white/65 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-[family-name:var(--font-nunito)] font-extrabold text-white text-[.9rem] uppercase tracking-[.06em] mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms",   label: "Terms of Service" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[.85rem] text-white/65 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[.8rem] text-white/40">
          <span>&copy; {year} PetBedNStay. Built with 🐾 for pet parents everywhere.</span>
          <span>All 50 states · 800+ listings · Always free to search</span>
        </div>
      </div>
    </footer>
  );
}
