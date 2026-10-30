"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { analyticsConsent, setAnalyticsConsent } from "@/lib/analytics";
import "./privacy.css";

type Consent = "accepted" | "declined" | null;

export default function PrivacyPage() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(analyticsConsent());
    setReady(true);
  }, []);

  function updateConsent(value: "accepted" | "declined") {
    setAnalyticsConsent(value);
    setConsent(value);
  }

  return (
    <main className="privacy-page">
      <div className="privacy-container">
        <header className="privacy-header">
          <Link href="/" className="privacy-brand">
            drizlo<span>.</span>
          </Link>
          <Link href="/app" className="privacy-back">
            Back to timer
          </Link>
        </header>

        <div className="privacy-intro">
          <span className="privacy-eyebrow">YOUR PRIVACY</span>
          <h1>A little more peace of mind.</h1>
          <p>
            Drizlo is designed to help you focus, not to collect unnecessary
            information about you.
          </p>
        </div>

        <section className="privacy-section">
          <h2>What Drizlo stores</h2>
          <p>
            Drizlo saves your timer session and preferences in your browser so
            you can return to your focus session. This information stays on your
            device.
          </p>
          <p>Drizlo does not currently require an account.</p>
        </section>

        <section className="privacy-section">
          <h2>Optional analytics</h2>
          <p>
            With your permission, Drizlo uses PostHog to understand how people
            use the app and which features are useful.
          </p>
          <p>
            This can include page visits, timer starts, pauses, completions,
            selected focus durations, and scene choices. Analytics may also
            process technical information such as browser type and device
            characteristics.
          </p>
          <p>
            Analytics is optional. Drizlo works whether you accept or decline.
            We do not use session recordings or automatic click tracking.
          </p>
        </section>

        <section className="privacy-section privacy-preferences">
          <h2>Your analytics preferences</h2>
          <p>You can change your decision at any time.</p>

          {ready && (
            <div className="privacy-choice">
              <div className="privacy-choice-status">
                Current preference:{" "}
                <strong>
                  {consent === "accepted"
                    ? "Analytics allowed"
                    : consent === "declined"
                      ? "Analytics declined"
                      : "Not selected"}
                </strong>
              </div>

              <div className="privacy-buttons">
                <button
                  type="button"
                  className={
                    consent === "accepted"
                      ? "privacy-button active"
                      : "privacy-button"
                  }
                  onClick={() => updateConsent("accepted")}
                >
                  Allow analytics
                </button>

                <button
                  type="button"
                  className={
                    consent === "declined"
                      ? "privacy-button active"
                      : "privacy-button"
                  }
                  onClick={() => updateConsent("declined")}
                >
                  Decline analytics
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="privacy-section">
          <h2>Third-party services</h2>
          <p>
            Drizlo is hosted on Vercel and uses PostHog for optional analytics.
            These providers may process technical information needed to operate
            their services.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Updates to this page</h2>
          <p>
            We may update this notice as Drizlo evolves, including when new
            features or services are introduced.
          </p>
        </section>

        <footer className="privacy-footer">
          <span>Make time feel beautiful.</span>
          <Link href="/app">Return to Drizlo</Link>
        </footer>
      </div>
    </main>
  );
}
