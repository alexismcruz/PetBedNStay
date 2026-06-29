const REVIEWS = [
  {
    stars: 5,
    text: '"Found an amazing kennel in 10 minutes for our rescue pup. The reviews were so helpful — we knew exactly what to expect. Mochi had the best week of his life!"',
    avatar: "🐕",
    name: "Sarah M.",
    sub: "Dog mom · Austin, TX",
  },
  {
    stars: 5,
    text: '"I was so stressed about leaving my two cats. PetBedNStay helped me find a cat-only boarding place nearby. Zero anxiety on my vacation — highly recommend!"',
    avatar: "😻",
    name: "James & Priya K.",
    sub: "Cat parents · Portland, OR",
  },
  {
    stars: 5,
    text: '"I travel for work every month. This site has saved me so much time — I find a great boarding spot in any city in minutes. It\'s my go-to resource now."',
    avatar: "✈️",
    name: "Marcus T.",
    sub: "Frequent traveler · Chicago, IL",
  },
];

export default function HappyPawrents() {
  return (
    <section className="bg-cream py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-[.75rem] font-bold uppercase tracking-[.1em] text-o mb-2.5">Pawrent Reviews</span>
          <h2 className="font-[family-name:var(--font-nunito)] font-black text-ptext" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
            From Pet Parents Who&apos;ve Been There 🐾
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-white border-[1.5px] border-pborder rounded-[14px] p-7">
              <div className="text-y text-[1rem] mb-3.5">{"★".repeat(r.stars)}</div>
              <p className="text-[.92rem] text-ptext italic leading-[1.7] mb-4">{r.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-full bg-g-pale flex items-center justify-center text-[1.3rem] shrink-0">
                  {r.avatar}
                </div>
                <div>
                  <div className="font-bold text-[.88rem] text-ptext">{r.name}</div>
                  <div className="text-[.78rem] text-ptext-soft">{r.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
