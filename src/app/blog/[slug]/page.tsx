import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, PawPrint } from "lucide-react";
import { getPost, getAllPosts, type BlogSection } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://petbednstay.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://petbednstay.com/blog/${slug}`,
      type: "article",
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.coverImageAlt }],
    },
    twitter: { card: "summary_large_image" },
  };
}

// ── Section renderer ─────────────────────────────────────────────────────────
function renderSection(section: BlogSection, i: number) {
  switch (section.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="text-xl sm:text-2xl font-bold text-stone-800 mt-10 mb-3 pl-4 border-l-4 border-brand-500"
        >
          {section.text}
        </h2>
      );
    case "p":
      return (
        <p key={i} className="text-stone-600 leading-relaxed mb-5 text-[1.0625rem]">
          {section.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="mb-6 space-y-2.5">
          {section.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-stone-600 leading-relaxed">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="mb-6 space-y-2.5 counter-reset-list">
          {section.items.map((item, j) => (
            <li key={j} className="flex gap-3 text-stone-600 leading-relaxed">
              <span className="shrink-0 h-6 w-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {j + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div
          key={i}
          className="bg-brand-50 border-l-4 border-brand-500 px-5 py-4 rounded-r-2xl mb-6"
        >
          <p className="text-brand-800 text-sm leading-relaxed font-medium">{section.text}</p>
        </div>
      );
    case "table":
      return (
        <div key={i} className="overflow-x-auto mb-7 rounded-2xl border border-amber-100 shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-warm-100">
                {section.headers.map((h, j) => (
                  <th
                    key={j}
                    className="text-left px-5 py-3 font-semibold text-stone-700 border-b border-amber-100"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, j) => (
                <tr
                  key={j}
                  className={`border-b border-amber-50 last:border-0 ${
                    j % 2 === 0 ? "bg-white" : "bg-warm-50"
                  }`}
                >
                  {row.map((cell, k) => (
                    <td key={k} className="px-5 py-3 text-stone-600">
                      {k === 0 ? <span className="font-medium text-stone-700">{cell}</span> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    url: `https://petbednstay.com/blog/${slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "PetBedNStay", url: "https://petbednstay.com" },
    publisher: { "@type": "Organization", name: "PetBedNStay", url: "https://petbednstay.com" },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",  item: "https://petbednstay.com" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://petbednstay.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://petbednstay.com/blog/${slug}` },
    ],
  };

  return (
    <div className="bg-warm-50 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* ── Hero image ──────────────────────────────────────── */}
      <div className="w-full bg-amber-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden shadow-md">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1024px"
              priority
            />
            {/* Gradient overlay so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
            {/* Category chip over image */}
            <div className="absolute bottom-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                {post.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article wrapper ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">

          {/* ── Main article column ───────────────────────────── */}
          <div>
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-brand-600 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Guides
            </Link>

            {/* Article card */}
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-10">
              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-stone-400 mb-5">
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

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 leading-tight mb-4">
                {post.title}
              </h1>

              {/* Lede */}
              <p className="text-stone-500 text-lg leading-relaxed border-b border-amber-100 pb-8 mb-2">
                {post.description}
              </p>

              {/* Body */}
              <article className="pt-2">
                {post.sections.map((section, i) => renderSection(section, i))}
              </article>
            </div>

            {/* ── Find boarding CTA ──────────────────────────── */}
            <div className="mt-8 bg-stone-900 rounded-2xl p-7 text-white">
              <div className="flex items-start gap-4">
                <div className="bg-brand-500 rounded-xl p-2.5 shrink-0">
                  <PawPrint className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-lg mb-1">Find Pet Boarding Near You</h2>
                  <p className="text-stone-400 text-sm mb-4">
                    Browse kennels, pet hotels, and pet sitters across all 50 states — free to search.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.relatedStates?.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/${s.slug}`}
                        className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {s.name}
                      </Link>
                    ))}
                    <Link
                      href="/search"
                      className="bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Search All States →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">

              {/* Quick navigation */}
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
                  In This Guide
                </h3>
                <nav className="space-y-2">
                  {post.sections
                    .filter((s) => s.type === "h2")
                    .map((s, i) =>
                      s.type === "h2" ? (
                        <p key={i} className="text-sm text-stone-600 leading-snug pl-3 border-l-2 border-amber-200 hover:border-brand-400 hover:text-brand-600 transition-colors cursor-default">
                          {s.text}
                        </p>
                      ) : null
                    )}
                </nav>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
                    Related Guides
                  </h3>
                  <div className="space-y-4">
                    {related.map((rp) => (
                      <Link
                        key={rp.slug}
                        href={`/blog/${rp.slug}`}
                        className="group flex gap-3 items-start"
                      >
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 bg-amber-50">
                          <Image
                            src={rp.coverImage}
                            alt={rp.coverImageAlt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="56px"
                          />
                        </div>
                        <p className="text-sm text-stone-700 leading-snug group-hover:text-brand-600 transition-colors line-clamp-3">
                          {rp.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticky search CTA */}
              <div className="bg-brand-500 rounded-2xl p-5 text-white text-center">
                <PawPrint className="h-6 w-6 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-sm mb-3">Find boarding in your state</p>
                <Link
                  href="/search"
                  className="block bg-white text-brand-600 font-bold text-sm py-2 rounded-xl hover:bg-brand-50 transition-colors"
                >
                  Search Now
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
