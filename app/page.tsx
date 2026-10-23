import Link from "next/link";
import CoffeeScene from "@/components/CoffeeScene";
import CopyrightYear from "@/components/CopyrightYear";
import "./landing.css";

const features = [
  {
    number: "01",
    title: "Choose your moment",
    description: "Set aside 15, 25, 45, or 60 minutes. Make the time your own.",
  },
  {
    number: "02",
    title: "Watch it unfold",
    description:
      "As you focus, coffee slowly collects in the carafe. One drop at a time.",
  },
  {
    number: "03",
    title: "Enjoy the pause",
    description: "A gentle sound lets you know when it's time for a break.",
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
            <span className="landing-kicker-dot" /> A LITTLE SPACE TO FOCUS
          </p>
          <h1 id="landing-heading">
            Make time
            <br />
            <em>feel beautiful.</em>
          </h1>
          <p className="landing-lede">
            A quiet corner for the things that matter. Set a timer, watch your
            coffee brew, and let the minutes find their rhythm.
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
            <span className="landing-live-dot" /> A moment in the making{" "}
            <span>☕</span>
          </div>
        </div>
        <div className="landing-hero-footnote">
          SLOW DOWN. SETTLE IN. BEGIN.
        </div>
      </section>

      <section
        id="how-it-works"
        className="landing-how"
        aria-labelledby="landing-how-heading"
      >
        <div className="landing-section-heading">
          <p className="landing-kicker">SIMPLE BY DESIGN</p>
          <h2 id="landing-how-heading">
            A little focus.
            <br />
            <em>A lovely difference.</em>
          </h2>
          <p>
            Nothing to organize. Nothing to keep up with. Just you, your time,
            and a coffee slowly brewing.
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
        <p className="landing-kicker">YOUR TIME IS YOURS</p>
        <h2 id="landing-close-heading">
          Ready for a<br />
          <em>beautiful moment?</em>
        </h2>
        <p>The coffee is waiting.</p>
        <Link className="landing-button landing-button-primary" href="/app">
          Open Drizlo <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <footer className="landing-footer">
        <Link className="landing-brand" href="/">
          drizlo<span>.</span>
        </Link>
        <span>Make time feel beautiful.</span>
        <span>
          © <CopyrightYear /> Drizlo
        </span>{" "}
      </footer>
    </main>
  );
}
