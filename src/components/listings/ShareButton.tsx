"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface Props {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    // Use native share sheet on mobile if available
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-brand-600 border border-stone-200 hover:border-brand-300 px-3 py-1.5 rounded-lg transition-colors"
      title="Share this listing"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-forest-500" />
          <span className="text-forest-500 text-xs font-medium">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Share</span>
        </>
      )}
    </button>
  );
}
