"use client";

import { useEffect, useState } from "react";
import CoffeeScene from "@/components/CoffeeScene";

type TimerMode = "focus" | "break";

interface TimerSession {
  mode: TimerMode;
  duration: number;
  focusDuration: number;
  remaining: number;
  running: boolean;
  endsAt: number | null;
  completed: number;
}

const FOCUS = 25;
const BREAK = 5;

const STORAGE_KEY = "drizlo-session-v1";
const LEGACY_STORAGE_KEY = "drizzlo-session-v1";

const DEFAULT_SESSION: TimerSession = {
  mode: "focus",
  duration: FOCUS,
  focusDuration: FOCUS,
  remaining: FOCUS * 60,
  running: false,
  endsAt: null,
  completed: 0,
};

function readSession(): TimerSession {
  try {
    let stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      stored = localStorage.getItem(LEGACY_STORAGE_KEY);

      if (stored) {
        localStorage.setItem(STORAGE_KEY, stored);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }

    if (!stored) return { ...DEFAULT_SESSION };

    const saved = JSON.parse(stored) as Partial<TimerSession>;

    const focusDuration =
      typeof saved.focusDuration === "number" &&
      Number.isFinite(saved.focusDuration) &&
      saved.focusDuration > 0
        ? saved.focusDuration
        : FOCUS;

    const mode: TimerMode = saved.mode === "break" ? "break" : "focus";

    const duration = mode === "break" ? BREAK : focusDuration;

    const remaining =
      typeof saved.remaining === "number" && Number.isFinite(saved.remaining)
        ? Math.min(duration * 60, Math.max(0, saved.remaining))
        : duration * 60;

    const running =
      saved.running === true &&
      typeof saved.endsAt === "number" &&
      Number.isFinite(saved.endsAt);

    return {
      mode,
      duration,
      focusDuration,
      remaining,
      running,
      endsAt: running ? saved.endsAt! : null,
      completed:
        typeof saved.completed === "number" && Number.isFinite(saved.completed)
          ? Math.max(0, Math.floor(saved.completed))
          : 0,
    };
  } catch {
    return { ...DEFAULT_SESSION };
  }
}

export default function Home() {
  const [session, setSession] = useState<TimerSession | null>(null);
  const [now, setNow] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setNow(Date.now());
  }, []);

  useEffect(() => {
    if (!session) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!session?.running || session.endsAt === null) {
      return;
    }

    if (now < session.endsAt) return;

    const wasFocus = session.mode === "focus";

    setSession((current) => {
      if (
        !current ||
        !current.running ||
        current.endsAt === null ||
        now < current.endsAt
      ) {
        return current;
      }

      const nextMode: TimerMode = current.mode === "focus" ? "break" : "focus";

      const nextDuration =
        current.mode === "focus" ? BREAK : current.focusDuration;

      return {
        ...current,
        mode: nextMode,
        duration: nextDuration,
        remaining: nextDuration * 60,
        running: false,
        endsAt: null,
        completed: current.completed + (current.mode === "focus" ? 1 : 0),
      };
    });

    if (wasFocus) {
      setJustCompleted(true);
    }
  }, [now, session?.running, session?.endsAt, session?.mode]);

  useEffect(() => {
    if (!justCompleted) return;

    const timeout = window.setTimeout(() => {
      setJustCompleted(false);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [justCompleted]);

  if (!session) {
    return (
      <main className="scene">
        <div className="scene-overlay" />

        <header className="topbar">
          <div className="brand">
            drizlo<span>.</span>
          </div>
        </header>
      </main>
    );
  }

  const seconds =
    session.running && session.endsAt !== null
      ? Math.max(0, Math.ceil((session.endsAt - now) / 1000))
      : session.remaining;

  const totalSeconds = session.duration * 60;

  const progress =
    totalSeconds > 0 ? Math.min(1, Math.max(0, 1 - seconds / totalSeconds)) : 0;

  const progressPercent = progress * 100;

  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;

  const isFocus = session.mode === "focus";
  const isRunning = session.running;

  function toggleTimer(): void {
    setJustCompleted(false);

    setSession((current) => {
      if (!current) return current;

      if (current.running && current.endsAt !== null) {
        return {
          ...current,
          remaining: Math.max(
            0,
            Math.ceil((current.endsAt - Date.now()) / 1000),
          ),
          running: false,
          endsAt: null,
        };
      }

      if (current.remaining <= 0) return current;

      return {
        ...current,
        running: true,
        endsAt: Date.now() + current.remaining * 1000,
      };
    });
  }

  function reset(): void {
    setJustCompleted(false);

    setSession((current) => {
      if (!current) return current;

      return {
        ...current,
        remaining: current.duration * 60,
        running: false,
        endsAt: null,
      };
    });
  }

  function changeDuration(minutes: number): void {
    setJustCompleted(false);

    setSession((current) => {
      if (!current || current.mode !== "focus" || current.running) {
        return current;
      }

      return {
        ...current,
        duration: minutes,
        focusDuration: minutes,
        remaining: minutes * 60,
        running: false,
        endsAt: null,
      };
    });
  }

  function switchMode(): void {
    setJustCompleted(false);

    setSession((current) => {
      if (!current) return current;

      const nextMode: TimerMode = current.mode === "focus" ? "break" : "focus";

      const duration = nextMode === "focus" ? current.focusDuration : BREAK;

      return {
        ...current,
        mode: nextMode,
        duration,
        remaining: duration * 60,
        running: false,
        endsAt: null,
      };
    });
  }

  return (
    <main className="scene">
      <div className="scene-overlay" />

      <header className="topbar">
        <div className="brand">
          drizlo<span>.</span>
        </div>

        <div className="session-count">
          {session.completed}{" "}
          {session.completed === 1 ? "cup brewed" : "cups brewed"}
        </div>
      </header>

      <section className="workspace">
        {/* Coffee artwork on the left */}
        <div className="scene-stage">
          <CoffeeScene
            progress={progress}
            running={isRunning}
            mode={session.mode}
            completed={session.completed}
            justCompleted={justCompleted}
          />

          <div className="scene-label">
            {justCompleted
              ? "Another beautiful moment of focus."
              : isFocus
                ? isRunning
                  ? "A little progress, one drop at a time."
                  : "Your next moment of focus awaits."
                : "Your coffee is ready. Enjoy your break."}
          </div>
        </div>

        {/* Existing timer floating over the shared background */}
        <aside className="timer-panel">
          <span className="eyebrow">
            {isFocus ? "FOCUS SESSION" : "SHORT BREAK"}
          </span>

          <div className="time">{time}</div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>

          <p className="timer-description">
            {justCompleted
              ? "Beautifully done. Take a moment."
              : isFocus
                ? isRunning
                  ? "One drop at a time."
                  : "Ready when you are."
                : "Take a moment for yourself."}
          </p>

          <div className="controls">
            <button
              type="button"
              className="primary-button"
              onClick={toggleTimer}
            >
              {isRunning
                ? "Pause"
                : seconds < totalSeconds
                  ? "Resume"
                  : "Start"}
            </button>

            <button type="button" className="secondary-button" onClick={reset}>
              Reset
            </button>
          </div>

          <div className="durations">
            {[15, 25, 45, 60].map((minutes) => (
              <button
                type="button"
                key={minutes}
                disabled={!isFocus || isRunning}
                className={session.focusDuration === minutes ? "selected" : ""}
                onClick={() => changeDuration(minutes)}
              >
                {minutes}m
              </button>
            ))}
          </div>

          <button type="button" className="mode-button" onClick={switchMode}>
            Switch to {isFocus ? "break" : "focus"}
          </button>
        </aside>
      </section>

      <footer className="bottombar">
        <span>COFFEE SCENE</span>
        <span>Make time feel beautiful.</span>
      </footer>
    </main>
  );
}
