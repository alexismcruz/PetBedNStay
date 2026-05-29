"use client";

import { useRef, useState } from "react";
import Script from "next/script";

interface Props {
  planId: string;
  listingId: string;
  tier: "FEATURED" | "PREMIUM";
  onSuccess?: (subscriptionId: string) => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export function PayPalSubscriptionButton({ planId, listingId, tier, onSuccess }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered    = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function renderButton() {
    if (!window.paypal || !containerRef.current || rendered.current) return;
    rendered.current = true;

    window.paypal
      .Buttons({
        style: {
          shape:  "pill",
          color:  "gold",
          layout: "vertical",
          label:  "subscribe",
        },

        createSubscription: (_: any, actions: any) =>
          actions.subscription.create({ plan_id: planId }),

        onApprove: async (data: any) => {
          setLoading(true);
          setError(null);
          try {
            const res = await fetch("/api/paypal/save-subscription", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subscriptionId: data.subscriptionID,
                listingId,
                tier,
              }),
            });
            if (!res.ok) throw new Error("save failed");
            onSuccess?.(data.subscriptionID);
          } catch {
            setError(
              "Your subscription was approved but we had trouble saving it. " +
              "Please contact hello@petbednstay.com with your subscription ID: " +
              data.subscriptionID
            );
          } finally {
            setLoading(false);
          }
        },

        onError: () =>
          setError("Something went wrong with PayPal. Please try again."),

        onCancel: () => setError(null),
      })
      .render(containerRef.current);
  }

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`}
        onLoad={renderButton}
      />

      {loading && (
        <p className="text-sm text-stone-500 text-center py-2 animate-pulse">
          Saving your subscription…
        </p>
      )}

      <div ref={containerRef} />

      {error && (
        <p className="mt-3 text-sm text-red-600 leading-relaxed">{error}</p>
      )}
    </>
  );
}
