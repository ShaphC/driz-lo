"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CoffeeScene from "@/components/CoffeeScene";
import TeaScene from "@/components/TeaScene";
import "./landing-experiments.css";

type Device = "desktop" | "mobile";
type Drink = "coffee" | "tea";

function Scene({ drink }: { drink: Drink }) {
  const props = { progress: 0.55, running: true, mode: "focus" as const, completed: 0 };
  return (
    <div className="dx-scene" aria-hidden="true">
      {drink === "coffee" ? <CoffeeScene {...props} /> : <TeaScene {...props} />}
    </div>
  );
}

function DevicePreview({ device, drink }: { device: Device; drink: Drink }) {
  return (
    <div className={`dx-device dx-device--${device}`} aria-label={`${device} preview of Drizlo ${drink} timer`}>
      <div className="dx-device-top">
        <span className="dx-device-title">drizlo.</span>
        <span className="dx-device-meta">{device === "mobile" ? "9:41" : "↗"}</span>
      </div>
      <div className="dx-screen">
        <Scene drink={drink} />
        <div className="dx-timer-preview">
          <span className="dx-timer-label">FOCUS TIME</span>
          <strong>14:32</strong>
          <small>One moment at a time.</small>
          <span className="dx-play" aria-hidden="true">Ⅱ</span>
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
      setDevice((previous) => previous === "desktop" ? "mobile" : "desktop");
    }, 6500);
    return () => window.clearInterval(interval);
  }, [autoCycle]);

  function chooseDevice(next: Device) {
    setDevice(next);
    setAutoCycle(false);
  }

  return (
    <main className="dx">
      <header className="dx-nav">
        <Link href="/" className="dx-brand">drizlo<span>.</span></Link>
        <nav className="dx-nav-right" aria-label="Landing navigation">
          <a href="#about">About</a>
          <Link href="/app" className="dx-nav-cta">Open timer ↗</Link>
        </nav>
      </header>

      <section className="dx-hero">
        <div className="dx-hero-content">
          <span className="dx-eyebrow">YOUR LITTLE CORNER OF CALM</span>
          <h1>Make time<br /><em>feel beautiful.</em></h1>
          <p>A cozy focus timer that brews alongside you. Find your pace, enjoy the pause, and begin again.</p>
          <div className="dx-actions">
            <Link className="dx-primary" href="/app">Start focusing <span>↗</span></Link>
            <a className="dx-secondary" href="#about">Discover Drizlo ↓</a>
          </div>
          <span className="dx-note">Free to use · No account needed</span>
        </div>

        <div className="dx-hero-visual">
          <div className="dx-preview-stage">
            <DevicePreview device={device} drink={drink} />
          </div>
          <div className="dx-preview-controls">
            <div className="dx-toggle" aria-label="Device preview">
              <button type="button" aria-pressed={device === "desktop"} onClick={() => chooseDevice("desktop")}>▣ Desktop</button>
              <button type="button" aria-pressed={device === "mobile"} onClick={() => chooseDevice("mobile")}>▯ Mobile</button>
              <button type="button" className="dx-auto" aria-pressed={autoCycle} onClick={() => setAutoCycle(v => !v)} title="Automatically switch devices">{autoCycle ? "Ⅱ Auto" : "▶ Auto"}</button>
            </div>
            <div className="dx-toggle" aria-label="Drink preview">
              <button type="button" aria-pressed={drink === "coffee"} onClick={() => setDrink("coffee")}>☕ Coffee</button>
              <button type="button" aria-pressed={drink === "tea"} onClick={() => setDrink("tea")}>🍵 Tea</button>
            </div>
          </div>
        </div>
      </section>

      <section className="dx-highlights" aria-label="Why Drizlo feels different">
        <article className="dx-highlight-card">
          <span className="dx-card-symbol" aria-hidden="true">☕</span>
          <h3>Watch your focus grow.</h3>
          <p>As you work, your coffee brews or your tea steeps. A little progress you can see.</p>
        </article>
        <article className="dx-highlight-card">
          <span className="dx-card-symbol" aria-hidden="true">☁</span>
          <h3>Enjoy the atmosphere.</h3>
          <p>Quiet café sunsets and rainy evenings bring a softer feeling to your day.</p>
        </article>
        <article className="dx-highlight-card">
          <span className="dx-card-symbol" aria-hidden="true">✦</span>
          <h3>Begin in a moment.</h3>
          <p>Choose a session length, press start, and settle in. No account needed.</p>
        </article>
      </section>

      <section className="dx-any-screen" aria-labelledby="dx-any-screen-title">
        <span className="dx-eyebrow">SAME CALM, ANY SCREEN</span>
        <h2 id="dx-any-screen-title">Your focus goes<br /><em>where you go.</em></h2>
        <p>See how Drizlo looks on a desktop or a phone. Switch drinks to discover a different atmosphere.</p>
      </section>

      <section className="dx-about" id="about">
        <span className="dx-eyebrow">FOCUS, THEN UNWIND</span>
        <h2>A little more calm<br /><em>in every session.</em></h2>
        <p>Watch your coffee brew or your tea steep while you focus. When it is time for a break, enjoy your drink as the timer winds down.</p>
        <Link href="/app" className="dx-primary">Try Drizlo ↗</Link>
      </section>

      <footer className="dx-footer">
        <Link href="/" className="dx-brand">drizlo<span>.</span></Link>
        <span>Make time feel beautiful.</span>
        <span>© <CopyrightYear /> Drizlo</span>
      </footer>
    </main>
  );
}
