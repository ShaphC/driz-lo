"use client";

import type posthogType from "posthog-js";

const CONSENT_KEY = "drizlo-analytics-consent-v1";

type AnalyticsProperties = Record<
  string,
  string | number | boolean
>;

let clientPromise: Promise<typeof posthogType | null> | null = null;

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
    void clientPromise?.then((client) => {
      client?.opt_out_capturing();
    });
  }
}

async function getClient(): Promise<
  typeof posthogType | null
> {
  if (
    typeof window === "undefined" ||
    process.env.NODE_ENV !== "production"
  ) {
    return null;
  }

  if (analyticsConsent() !== "accepted") {
    return null;
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) return null;

  if (!clientPromise) {
    clientPromise = import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(key, {
          api_host: host,
          autocapture: false,
          capture_pageview: false,
          capture_pageleave: false,
          disable_session_recording: true,
          persistence: "localStorage",
          person_profiles: "identified_only",
          opt_out_capturing_by_default: false,
        });

        return posthog;
      })
      .catch(() => null);
  }

  return clientPromise;
}

export function trackEvent(
  name: string,
  properties: AnalyticsProperties = {}
): void {
  void getClient().then((client) => {
    if (analyticsConsent() === "accepted") {
      client?.capture(name, properties);
    }
  });
}
