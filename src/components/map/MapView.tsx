"use client";

import { useEffect, useRef } from "react";
import type { Listing } from "@/types";

interface Props {
  listings: Pick<Listing, "id" | "name" | "lat" | "lng" | "city" | "state" | "slug" | "tier">[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapView({ listings, center, zoom = 5, className }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let L: typeof import("leaflet");
    let map: import("leaflet").Map;

    async function initMap() {
      L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const validListings = listings.filter((l) => l.lat && l.lng);
      const defaultCenter: [number, number] = center ?? (validListings.length > 0
        ? [validListings[0].lat!, validListings[0].lng!]
        : [39.5, -98.35]);

      map = L.map(mapRef.current!).setView(defaultCenter, zoom);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const premiumIcon = L.divIcon({
        html: `<div style="background:#f59e0b;border:2px solid #d97706;border-radius:50%;width:16px;height:16px;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
        iconSize: [16, 16],
        className: "",
      });

      const freeIcon = L.divIcon({
        html: `<div style="background:#059669;border:2px solid #047857;border-radius:50%;width:12px;height:12px;box-shadow:0 1px 4px rgba(0,0,0,.2)"></div>`,
        iconSize: [12, 12],
        className: "",
      });

      validListings.forEach((listing) => {
        const icon = listing.tier !== "FREE" ? premiumIcon : freeIcon;
        L.marker([listing.lat!, listing.lng!], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="min-width:160px">
              <strong style="font-size:13px">${listing.name}</strong><br>
              <span style="font-size:12px;color:#6b7280">${listing.city}, ${listing.state}</span><br>
              <a href="/listing/${listing.slug}" style="font-size:12px;color:#d97706;font-weight:600">View Listing →</a>
            </div>`
          );
      });

      if (validListings.length > 1 && !center) {
        const group = L.featureGroup(
          validListings.map((l) => L.marker([l.lat!, l.lng!]))
        );
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as import("leaflet").Map).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listings, center, zoom]);

  return <div ref={mapRef} className={className ?? "h-full w-full rounded-xl"} />;
}
