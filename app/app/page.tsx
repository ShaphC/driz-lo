"use client";

import { useEffect, useRef, useState } from "react";
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
const SOUND_KEY = "drizlo-sound-enabled-v1";

function playChime(kind: "start" | "focus-end" | "break-end") {
  try {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const tones =
      kind === "start"
        ? [523.25]
        : kind === "focus-end"
          ? [659.25, 783.99]
          : [523.25, 392];
    const start = context.currentTime + 0.02;
    tones.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const at = start + index * 0.22;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.075, at + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.3);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.32);
    });
    window.setTimeout(() => void context.close(), 1100);
  } catch {
    /* Audio is optional; unsupported or blocked devices stay silent. */
  }
}

function notifyCompletion(mode: TimerMode) {
  if (
    typeof Notification === "undefined" ||
    Notification.permission !== "granted"
  )
    return;
  try {
    new Notification(
      mode === "focus" ? "Focus complete ☕" : "Break complete",
      {
        body:
          mode === "focus"
            ? "Beautifully done. Your break is ready."
            : "Ready for another moment of focus?",
        tag: "drizlo-timer-finished",
      },
    );
  } catch {
    /* Some mobile browsers disallow page-created notifications. */
  }
}

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
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const completedEndRef = useRef<number | null>(null);

  useEffect(() => {
    setSession(readSession());
    setNow(Date.now());
    try {
      setSoundEnabled(localStorage.getItem(SOUND_KEY) !== "false");
    } catch {
      /* ignore */
    }
    setNotificationsEnabled(
      typeof Notification !== "undefined" &&
        Notification.permission === "granted",
    );
  }, []);
  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const interval = window.setInterval(refresh, 250);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, []);
  useEffect(() => {
    if (!session?.running || session.endsAt === null || now < session.endsAt)
      return;
    // A deadline is authoritative, even if the tab was asleep for hours.
    // Guard the side effects against repeated renders and React Strict Mode.
    if (completedEndRef.current === session.endsAt) return;
    completedEndRef.current = session.endsAt;
    const finishedMode = session.mode;
    if (soundEnabled)
      playChime(finishedMode === "focus" ? "focus-end" : "break-end");
    notifyCompletion(finishedMode);
    setSession((current) => {
      if (!current?.running || current.endsAt === null || now < current.endsAt)
        return current;
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
    if (finishedMode === "focus") setJustCompleted(true);
  }, [now, session?.running, session?.endsAt, session?.mode, soundEnabled]);
  useEffect(() => {
    if (!justCompleted) return;
    const timeout = window.setTimeout(() => setJustCompleted(false), 3500);
    return () => window.clearTimeout(timeout);
  }, [justCompleted]);

  if (!session)
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

  const seconds =
    session.running && session.endsAt !== null
      ? Math.max(0, Math.ceil((session.endsAt - now) / 1000))
      : session.remaining;
  const totalSeconds = session.duration * 60;
  const progress =
    totalSeconds > 0 ? Math.min(1, Math.max(0, 1 - seconds / totalSeconds)) : 0;
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const isFocus = session.mode === "focus";
  const isRunning = session.running;
  const actionLabel = isRunning
    ? "Pause"
    : seconds < totalSeconds
      ? "Resume"
      : "Start";

  function toggleTimer(): void {
    setJustCompleted(false);
    if (!isRunning && seconds > 0 && soundEnabled) playChime("start");
    setSession((current) => {
      if (!current) return current;
      if (current.running && current.endsAt !== null)
        return {
          ...current,
          remaining: Math.max(
            0,
            Math.ceil((current.endsAt - Date.now()) / 1000),
          ),
          running: false,
          endsAt: null,
        };
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
    setSession((current) =>
      current
        ? {
            ...current,
            remaining: current.duration * 60,
            running: false,
            endsAt: null,
          }
        : current,
    );
  }
  function changeDuration(minutes: number): void {
    setJustCompleted(false);
    setSession((current) => {
      if (!current || current.mode !== "focus" || current.running)
        return current;
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

  function toggleSound(): void {
    setSoundEnabled((current) => {
      try {
        localStorage.setItem(SOUND_KEY, String(!current));
      } catch {
        /* ignore */
      }
      return !current;
    });
  }

  async function enableNotifications(): Promise<void> {
    if (typeof Notification === "undefined" || !window.isSecureContext) return;
    try {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
    } catch {
      setNotificationsEnabled(false);
    }
  }

  const preferences = (prefix: string) => (
    <div className="timer-preferences" aria-label="Timer preferences">
      <button
        type="button"
        className="sound-toggle"
        aria-pressed={soundEnabled}
        onClick={toggleSound}
      >
        {soundEnabled ? "Sound on" : "Sound off"}
      </button>
      <button
        type="button"
        className="notification-toggle"
        onClick={() => void enableNotifications()}
        disabled={
          notificationsEnabled ||
          typeof Notification === "undefined" ||
          !window.isSecureContext ||
          Notification.permission === "denied"
        }
      >
        {notificationsEnabled
          ? "Notifications on"
          : typeof Notification === "undefined" || !window.isSecureContext
            ? "Notifications unavailable"
            : Notification.permission === "denied"
              ? "Notifications blocked"
              : "Enable notifications"}
      </button>
    </div>
  );

  const durationControls = (prefix: string) => (
    <div className="durations" role="group" aria-label="Focus duration">
      {[15, 25, 45, 60].map((minutes) => (
        <button
          type="button"
          key={`${prefix}-${minutes}`}
          disabled={!isFocus || isRunning}
          aria-pressed={isFocus && session.focusDuration === minutes}
          className={session.focusDuration === minutes ? "selected" : ""}
          onClick={() => changeDuration(minutes)}
        >
          {minutes}m
        </button>
      ))}
    </div>
  );

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

        {/* Desktop: unchanged glass timer card. */}
        <aside
          className="timer-panel desktop-timer"
          aria-label="Timer controls"
        >
          <span className="eyebrow">
            {isFocus ? "FOCUS SESSION" : "SHORT BREAK"}
          </span>
          <div className="time">{time}</div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress * 100}%` }}
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
              {actionLabel}
            </button>
            <button type="button" className="secondary-button" onClick={reset}>
              Reset
            </button>
          </div>
          {durationControls("desktop")}
          {preferences("desktop")}
          <button type="button" className="mode-button" onClick={switchMode}>
            Switch to {isFocus ? "break" : "focus"}
          </button>
        </aside>

        {/* Mobile: visible timer, no hidden scrolling card. */}
        <section className="mobile-timer" aria-label="Focus timer">
          <span className="eyebrow">
            {isFocus ? "FOCUS SESSION" : "SHORT BREAK"}
          </span>
          <div className="mobile-time" role="timer" aria-live="off">
            {time}
          </div>
          <div className="mobile-progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="mobile-timer-description">
            {justCompleted
              ? "Beautifully done. Take a moment."
              : isFocus
                ? isRunning
                  ? "One drop at a time."
                  : "Ready when you are."
                : "Take a moment for yourself."}
          </p>
          <div className="mobile-timer-actions">
            <button
              type="button"
              className="primary-button"
              onClick={toggleTimer}
            >
              {actionLabel}
            </button>
            <button type="button" className="secondary-button" onClick={reset}>
              Reset
            </button>
          </div>
          <button
            type="button"
            className="mobile-settings-toggle"
            aria-expanded={mobileSettingsOpen}
            aria-controls="mobile-timer-settings"
            onClick={() => setMobileSettingsOpen((open) => !open)}
          >
            <span>More timer options</span>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              className={
                mobileSettingsOpen ? "mobile-chevron is-open" : "mobile-chevron"
              }
            >
              <path
                d="m5 9 7 7 7-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </section>
      </section>

      {/* Mobile bottom drawer: overlays the scene instead of shifting the brewer. */}
      {mobileSettingsOpen && (
        <div
          className="mobile-settings-backdrop"
          onClick={() => setMobileSettingsOpen(false)}
        >
          <section
            id="mobile-timer-settings"
            className="mobile-settings-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Timer settings"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-drawer-heading">
              <span>Timer settings</span>
              <button
                type="button"
                onClick={() => setMobileSettingsOpen(false)}
                aria-label="Close timer settings"
              >
                ✕
              </button>
            </div>
            <p className="mobile-drawer-label">
              {isFocus
                ? "FOCUS DURATION"
                : "FOCUS DURATION · AVAILABLE IN FOCUS MODE"}
            </p>
            {durationControls("mobile")}
            {preferences("mobile")}
            <button
              type="button"
              className="mode-button"
              onClick={() => {
                switchMode();
                setMobileSettingsOpen(false);
              }}
            >
              Switch to {isFocus ? "break" : "focus"}
            </button>
          </section>
        </div>
      )}

      <footer className="bottombar">
        <span>COFFEE SCENE</span>
        <span>Make time feel beautiful.</span>
      </footer>
    </main>
  );
}
