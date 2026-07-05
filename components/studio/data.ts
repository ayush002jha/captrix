import type { CaptionStyle, PlatformKey, PlatformPreset } from "./types";

export const MIN_DURATION_SECONDS = 30;
export const MAX_DURATION_SECONDS = 120;

export const styleLabels: Record<CaptionStyle, string> = {
  creator: "Creator Pop",
  karaoke: "Karaoke",
  meme: "Meme Stack",
  minimal: "Minimal",
  neon: "Neon Punch"
};

export const platformPresets: Record<PlatformKey, PlatformPreset> = {
  "instagram-reels": {
    label: "Instagram Reels",
    shortLabel: "Reels",
    family: "short-form",
    aspectRatio: "9 / 16",
    frame: "phone",
    size: "1080 x 1920",
    guidance: "Keep captions inside the center safe zone for UI overlays."
  },
  tiktok: {
    label: "TikTok",
    shortLabel: "TikTok",
    family: "short-form",
    aspectRatio: "9 / 16",
    frame: "phone",
    size: "1080 x 1920",
    guidance: "Use large hooks and avoid the lower-right action rail."
  },
  "youtube-shorts": {
    label: "YouTube Shorts",
    shortLabel: "Shorts",
    family: "short-form",
    aspectRatio: "9 / 16",
    frame: "phone",
    size: "1080 x 1920",
    guidance: "Put the hook high enough to clear title and controls."
  },
  "instagram-feed": {
    label: "Instagram Feed",
    shortLabel: "Feed",
    family: "feed",
    aspectRatio: "4 / 5",
    frame: "phone",
    size: "1080 x 1350",
    guidance: "Balanced framing for feed posts and profile previews."
  },
  "youtube-video": {
    label: "YouTube Long-form",
    shortLabel: "YouTube",
    family: "long-form",
    aspectRatio: "16 / 9",
    frame: "desktop",
    size: "1920 x 1080",
    guidance: "Use lower-third captions that do not cover the subject."
  },
  "facebook-video": {
    label: "Facebook Video",
    shortLabel: "Facebook",
    family: "long-form",
    aspectRatio: "16 / 9",
    frame: "desktop",
    size: "1920 x 1080",
    guidance: "Readable captions matter for muted autoplay feeds."
  },
  "square-post": {
    label: "Square Post",
    shortLabel: "Square",
    family: "feed",
    aspectRatio: "1 / 1",
    frame: "square",
    size: "1080 x 1080",
    guidance: "Best for cross-posted feed clips and thumbnails."
  }
};

export const platformOrder = Object.keys(platformPresets) as PlatformKey[];

export const captionSuggestions = [
  "Wait for the twist at the end.",
  "This one change made the whole clip land.",
  "The fastest way to make this moment clear.",
  "Watch how the before turns into the after.",
  "Small detail. Huge difference.",
  "Here is the part everyone misses.",
  "Make the first second impossible to skip."
];

export const templateCaptions = [
  "New drop. New energy.",
  "Watch this before you post.",
  "One edit changed the whole clip."
];
