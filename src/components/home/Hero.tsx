"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { US_STATES } from "@/lib/utils";

interface Props {
  listingCount?: number;
  stateCount?:   number;
}

export default function Hero({ listingCount = 800, stateCount = 49 }: Props) {
  const router = useRouter();
  const [petType, setPetType] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section
      className="relative text-white text-center overflow-hidden py-20 px-6 pb-[100px]"
      style={{ background: "linear-gradient(145deg, #1B4D35 0%, #2D6A4F 60%, #3A8C6A 100%)" }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="relative max-w-2xl mx-auto">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[.82rem] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-[.04em]">
          <span className="w-2 h-2 rounded-full bg-y inline-block" />
          {listingCount}+ Listings Across {stateCount} States
        </div>

        <h1 className="font-[family-name:var(--font-nunito)] font-black text-white leading-[1.15] mb-4"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>
          Find the Perfect Stay<br/>for Your <em className="not-italic text-y">Furry Family</em>
        </h1>

        <p className="text-white/82 text-[1.1rem] max-w-[540px] mx-auto mb-9">
          The easiest way to discover trusted pet hotels, kennels, and sitters — wherever you are in the US.
        </p>

        {/* Search box */}
        <form onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,.2)] p-2 flex flex-col sm:flex-row gap-2 max-w-[620px] mx-auto">
          <div className="flex flex-1 flex-col sm:flex-row">
            <input
              type="text"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              placeholder="🐾  Dog, cat, rabbit…"
              className="flex-1 px-4 py-2.5 text-ptext text-[.95rem] placeholder:text-ptext-soft border-none outline-none bg-transparent sm:border-r sm:border-pborder rounded-lg sm:rounded-none sm:rounded-l-lg font-[family-name:var(--font-inter)]"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="📍  City or state"
              className="flex-1 px-4 py-2.5 text-ptext text-[.95rem] placeholder:text-ptext-soft border-t sm:border-t-0 border-pborder outline-none bg-transparent rounded-lg sm:rounded-none sm:rounded-r-lg font-[family-name:var(--font-inter)]"
            />
          </div>
          <button
            type="submit"
            className="bg-o hover:bg-o-dark text-white font-bold text-[.95rem] px-6 py-3 rounded-[10px] flex items-center gap-2 shrink-0 transition-colors"
          >
            <Search className="h-4 w-4" />
            Find Stays
          </button>
        </form>

        {/* Hero stats */}
        <div className="flex justify-center gap-10 mt-11 flex-wrap">
          {[
            { value: `${listingCount}+`, label: "Verified Listings" },
            { value: String(stateCount), label: "States Covered" },
            { value: "3 Types",          label: "Hotels · Kennels · Sitters" },
            { value: "Free",             label: "To Search & Browse" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <strong className="block font-[family-name:var(--font-nunito)] font-black text-[1.8rem] text-white">{s.value}</strong>
              <span className="text-[.82rem] text-white/70 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
