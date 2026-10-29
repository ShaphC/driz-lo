"use client";

import posthog from "posthog-js";

import { analyticsConsent } from "@/lib/analytics";

type TimerMode = "focus" | "break";
type TimerAction = "started" | "resumed" | "paused" | "reset";

export const posthogTimerLogger = {
  action(action: TimerAction, details: { mode: TimerMode; scene: "coffee" | "tea"; focusDurationMinutes: number }): void {
    if (analyticsConsent() !== "accepted") return;

    posthog.logger.info("focus_timer_action", {
      action,
      mode: details.mode,
      scene: details.scene,
      focus_duration_minutes: details.focusDurationMinutes,
    });
  },

  intervalCompleted(details: { mode: TimerMode; scene: "coffee" | "tea"; focusDurationMinutes: number }): void {
    if (analyticsConsent() !== "accepted") return;

    posthog.logger.info("focus_timer_interval_completed", {
      mode: details.mode,
      scene: details.scene,
      focus_duration_minutes: details.focusDurationMinutes,
    });
  },
};
