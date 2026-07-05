"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Captions, Download, Film, Frame, Sparkles } from "lucide-react";
import { generateClientCaptionSegments } from "./studio/client-transcription";
import { captionSuggestions, platformPresets } from "./studio/data";
import { InspectorPanel } from "./studio/inspector-panel";
import { PreviewStage } from "./studio/preview-stage";
import { TimelinePanel } from "./studio/timeline-panel";
import { TopBar } from "./studio/top-bar";
import type { CaptionPosition, CaptionSegment, CaptionStyle, PlatformKey, Tone, VideoState } from "./studio/types";
import { analyzeCaption, timelinePercent, validateDuration } from "./studio/utils";

export function CaptionStudio() {
  const [video, setVideo] = useState<VideoState | null>(null);
  const [caption, setCaption] = useState("");
  const [segments, setSegments] = useState<CaptionSegment[]>([]);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekRequest, setSeekRequest] = useState({ time: 0, nonce: 0 });
  const [style, setStyle] = useState<CaptionStyle>("creator");
  const [position, setPosition] = useState<CaptionPosition>("bottom");
  const [captionSize, setCaptionSize] = useState(30);
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
  const [transcriptionStatus, setTranscriptionStatus] = useState("Upload a clip, then generate captions with hosted AI or local fallback.");
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const coach = useMemo(() => analyzeCaption(caption), [caption]);
  const selectedPlatform = platformPresets[platform];
  const status = video ? "Clip loaded" : "Ready for a clip";
  const trackWidth = timelinePercent(start, end);
  const playbackSegment = useMemo(
    () => segments.find((segment) => currentTime >= segment.start && currentTime < segment.end) ?? null,
    [currentTime, segments]
  );
  const selectedSegment = useMemo(
    () => segments.find((segment) => segment.id === activeSegmentId) ?? null,
    [activeSegmentId, segments]
  );
  const previewCaption = segments.length > 0 ? playbackSegment?.text ?? selectedSegment?.text ?? "" : caption;
  const activeTimelineSegmentId = playbackSegment?.id ?? activeSegmentId;

  function syncActiveSegment(nextSegment: Partial<CaptionSegment>) {
    if (!activeSegmentId) {
      return;
    }

    setSegments((currentSegments) =>
      currentSegments.map((segment) => (segment.id === activeSegmentId ? { ...segment, ...nextSegment } : segment))
    );
  }

  function updateCaption(nextCaption: string) {
    setCaption(nextCaption);
    syncActiveSegment({ text: nextCaption });
  }

  function updateStart(nextStart: number) {
    setStart(nextStart);
    syncActiveSegment({ start: nextStart });
  }

  function updateEnd(nextEnd: number) {
    setEnd(nextEnd);
    syncActiveSegment({ end: nextEnd });
  }

  function selectSegment(segment: CaptionSegment) {
    setActiveSegmentId(segment.id);
    setCaption(segment.text);
    setStart(segment.start);
    setEnd(segment.end);
    setCurrentTime(segment.start);
    setSeekRequest((request) => ({ time: segment.start, nonce: request.nonce + 1 }));
  }

  function handlePlaybackTimeUpdate(nextTime: number) {
    setCurrentTime(nextTime);

    const matchingSegment = segments.find((segment) => nextTime >= segment.start && nextTime < segment.end);
    if (!matchingSegment || matchingSegment.id === activeSegmentId) {
      return;
    }

    setActiveSegmentId(matchingSegment.id);
    setCaption(matchingSegment.text);
    setStart(matchingSegment.start);
    setEnd(matchingSegment.end);
  }

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
      setVideo({ name: file.name, duration, url, file });
      setMessage({
        text: validationError ?? `${file.name} is ready for captions.`,
        tone: validationError ? "error" : "success"
      });
      setSegments([]);
      setActiveSegmentId(null);
      setCaption("");
      setCurrentTime(0);
      setStart(0);
      setEnd(Math.min(8, Math.max(1, duration)));
      setTranscriptionStatus("Ready to generate captions with hosted AI. Local browser AI is the fallback.");
    };
    probe.src = url;
  }

  function suggestCaption() {
    const words = caption.trim().split(/\s+/).filter(Boolean);
    const suggestion =
      words.length >= 5
        ? `POV: ${words.slice(0, 7).join(" ")}`
        : captionSuggestions[Math.floor(Math.random() * captionSuggestions.length)];

    updateCaption(suggestion);
    setStyle(analyzeCaption(suggestion).recommendedStyle);
    setMessage({
      text: "Local caption AI suggested a tighter hook and style.",
      tone: "success"
    });
  }

  async function generateCaptionsFromVideo() {
    if (!video) {
      setMessage({
        text: "Upload a video before generating captions.",
        tone: "error"
      });
      setTranscriptionStatus("Caption generation needs a loaded clip.");
      return;
    }

    const validationError = validateDuration(video.duration);
    if (validationError) {
      setMessage({
        text: validationError,
        tone: "error"
      });
      setTranscriptionStatus("Use a 30 second to 2 minute clip before generating captions.");
      return;
    }

    setIsGeneratingCaptions(true);
    setExportMessage({ text: "", tone: "neutral" });
    setTranscriptionStatus("Starting caption generation...");

    try {
      const generatedSegments = await generateClientCaptionSegments(video.url, video.file, video.duration, setTranscriptionStatus);

      if (generatedSegments.length === 0) {
        setMessage({
          text: "No clear speech was detected in this clip.",
          tone: "error"
        });
        setTranscriptionStatus("Try a clip with clearer voice audio.");
        return;
      }

      setSegments(generatedSegments);
      setActiveSegmentId(generatedSegments[0].id);
      setCaption(generatedSegments[0].text);
      setStart(generatedSegments[0].start);
      setEnd(generatedSegments[0].end);
      setStyle(analyzeCaption(generatedSegments[0].text).recommendedStyle);
      setMessage({
        text: `Generated ${generatedSegments.length} editable caption segments.`,
        tone: "success"
      });
      setTranscriptionStatus("Captions generated. Select a segment on the timeline to edit it.");
    } catch (error) {
      setMessage({
        text: "Caption generation failed in this browser.",
        tone: "error"
      });
      setTranscriptionStatus(error instanceof Error ? error.message : "AI caption generation failed.");
    } finally {
      setIsGeneratingCaptions(false);
    }
  }

  function exportCaptionKit() {
    if (!video) {
      setExportMessage({
        text: "Upload a valid clip before exporting.",
        tone: "error"
      });
      return;
    }

    const exportedCaptions =
      segments.length > 0
        ? segments.map((segment) => ({
            text: segment.text,
            startSeconds: segment.start,
            endSeconds: segment.end,
            style,
            size: captionSize,
            position,
            generatedBy: "ai-transcription"
          }))
        : [
            {
              text: caption,
              startSeconds: start,
              endSeconds: end,
              style,
              size: captionSize,
              position,
              generatedBy: "manual"
            }
          ];

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
      captions: exportedCaptions,
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
    setCaption("");
    setSegments([]);
    setActiveSegmentId(null);
    setCurrentTime(0);
    setStyle("creator");
    setPosition("bottom");
    setCaptionSize(30);
    setPlatform("instagram-reels");
    setStart(0);
    setEnd(8);
    setMessage({
      text: "Studio reset. Choose another short clip when ready.",
      tone: "neutral"
    });
    setExportMessage({ text: "", tone: "neutral" });
    setTranscriptionStatus("Upload a clip, then generate captions with hosted AI or local fallback.");
  }

  return (
    <main className="h-[100svh] overflow-hidden bg-[#050509] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(233,255,18,0.16),transparent_24%),radial-gradient(circle_at_86%_10%,rgba(0,245,212,0.16),transparent_28%),linear-gradient(135deg,#050509_0%,#0b1020_48%,#050509_100%)]" />
      <div className="relative grid h-full min-h-0 grid-rows-[56px_minmax(0,1fr)]">
        <TopBar status={status} />

        <section className="grid min-h-0 p-3" id="editor" aria-labelledby="app-title">
          <h1 id="app-title" className="sr-only">
            Make captions move.
          </h1>

          <div className="grid min-h-0 grid-cols-[76px_minmax(0,1fr)_370px] gap-3">
            <aside className="grid content-start gap-2 rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl" aria-label="Studio tools">
              {[
                { label: "Scene", icon: Film, action: () => setPlatform("youtube-video") },
                { label: "Frame", icon: Frame, action: () => setPlatform("instagram-reels") },
                { label: "Caption", icon: Captions, action: suggestCaption },
                { label: "Export", icon: Download, action: exportCaptionKit }
              ].map((tool, index) => {
                const Icon = tool.icon;
                return (
                <button
                  className={`grid h-[3.75rem] w-full place-items-center rounded-2xl border px-1 py-2 text-[9px] font-black transition ${index === 2 ? "border-[#e9ff12] bg-[#e9ff12] text-black shadow-[0_0_24px_rgba(233,255,18,0.24)]" : "border-white/10 bg-white/[0.06] text-white/65 hover:bg-white/[0.12] hover:text-white"}`}
                  key={tool.label}
                  type="button"
                  title={tool.label}
                  onClick={tool.action}
                >
                  <Icon aria-hidden="true" size={22} strokeWidth={2.4} />
                  <span className="truncate">{tool.label}</span>
                </button>
                );
              })}
              <button
                className="grid h-[3.75rem] w-full place-items-center rounded-2xl border border-white/10 bg-white/[0.06] px-1 py-2 text-[9px] font-black text-white/65 transition hover:bg-white/[0.12] hover:text-white"
                type="button"
                title="Increase caption size"
                onClick={() => setCaptionSize((size) => Math.min(52, size + 4))}
              >
                <Sparkles aria-hidden="true" size={22} strokeWidth={2.4} />
                <span>Size</span>
              </button>
            </aside>

            <section className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3">
              <PreviewStage
                video={video}
                caption={previewCaption}
                style={style}
                position={position}
                captionSize={captionSize}
                platform={selectedPlatform}
                segmentCount={segments.length}
                seekRequest={seekRequest}
                onTimeUpdate={handlePlaybackTimeUpdate}
              />
              <TimelinePanel
                caption={caption}
                start={start}
                end={end}
                width={trackWidth}
                platform={selectedPlatform}
                duration={video?.duration ?? 120}
                segments={segments}
                activeSegmentId={activeTimelineSegmentId}
                onSelectSegment={selectSegment}
              />
            </section>

            <InspectorPanel
              caption={caption}
              segments={segments}
              style={style}
              position={position}
              captionSize={captionSize}
              platform={platform}
              selectedPlatform={selectedPlatform}
              coach={coach}
              message={message}
              exportMessage={exportMessage}
              transcriptionStatus={transcriptionStatus}
              isGeneratingCaptions={isGeneratingCaptions}
              start={start}
              end={end}
              onVideoChange={handleVideoChange}
              setCaption={updateCaption}
              setStyle={setStyle}
              setPosition={setPosition}
              setCaptionSize={setCaptionSize}
              setPlatform={setPlatform}
              setStart={updateStart}
              setEnd={updateEnd}
              suggestCaption={suggestCaption}
              generateCaptionsFromVideo={generateCaptionsFromVideo}
              exportCaptionKit={exportCaptionKit}
              resetStudio={resetStudio}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
