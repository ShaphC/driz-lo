"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CoffeeScene from "@/components/CoffeeScene";
import TeaScene from "@/components/TeaScene";
import { trackEvent } from "@/lib/analytics";
import "./landing-experiments.css";

type Device = "desktop" | "mobile";
type Drink = "coffee" | "tea";

function Scene({ drink }: { drink: Drink }) {
  const props = {
    progress: 0.55,
    running: true,
    mode: "focus" as const,
    completed: 0,
  };
  return (
    <div className="dx-scene" aria-hidden="true">
      {drink === "coffee" ? (
        <CoffeeScene {...props} />
      ) : (
        <TeaScene {...props} />
      )}
    </div>
  );
}

function DevicePreview({ device, drink }: { device: Device; drink: Drink }) {
  const [secondsRemaining, setSecondsRemaining] = useState(14 * 60 + 32);
  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsRemaining(previous => previous > 0 ? previous - 1 : 14 * 60 + 32);
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);
  const previewTime = `${String(Math.floor(secondsRemaining / 60)).padStart(2, "0")}:${String(secondsRemaining % 60).padStart(2, "0")}`;
  return (
    <div
      className={`dx-device dx-device--${device}`}
      role="img"
      aria-label={`${device} preview of Drizlo ${drink} timer`}
    >
      <div className="dx-device-top">
        <span className="dx-device-title">
          drizlo<span>.</span>
        </span>
        <span className="dx-device-meta">
          {device === "mobile" ? "9:41" : "●  ●  ●"}
        </span>
      </div>
      <div className="dx-screen">
        <Scene drink={drink} />
        <div className="dx-timer-preview">
          <span className="dx-timer-label">FOCUS TIME</span>
          <strong aria-live="off">{previewTime}</strong>
          <small>Keep your focus going.</small>
          <span className="dx-play" aria-hidden="true">
            Ⅱ
          </span>
        </div>
      </div>
      {device === "mobile" && <div className="dx-home-bar" />}
    </div>
  );
}

const features = [
  {
    number: "01",
    symbol: "◷",
    title: "Progress you can see.",
    description:
      "Watch the scene change as you work. A quieter, more satisfying way to see how far you've come.",
  },
  {
    number: "02",
    symbol: "☁",
    title: "An atmosphere of your own.",
    description:
      "Coffee brewing, tea steeping, and more scenes to come. Find a setting that feels right for today.",
  },
  {
    number: "03",
    symbol: "✦",
    title: "Nothing between you and focus.",
    description:
      "No complicated setup. No account needed. Just choose a scene, set the time, and begin.",
  },
];

const steps = [
  {
    title: "Find your scene",
    description: "Choose an animated atmosphere for your session.",
  },
  {
    title: "Set your time",
    description: "Pick a focus duration that fits what you want to get done.",
  },
  {
    title: "Let the scene unfold",
    description: "Focus on your work while your scene moves with you.",
  },
];

const faqs = [
  [
    "Is Drizlo free to use?",
    "Yes. You can use the focus timer and currently available scenes for free.",
  ],
  [
    "Do I need an account?",
    "No. Open Drizlo, choose a scene, and start your session.",
  ],
  [
    "Does Drizlo work on mobile?",
    "Yes. Drizlo works in your mobile browser. Dedicated Android and iOS apps are planned.",
  ],
  [
    "What happens when my timer finishes?",
    "Your focus session ends, and you can switch to a break before starting again.",
  ],
  [
    "Can I customize my sessions?",
    "You can choose between available scenes and session lengths to suit how you work.",
  ],
];

export default function LandingPage() {
  const [device, setDevice] = useState<Device>("desktop");
  const [drink] = useState<Drink>("coffee");
  const [cycleKey, setCycleKey] = useState(0);
  const [year, setYear] = useState(2026);

  useEffect(() => setYear(new Date().getFullYear()), []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      setDevice((previous) => (previous === "desktop" ? "mobile" : "desktop"));
    }, 6500);
    return () => window.clearInterval(interval);
  }, [cycleKey]);

  function chooseDevice(next: Device) {
    setDevice(next);
    setCycleKey((key) => key + 1);
  }

  function openTimer(source: "navigation" | "hero" | "how_it_works" | "final_cta") {
    trackEvent("timer_opened", { source });
  }

  return (
    <main className="dx" id="top">
      <header className="dx-nav-shell">
        <div className="dx-nav">
          <Link href="/" className="dx-brand" aria-label="Drizlo home">
            drizlo<span>.</span>
          </Link>
          <nav className="dx-nav-right" aria-label="Main navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#faq">FAQ</a>
            <Link href="/app" className="dx-nav-cta" onClick={() => openTimer("navigation")}>
              Open timer <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
      </header>

      <section className="dx-hero-shell" aria-labelledby="dx-hero-title">
        <div className="dx-hero">
          <div className="dx-hero-content">
            <span className="dx-eyebrow">
              <i aria-hidden="true" /> A DIFFERENT KIND OF FOCUS TIMER
            </span>
            <h1 id="dx-hero-title">
              Focus feels
              <br />
              <em>different here.</em>
            </h1>
            <p>
              Make room for the work that matters. Set a timer, settle into a
              scene, and watch your progress come to life.
            </p>
            <div className="dx-actions">
              <Link className="dx-primary" href="/app" onClick={() => openTimer("hero")}>
                Start focusing <span aria-hidden="true">↗</span>
              </Link>
              <a className="dx-secondary" href="#how-it-works">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </div>
            <span className="dx-note">
              Free to use <span aria-hidden="true">·</span> No account needed
            </span>
            <div className="dx-hero-smallprint">
              <span className="dx-small-line" /> A LITTLE LESS CLOCK-WATCHING. A
              LITTLE MORE DOING.
            </div>
          </div>

          <div className="dx-hero-visual">
            <div className="dx-showcase-top">
              <span className="dx-showcase-label">
                A GLIMPSE OF YOUR NEXT SESSION
              </span>
              <span className="dx-showcase-live">
                <i aria-hidden="true" /> LIVE PREVIEW
              </span>
            </div>
            <div className="dx-preview-stage">
              <div
                className="dx-stage-orbit dx-stage-orbit--one"
                aria-hidden="true"
              />
              <div
                className="dx-stage-orbit dx-stage-orbit--two"
                aria-hidden="true"
              />
              <DevicePreview device={device} drink={drink} />
            </div>
            <div className="dx-preview-bottom">
              <div className="dx-toggle" aria-label="Device preview">
                <button
                  type="button"
                  aria-pressed={device === "desktop"}
                  onClick={() => chooseDevice("desktop")}
                >
                  ▣ <span>Desktop</span>
                </button>
                <button
                  type="button"
                  aria-pressed={device === "mobile"}
                  onClick={() => chooseDevice("mobile")}
                >
                  ▯ <span>Mobile</span>
                </button>
              </div>
              <span className="dx-preview-hint">
                A little window into your focus time.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="dx-any-screen" aria-labelledby="dx-any-screen-title">
        <div className="dx-any-screen-inner">
          <span className="dx-eyebrow">WHEREVER YOU SETTLE IN</span>
          <h2 id="dx-any-screen-title">
            Your focus goes
            <br />
            <em>where you go.</em>
          </h2>
          <p>
            At your desk or on your phone, your focus time feels familiar. One
            simple space to begin, wherever the day takes you.
          </p>
        </div>
        <div className="dx-any-screen-aside" aria-hidden="true">
          <span>01 / 03</span>
          <span className="dx-aside-rule" />
          <span>MAKE SPACE FOR FOCUS</span>
        </div>
      </section>

      <section
        className="dx-highlights"
        aria-label="Why Drizlo feels different"
      >
        {features.map((feature) => (
          <article className="dx-highlight-card" key={feature.number}>
            <div className="dx-card-top">
              <span className="dx-card-symbol" aria-hidden="true">
                {feature.symbol}
              </span>
              <span className="dx-card-index">{feature.number}</span>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section
        className="dx-how-shell"
        id="how-it-works"
        aria-labelledby="dx-how-title"
      >
        <div className="dx-how">
          <div className="dx-how-intro">
            <span className="dx-eyebrow">THE SIMPLE PART</span>
            <h2 id="dx-how-title">
              Three steps to
              <br />
              <em>finding your flow.</em>
            </h2>
            <p>
              Less time setting up. More time settling in. Getting started with
              Drizlo takes just a moment.
            </p>
            <Link href="/app" className="dx-inline-link" onClick={() => openTimer("how_it_works")}>
              Try a focus session <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="dx-steps">
            {steps.map((step, index) => (
              <div className="dx-step" key={step.title}>
                <span className="dx-step-number">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <span className="dx-step-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dx-faq" id="faq" aria-labelledby="dx-faq-title">
        <div className="dx-faq-heading">
          <span className="dx-eyebrow">THE DETAILS</span>
          <h2 id="dx-faq-title">
            Good questions.
            <br />
            <em>Simple answers.</em>
          </h2>
          <p>Everything you need to know before your first session.</p>
        </div>
        <div className="dx-faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="dx-final-cta">
        <div className="dx-final-decoration" aria-hidden="true">
          ✳
        </div>
        <span className="dx-eyebrow">A FRESH START IS ONE CLICK AWAY</span>
        <h2>
          Ready to get
          <br />
          <em>in the zone?</em>
        </h2>
        <p>Pick a scene, set your timer, and make this moment yours.</p>
        <Link href="/app" className="dx-primary" onClick={() => openTimer("final_cta")}>
          Start focusing <span aria-hidden="true">↗</span>
        </Link>
        <span className="dx-final-note">Free to use · No account needed</span>
      </section>

      <footer className="dx-footer-shell">
        <div className="dx-footer">
          <Link href="/" className="dx-brand">
            drizlo<span>.</span>
          </Link>
          <span>A different kind of focus timer.</span>
          <span>© {year} Drizlo</span>
        </div>
      </footer>
    </main>
  );
}
