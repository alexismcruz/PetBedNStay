const ITEMS = [
  { icon: "✅", title: "Verified Listings",  body: "Every business is manually reviewed before going live on our directory" },
  { icon: "🆓", title: "Free to Search",    body: "No account, no subscription — browse all 800+ listings for free, always" },
  { icon: "💬", title: "Real Reviews",      body: "Ratings and reviews from pet owners who've actually used the services" },
  { icon: "🗺️", title: "49 States",         body: "The most comprehensive US pet boarding directory — coast to coast coverage" },
];

export default function TrustBand() {
  return (
    <div className="bg-g py-[52px] px-6">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {ITEMS.map((item) => (
          <div key={item.title}>
            <div className="text-[2rem] mb-2.5">{item.icon}</div>
            <h3 className="font-[family-name:var(--font-nunito)] font-extrabold text-white text-[1rem] mb-1.5">{item.title}</h3>
            <p className="text-[.83rem] text-white/75 leading-[1.6]">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
