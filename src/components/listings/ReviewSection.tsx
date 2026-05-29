"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  createdAt: string;
}

interface Props {
  listingId: string;
  listingName: string;
  initialReviews: Review[];
}

export default function ReviewSection({ listingId, listingName, initialReviews }: Props) {
  const [reviews, setReviews]     = useState<Review[]>(initialReviews);
  const [showForm, setShowForm]   = useState(false);
  const [rating, setRating]       = useState(0);
  const [hover, setHover]         = useState(0);
  const [name, setName]           = useState("");
  const [body, setBody]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState("");

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  function resetForm() {
    setName(""); setBody(""); setRating(0); setHover(0); setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Please select a star rating."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, authorName: name, rating, body }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Submission failed");
      }
      const newReview: Review = await res.json();
      setReviews([newReview, ...reviews]);
      setSubmitted(true);
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-6">
      {/* Header row */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-semibold text-stone-800 text-lg">
            Reviews
            {reviews.length > 0 && (
              <span className="text-stone-400 font-normal text-base ml-1">({reviews.length})</span>
            )}
          </h2>
          {avg && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= Math.round(Number(avg)) ? "fill-amber-400 text-amber-400" : "text-stone-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-stone-700">{avg}</span>
              <span className="text-sm text-stone-400">/ 5</span>
            </div>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => { setSubmitted(false); setShowForm(true); }}
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 hover:border-brand-400 px-4 py-2 rounded-xl transition-colors shrink-0"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Success banner */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
          <span className="text-green-500 text-base">✓</span>
          Thanks for your review!
        </div>
      )}

      {/* Submission form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-warm-50 rounded-xl border border-amber-100 p-5 mb-6 space-y-4"
        >
          <h3 className="font-semibold text-stone-800">Your Review</h3>

          {/* Star picker */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${i} star${i > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      i <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-stone-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Your Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Jane S."
              className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Review *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={4}
              placeholder={`Share your experience with ${listingName}…`}
              className="w-full border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              {loading ? "Submitting…" : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="px-4 py-2.5 text-stone-500 hover:text-stone-700 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-stone-400 text-sm">No reviews yet — be the first to share your experience!</p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {reviews.map((r) => (
            <div key={r.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-stone-700">{r.authorName}</span>
                <span className="text-xs text-stone-400 ml-auto">
                  {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
