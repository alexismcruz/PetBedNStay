import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { US_STATES } from "@/lib/utils";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://petbednstay.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogPosts = getAllPosts();

  // ── High-priority static pages ─────────────────────────────────────────────
  const statics: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: "daily"   as const, priority: 1.0 },
    { url: `${BASE}/states`,              lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/list-your-business`,  lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/blog`,                lastModified: now, changeFrequency: "weekly"  as const, priority: 0.7 },
    { url: `${BASE}/contact`,             lastModified: now, changeFrequency: "yearly"  as const, priority: 0.4 },
    { url: `${BASE}/privacy`,             lastModified: now, changeFrequency: "yearly"  as const, priority: 0.3 },
    { url: `${BASE}/terms`,               lastModified: now, changeFrequency: "yearly"  as const, priority: 0.3 },
    ...blogPosts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // ── State pages (50 pages — always crawlable) ──────────────────────────────
  const statePages: MetadataRoute.Sitemap = US_STATES.map((s) => ({
    url: `${BASE}/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  let cityPages: MetadataRoute.Sitemap = [];
  let listingPages: MetadataRoute.Sitemap = [];

  try {
    const [cityRows, listings] = await Promise.all([
      db.listing.groupBy({
        by: ["stateSlug", "citySlug"],
        where: { isActive: true },
        _max: { updatedAt: true },
      }),
      db.listing.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true, tier: true },
      }),
    ]);

    cityPages = cityRows.map((r) => ({
      url: `${BASE}/${r.stateSlug}/${r.citySlug}`,
      lastModified: r._max.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Prioritise claimed/paid listings higher so Google crawls them first
    listingPages = listings.map((l) => ({
      url: `${BASE}/listing/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "monthly" as const,
      priority: l.tier === "PREMIUM" ? 0.8 : l.tier === "FEATURED" ? 0.7 : 0.5,
    }));
  } catch {
    // DB unavailable at build time
  }

  return [...statics, ...statePages, ...cityPages, ...listingPages];
}
