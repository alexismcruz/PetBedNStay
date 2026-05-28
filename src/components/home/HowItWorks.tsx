import { Search, Star, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Your Area",
    description:
      "Enter your city or state to browse verified pet hotels and sitters near you. Filter by pet type, amenities, and budget.",
    color: "bg-brand-100 text-brand-600",
  },
  {
    icon: Star,
    title: "Compare Listings",
    description:
      "Read detailed profiles, view photos, check amenities, and compare options to find the perfect match for your pet.",
    color: "bg-forest-100 text-forest-600",
  },
  {
    icon: CalendarCheck,
    title: "Contact & Book",
    description:
      "Reach out directly to the pet hotel or sitter to confirm availability and book your pet's stay with peace of mind.",
    color: "bg-sky-100 text-sky-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">
            How It Works
          </h2>
          <p className="mt-3 text-stone-500 text-lg max-w-xl mx-auto">
            Finding the right care for your pet has never been easier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div className={`rounded-2xl p-5 ${step.color}`}>
                <step.icon className="h-8 w-8" />
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center -mt-1">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold text-stone-800">{step.title}</h3>
              <p className="text-stone-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
