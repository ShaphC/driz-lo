"use client";

import posthog from "posthog-js";

const CONSENT_KEY = "drizlo-analytics-consent-v1";
export const CONSENT_CHANGED_EVENT = "drizlo:analytics-consent-changed";

export type AnalyticsConsentChoice = "accepted" | "declined";

type AnalyticsProperties = Record<
  string,
  string | number | boolean
>;

export function analyticsConsent(): AnalyticsConsentChoice | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(CONSENT_KEY);

    return value === "accepted" || value === "declined"
      ? value
      : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(
  value: AnalyticsConsentChoice
): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Browser storage may be unavailable.
  }

  if (posthog.__loaded) {
    if (value === "accepted") {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
  }

  // Always notify React components, even if PostHog is not loaded.
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGED_EVENT, {
      detail: value,
    })
  );
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
