"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const KEY = "pbs_favorites";

function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

interface Props {
  listingId: string;
  className?: string;
}

export default function FavoriteButton({ listingId, className }: Props) {
  const [saved, setSaved] = useState(false);
  const [pop,   setPop]   = useState(false);

  useEffect(() => {
    setSaved(getFavorites().includes(listingId));
  }, [listingId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const current = getFavorites();
    const next = current.includes(listingId)
      ? current.filter((id) => id !== listingId)
      : [...current, listingId];
    saveFavorites(next);
    setSaved(!current.includes(listingId));
    setPop(true);
    setTimeout(() => setPop(false), 800);
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove from saved" : "Save listing"}
      className={cn(
        "flex items-center justify-center rounded-full w-8 h-8 shadow-sm transition-all duration-200",
        saved
          ? "bg-red-500 text-white"
          : "bg-white/90 text-stone-400 hover:text-red-400",
        pop && "scale-125",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4 transition-all", saved && "fill-current")} />
    </button>
  );
}
