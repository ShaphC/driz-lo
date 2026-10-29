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
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage may be unavailable.
  }

  if (value === "declined") {
    posthog.opt_out_capturing();
  } else {
    posthog.opt_in_capturing();
  }
}

export function trackEvent(
  name: string,
  properties: AnalyticsProperties = {}
): void {
  if (analyticsConsent() === "accepted") {
    posthog.capture(name, properties);
  }
}
