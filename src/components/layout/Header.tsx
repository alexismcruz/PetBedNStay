"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, PawPrint } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E0EDE2] shadow-[0_1px_8px_rgba(0,0,0,.06)]">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-6 h-[68px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
          <span className="w-10 h-10 bg-g rounded-[10px] flex items-center justify-center">
            <PawPrint className="h-5 w-5 text-white" />
          </span>
          <span className="font-[family-name:var(--font-nunito)] font-black text-[1.2rem] text-g">
            PetBed<span className="text-o">N</span>Stay
          </span>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[420px] items-center bg-cream border-[1.5px] border-pborder rounded-full px-4 gap-2 focus-within:border-g transition-colors">
          <Search className="h-4 w-4 text-ptext-soft shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city or state…"
            className="flex-1 py-[9px] bg-transparent border-none outline-none text-sm text-ptext placeholder:text-ptext-soft font-[family-name:var(--font-inter)]"
          />
        </form>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5 ml-auto">
          <Link href="/search"            className="text-sm font-semibold text-ptext-mid hover:bg-g-pale hover:text-g px-3.5 py-1.5 rounded-lg transition-colors">Browse</Link>
          <Link href="/states"            className="text-sm font-semibold text-ptext-mid hover:bg-g-pale hover:text-g px-3.5 py-1.5 rounded-lg transition-colors">States</Link>
          <Link href="/list-your-business" className="text-sm font-semibold text-ptext-mid hover:bg-g-pale hover:text-g px-3.5 py-1.5 rounded-lg transition-colors">For Businesses</Link>
          <Link href="/list-your-business" className="ml-2 bg-o hover:bg-o-dark text-white text-[.88rem] font-bold px-[18px] py-2 rounded-full transition-colors">
            List Your Business
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto p-2 rounded-lg text-ptext-mid hover:bg-g-pale"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-pborder bg-white px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center bg-cream border border-pborder rounded-full px-4 gap-2">
            <Search className="h-4 w-4 text-ptext-soft" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 py-2 bg-transparent border-none outline-none text-sm text-ptext"
            />
          </form>
          <nav className="flex flex-col gap-3">
            {[
              { href: "/search",             label: "Browse Listings" },
              { href: "/states",             label: "Browse by State" },
              { href: "/list-your-business", label: "For Businesses" },
            ].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="text-sm font-semibold text-ptext-mid hover:text-g">
                {l.label}
              </Link>
            ))}
            <Link href="/list-your-business" onClick={() => setOpen(false)}
              className="inline-block bg-o text-white text-sm font-bold px-5 py-2.5 rounded-full text-center mt-1">
              List Your Business
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
