export interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface OverpassResult {
  elements: OverpassElement[];
}

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function queryOverpass(query: string): Promise<OverpassResult> {
  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);
  return res.json();
}

export function buildPetQuery(stateCode: string): string {
  return `
[out:json][timeout:90];
area["ISO3166-2"="US-${stateCode}"][admin_level=4]->.state;
(
  node["amenity"="animal_boarding"](area.state);
  way["amenity"="animal_boarding"](area.state);
  node["amenity"="animal_shelter"](area.state);
  node["shop"="pet"](area.state);
  node["shop"="pet_grooming"](area.state);
  node["leisure"="dog_park"](area.state);
);
out body;
>;
out skel qt;
  `.trim();
}

export function extractListingData(el: OverpassElement) {
  const tags = el.tags ?? {};
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;

  return {
    osmId: String(el.id),
    name: tags.name ?? tags["name:en"] ?? null,
    phone: tags.phone ?? tags["contact:phone"] ?? null,
    website: tags.website ?? tags["contact:website"] ?? tags.url ?? null,
    address: tags["addr:street"]
      ? `${tags["addr:housenumber"] ?? ""} ${tags["addr:street"]}`.trim()
      : null,
    city: tags["addr:city"] ?? null,
    zip: tags["addr:postcode"] ?? null,
    lat: lat ?? null,
    lng: lon ?? null,
  };
}
