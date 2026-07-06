import { useEffect, useRef } from "react";
import { styleLabels } from "./data";
import type { CaptionPosition, CaptionStyle, PlatformPreset, VideoState } from "./types";
import { formatDuration } from "./utils";

type PreviewStageProps = {
  video: VideoState | null;
  caption: string;
  style: CaptionStyle;
  position: CaptionPosition;
  captionSize: number;
  platform: PlatformPreset;
  segmentCount: number;
  seekRequest: { time: number; nonce: number };
  isGeneratingCaptions: boolean;
  generationStatus: string;
  onTimeUpdate: (time: number) => void;
};

const captionPositionClass: Record<CaptionPosition, string> = {
  top: "top-[10%]",
  middle: "top-1/2 -translate-y-1/2",
  bottom: "bottom-[10%]"
};

const captionStyleClass: Record<CaptionStyle, string> = {
  creator:
    "bg-[#e9ff12] px-2 py-1 text-black shadow-[5px_5px_0_rgba(0,0,0,0.85)] [text-shadow:2px_2px_0_rgba(255,255,255,0.7)]",
  karaoke: "border-b-[0.16em] border-[#e9ff12] text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.85)]",
  meme: "font-black text-white [font-family:Impact,Haettenschweiler,'Arial_Narrow_Bold',sans-serif] [text-shadow:3px_3px_0_#000,-3px_3px_0_#000,3px_-3px_0_#000,-3px_-3px_0_#000]",
  minimal: "rounded-xl bg-black/70 px-4 py-3 font-bold normal-case text-white",
  neon: "text-white [text-shadow:0_0_12px_#e9ff12,0_0_24px_#00f5d4,0_6px_18px_#000]"
};

const frameClass: Record<PlatformPreset["frame"], string> = {
  phone: "mx-auto w-full max-w-[300px] rounded-[2.4rem] border-[5px] border-black bg-black p-3 pt-7 shadow-[0_28px_80px_rgba(0,0,0,0.52)] before:absolute before:left-1/2 before:top-3 before:z-20 before:h-4 before:w-20 before:-translate-x-1/2 before:rounded-full before:bg-black",
  desktop:
    "mx-auto w-full max-w-[780px] rounded-[1.4rem] border border-white/12 bg-black/75 p-3 shadow-[0_28px_80px_rgba(0,0,0,0.42)]",
  square:
    "mx-auto w-full max-w-[500px] rounded-[1.6rem] border border-white/12 bg-black/75 p-3 shadow-[0_28px_80px_rgba(0,0,0,0.42)]"
};

export function PreviewStage({
  video,
  caption,
  style,
  position,
  captionSize,
  platform,
  segmentCount,
  seekRequest,
  isGeneratingCaptions,
  generationStatus,
  onTimeUpdate
}: PreviewStageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoText = video ? video.name : "No clip loaded";
  const previewCaption = caption.trim();
  const isPlaceholder = previewCaption.length === 0;

  useEffect(() => {
    if (!videoRef.current || seekRequest.nonce === 0) {
      return;
    }

    videoRef.current.currentTime = seekRequest.time;
  }, [seekRequest]);

  return (
    <section className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div
        className={`relative grid min-h-0 place-items-center overflow-hidden rounded-[1.35rem] bg-[radial-gradient(circle_at_28%_18%,rgba(233,255,18,0.12),transparent_28%),linear-gradient(140deg,rgba(11,18,32,0.95),rgba(10,10,12,0.96))] p-3 ${
          isGeneratingCaptions ? "captrix-ai-border-pulse border-[3px] border-[#e9ff12]" : "border border-white/10"
        }`}
        aria-busy={isGeneratingCaptions}
        aria-label={isGeneratingCaptions ? generationStatus : undefined}
      >
        <div className={`relative z-10 grid max-h-full min-h-0 gap-2 ${frameClass[platform.frame]}`}>
          <div className="flex min-h-6 items-center justify-between gap-3 px-2 text-[11px] font-black text-white/65">
            <span>{platform.shortLabel}</span>
            <strong>{platform.size}</strong>
          </div>

          <div
            className={`relative grid max-h-[calc(100svh-242px)] min-h-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_72%_40%,rgba(255,56,86,0.30),transparent_32%),radial-gradient(circle_at_24%_28%,rgba(0,245,212,0.25),transparent_30%),linear-gradient(135deg,#111827,#050509)] ${platform.frame === "phone" ? "rounded-[1.8rem]" : ""}`}
            data-testid="video-stage"
            style={{ aspectRatio: platform.aspectRatio }}
          >
            {video ? (
              <video
                ref={videoRef}
                className="h-full w-full bg-black object-contain"
                src={video.url}
                controls
                playsInline
                preload="metadata"
                data-testid="video-preview"
                onTimeUpdate={(event) => onTimeUpdate(event.currentTarget.currentTime)}
              />
            ) : null}

            <div className={`absolute left-1/2 z-[8] w-[82%] -translate-x-1/2 text-center ${captionPositionClass[position]}`} data-testid="caption-overlay">
              <span
                className={
                  isPlaceholder
                    ? "inline rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-sm font-semibold normal-case leading-tight text-white/70 backdrop-blur-md"
                    : `inline text-balance font-black uppercase leading-[0.98] tracking-normal ${captionStyleClass[style]}`
                }
                style={{ fontSize: isPlaceholder ? "14px" : `clamp(18px, ${captionSize}px, 52px)` }}
              >
                {previewCaption || "Add a caption to preview it here."}
              </span>
            </div>

            {!video ? (
              <div className="absolute inset-0 z-[4] grid place-items-center p-6 text-center text-white">
                <div>
                  <strong className="block text-lg font-black">Drop in a {platform.shortLabel} clip</strong>
                  <span className="mt-2 block max-w-[28ch] text-sm text-white/60">
                    {platform.size}. 30 seconds to 2 minutes, MP4/WebM/MOV.
                  </span>
                </div>
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-[11%_10%] z-[5] rounded-2xl border border-dashed border-white/25" />
          </div>
        </div>

        {isGeneratingCaptions ? <p className="sr-only" aria-live="polite">{generationStatus}</p> : null}
      </div>

      <div className="grid grid-cols-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
        {[
          ["Duration", formatDuration(video?.duration ?? null)],
          ["Style", styleLabels[style]],
          ["Segments", segmentCount > 0 ? String(segmentCount) : caption.trim() ? "1" : "0"],
          ["Format", platform.shortLabel]
        ].map(([label, value]) => (
          <div className="border-r border-white/10 p-2.5 last:border-r-0" key={label}>
            <span className="block text-[10px] font-black uppercase text-white/40">{label}</span>
            <strong className="mt-1 block truncate text-sm font-black text-white">{value}</strong>
          </div>
        ))}
      </div>

      <p className="sr-only">{videoText}</p>
    </section>
  );
}
