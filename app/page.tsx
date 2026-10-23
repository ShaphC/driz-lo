"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CoffeeScene from "@/components/CoffeeScene";
import TeaScene from "@/components/TeaScene";
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
  return (
    <div
      className={`dx-device dx-device--${device}`}
      aria-label={`${device} preview of Drizlo ${drink} timer`}
    >
      <div className="dx-device-top">
        <span className="dx-device-title">drizlo.</span>
        <span className="dx-device-meta">
          {device === "mobile" ? "9:41" : "↗"}
        </span>
      </div>
      <div className="dx-screen">
        <Scene drink={drink} />
        <div className="dx-timer-preview">
          <span className="dx-timer-label">FOCUS TIME</span>
          <strong>14:32</strong>
          <small>One moment at a time.</small>
          <span className="dx-play" aria-hidden="true">
            Ⅱ
          </span>
        </div>
      </div>
      {device === "mobile" && <div className="dx-home-bar" />}
    </div>
  );
}

function CopyrightYear() {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}

export default function LandingPage() {
  const [device, setDevice] = useState<Device>("desktop");
  const [drink, setDrink] = useState<Drink>("coffee");
  const [autoCycle, setAutoCycle] = useState(true);

  useEffect(() => {
    if (!autoCycle) return;
    const interval = window.setInterval(() => {
      setDevice((previous) => (previous === "desktop" ? "mobile" : "desktop"));
    }, 6500);
    return () => window.clearInterval(interval);
  }, [autoCycle]);

  function chooseDevice(next: Device) {
    setDevice(next);
    setAutoCycle(false);
  }

  return (
    <main className="dx" id="top">
      <header className="dx-nav">
        <Link href="/" className="dx-brand">
          drizlo<span>.</span>
        </Link>
        <nav className="dx-nav-right" aria-label="Landing navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQ</a>
          <Link href="/app" className="dx-nav-cta">
            Open timer ↗
          </Link>
        </nav>
      </header>

      <section className="dx-hero">
        <div className="dx-hero-content">
          <span className="dx-eyebrow">YOUR LITTLE CORNER OF CALM</span>
          <h1>
            Make time
            <br />
            <em>feel beautiful.</em>
          </h1>
          <p>
            A cozy focus timer that brews alongside you. Find your pace, enjoy
            the pause, and begin again.
          </p>
          <div className="dx-actions">
            <Link className="dx-primary" href="/app">
              Start focusing <span>↗</span>
            </Link>
            <a className="dx-secondary" href="#how-it-works">
              Discover Drizlo ↓
            </a>
          </div>
          <span className="dx-note">Free to use · No account needed</span>
        </div>

        <div className="dx-hero-visual">
          <div className="dx-preview-stage">
            <DevicePreview device={device} drink={drink} />
          </div>
          <div className="dx-preview-controls">
            <div className="dx-toggle" aria-label="Device preview">
              <button
                type="button"
                aria-pressed={device === "desktop"}
                onClick={() => chooseDevice("desktop")}
              >
                ▣ Desktop
              </button>
              <button
                type="button"
                aria-pressed={device === "mobile"}
                onClick={() => chooseDevice("mobile")}
              >
                ▯ Mobile
              </button>
              <button
                type="button"
                className="dx-auto"
                aria-pressed={autoCycle}
                onClick={() => setAutoCycle((v) => !v)}
                title="Automatically switch devices"
              >
                {autoCycle ? "Ⅱ Auto" : "▶ Auto"}
              </button>
            </div>
            <div className="dx-toggle" aria-label="Drink preview">
              <button
                type="button"
                aria-pressed={drink === "coffee"}
                onClick={() => setDrink("coffee")}
              >
                ☕ Coffee
              </button>
              <button
                type="button"
                aria-pressed={drink === "tea"}
                onClick={() => setDrink("tea")}
              >
                🍵 Tea
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="dx-highlights"
        aria-label="Why Drizlo feels different"
      >
        <article className="dx-highlight-card">
          <span className="dx-card-symbol" aria-hidden="true">
            ☕
          </span>
          <h3>Watch your focus grow.</h3>
          <p>
            As you work, your coffee brews or your tea steeps. A little progress
            you can see.
          </p>
        </article>
        <article className="dx-highlight-card">
          <span className="dx-card-symbol" aria-hidden="true">
            ☁
          </span>
          <h3>Enjoy the atmosphere.</h3>
          <p>
            Quiet café sunsets and rainy evenings bring a softer feeling to your
            day.
          </p>
        </article>
        <article className="dx-highlight-card">
          <span className="dx-card-symbol" aria-hidden="true">
            ✦
          </span>
          <h3>Begin in a moment.</h3>
          <p>
            Choose a session length, press start, and settle in. No account
            needed.
          </p>
        </article>
      </section>

      <section
        className="dx-how"
        id="how-it-works"
        aria-labelledby="dx-how-title"
      >
        <div className="dx-how-intro">
          <span className="dx-eyebrow">HOW IT WORKS</span>
          <h2 id="dx-how-title">
            A simpler way
            <br />
            <em>to settle in.</em>
          </h2>
          <p>
            No complicated setup. Just a quiet place to focus, with a little
            something to look forward to.
          </p>
        </div>
        <div className="dx-steps">
          <div className="dx-step">
            <span className="dx-step-number">01</span>
            <div>
              <h3>Choose your atmosphere.</h3>
              <p>Start with a warm café sunset or a peaceful rainy evening.</p>
            </div>
          </div>
          <div className="dx-step">
            <span className="dx-step-number">02</span>
            <div>
              <h3>Set your focus time.</h3>
              <p>
                Pick a session length and watch your drink gradually come to
                life.
              </p>
            </div>
          </div>
          <div className="dx-step">
            <span className="dx-step-number">03</span>
            <div>
              <h3>Take a well-earned break.</h3>
              <p>
                When your focus session ends, slow down and enjoy the pause.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dx-any-screen" aria-labelledby="dx-any-screen-title">
        <div className="dx-screen-decoration" aria-hidden="true">
          <span className="dx-screen-decoration-window">
            <span>☁</span>
            <span>☕</span>
          </span>
          <span className="dx-screen-decoration-phone">
            <span>🍵</span>
          </span>
        </div>
        <div className="dx-any-screen-inner">
          <span className="dx-eyebrow">SAME CALM, ANY SCREEN</span>
          <h2 id="dx-any-screen-title">
            Your focus goes
            <br />
            <em>where you go.</em>
          </h2>
          <p>
            See how Drizlo looks on a desktop or a phone. Switch drinks to
            discover a different atmosphere.
          </p>
          <a href="#top" className="dx-text-link">
            Explore the preview ↑
          </a>
        </div>
      </section>

      <section className="dx-faq" id="faq" aria-labelledby="dx-faq-title">
        <div className="dx-faq-heading">
          <span className="dx-eyebrow">GOOD TO KNOW</span>
          <h2 id="dx-faq-title">
            A few little
            <br />
            <em>questions.</em>
          </h2>
          <p>Everything you need to know before your first focus session.</p>
        </div>
        <div className="dx-faq-list">
          <details>
            <summary>
              Is Drizlo free to use?<span aria-hidden="true">+</span>
            </summary>
            <p>
              Yes. You can use the focus timer and the available scenes for
              free.
            </p>
          </details>
          <details>
            <summary>
              Do I need to create an account?<span aria-hidden="true">+</span>
            </summary>
            <p>
              No. Open Drizlo and start focusing right away, without signing up.
            </p>
          </details>
          <details>
            <summary>
              Can I use it on my phone?<span aria-hidden="true">+</span>
            </summary>
            <p>
              Yes. Drizlo works in a mobile browser as well as on desktop. A
              separate mobile app is planned for later.
            </p>
          </details>
          <details>
            <summary>
              What happens when my focus session ends?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              Drizlo lets you know the session is complete. You can then take a
              break and watch your drink wind down.
            </p>
          </details>
          <details>
            <summary>
              Can I change the scene or session length?
              <span aria-hidden="true">+</span>
            </summary>
            <p>
              Yes. Choose Coffee or Tea and select a focus length that works for
              you.
            </p>
          </details>
        </div>
      </section>

      <section className="dx-final-cta">
        <span className="dx-eyebrow">YOUR NEXT MOMENT STARTS HERE</span>
        <h2>
          Make room for
          <br />
          <em>a little calm.</em>
        </h2>
        <p>Your coffee is waiting. So is your next moment of focus.</p>
        <Link href="/app" className="dx-primary">
          Start focusing ↗
        </Link>
        <span className="dx-final-note">Free to use · No account needed</span>
      </section>

      <footer className="dx-footer">
        <Link href="/" className="dx-brand">
          drizlo<span>.</span>
        </Link>
        <span>Make time feel beautiful.</span>
        <span>
          © <CopyrightYear /> Drizlo
        </span>
      </footer>
    </main>
  );
}
