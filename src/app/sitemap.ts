import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { US_STATES } from "@/lib/utils";

const BASE = "https://petbednstay.com";

export const revalidate = 3600; // rebuild sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/search`,              lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/list-your-business`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/premium`,             lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/advertise`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const statePages: MetadataRoute.Sitemap = US_STATES.map((s) => ({
    url: `${BASE}/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  let cityPages: MetadataRoute.Sitemap = [];
  let listingPages: MetadataRoute.Sitemap = [];

  try {
    const [cityRows, listings] = await Promise.all([
      db.listing.groupBy({
        by: ["stateSlug", "citySlug"],
        where: { isActive: true },
      }),
      db.listing.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    cityPages = cityRows.map((r) => ({
      url: `${BASE}/${r.stateSlug}/${r.citySlug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    listingPages = listings.map((l) => ({
      url: `${BASE}/listing/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB unavailable at build time — return static + state pages only
  }

  return [...statics, ...statePages, ...cityPages, ...listingPages];
}
