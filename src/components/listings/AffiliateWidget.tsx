import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";

// Set these env vars in Railway once your affiliate accounts are approved:
//   NEXT_PUBLIC_FETCH_AFFILIATE_URL  — your Fetch Pet Insurance affiliate link
//   NEXT_PUBLIC_CHEWY_AFFILIATE_URL  — your Chewy affiliate link
const FETCH_URL = process.env.NEXT_PUBLIC_FETCH_AFFILIATE_URL;
const CHEWY_URL = process.env.NEXT_PUBLIC_CHEWY_AFFILIATE_URL;

// Don't render the widget at all if neither affiliate link is configured yet
const AFFILIATES = [
  FETCH_URL && {
    id: "fetch",
    emoji: "🛡️",
    name: "Fetch Pet Insurance",
    tagline: "Covers accidents, illness & more",
    cta: "Get a Free Quote",
    href: FETCH_URL,
    highlight: true,
  },
  CHEWY_URL && {
    id: "chewy",
    emoji: "🛍️",
    name: "Chewy",
    tagline: "Food, treats & boarding supplies",
    cta: "Shop Chewy",
    href: CHEWY_URL,
    highlight: false,
  },
].filter(Boolean) as { id: string; emoji: string; name: string; tagline: string; cta: string; href: string; highlight: boolean }[];

export default function AffiliateWidget() {
  // Hide entirely until at least one affiliate link is configured
  if (AFFILIATES.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-brand-500 shrink-0" />
        <h2 className="font-semibold text-stone-800 text-sm">Recommended for Pet Owners</h2>
      </div>

      <div className="space-y-2">
        {AFFILIATES.map((a) => (
          <a
            key={a.id}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all group ${
              a.highlight
                ? "border-brand-200 bg-brand-50 hover:bg-brand-100"
                : "border-stone-100 bg-stone-50 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0">{a.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-stone-800">{a.name}</p>
                <p className="text-xs text-stone-500">{a.tagline}</p>
              </div>
            </div>
            <span className={`text-xs font-semibold shrink-0 flex items-center gap-1 ${
              a.highlight ? "text-brand-600" : "text-stone-500"
            }`}>
              {a.cta}
              <ExternalLink className="h-3 w-3" />
            </span>
          </a>
        ))}
      </div>

      <p className="text-xs text-stone-400 leading-relaxed">
        * Affiliate links — we may earn a commission at no extra cost to you.{" "}
        <Link href="/terms#affiliate" className="hover:text-brand-600 underline">Learn more</Link>
      </p>
    </div>
  );
}
