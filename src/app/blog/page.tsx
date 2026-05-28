import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, PawPrint } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Pet Boarding Tips & Guides | PetBedNStay Blog",
  description:
    "Expert guides on pet boarding, dog kennels, and pet sitting. Learn how to choose a facility, prepare your pet, understand costs, and more.",
  alternates: { canonical: "https://petbednstay.com/blog" },
  openGraph: {
    title: "Pet Boarding Tips & Guides | PetBedNStay Blog",
    description:
      "Expert guides on pet boarding, dog kennels, and pet sitting. Learn how to choose a facility, prepare your pet, understand costs, and more.",
    url: "https://petbednstay.com/blog",
  },
};

// Category chip colours — mapped to the site palette
const CATEGORY_COLORS: Record<string, string> = {
  "Preparation":        "bg-brand-100 text-brand-700",
  "Choosing a Facility":"bg-forest-100 text-forest-700",
  "Health & Safety":    "bg-amber-100 text-amber-700",
  "Costs & Budgeting":  "bg-stone-100 text-stone-700",
  "Cat Care":           "bg-brand-100 text-brand-700",
  "Finding Boarding":   "bg-forest-100 text-forest-700",
  "Tips & Tricks":      "bg-amber-100 text-amber-700",
};

function categoryClass(cat: string) {
  return CATEGORY_COLORS[cat] ?? "bg-stone-100 text-stone-600";
}

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="bg-warm-50 min-h-screen">
      {/* ── Page hero ─────────────────────────────────────── */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center gap-4">
          <div className="bg-brand-500 rounded-2xl p-3 shrink-0">
            <PawPrint className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-1">
              Guides &amp; Tips
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 leading-tight">
              Pet Boarding Guides
            </h1>
            <p className="text-stone-500 mt-1 max-w-xl">
              Practical advice for pet owners — from first-time boarders to seasoned travelers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Featured post ─────────────────────────────────── */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group block bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:border-brand-300 overflow-hidden transition-all duration-200 mb-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-full min-h-[280px] bg-amber-50 overflow-hidden">
              <Image
                src={featured.coverImage}
                alt={featured.coverImageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Latest Guide
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryClass(featured.category)}`}>
                  {featured.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 leading-snug group-hover:text-brand-600 transition-colors mb-3">
                {featured.title}
              </h2>
              <p className="text-stone-500 leading-relaxed mb-6 line-clamp-3">
                {featured.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Clock className="h-3.5 w-3.5" />
                  {featured.readingTime}
                </div>
                <span className="text-brand-600 font-semibold text-sm group-hover:underline">
                  Read guide →
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* ── Grid of remaining posts ───────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md hover:border-brand-300 overflow-hidden transition-all duration-200 flex flex-col"
            >
              {/* Card image */}
              <div className="relative h-48 bg-amber-50 overflow-hidden shrink-0">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryClass(post.category)}`}>
                    {post.category}
                  </span>
                </div>

                <h2 className="font-bold text-stone-800 text-base leading-snug group-hover:text-brand-600 transition-colors mb-2">
                  {post.title}
                </h2>

                <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 flex-1">
                  {post.description}
                </p>

                <div className="flex items-center justify-between pt-4 mt-auto border-t border-stone-100">
                  <span className="flex items-center gap-1.5 text-xs text-stone-400">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                  <span className="text-brand-600 text-sm font-medium group-hover:underline">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Bottom CTA ────────────────────────────────────── */}
        <div className="bg-stone-900 rounded-2xl p-8 sm:p-12 text-center text-white">
          <div className="inline-flex items-center justify-center bg-brand-500 rounded-xl p-3 mb-4">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to Find a Boarding Facility?
          </h2>
          <p className="text-stone-400 mb-8 max-w-md mx-auto">
            Browse kennels, pet hotels, and pet sitters across all 50 US states — free to search,
            no sign-up required.
          </p>
          <Link
            href="/search"
            className="inline-block bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Search Pet Boarding Near You
          </Link>
        </div>
      </div>
    </div>
  );
}
