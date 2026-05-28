import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
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
    },
    twitter: { card: "summary_large_image" },
  };
}

function renderSection(section: BlogSection, i: number) {
  switch (section.type) {
    case "h2":
      return (
        <h2 key={i} className="text-2xl font-bold text-stone-800 mt-10 mb-4">
          {section.text}
        </h2>
      );
    case "p":
      return (
        <p key={i} className="text-stone-600 leading-relaxed mb-5">
          {section.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="list-disc list-outside ml-5 space-y-2 mb-6 text-stone-600">
          {section.items.map((item, j) => (
            <li key={j} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i} className="list-decimal list-outside ml-5 space-y-2 mb-6 text-stone-600">
          {section.items.map((item, j) => (
            <li key={j} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div
          key={i}
          className="bg-amber-50 border-l-4 border-amber-400 px-5 py-4 rounded-r-xl mb-6"
        >
          <p className="text-amber-900 text-sm leading-relaxed">{section.text}</p>
        </div>
      );
    case "table":
      return (
        <div key={i} className="overflow-x-auto mb-7 rounded-xl border border-amber-100">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-amber-50">
                {section.headers.map((h, j) => (
                  <th
                    key={j}
                    className="text-left px-4 py-3 font-semibold text-stone-700 border-b border-amber-100"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, j) => (
                <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 text-stone-600">
                      {cell}
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `https://petbednstay.com/blog/${slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "PetBedNStay",
      url: "https://petbednstay.com",
    },
    publisher: {
      "@type": "Organization",
      name: "PetBedNStay",
      url: "https://petbednstay.com",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://petbednstay.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://petbednstay.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://petbednstay.com/blog/${slug}` },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-brand-600 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Guides
      </Link>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-stone-400 mb-4">
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

      {/* Title + lede */}
      <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 leading-tight mb-4">
        {post.title}
      </h1>
      <p className="text-stone-500 text-lg leading-relaxed border-b border-amber-100 pb-8 mb-2">
        {post.description}
      </p>

      {/* Article body */}
      <article>{post.sections.map((section, i) => renderSection(section, i))}</article>

      {/* Related states CTA */}
      <div className="mt-12 pt-8 border-t border-amber-100">
        <h2 className="text-lg font-semibold text-stone-700 mb-4">Find Pet Boarding Near You</h2>
        <div className="flex flex-wrap gap-3">
          {post.relatedStates?.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="bg-white border border-amber-200 hover:border-brand-400 hover:shadow-sm rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-brand-600 transition-all"
            >
              Pet Boarding in {s.name}
            </Link>
          ))}
          <Link
            href="/search"
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            Search All States →
          </Link>
        </div>
      </div>
    </div>
  );
}
