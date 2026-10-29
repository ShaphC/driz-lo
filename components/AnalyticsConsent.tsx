"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  analyticsConsent,
  setAnalyticsConsent,
  trackEvent,
} from "@/lib/analytics";

export default function AnalyticsConsent() {
  const pathname = usePathname();

  const [choice, setChoice] = useState<
    "accepted" | "declined" | null
  >(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(analyticsConsent());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || choice !== "accepted") return;

    trackEvent("page_viewed", {
      path: pathname,
    });
  }, [ready, choice, pathname]);

  if (!ready || choice !== null) return null;

  return (
    <aside
      aria-label="Analytics preferences"
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 1000,
        maxWidth: 440,
        margin: "0 auto",
        padding: 18,
        borderRadius: 16,
        background: "#2b1b17",
        border: "1px solid #9a7156",
        color: "#fff2df",
        boxShadow: "0 12px 36px rgba(0,0,0,.35)",
        fontSize: 14,
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          lineHeight: 1.5,
        }}
      >
        May we use privacy-conscious analytics to learn
        how Drizlo is used? Optional; the timer works
        without it. No session recordings.
      </p>

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={() => {
            setAnalyticsConsent("accepted");
            setChoice("accepted");
          }}
          style={{
            flex: 1,
            border: 0,
            borderRadius: 8,
            padding: 10,
            background: "#f5b579",
            color: "#27140c",
            fontWeight: 700,
          }}
        >
          Allow analytics
        </button>

        <button
          type="button"
          onClick={() => {
            setAnalyticsConsent("declined");
            setChoice("declined");
          }}
          style={{
            flex: 1,
            border: "1px solid #ad8a74",
            borderRadius: 8,
            padding: 10,
            background: "transparent",
            color: "#fff2df",
          }}
        >
          No thanks
        </button>
      </div>
    </aside>
  );
}
