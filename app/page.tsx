import Link from "next/link";
import CoffeeScene from "@/components/CoffeeScene";
import CopyrightYear from "@/components/CopyrightYear";
import "./landing.css";

const features = [
  {
    number: "01",
    title: "Choose your scene",
    description:
      "Pick an atmosphere and set aside 15, 25, 45, or 60 minutes to focus.",
  },
  {
    number: "02",
    title: "Watch your progress unfold",
    description:
      "Your animated scene evolves as your session moves forward. See your progress without watching the clock.",
  },
  {
    number: "03",
    title: "Focus, then take a break",
    description:
      "Stay with your task until the timer ends, then take a well-earned break.",
  },
];

export default function LandingPage() {
  return (
    <main className="landing">
      <header className="landing-nav">
        <Link className="landing-brand" href="/" aria-label="Drizlo home">
          drizlo<span>.</span>
        </Link>
        <nav aria-label="Main navigation" className="landing-nav-links">
          <a href="#how-it-works">How it works</a>
          <Link className="landing-nav-cta" href="/app">
            Open timer <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="landing-heading">
        <div className="landing-hero-copy">
          <p className="landing-kicker">
            <span className="landing-kicker-dot" /> A DIFFERENT KIND OF FOCUS TIMER
          </p>
          <h1 id="landing-heading">
            Focus feels
            <br />
            <em>different here.</em>
          </h1>
          <p className="landing-lede">
            A focus timer that brings your sessions to life. Watch animated
            scenes evolve as you make progress, one session at a time.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-button landing-button-primary" href="/app">
              Start focusing <span aria-hidden="true">↗</span>
            </Link>
            <a className="landing-text-link" href="#how-it-works">
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="landing-free-note">Free to use · No account needed</p>
        </div>
        <div
          className="landing-art"
          aria-label="Illustrated sunset café with a brewing coffee carafe"
        >
          <div className="landing-art-scene" aria-hidden="true">
            <CoffeeScene progress={0.43} running mode="focus" completed={0} />
          </div>
          <div className="landing-art-caption">
            <span className="landing-live-dot" /> Focus in progress{" "}
            <span>☕</span>
          </div>
        </div>
        <div className="landing-hero-footnote">
          CHOOSE A SCENE. SET YOUR TIME. GET FOCUSED.
        </div>
      </section>

      <section
        id="how-it-works"
        className="landing-how"
        aria-labelledby="landing-how-heading"
      >
        <div className="landing-section-heading">
          <p className="landing-kicker">HOW IT WORKS</p>
          <h2 id="landing-how-heading">
            Three steps to
            <br />
            <em>finding your flow.</em>
          </h2>
          <p>
            Getting started is simple. Choose an atmosphere, set your focus
            time, and let Drizlo handle the countdown.
          </p>
        </div>
        <div className="landing-steps">
          {features.map((feature) => (
            <article className="landing-step" key={feature.number}>
              <span className="landing-step-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="landing-close"
        aria-labelledby="landing-close-heading"
      >
        <div className="landing-close-glow" aria-hidden="true" />
        <p className="landing-kicker">YOUR NEXT SESSION STARTS HERE</p>
        <h2 id="landing-close-heading">
          Ready to get<br />
          <em>in the zone?</em>
        </h2>
        <p>Pick a scene, set your timer, and see where your focus takes you.</p>
        <Link className="landing-button landing-button-primary" href="/app">
          Start focusing <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <footer className="landing-footer">
        <Link className="landing-brand" href="/">
          drizlo<span>.</span>
        </Link>
        <span>A different kind of focus timer.</span>
        <span>
          © <CopyrightYear /> Drizlo
        </span>{" "}
      </footer>
    </main>
  );
}
