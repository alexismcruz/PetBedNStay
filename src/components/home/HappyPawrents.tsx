import Image from "next/image";

const STORIES = [
  {
    photo: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=600&q=80",
    name: "Sarah & Biscuit",
    location: "Austin, TX",
    quote:
      "Found the most amazing boarding facility 10 minutes from our home. Biscuit actually gets excited when we pull into the driveway now!",
    petEmoji: "🐕",
  },
  {
    photo: "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=600&q=80",
    name: "Marcus & Noodle",
    location: "Denver, CO",
    quote:
      "Traveled for two weeks without a worry in the world. The sitter sent daily updates and photos. Noodle was in great hands the whole time.",
    petEmoji: "🐈",
  },
  {
    photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    name: "The Rodriguezes & Luna",
    location: "Miami, FL",
    quote:
      "As a family with three kids and a dog, we needed someone who could handle the energy. Luna came back tired and happy — perfect!",
    petEmoji: "🐶",
  },
];

export default function HappyPawrents() {
  return (
    <section className="bg-warm-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-2xl">🐾</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mt-2">
            Real Stories from Real Pawrents
          </h2>
          <p className="mt-3 text-stone-500 text-lg max-w-xl mx-auto">
            Thousands of pet owners across the US have found trusted care through PetBedNStay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORIES.map((story) => (
            <div
              key={story.name}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
            >
              {/* Photo */}
              <div className="relative h-52 bg-stone-100">
                <Image
                  src={story.photo}
                  alt={`${story.name} — happy pet owner`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Pet emoji badge */}
                <div className="absolute top-3 right-3 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-lg">
                  {story.petEmoji}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-stone-600 text-sm leading-relaxed italic mb-4">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2 border-t border-stone-100 pt-3">
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{story.name}</p>
                    <p className="text-xs text-stone-400">{story.location}</p>
                  </div>
                  {/* Stars */}
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-brand-500 text-sm">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Photo mosaic strip */}
        <div className="mt-10 grid grid-cols-4 sm:grid-cols-6 gap-2 rounded-2xl overflow-hidden">
          {[
            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=300&q=75",
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=300&q=75",
            "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=300&q=75",
            "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=300&q=75",
            "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=300&q=75",
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=75",
          ].map((url, i) => (
            <div key={i} className="relative aspect-square bg-stone-100">
              <Image
                src={url}
                alt="Happy pet"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 25vw, 16vw"
              />
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-stone-400 mt-2">
          Photos via Unsplash — free for commercial use
        </p>
      </div>
    </section>
  );
}
