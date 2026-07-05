export type CaptionStyle = "creator" | "karaoke" | "meme" | "minimal" | "neon";

export type CaptionPosition = "top" | "middle" | "bottom";

export type PlatformKey =
  | "instagram-reels"
  | "tiktok"
  | "youtube-shorts"
  | "instagram-feed"
  | "youtube-video"
  | "facebook-video"
  | "square-post";

export type PlatformPreset = {
  label: string;
  shortLabel: string;
  family: "short-form" | "feed" | "long-form";
  aspectRatio: string;
  frame: "phone" | "desktop" | "square";
  size: string;
  guidance: string;
};

export type VideoState = {
  name: string;
  duration: number;
  url: string;
};

export type Tone = "neutral" | "error" | "success";
