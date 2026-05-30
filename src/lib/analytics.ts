/**
 * Safe GA4 event helper — works in both client and server contexts.
 * Silently no-ops if gtag isn't available (SSR, ad blockers, etc).
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number>,
) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", eventName, params);
  }
}
