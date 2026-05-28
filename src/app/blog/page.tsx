import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
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

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-wide mb-2">Guides & Tips</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">Pet Boarding Guides</h1>
        <p className="text-stone-500 mt-3 text-lg max-w-2xl">
          Practical advice for pet owners — from first-time boarders to seasoned travelers. Everything you need to choose the right facility and prepare your pet.
        </p>
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white border border-amber-100 hover:border-brand-400 hover:shadow-md rounded-2xl p-6 transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime}
              </span>
            </div>

            <h2 className="font-bold text-stone-800 text-lg leading-snug group-hover:text-brand-600 transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 flex-1">
              {post.description}
            </p>

            <span className="inline-flex items-center gap-1 mt-4 text-brand-600 text-sm font-medium group-hover:gap-2 transition-all">
              Read guide <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 bg-stone-900 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Ready to Find a Boarding Facility?</h2>
        <p className="text-stone-400 mb-6 max-w-md mx-auto">
          Browse kennels, pet hotels, and pet sitters across all 50 US states — free to search.
        </p>
        <Link
          href="/search"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Search Pet Boarding Near You
        </Link>
      </div>
    </div>
  );
}
