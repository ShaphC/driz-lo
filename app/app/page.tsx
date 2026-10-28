"use client";

import { useEffect, useRef, useState } from "react";
import CoffeeScene from "@/components/CoffeeScene";
import TeaScene from "@/components/TeaScene";
import "./scene-selector.css";

type TimerMode = "focus" | "break";
interface TimerSession {
  mode: TimerMode;
  duration: number;
  focusDuration: number;
  remaining: number;
  running: boolean;
  endsAt: number | null;
  completed: number;
  roundsInSet: number;
  setFinished: boolean;
}
const FOCUS = 25;
const BREAK = 5;
const STORAGE_KEY = "drizlo-session-v1";
const LEGACY_STORAGE_KEY = "drizzlo-session-v1";
const SOUND_KEY = "drizlo-sound-enabled-v1";
const AMBIENCE_KEY = "drizlo-ambience-enabled-v1";
const SCENE_KEY = "drizlo-scene-v1";
type SceneChoice = "coffee" | "tea";

function playChime(kind: "start" | "focus-end" | "break-end") {
  try {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const tones = kind === "start" ? [523.25] : kind === "focus-end" ? [659.25, 783.99] : [523.25, 392];
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
  } catch { /* Audio is optional; unsupported or blocked devices stay silent. */ }
}

function playCountdownTick(second: number) {
  try {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    if (context.state === "suspended") void context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const at = context.currentTime + 0.01;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(second <= 3 ? 880 : 660, at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.06, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.12);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + 0.13);
    oscillator.onended = () => { void context.close(); };
  } catch { /* Browser may restrict background audio. */ }
}


// Soft, locally generated rain-like ambience. No external audio files or network requests.
function startAmbience(): { stop: () => void } | null {
  try {
    const context = new AudioContext();
    const seconds = 3;
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const data = buffer.getChannelData(0);
    let brown = 0;
    for (let i = 0; i < data.length; i++) {
      brown = (brown + (Math.random() * 2 - 1) * 0.04) * 0.995;
      data[i] = brown * 0.9;
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 850;
    const gain = context.createGain();
    gain.gain.value = 0.12;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    void context.resume().catch(() => {});
    return { stop: () => {
      try { source.stop(); } catch { /* already stopped */ }
      void context.close().catch(() => {});
    } };
  } catch { return null; }
}

function notifyCompletion(mode: TimerMode) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  try {
    new Notification(mode === "focus" ? "Focus complete ☕" : "Break complete", {
      body: mode === "focus" ? "Beautifully done. Your break is ready." : "Ready for another moment of focus?",
      tag: "drizlo-timer-finished",
    });
  } catch { /* Some mobile browsers disallow page-created notifications. */ }
}

const DEFAULT_SESSION: TimerSession = {
  mode: "focus", duration: FOCUS, focusDuration: FOCUS,
  remaining: FOCUS * 60, running: false, endsAt: null, completed: 0,
  roundsInSet: 0, setFinished: false,
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
      typeof saved.focusDuration === "number" && Number.isFinite(saved.focusDuration) && saved.focusDuration > 0
        ? saved.focusDuration : FOCUS;
    const mode: TimerMode = saved.mode === "break" ? "break" : "focus";
    const duration = mode === "break" ? BREAK : focusDuration;
    const remaining = typeof saved.remaining === "number" && Number.isFinite(saved.remaining)
      ? Math.min(duration * 60, Math.max(0, saved.remaining)) : duration * 60;
    const running = saved.running === true && typeof saved.endsAt === "number" && Number.isFinite(saved.endsAt);
    return {
      mode, duration, focusDuration, remaining, running,
      endsAt: running ? saved.endsAt! : null,
      completed: typeof saved.completed === "number" && Number.isFinite(saved.completed)
        ? Math.max(0, Math.floor(saved.completed)) : 0,
      roundsInSet: typeof saved.roundsInSet === "number" && Number.isFinite(saved.roundsInSet)
        ? Math.min(2, Math.max(0, Math.floor(saved.roundsInSet))) : 0,
      setFinished: saved.setFinished === true,
    };
  } catch {
    return { ...DEFAULT_SESSION };
  }
}

export default function Home() {
  const [session, setSession] = useState<TimerSession | null>(null);
  const [sceneChoice, setSceneChoice] = useState<SceneChoice>("coffee");
  const [now, setNow] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambienceEnabled, setAmbienceEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const completedEndRef = useRef<number | null>(null);
  const lastCountdownTickRef = useRef<string | null>(null);

  useEffect(() => {
    setSession(readSession());
    try { setSceneChoice(localStorage.getItem(SCENE_KEY) === "tea" ? "tea" : "coffee"); } catch { /* ignore */ }
    setNow(Date.now());
    try { setSoundEnabled(localStorage.getItem(SOUND_KEY) !== "false"); } catch { /* ignore */ }
    try { setAmbienceEnabled(localStorage.getItem(AMBIENCE_KEY) === "true"); } catch { /* ignore */ }
    setNotificationsEnabled(typeof Notification !== "undefined" && Notification.permission === "granted");
  }, []);
  useEffect(() => { if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); }, [session]);
  // Ambience is independent from alert sounds and stops on pause, completion, or unmount.
  useEffect(() => {
    if (!ambienceEnabled || !session?.running) return;
    const audio = startAmbience();
    return () => audio?.stop();
  }, [ambienceEnabled, session?.running]);

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
    if (!session?.running || session.endsAt === null || !soundEnabled || now <= 0) return;
    const secondsLeft = Math.ceil((session.endsAt - now) / 1000);
    if (secondsLeft < 1 || secondsLeft > 10) return;
    // Key by deadline and second so re-renders cannot repeat a tick.
    const key = `${session.endsAt}:${secondsLeft}`;
    if (lastCountdownTickRef.current === key) return;
    lastCountdownTickRef.current = key;
    playCountdownTick(secondsLeft);
  }, [now, session?.running, session?.endsAt, soundEnabled]);

  useEffect(() => {
    if (!session?.running || session.endsAt === null || now < session.endsAt) return;
    if (completedEndRef.current === session.endsAt) return;
    completedEndRef.current = session.endsAt;
    const completedDeadline = session.endsAt;

    // Advance using scheduled deadlines, not the time the browser woke up.
    // This also handles sleeping tabs and reloads without extending a break.
    let next = { ...session };
    const events: TimerMode[] = [];
    let finishedFocus = false;
    while (next.running && next.endsAt !== null && now >= next.endsAt) {
      const boundary = next.endsAt;
      events.push(next.mode);
      if (next.mode === "focus") {
        finishedFocus = true;
        next.completed += 1;
        next.roundsInSet += 1;
        next.mode = "break";
        next.duration = BREAK;
        next.remaining = BREAK * 60;
        next.endsAt = boundary + BREAK * 60_000;
      } else if (next.roundsInSet >= 2) {
        next = {
          ...next, running: false, endsAt: null, remaining: 0,
          setFinished: true,
        };
      } else {
        next.mode = "focus";
        next.duration = next.focusDuration;
        next.remaining = next.duration * 60;
        next.endsAt = boundary + next.duration * 60_000;
      }
    }
    if (soundEnabled && events.length > 0) {
      const last = events[events.length - 1];
      playChime(last === "focus" ? "focus-end" : "break-end");
    }
    if (events.length > 0) notifyCompletion(events[events.length - 1]);
    if (finishedFocus) setJustCompleted(true);
    setSession((current) => {
      if (!current?.running || current.endsAt !== completedDeadline) return current;
      return next;
    });
  }, [now, session, soundEnabled]);
  useEffect(() => {
    if (!justCompleted) return;
    const timeout = window.setTimeout(() => setJustCompleted(false), 3500);
    return () => window.clearTimeout(timeout);
  }, [justCompleted]);

  if (!session) return (
    <main className="scene"><div className="scene-overlay" />
      <header className="topbar"><div className="brand">drizlo<span>.</span></div></header>
    </main>
  );

  const seconds = session.running && session.endsAt !== null
    ? Math.max(0, Math.ceil((session.endsAt - now) / 1000)) : session.remaining;
  const totalSeconds = session.duration * 60;
  const progress = totalSeconds > 0 ? Math.min(1, Math.max(0, 1 - seconds / totalSeconds)) : 0;
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const isFocus = session.mode === "focus";
  const isRunning = session.running;
  const actionLabel = isRunning ? "Pause" : session.setFinished ? "Start again" : seconds < totalSeconds ? "Resume" : "Start";

  function toggleTimer(): void {
    setJustCompleted(false);
    if (!isRunning && (seconds > 0 || session?.setFinished) && soundEnabled) playChime("start");
    setSession((current) => {
      if (!current) return current;
      if (current.running && current.endsAt !== null) return {
        ...current, remaining: Math.max(0, Math.ceil((current.endsAt - Date.now()) / 1000)),
        running: false, endsAt: null,
      };
      if (current.setFinished) return {
        ...current, mode: "focus", duration: current.focusDuration,
        remaining: current.focusDuration * 60, roundsInSet: 0, setFinished: false,
        running: true, endsAt: Date.now() + current.focusDuration * 60_000,
      };
      if (current.remaining <= 0) return current;
      return { ...current, running: true, endsAt: Date.now() + current.remaining * 1000 };
    });
  }
  function reset(): void {
    setJustCompleted(false);
    completedEndRef.current = null;
    setSession((current) => current ? {
      ...current, mode: "focus", duration: current.focusDuration,
      remaining: current.focusDuration * 60, running: false, endsAt: null,
      roundsInSet: 0, setFinished: false,
    } : current);
  }
  function changeDuration(minutes: number): void {
    setJustCompleted(false);
    setSession((current) => {
      if (!current || current.mode !== "focus" || current.running) return current;
      return { ...current, duration: minutes, focusDuration: minutes,
        remaining: minutes * 60, running: false, endsAt: null,
        roundsInSet: 0, setFinished: false };
    });
  }
  function switchMode(): void {
    setJustCompleted(false);
    setSession((current) => {
      if (!current) return current;
      const nextMode: TimerMode = current.mode === "focus" ? "break" : "focus";
      const duration = nextMode === "focus" ? current.focusDuration : BREAK;
      return { ...current, mode: nextMode, duration,
        remaining: duration * 60, running: false, endsAt: null,
        roundsInSet: 0, setFinished: false };
    });
  }

  function changeScene(next: SceneChoice): void {
    setSceneChoice(next);
    try { localStorage.setItem(SCENE_KEY, next); } catch { /* ignore */ }
  }

  function toggleSound(): void {
    setSoundEnabled((current) => {
      try { localStorage.setItem(SOUND_KEY, String(!current)); } catch { /* ignore */ }
      return !current;
    });
  }

  function toggleAmbience(): void {
    setAmbienceEnabled((current) => {
      try { localStorage.setItem(AMBIENCE_KEY, String(!current)); } catch { /* ignore */ }
      return !current;
    });
  }

  async function enableNotifications(): Promise<void> {
    if (typeof Notification === "undefined" || !window.isSecureContext) return;
    try {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
    } catch { setNotificationsEnabled(false); }
  }

  const preferences = (prefix: string) => (
    <div className="timer-preferences" aria-label="Timer preferences">
      <button type="button" className="sound-toggle" aria-pressed={soundEnabled}
        onClick={toggleSound}>{soundEnabled ? "Sound on" : "Sound off"}</button>
      <button type="button" className="sound-toggle" aria-pressed={ambienceEnabled}
        onClick={toggleAmbience}>{ambienceEnabled ? "Ambience on" : "Ambience off"}</button>
      <button type="button" className="notification-toggle"
        onClick={() => void enableNotifications()}
        disabled={notificationsEnabled || typeof Notification === "undefined" || !window.isSecureContext || Notification.permission === "denied"}>
        {notificationsEnabled ? "Notifications on" : typeof Notification === "undefined" || !window.isSecureContext
          ? "Notifications unavailable" : Notification.permission === "denied" ? "Notifications blocked" : "Enable notifications"}
      </button>
    </div>
  );

  const durationControls = (prefix: string) => (
    <div className="durations" role="group" aria-label="Focus duration">
      {[15, 25, 45, 60].map((minutes) => (
        <button type="button" key={`${prefix}-${minutes}`}
          disabled={!isFocus || isRunning}
          aria-pressed={isFocus && session.focusDuration === minutes}
          className={session.focusDuration === minutes ? "selected" : ""}
          onClick={() => changeDuration(minutes)}>{minutes}m</button>
      ))}
    </div>
  );

  return (
    <main className="scene">
      <div className="scene-overlay" />
      <header className="topbar">
        <div className="brand">drizlo<span>.</span></div>
        <div className="session-count">{session.completed} {session.completed === 1 ? "cup brewed" : "cups brewed"}</div>
      </header>

      <section className="workspace">
        <div className="drizlo-scene-selector" role="group" aria-label="Choose a scene">
          <button type="button" className={sceneChoice === "coffee" ? "is-selected" : ""}
            aria-pressed={sceneChoice === "coffee"} onClick={() => changeScene("coffee")}>Coffee</button>
          <button type="button" className={sceneChoice === "tea" ? "is-selected" : ""}
            aria-pressed={sceneChoice === "tea"} onClick={() => changeScene("tea")}>Tea</button>
        </div>
        <div className="scene-stage">
          {sceneChoice === "coffee" ? (
            <CoffeeScene progress={progress} running={isRunning} mode={session.mode}
              completed={session.completed} justCompleted={justCompleted} />
          ) : (
            <TeaScene progress={progress} running={isRunning} mode={session.mode}
              completed={session.completed} justCompleted={justCompleted} />
          )}
          <div className="scene-label">
            {justCompleted ? "Another beautiful moment of focus."
              : isFocus ? isRunning
                ? sceneChoice === "tea" ? "A little calm, one steep at a time." : "A little progress, one drop at a time."
                : "Your next moment of focus awaits."
                : sceneChoice === "tea" ? "Your tea is ready. Enjoy your break." : "Your coffee is ready. Enjoy your break."}
          </div>
        </div>

        {/* Desktop: unchanged glass timer card. */}
        <aside className="timer-panel desktop-timer" aria-label="Timer controls">
          <span className="eyebrow">{session.setFinished ? "TWO ROUNDS COMPLETE" : `${isFocus ? "FOCUS SESSION" : "SHORT BREAK"} · ROUND ${Math.min(2, Math.max(1, session.roundsInSet + (isFocus ? 1 : 0)))}/2`}</span>
          <div className="time">{time}</div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progress * 100}%` }} /></div>
          <p className="timer-description">{justCompleted ? "Beautifully done. Take a moment."
            : isFocus ? isRunning ? "One drop at a time." : "Ready when you are."
              : "Take a moment for yourself."}</p>
          <div className="controls">
            <button type="button" className="primary-button" onClick={toggleTimer}>{actionLabel}</button>
            <button type="button" className="secondary-button" onClick={reset}>Reset</button>
          </div>
          {durationControls("desktop")}
          {preferences("desktop")}
          <button type="button" className="mode-button" onClick={switchMode}>
            Switch to {isFocus ? "break" : "focus"}
          </button>
        </aside>

        {/* Mobile: visible timer, no hidden scrolling card. */}
        <section className="mobile-timer" aria-label="Focus timer">
          <span className="eyebrow">{session.setFinished ? "TWO ROUNDS COMPLETE" : `${isFocus ? "FOCUS SESSION" : "SHORT BREAK"} · ROUND ${Math.min(2, Math.max(1, session.roundsInSet + (isFocus ? 1 : 0)))}/2`}</span>
          <div className="mobile-time" role="timer" aria-live="off">{time}</div>
          <div className="mobile-progress-track"><div className="progress-fill" style={{ width: `${progress * 100}%` }} /></div>
          <p className="mobile-timer-description">
            {justCompleted ? "Beautifully done. Take a moment."
              : isFocus ? isRunning ? "One drop at a time." : "Ready when you are."
                : "Take a moment for yourself."}
          </p>
          <div className="mobile-timer-actions">
            <button type="button" className="primary-button" onClick={toggleTimer}>{actionLabel}</button>
            <button type="button" className="secondary-button" onClick={reset}>Reset</button>
          </div>
          <button type="button" className="mobile-settings-toggle"
            aria-expanded={mobileSettingsOpen} aria-controls="mobile-timer-settings"
            onClick={() => setMobileSettingsOpen((open) => !open)}>
            <span>More timer options</span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
              className={mobileSettingsOpen ? "mobile-chevron is-open" : "mobile-chevron"}>
              <path d="m5 9 7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </section>
      </section>

      {/* Mobile bottom drawer: overlays the scene instead of shifting the brewer. */}
      {mobileSettingsOpen && (
        <div className="mobile-settings-backdrop" onClick={() => setMobileSettingsOpen(false)}>
          <section id="mobile-timer-settings" className="mobile-settings-drawer"
            role="dialog" aria-modal="true" aria-label="Timer settings"
            onClick={(event) => event.stopPropagation()}>
            <div className="mobile-drawer-heading">
              <span>Timer settings</span>
              <button type="button" onClick={() => setMobileSettingsOpen(false)} aria-label="Close timer settings">✕</button>
            </div>
            <p className="mobile-drawer-label">{isFocus ? "FOCUS DURATION" : "FOCUS DURATION · AVAILABLE IN FOCUS MODE"}</p>
            {durationControls("mobile")}
            {preferences("mobile")}
            <button type="button" className="mode-button" onClick={() => { switchMode(); setMobileSettingsOpen(false); }}>
              Switch to {isFocus ? "break" : "focus"}
            </button>
          </section>
        </div>
      )}

      <footer className="bottombar"><span>{sceneChoice === "tea" ? "TEA SCENE" : "COFFEE SCENE"}</span><span>Make time feel beautiful.</span></footer>
    </main>
  );
}
