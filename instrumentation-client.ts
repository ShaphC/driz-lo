import posthog from "posthog-js";

const projectToken =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  process.env.NEXT_PUBLIC_POSTHOG_KEY;

const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "production" &&
  projectToken &&
  host
) {
  posthog.init(projectToken, {
    api_host: host,

    // No tracking until the visitor accepts.
    opt_out_capturing_by_default: true,

    // We track only the events Drizlo needs.
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,

    // Disable unnecessary collection.
    disable_session_recording: true,
    capture_exceptions: false,

    // Avoid creating unnecessary person profiles.
    person_profiles: "identified_only",

    // Keep analytics anonymous.
    persistence: "localStorage",
  });

  // Restore consent from a previous visit.
  try {
    const consent = localStorage.getItem(
      "drizlo-analytics-consent-v1"
    );

    if (consent === "accepted") {
      posthog.opt_in_capturing();
    }
  } catch {
    // Storage may be unavailable.
  }
}
