interface StatProps {
  listingCount: number;
  stateCount:   number;
  cityCount:    number;
}

export default function Stats({ listingCount, stateCount, cityCount }: StatProps) {
  const stats = [
    { value: listingCount.toLocaleString() + "+", label: "Boarding Facilities", sub: "hotels, kennels & sitters" },
    { value: cityCount.toLocaleString() + "+",    label: "Cities Covered",      sub: "across the US" },
    { value: stateCount.toString(),               label: "States",              sub: "all of the US" },
    { value: "100%",                              label: "Free to Search",      sub: "no account needed" },
  ];

  return (
    <section className="bg-brand-500 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-0.5">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</div>
              <div className="text-amber-100 text-sm font-semibold">{s.label}</div>
              <div className="text-amber-200/70 text-xs">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
