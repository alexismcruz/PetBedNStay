"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import type { Listing } from "@/types";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

interface Props {
  listings: Pick<Listing, "id" | "name" | "lat" | "lng" | "city" | "state" | "slug" | "tier">[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapWrapper(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Load map only when it enters the viewport (200px lookahead)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full bg-amber-50 flex items-center justify-center">
      {shouldLoad ? (
        <MapView {...props} />
      ) : (
        <span className="text-xs text-stone-400">Loading map…</span>
      )}
    </div>
  );
}
