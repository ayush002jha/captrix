import type { ChangeEvent, ReactElement } from "react";
import { AudioLines, WandSparkles } from "lucide-react";
import { platformOrder, platformPresets, styleLabels } from "./data";
import type { CaptionPosition, CaptionSegment, CaptionStyle, PlatformKey, PlatformPreset, Tone } from "./types";

type InspectorPanelProps = {
  segments: CaptionSegment[];
  style: CaptionStyle;
  position: CaptionPosition;
  captionSize: number;
  platform: PlatformKey;
  selectedPlatform: PlatformPreset;
  message: { text: string; tone: Tone };
  exportMessage: { text: string; tone: Tone };
  transcriptionStatus: string;
  isGeneratingCaptions: boolean;
  onVideoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setStyle: (style: CaptionStyle) => void;
  setPosition: (position: CaptionPosition) => void;
  setCaptionSize: (size: number) => void;
  setPlatform: (platform: PlatformKey) => void;
  generateCaptionsFromVideo: () => void;
  exportCaptionKit: () => void;
  resetStudio: () => void;
};

const messageClass: Record<Tone, string> = {
  neutral: "text-white/45",
  error: "text-red-300",
  success: "text-emerald-300"
};

type PlatformLogoProps = {
  active: boolean;
};

function InstagramLogo({ active }: PlatformLogoProps) {
  return (
    <svg className="size-8" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="instagram-gradient" x1="4" x2="28" y1="28" y2="4">
          <stop stopColor="#feda75" />
          <stop offset="0.32" stopColor="#fa7e1e" />
          <stop offset="0.58" stopColor="#d62976" />
          <stop offset="0.78" stopColor="#962fbf" />
          <stop offset="1" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#instagram-gradient)" />
      <rect x="8.5" y="8.5" width="15" height="15" rx="5" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="16" cy="16" r="4" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="21.2" cy="10.8" r="1.4" fill="white" />
      {active ? <rect x="7" y="7" width="18" height="18" rx="6" fill="none" stroke="black" strokeOpacity="0.22" /> : null}
    </svg>
  );
}

function ReelsLogo({ active }: PlatformLogoProps) {
  return (
    <svg className="size-8" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="reels-gradient" x1="4" x2="28" y1="28" y2="4">
          <stop stopColor="#feda75" />
          <stop offset="0.34" stopColor="#fa7e1e" />
          <stop offset="0.62" stopColor="#d62976" />
          <stop offset="1" stopColor="#962fbf" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#reels-gradient)" />
      <path d="M8 11.5h16M10.2 7.5l4 4M17 7.5l4 4" stroke="white" strokeWidth="2.1" strokeLinecap="round" />
      <rect x="7.5" y="10" width="17" height="14.5" rx="4" fill="none" stroke="white" strokeWidth="2" />
      <path d="M14 14.2v6.6l5.4-3.3-5.4-3.3Z" fill="white" />
      {active ? <rect x="7" y="7" width="18" height="18" rx="6" fill="none" stroke="black" strokeOpacity="0.22" /> : null}
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg className="size-8" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#050505" />
      <path d="M18.7 7.5c.5 3.1 2.2 5 5.1 5.5v4c-1.9-.1-3.5-.7-5-1.8v5.8c0 4.1-2.7 6.6-6.5 6.6-3.4 0-5.8-2.2-5.8-5.3 0-3.4 2.8-5.6 6.8-5.4v4c-1.6-.3-2.6.4-2.6 1.5 0 1 .8 1.7 1.9 1.7 1.3 0 2.2-.8 2.2-2.7V7.5h3.9Z" fill="#25f4ee" transform="translate(-1 1)" opacity="0.9" />
      <path d="M18.7 7.5c.5 3.1 2.2 5 5.1 5.5v4c-1.9-.1-3.5-.7-5-1.8v5.8c0 4.1-2.7 6.6-6.5 6.6-3.4 0-5.8-2.2-5.8-5.3 0-3.4 2.8-5.6 6.8-5.4v4c-1.6-.3-2.6.4-2.6 1.5 0 1 .8 1.7 1.9 1.7 1.3 0 2.2-.8 2.2-2.7V7.5h3.9Z" fill="#fe2c55" transform="translate(1 -1)" opacity="0.88" />
      <path d="M18.7 7.5c.5 3.1 2.2 5 5.1 5.5v4c-1.9-.1-3.5-.7-5-1.8v5.8c0 4.1-2.7 6.6-6.5 6.6-3.4 0-5.8-2.2-5.8-5.3 0-3.4 2.8-5.6 6.8-5.4v4c-1.6-.3-2.6.4-2.6 1.5 0 1 .8 1.7 1.9 1.7 1.3 0 2.2-.8 2.2-2.7V7.5h3.9Z" fill="white" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg className="size-8" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#ff0033" />
      <rect x="6" y="10" width="20" height="12" rx="4" fill="white" />
      <path d="M14 13.2v5.6l5-2.8-5-2.8Z" fill="#ff0033" />
    </svg>
  );
}

function ShortsLogo() {
  return (
    <svg className="size-8" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#ff0033" />
      <path d="M12.3 6.5 22 11.2c2.3 1.1 2.3 4.4 0 5.6l-9.7 4.7A3 3 0 0 1 8 18.8V9.2a3 3 0 0 1 4.3-2.7Z" fill="white" opacity="0.96" />
      <path d="M14.2 11.2v5.6l5.2-2.8-5.2-2.8Z" fill="#ff0033" />
      <path d="M20 17.7 10.3 22.4c-2.3 1.1-2.3 4.4 0 5.6l.4.2A3 3 0 0 0 15 25.5v-5.2l5-2.6Z" fill="white" opacity="0.72" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg className="size-8" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#1877f2" />
      <path d="M18.3 27v-9.7h3.2l.6-4h-3.8v-2.2c0-1.1.4-1.9 2-1.9h2V5.7c-.4-.1-1.8-.2-3.4-.2-3.4 0-5.7 2.1-5.7 5.9v1.9H9.5v4h3.7V27h5.1Z" fill="white" />
    </svg>
  );
}

function SquarePostLogo() {
  return (
    <svg className="size-8" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#111827" />
      <rect x="8" y="8" width="16" height="16" rx="3" fill="none" stroke="#e9ff12" strokeWidth="2" />
      <path d="M12 16h8M16 12v8" stroke="#00f5d4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const platformVisuals: Record<
  PlatformKey,
  {
    Logo: (props: PlatformLogoProps) => ReactElement;
  }
> = {
  "instagram-reels": {
    Logo: ReelsLogo
  },
  tiktok: {
    Logo: TikTokLogo
  },
  "youtube-shorts": {
    Logo: ShortsLogo
  },
  "instagram-feed": {
    Logo: InstagramLogo
  },
  "youtube-video": {
    Logo: YouTubeLogo
  },
  "facebook-video": {
    Logo: FacebookLogo
  },
  "square-post": {
    Logo: SquarePostLogo
  }
};

export function InspectorPanel({
  segments,
  style,
  position,
  captionSize,
  platform,
  selectedPlatform,
  message,
  exportMessage,
  transcriptionStatus,
  isGeneratingCaptions,
  onVideoChange,
  setStyle,
  setPosition,
  setCaptionSize,
  setPlatform,
  generateCaptionsFromVideo,
  exportCaptionKit,
  resetStudio
}: InspectorPanelProps) {
  return (
    <aside className="min-h-0 overflow-y-auto overflow-x-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl [scrollbar-color:rgba(233,255,18,0.45)_rgba(255,255,255,0.06)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#e9ff12]/45 [&::-webkit-scrollbar-track]:bg-white/[0.06]" aria-label="Caption controls">
      <section className="border-b border-white/10 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black text-white">Platform</h2>
          <span className="text-xs font-black text-white/45">{selectedPlatform.size}</span>
        </div>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Platform format">
          {platformOrder.map((platformName) => {
            const preset = platformPresets[platformName];
            const active = platform === platformName;
            const visual = platformVisuals[platformName];
            const Logo = visual.Logo;

            return (
              <button
                className={`grid min-h-12 grid-cols-[2rem_minmax(0,1fr)] items-center gap-2 rounded-2xl border px-2 py-1.5 text-left transition ${active ? "border-[#e9ff12] bg-[#e9ff12] text-black shadow-[0_0_28px_rgba(233,255,18,0.3)]" : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"}`}
                type="button"
                data-testid={`platform-${platformName}`}
                key={platformName}
                onClick={() => setPlatform(platformName)}
              >
                <span className="grid size-8 place-items-center rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
                  <Logo active={active} />
                </span>
                <span className="min-w-0">
                  <strong className="block truncate text-xs font-black">{preset.shortLabel}</strong>
                  <span className={`text-[10px] font-bold ${active ? "text-black/65" : "text-white/45"}`}>{preset.aspectRatio}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] leading-4 text-[#e9ff12]">{selectedPlatform.guidance}</p>
      </section>

      <section className="border-b border-white/10 p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black text-white">Caption size</h2>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-white/70">
            {Math.round(captionSize)}px
          </span>
        </div>
        <input
          className="h-2 w-full accent-[#e9ff12]"
          type="range"
          min={20}
          max={52}
          step={1}
          value={captionSize}
          aria-label="Caption overlay size"
          data-testid="caption-size"
          onChange={(event) => setCaptionSize(Number(event.target.value))}
        />
      </section>

      <section className="border-b border-white/10 p-3">
        <label className="flex min-h-16 items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.05] p-3" htmlFor="videoInput" data-testid="video-input">
          <input id="videoInput" className="sr-only" type="file" accept="video/*" data-testid="video-file-input" onChange={onVideoChange} />
          <span className="grid size-10 place-items-center rounded-2xl bg-[#0b63f6] text-2xl font-black text-white">+</span>
          <span>
            <strong className="block text-sm font-black text-white">Choose video</strong>
            <small className="mt-1 block text-xs text-white/45">Validated locally before editing</small>
          </span>
        </label>
        <p className={`mt-2 truncate text-xs ${messageClass[message.tone]}`} role="status">
          {message.text}
        </p>
      </section>

      <section className="border-b border-white/10 p-3" aria-label="Client-side caption generation">
        <button
          className="grid min-h-14 w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[#e9ff12]/35 bg-[#e9ff12]/10 p-3 text-left text-white transition hover:bg-[#e9ff12]/15 disabled:cursor-wait disabled:opacity-60"
          type="button"
          data-testid="generate-captions"
          aria-busy={isGeneratingCaptions}
          disabled={isGeneratingCaptions}
          onClick={generateCaptionsFromVideo}
        >
          <span className="grid size-10 place-items-center rounded-2xl bg-[#e9ff12] text-black shadow-[0_0_24px_rgba(233,255,18,0.22)]">
            {isGeneratingCaptions ? <AudioLines aria-hidden="true" size={21} /> : <WandSparkles aria-hidden="true" size={21} />}
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-sm font-black">
              {isGeneratingCaptions ? "Generating captions" : "Generate captions"}
            </strong>
            <small className="mt-1 block truncate text-xs text-white/55">Hosted first, local browser fallback</small>
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[10px] font-black text-white/70">
            {segments.length || "AI"}
          </span>
        </button>
        <p className="mt-2 text-[11px] leading-4 text-white/50" data-testid="transcription-status">
          {transcriptionStatus}
        </p>
      </section>

      <section className="border-b border-white/10 p-3" id="styles">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black text-white">Style</h2>
          <button
            className="h-8 rounded-xl border border-white/10 bg-white/[0.08] px-3 text-xs font-black text-white transition hover:bg-white/[0.14]"
            type="button"
            onClick={() => {
              const styles = Object.keys(styleLabels) as CaptionStyle[];
              setStyle(styles[Math.floor(Math.random() * styles.length)]);
            }}
          >
            Shuffle
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Caption style">
          {(Object.keys(styleLabels) as CaptionStyle[]).map((styleName) => (
            <button
              className={`min-h-9 rounded-xl border px-2 text-xs font-black transition ${style === styleName ? "border-[#0b63f6] bg-[#0b63f6] text-white" : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"}`}
              type="button"
              data-testid={`style-${styleName}`}
              data-style={styleName}
              key={styleName}
              onClick={() => setStyle(styleName)}
            >
              {styleLabels[styleName]}
            </button>
          ))}
        </div>
      </section>

      <section className="border-b border-white/10 p-3">
        <h2 className="mb-2 text-sm font-black text-white">Position</h2>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Caption position">
          {(["top", "middle", "bottom"] as CaptionPosition[]).map((positionName) => (
            <button
              className={`h-9 rounded-xl border text-xs font-black transition ${position === positionName ? "border-[#0b63f6] bg-[#0b63f6] text-white" : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"}`}
              type="button"
              data-testid={`position-${positionName}`}
              data-position={positionName}
              key={positionName}
              onClick={() => setPosition(positionName)}
            >
              {positionName[0].toUpperCase() + positionName.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2 p-3" id="export">
        <button className="min-h-10 rounded-2xl bg-[#ff3856] px-4 text-sm font-black text-white shadow-[0_0_28px_rgba(255,56,86,0.3)]" type="button" data-testid="export-kit" onClick={exportCaptionKit}>
          Export kit
        </button>
        <button className="min-h-10 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-white" type="button" data-testid="reset-studio" onClick={resetStudio}>
          Reset
        </button>
        <p className={`col-span-2 min-h-5 text-xs ${messageClass[exportMessage.tone]}`} role="status">
          {exportMessage.text}
        </p>
      </section>
    </aside>
  );
}
