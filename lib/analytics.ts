"use client";

import posthog from "posthog-js";

const CONSENT_KEY = "drizlo-analytics-consent-v1";

type AnalyticsProperties = Record<
  string,
  string | number | boolean
>;

export function analyticsConsent():
  | "accepted"
  | "declined"
  | null {
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(CONSENT_KEY);

    return value === "accepted" || value === "declined"
      ? value
      : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(
  value: "accepted" | "declined"
): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage may be unavailable.
  }

  if (!posthog.__loaded) return;

  if (value === "accepted") {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
}

export function trackEvent(
  name: string,
  properties: AnalyticsProperties = {}
): void {
  if (
    typeof window === "undefined" ||
    analyticsConsent() !== "accepted" ||
    !posthog.__loaded
  ) {
    return;
  }

  posthog.capture(name, properties);
}
