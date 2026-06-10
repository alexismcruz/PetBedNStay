import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import AdminPanel from "./AdminPanel";

// Protect with a secret token — set ADMIN_SECRET in .env.local
// Visit: /admin?token=YOUR_SECRET
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const secret = process.env.ADMIN_SECRET;

  if (!secret || token !== secret) notFound();

  const [requests, recentClaims, stats] = await Promise.all([
    db.listingRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.listing.findMany({
      where: { claimedAt: { not: null } },
      select: { id: true, name: true, city: true, state: true, claimedAt: true, tier: true, slug: true },
      orderBy: { claimedAt: "desc" },
      take: 20,
    }),
    Promise.all([
      db.listing.count({ where: { isActive: true } }),
      db.listing.count({ where: { claimedAt: { not: null } } }),
      db.listing.count({ where: { tier: "FEATURED" } }),
      db.listing.count({ where: { tier: "PREMIUM" } }),
      db.listingRequest.count(),
      db.listingRequest.count({ where: { status: "PENDING" } }),
    ]),
  ]);

  const [totalListings, claimed, featured, premium, totalRequests, pendingRequests] = stats;

  return (
    <AdminPanel
      token={token!}
      requests={requests.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      }))}
      recentClaims={recentClaims.map((c) => ({
        ...c,
        claimedAt: c.claimedAt?.toISOString() ?? null,
      }))}
      stats={{ totalListings, claimed, featured, premium, totalRequests, pendingRequests }}
    />
  );
}
