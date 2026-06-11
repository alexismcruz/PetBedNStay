import Link from "next/link";
import { PawPrint, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-warm-50">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-100 rounded-full p-5">
            <PawPrint className="h-12 w-12 text-brand-500" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-stone-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-stone-700 mb-3">
          This listing has moved on
        </h2>
        <p className="text-stone-500 mb-8 leading-relaxed">
          This page no longer exists — the business may have closed, moved, or been removed from our directory. Try searching for pet boarding near you.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Search className="h-4 w-4" />
            Search Pet Boarding
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border border-amber-200 hover:border-brand-300 text-stone-700 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
