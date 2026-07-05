"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { captionSuggestions, platformPresets } from "./studio/data";
import { InspectorPanel } from "./studio/inspector-panel";
import { PreviewStage } from "./studio/preview-stage";
import { TimelinePanel } from "./studio/timeline-panel";
import { TopBar } from "./studio/top-bar";
import type { CaptionPosition, CaptionStyle, PlatformKey, Tone, VideoState } from "./studio/types";
import { analyzeCaption, timelinePercent, validateDuration } from "./studio/utils";

export function CaptionStudio() {
  const [video, setVideo] = useState<VideoState | null>(null);
  const [caption, setCaption] = useState("Turn rough clips into scroll-stopping captions.");
  const [style, setStyle] = useState<CaptionStyle>("creator");
  const [position, setPosition] = useState<CaptionPosition>("middle");
  const [platform, setPlatform] = useState<PlatformKey>("instagram-reels");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(8);
  const [message, setMessage] = useState({
    text: "No video selected yet.",
    tone: "neutral" as Tone
  });
  const [exportMessage, setExportMessage] = useState({
    text: "",
    tone: "neutral" as Tone
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  const coach = useMemo(() => analyzeCaption(caption), [caption]);
  const selectedPlatform = platformPresets[platform];
  const status = video ? "Clip loaded" : "Ready for a clip";
  const trackWidth = timelinePercent(start, end);

  function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      setMessage({
        text: "Choose a video file so Captrix can create a caption preview.",
        tone: "error"
      });
      event.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => {
      const duration = probe.duration;
      const validationError = validateDuration(duration);
      setVideo({ name: file.name, duration, url });
      setMessage({
        text: validationError ?? `${file.name} is ready for captions.`,
        tone: validationError ? "error" : "success"
      });
    };
    probe.src = url;
  }

  function suggestCaption() {
    const words = caption.trim().split(/\s+/).filter(Boolean);
    const suggestion =
      words.length >= 5
        ? `POV: ${words.slice(0, 7).join(" ")}`
        : captionSuggestions[Math.floor(Math.random() * captionSuggestions.length)];

    setCaption(suggestion);
    setStyle(analyzeCaption(suggestion).recommendedStyle);
    setMessage({
      text: "Local caption AI suggested a tighter hook and style.",
      tone: "success"
    });
  }

  function exportCaptionKit() {
    if (!video) {
      setExportMessage({
        text: "Upload a valid clip before exporting.",
        tone: "error"
      });
      return;
    }

    const kit = {
      app: "Captrix",
      version: "0.1.0",
      video: {
        name: video.name,
        durationSeconds: Number(video.duration.toFixed(2))
      },
      platform: {
        id: platform,
        name: selectedPlatform.label,
        aspectRatio: selectedPlatform.aspectRatio,
        exportSize: selectedPlatform.size,
        guidance: selectedPlatform.guidance
      },
      captions: [
        {
          text: caption,
          startSeconds: start,
          endSeconds: end,
          style,
          position
        }
      ],
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(kit, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "captrix-caption-kit.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setExportMessage({
      text: "Caption kit exported.",
      tone: "success"
    });
  }

  function resetStudio() {
    setVideo(null);
    setCaption("Turn rough clips into scroll-stopping captions.");
    setStyle("creator");
    setPosition("middle");
    setPlatform("instagram-reels");
    setStart(0);
    setEnd(8);
    setMessage({
      text: "Studio reset. Choose another short clip when ready.",
      tone: "neutral"
    });
    setExportMessage({ text: "", tone: "neutral" });
  }

  return (
    <main className="h-[100svh] overflow-hidden bg-[#050509] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(233,255,18,0.16),transparent_24%),radial-gradient(circle_at_86%_10%,rgba(0,245,212,0.16),transparent_28%),linear-gradient(135deg,#050509_0%,#0b1020_48%,#050509_100%)]" />
      <div className="relative grid h-full min-h-0 grid-rows-[56px_minmax(0,1fr)]">
        <TopBar status={status} />

        <section className="grid min-h-0 gap-3 p-3" id="editor" aria-labelledby="app-title">
          <div className="flex min-h-0 items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.07] px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <div>
              <p className="text-[11px] font-black uppercase text-[#e9ff12]">Platform-aware caption studio</p>
              <h1 id="app-title" className="mt-1 text-2xl font-black leading-none tracking-normal text-white">
                Make captions move.
              </h1>
            </div>
            <p className="hidden max-w-[34rem] text-sm leading-5 text-white/55 lg:block">
              Pick a format, preview inside a device frame, tune the caption hook, and export a reusable kit.
            </p>
          </div>

          <div className="grid min-h-0 grid-cols-[88px_minmax(0,1fr)_390px] gap-3">
            <aside className="grid content-start gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-3 backdrop-blur-xl" aria-label="Studio tools">
              {["Scene", "Frame", "Caption", "Export"].map((item, index) => (
                <button
                  className={`grid size-14 place-items-center rounded-2xl border text-[10px] font-black transition ${index === 2 ? "border-[#e9ff12] bg-[#e9ff12] text-black" : "border-white/10 bg-white/[0.06] text-white/65 hover:bg-white/[0.12]"}`}
                  key={item}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </aside>

            <section className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3">
              <PreviewStage
                video={video}
                caption={caption}
                style={style}
                position={position}
                platform={selectedPlatform}
                setCaption={setCaption}
                setStyle={setStyle}
              />
              <TimelinePanel caption={caption} start={start} end={end} width={trackWidth} platform={selectedPlatform} />
            </section>

            <InspectorPanel
              caption={caption}
              style={style}
              position={position}
              platform={platform}
              selectedPlatform={selectedPlatform}
              coach={coach}
              message={message}
              exportMessage={exportMessage}
              start={start}
              end={end}
              onVideoChange={handleVideoChange}
              setCaption={setCaption}
              setStyle={setStyle}
              setPosition={setPosition}
              setPlatform={setPlatform}
              setStart={setStart}
              setEnd={setEnd}
              suggestCaption={suggestCaption}
              exportCaptionKit={exportCaptionKit}
              resetStudio={resetStudio}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
