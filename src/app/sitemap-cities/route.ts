import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const BASE = "https://petbednstay.com";

export const revalidate = 3600;

export async function GET() {
  try {
    const cityRows = await db.listing.groupBy({
      by: ["stateSlug", "citySlug"],
      where: { isActive: true },
      _max: { updatedAt: true },
      orderBy: { _count: { citySlug: "desc" } }, // most-listed cities first
    });

    const urls = cityRows.map((r) => `
  <url>
    <loc>${BASE}/${r.stateSlug}/${r.citySlug}</loc>
    <lastmod>${(r._max.updatedAt ?? new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);

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
