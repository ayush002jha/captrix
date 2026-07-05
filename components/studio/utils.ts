import { MAX_DURATION_SECONDS, MIN_DURATION_SECONDS, styleLabels } from "./data";
import type { CaptionStyle } from "./types";

export function formatDuration(seconds: number | null) {
  if (!Number.isFinite(seconds)) {
    return "--";
  }

  const safeSeconds = seconds ?? 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = Math.round(safeSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function validateDuration(duration: number) {
  if (!Number.isFinite(duration)) {
    return "We could not read that video duration.";
  }

  if (duration < MIN_DURATION_SECONDS) {
    return `Clip is ${formatDuration(duration)}. Captrix needs at least 0:30.`;
  }

  if (duration > MAX_DURATION_SECONDS) {
    return `Clip is ${formatDuration(duration)}. Captrix supports clips up to 2:00.`;
  }

  return null;
}

export function analyzeCaption(text: string) {
  const normalized = text.trim();
  const words = normalized.split(/\s+/).filter(Boolean);
  const lower = normalized.toLowerCase();
  let score = 44;
  const signals: string[] = [];

  if (words.length >= 5 && words.length <= 12) {
    score += 18;
    signals.push("Readable");
  } else if (words.length > 12) {
    score -= 8;
    signals.push("Trim length");
  } else {
    signals.push("Needs detail");
  }

  if (/how|why|watch|make|stop|start|pov|before|after|fast|easy/.test(lower)) {
    score += 16;
    signals.push("Hook-led");
  }

  if (/[0-9]|one|two|three|first|last|seconds|minutes/.test(lower)) {
    score += 10;
    signals.push("Concrete");
  }

  if (/[.!?]$/.test(normalized)) {
    score += 5;
    signals.push("Clean ending");
  }

  if (normalized.length > 82) {
    score -= 10;
  }

  const boundedScore = Math.max(8, Math.min(98, score));
  const recommendedStyle: CaptionStyle =
    boundedScore > 84 ? "neon" : lower.includes("pov") ? "neon" : words.length > 10 ? "minimal" : "creator";
  const summary =
    boundedScore > 84
      ? "High-retention caption. Keep it short and let the style do the punch."
      : boundedScore > 66
        ? "Strong hook. Add one concrete outcome to make it easier to follow."
        : "Good start. Make the first words more specific and action-led.";

  return {
    score: boundedScore,
    summary,
    signals: [...signals, `Style: ${styleLabels[recommendedStyle]}`].slice(0, 3),
    recommendedStyle
  };
}

export function timelinePercent(start: number, end: number) {
  return Math.max(8, Math.min(100, ((end - start) / MAX_DURATION_SECONDS) * 100));
}
