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
          <small>Keep your focus going.</small>
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
    <main className="dx" id="top">
      <header className="dx-nav">
        <Link href="/" className="dx-brand">drizlo<span>.</span></Link>
        <nav className="dx-nav-right" aria-label="Landing navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQ</a>
          <Link href="/app" className="dx-nav-cta">Open timer ↗</Link>
        </nav>
      </header>

      <section className="dx-hero">
        <div className="dx-hero-content">
          <span className="dx-eyebrow">A DIFFERENT KIND OF FOCUS TIMER</span>
          <h1>Focus feels<br /><em>different here.</em></h1>
          <p>A focus timer that brings your sessions to life. Watch coffee brew, tea steep, and animated scenes evolve as you make progress.</p>
          <div className="dx-actions">
            <Link className="dx-primary" href="/app">Start focusing <span>↗</span></Link>
            <a className="dx-secondary" href="#how-it-works">See how it works ↓</a>
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

      <section className="dx-any-screen" aria-labelledby="dx-any-screen-title">
        <div className="dx-any-screen-inner">
          <span className="dx-eyebrow">MADE FOR YOUR WORKSPACE</span>
          <h2 id="dx-any-screen-title">Your focus goes<br /><em>where you go.</em></h2>
          <p>At your desk or on your phone, Drizlo keeps your focus sessions moving. Same timer, same animated scenes, wherever you decide to work.</p>
          <a href="#top" className="dx-text-link">Explore the preview ↑</a>
        </div>
      </section>

      <section className="dx-highlights" aria-label="Why Drizlo feels different">
        <article className="dx-highlight-card">
          <span className="dx-card-symbol" aria-hidden="true">◷</span>
          <h3>Watch your progress unfold.</h3>
          <p>Your scene changes as your session moves forward. A different way to see the time you've put in.</p>
        </article>
        <article className="dx-highlight-card">
          <span className="dx-card-symbol" aria-hidden="true">☁</span>
          <h3>Set the mood for focus.</h3>
          <p>From brewing coffee to rainy evenings, choose an atmosphere that makes your workspace feel like yours.</p>
        </article>
        <article className="dx-highlight-card">
          <span className="dx-card-symbol" aria-hidden="true">✦</span>
          <h3>Just press start.</h3>
          <p>Choose your scene, set your timer, and get going. No complicated setup or account required.</p>
        </article>
      </section>

      <section className="dx-how" id="how-it-works" aria-labelledby="dx-how-title">
        <div className="dx-how-intro">
          <span className="dx-eyebrow">HOW IT WORKS</span>
          <h2 id="dx-how-title">Three steps to<br /><em>finding your flow.</em></h2>
          <p>Getting started is simple. Pick your atmosphere, choose how long you want to focus, and let Drizlo handle the countdown.</p>
        </div>
        <div className="dx-steps">
          <div className="dx-step"><span className="dx-step-number">01</span><div><h3>Choose your scene.</h3><p>Coffee brewing or tea steeping? Pick the atmosphere that suits your session.</p></div></div>
          <div className="dx-step"><span className="dx-step-number">02</span><div><h3>Set your focus time.</h3><p>Choose your session length and start the timer. Your scene progresses alongside you.</p></div></div>
          <div className="dx-step"><span className="dx-step-number">03</span><div><h3>Focus, then take a break.</h3><p>Work through your session, watch your progress unfold, and take a break when the timer ends.</p></div></div>
        </div>
      </section>

      <section className="dx-faq" id="faq" aria-labelledby="dx-faq-title">
        <div className="dx-faq-heading">
          <span className="dx-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2 id="dx-faq-title">Good questions.<br /><em>Simple answers.</em></h2>
          <p>A few things to know before getting started.</p>
        </div>
        <div className="dx-faq-list">
          <details><summary>Is Drizlo free to use?<span aria-hidden="true">+</span></summary><p>Yes. You can use the focus timer and currently available scenes for free.</p></details>
          <details><summary>Do I need an account?<span aria-hidden="true">+</span></summary><p>No. Just open Drizlo, choose a scene, and start your session.</p></details>
          <details><summary>Does Drizlo work on mobile?<span aria-hidden="true">+</span></summary><p>Yes. Drizlo works in your mobile browser. Dedicated Android and iOS apps are planned.</p></details>
          <details><summary>What happens when my timer finishes?<span aria-hidden="true">+</span></summary><p>Your focus session ends and you can switch to a break before starting again.</p></details>
          <details><summary>Can I customize my sessions?<span aria-hidden="true">+</span></summary><p>You can choose between available scenes and session lengths to suit how you work.</p></details>
        </div>
      </section>

      <section className="dx-final-cta">
        <span className="dx-eyebrow">YOUR NEXT SESSION STARTS HERE</span>
        <h2>Ready to get<br /><em>in the zone?</em></h2>
        <p>Pick a scene, set your timer, and see where your focus takes you.</p>
        <Link href="/app" className="dx-primary">Start focusing ↗</Link>
        <span className="dx-final-note">Free to use · No account needed</span>
      </section>

      <footer className="dx-footer">
        <Link href="/" className="dx-brand">drizlo<span>.</span></Link>
        <span>A different kind of focus timer.</span>
        <span>© <CopyrightYear /> Drizlo</span>
      </footer>
    </main>
  );
}
