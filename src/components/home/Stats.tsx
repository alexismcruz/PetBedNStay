interface StatProps {
  listingCount: number;
  stateCount: number;
}

export default function Stats({ listingCount, stateCount }: StatProps) {
  const stats = [
    { value: listingCount.toLocaleString() + "+", label: "Pet Hotels & Sitters" },
    { value: stateCount + "", label: "States Covered" },
    { value: "100%", label: "Free to Search" },
    { value: "24/7", label: "Listings Available" },
  ];

  return (
    <section className="bg-brand-500 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</div>
              <div className="text-amber-100 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
