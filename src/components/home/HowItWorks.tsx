import { Search, Star, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Your Area",
    description: "Enter your city or state to browse verified pet hotels and sitters near you.",
    color: "bg-brand-100 text-brand-600",
  },
  {
    icon: Star,
    title: "Compare Listings",
    description: "View photos, check amenities, and compare options to find the perfect match.",
    color: "bg-forest-100 text-forest-600",
  },
  {
    icon: CalendarCheck,
    title: "Contact & Book",
    description: "Reach out directly to confirm availability and book your pet's stay.",
    color: "bg-sky-100 text-sky-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-8 border-b border-amber-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold text-stone-700 text-center mb-5 uppercase tracking-widest text-sm">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-warm-50 rounded-xl p-4">
              <div className={`rounded-xl p-2.5 shrink-0 ${step.color}`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 mb-0.5">Step {i + 1}</p>
                <h3 className="text-sm font-semibold text-stone-800">{step.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
