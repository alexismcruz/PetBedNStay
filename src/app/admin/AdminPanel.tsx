"use client";

import { useState } from "react";
import { CheckCircle, Clock, ExternalLink, BadgeCheck, Users, Building2, Star, Crown } from "lucide-react";

interface Request {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string | null;
  city: string;
  state: string;
  website: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

interface Claim {
  id: string;
  name: string;
  city: string;
  state: string;
  claimedAt: string | null;
  tier: string;
  slug: string;
}

interface Stats {
  totalListings: number;
  claimed: number;
  featured: number;
  premium: number;
  totalRequests: number;
  pendingRequests: number;
}

interface Props {
  token: string;
  requests: Request[];
  recentClaims: Claim[];
  stats: Stats;
}

export default function AdminPanel({ token, requests, recentClaims, stats }: Props) {
  const [tab, setTab] = useState<"requests" | "claims">("requests");
  const [updating, setUpdating] = useState<string | null>(null);
  const [localRequests, setLocalRequests] = useState(requests);

  async function markApproved(id: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED", token }),
      });
      if (res.ok) {
        setLocalRequests((prev) =>
          prev.map((r) => r.id === id ? { ...r, status: "APPROVED" } : r)
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  async function markRejected(id: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED", token }),
      });
      if (res.ok) {
        setLocalRequests((prev) =>
          prev.map((r) => r.id === id ? { ...r, status: "REJECTED" } : r)
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  const pending  = localRequests.filter((r) => r.status === "PENDING");
  const approved = localRequests.filter((r) => r.status === "APPROVED");
  const rejected = localRequests.filter((r) => r.status === "REJECTED");

  return (
    <div className="bg-warm-50 min-h-screen">
      {/* Header */}
      <div className="bg-stone-900 text-white px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">PetBedNStay Admin</h1>
            <p className="text-stone-400 text-sm mt-0.5">Internal dashboard</p>
          </div>
          <a href="/" className="text-sm text-stone-400 hover:text-white transition-colors">
            ← Back to site
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Active Listings",    value: stats.totalListings, icon: Building2, color: "text-stone-700" },
            { label: "Claimed",            value: stats.claimed,       icon: BadgeCheck, color: "text-forest-600" },
            { label: "Featured",           value: stats.featured,      icon: Star,       color: "text-brand-500" },
            { label: "Premium",            value: stats.premium,       icon: Crown,      color: "text-amber-500" },
            { label: "Total Requests",     value: stats.totalRequests, icon: Users,      color: "text-stone-500" },
            { label: "Pending Review",     value: stats.pendingRequests, icon: Clock,    color: "text-orange-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-amber-100 p-4">
              <Icon className={`h-5 w-5 ${color} mb-2`} />
              <p className="text-2xl font-bold text-stone-800">{value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["requests", "claims"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-brand-500 text-white"
                  : "bg-white border border-amber-200 text-stone-600 hover:border-brand-300"
              }`}
            >
              {t === "requests" ? `Listing Requests (${pending.length} pending)` : "Recent Claims"}
            </button>
          ))}
        </div>

        {/* Requests tab */}
        {tab === "requests" && (
          <div className="space-y-4">
            {pending.length === 0 && approved.length === 0 && rejected.length === 0 && (
              <div className="bg-white rounded-2xl border border-amber-100 p-10 text-center text-stone-400">
                No listing requests yet.
              </div>
            )}

            {[
              { label: "Pending", items: pending, color: "bg-orange-50 border-orange-200" },
              { label: "Approved", items: approved, color: "bg-green-50 border-green-200" },
              { label: "Rejected", items: rejected, color: "bg-red-50 border-red-200" },
            ].map(({ label, items, color }) =>
              items.length > 0 ? (
                <div key={label}>
                  <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
                    {label} ({items.length})
                  </h2>
                  <div className="space-y-3">
                    {items.map((r) => (
                      <div key={r.id} className={`bg-white rounded-2xl border ${color.split(" ")[1]} p-5`}>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <p className="font-semibold text-stone-800 text-base">{r.businessName}</p>
                            <p className="text-sm text-stone-500 mt-0.5">
                              {r.city}, {r.state} &nbsp;·&nbsp; {r.ownerName} &nbsp;·&nbsp;
                              <a href={`mailto:${r.email}`} className="text-brand-600 hover:underline">{r.email}</a>
                              {r.phone && <> &nbsp;·&nbsp; {r.phone}</>}
                            </p>
                            {r.website && (
                              <a href={r.website} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-brand-600 hover:underline flex items-center gap-1 mt-1">
                                {r.website} <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {r.message && (
                              <p className="text-sm text-stone-500 mt-2 bg-stone-50 rounded-lg p-3 italic">
                                &ldquo;{r.message}&rdquo;
                              </p>
                            )}
                            <p className="text-xs text-stone-400 mt-2">
                              Submitted {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>

                          {r.status === "PENDING" && (
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => markApproved(r.id)}
                                disabled={updating === r.id}
                                className="flex items-center gap-1.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => markRejected(r.id)}
                                disabled={updating === r.id}
                                className="flex items-center gap-1.5 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {r.status !== "PENDING" && (
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                              r.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                            }`}>
                              {r.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Claims tab */}
        {tab === "claims" && (
          <div>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Recently Claimed Listings ({recentClaims.length})
            </h2>
            {recentClaims.length === 0 ? (
              <div className="bg-white rounded-2xl border border-amber-100 p-10 text-center text-stone-400">
                No listings claimed yet.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-100 bg-amber-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Business</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Tier</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Claimed</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClaims.map((c, i) => (
                      <tr key={c.id} className={i % 2 === 0 ? "" : "bg-stone-50"}>
                        <td className="px-4 py-3 font-medium text-stone-800">{c.name}</td>
                        <td className="px-4 py-3 text-stone-500">{c.city}, {c.state}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            c.tier === "PREMIUM"  ? "bg-amber-100 text-amber-700" :
                            c.tier === "FEATURED" ? "bg-brand-100 text-brand-700" :
                            "bg-stone-100 text-stone-600"
                          }`}>
                            {c.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-stone-400 text-xs">
                          {c.claimedAt ? new Date(c.claimedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={`/listing/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-600 hover:underline text-xs flex items-center gap-1"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
