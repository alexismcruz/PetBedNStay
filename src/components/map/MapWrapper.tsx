"use client";

import dynamic from "next/dynamic";
import type { Listing } from "@/types";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

interface Props {
  listings: Pick<Listing, "id" | "name" | "lat" | "lng" | "city" | "state" | "slug" | "tier">[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapWrapper(props: Props) {
  return <MapView {...props} />;
}
