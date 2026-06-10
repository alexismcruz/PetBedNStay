import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const BASE = "https://petbednstay.com";

// Dedicated sitemap just for listing pages — keeps crawl budget separate
// from state/city/blog pages so Google can allocate intelligently
export const revalidate = 3600;

export async function GET() {
  try {
    const listings = await db.listing.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true, tier: true },
      orderBy: [{ tier: "desc" }, { updatedAt: "desc" }],
    });

    const urls = listings.map((l) => {
      const priority = l.tier === "PREMIUM" ? "0.8" : l.tier === "FEATURED" ? "0.7" : "0.5";
      return `
  <url>
    <loc>${BASE}/listing/${l.slug}</loc>
    <lastmod>${l.updatedAt.toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
