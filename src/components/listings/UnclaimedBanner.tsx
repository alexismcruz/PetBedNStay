import Link from "next/link";
import { BadgeCheck } from "lucide-react";

interface Props {
  listingName: string;
  city: string;
  state: string;
}

/**
 * Shown on listings that haven't been claimed by their owner.
 * Sets honest expectations for visitors (info is auto-compiled, not owner-supplied)
 * while turning every unclaimed listing into a lead-gen CTA.
 */
export default function UnclaimedBanner({ listingName, city, state }: Props) {
  const claimHref =
    `/list-your-business?claim=${encodeURIComponent(listingName)}` +
    `&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <BadgeCheck className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-stone-800">Is this your business?</span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          This listing was compiled from public information and hasn&apos;t been claimed yet.
          Claim it free to add photos, prices, hours, and a description — and show pet owners
          you&apos;re open for bookings.
        </p>
      </div>
      <Link
        href={claimHref}
        className="shrink-0 inline-flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
      >
        Claim this listing — Free
      </Link>
    </div>
  );
}
