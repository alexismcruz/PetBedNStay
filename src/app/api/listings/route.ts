import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const tier = searchParams.get("tier");
    const q = searchParams.get("q");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "24"));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };
    if (state) where.stateSlug = state;
    if (city) where.citySlug = city;
    if (type) where.type = type;
    if (tier) where.tier = tier;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        include: { images: true, amenities: true },
        orderBy: [{ tier: "desc" }, { isVerified: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      db.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("[GET /api/listings]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
