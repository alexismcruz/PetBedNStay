const steps = [
  { num: 1, icon: "🔍", title: "Search Your Area",     body: "Enter your city, zip code, or state. Filter by pet type — dogs, cats, exotics, or all furry friends." },
  { num: 2, icon: "📋", title: "Compare Options",      body: "Browse kennels, hotels, and sitters side by side. Read real reviews from real pawrents like you." },
  { num: 3, icon: "📞", title: "Contact Directly",     body: "Reach out straight to the business — no middleman, no extra fees. Book on your terms." },
  { num: 4, icon: "✈️", title: "Travel Worry-Free",    body: "Your pet is in great hands. Enjoy your trip knowing they're happy, safe, and well cared for." },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 max-w-[1200px] mx-auto">
      <div className="text-center mb-12">
        <span className="inline-block text-[.75rem] font-bold uppercase tracking-[.1em] text-o mb-2.5">Super Simple</span>
        <h2 className="font-[family-name:var(--font-nunito)] font-black text-ptext" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
          Finding a Stay Takes 3 Steps 🐾
        </h2>
        <p className="text-ptext-mid mt-2.5">No accounts needed. No booking fees. Just find and contact directly.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s) => (
          <div key={s.num} className="relative bg-white border-[1.5px] border-pborder rounded-[14px] p-8 text-center">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-g text-white flex items-center justify-center font-[family-name:var(--font-nunito)] font-black text-[.9rem]">
              {s.num}
            </div>
            <div className="w-[72px] h-[72px] rounded-[18px] bg-g-pale flex items-center justify-center text-[2rem] mx-auto mb-4 mt-2">
              {s.icon}
            </div>
            <h3 className="font-[family-name:var(--font-nunito)] font-extrabold text-[1.05rem] text-ptext mb-2.5">{s.title}</h3>
            <p className="text-[.88rem] text-ptext-mid leading-[1.7]">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
