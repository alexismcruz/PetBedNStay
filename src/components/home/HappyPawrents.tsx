const REASONS = [
  {
    emoji: "🔍",
    title: "Free to Search",
    body: "Browse hundreds of pet hotels, kennels, and sitters across all 50 states — no account or fees required.",
  },
  {
    emoji: "📞",
    title: "Contact Directly",
    body: "Every listing shows contact details so you can call, email, or visit the facility before you commit.",
  },
  {
    emoji: "📍",
    title: "Local & Nationwide",
    body: "Whether you need boarding in your city or across the country, we have options in every state.",
  },
  {
    emoji: "⭐",
    title: "See Their Reputation",
    body: "Every listing links to Google and Yelp reviews so you can read what real customers are saying before you book.",
  },
  {
    emoji: "🏨",
    title: "Hotels & Sitters",
    body: "Find full-service pet hotels, home-based sitters, and everything in between — filtered to exactly what your pet needs.",
  },
  {
    emoji: "🐾",
    title: "Dogs & Cats Welcome",
    body: "Our directory covers facilities that care for both dogs and cats, so the whole family is covered.",
  },
];

export default function HappyPawrents() {
  return (
    <section className="bg-warm-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-2xl">🐾</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mt-2">
            Why Pet Owners Use PetBedNStay
          </h2>
          <p className="mt-3 text-stone-500 text-lg max-w-xl mx-auto">
            Finding safe, trusted care for your pet shouldn&apos;t be hard. Here&apos;s what makes us different.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{r.emoji}</div>
              <h3 className="font-semibold text-stone-800 mb-2">{r.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
