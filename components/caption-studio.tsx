"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Captions, Film, Frame, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { generateClientCaptionSegments } from "./studio/client-transcription";
import { platformPresets } from "./studio/data";
import { ExportModal, type ExportFileType, type ExportQuality } from "./studio/export-modal";
import { InspectorPanel } from "./studio/inspector-panel";
import { PreviewStage } from "./studio/preview-stage";
import { TimelinePanel } from "./studio/timeline-panel";
import { TopBar } from "./studio/top-bar";
import type { CaptionPosition, CaptionSegment, CaptionStyle, PlatformKey, Tone, VideoState } from "./studio/types";
import { analyzeCaption, timelinePercent, validateDuration } from "./studio/utils";

type StudioPreset = {
  label: string;
  title: string;
  icon: LucideIcon;
  platform: PlatformKey;
  style: CaptionStyle;
  position: CaptionPosition;
  captionSize: number;
};

const studioPresets: StudioPreset[] = [
  {
    label: "Viral",
    title: "Reels creator captions",
    icon: Captions,
    platform: "instagram-reels",
    style: "creator",
    position: "bottom",
    captionSize: 30
  },
  {
    label: "Hook",
    title: "Shorts hook stack",
    icon: Sparkles,
    platform: "youtube-shorts",
    style: "meme",
    position: "middle",
    captionSize: 34
  },
  {
    label: "Wide",
    title: "YouTube lower third",
    icon: Film,
    platform: "youtube-video",
    style: "minimal",
    position: "bottom",
    captionSize: 24
  },
  {
    label: "Feed",
    title: "Feed-safe neon punch",
    icon: Frame,
    platform: "instagram-feed",
    style: "neon",
    position: "bottom",
    captionSize: 28
  }
];

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
    text: "Choose a clip to start editing.",
    tone: "neutral" as Tone
  });
  const [exportMessage, setExportMessage] = useState({
    text: "",
    tone: "neutral" as Tone
  });
  const [transcriptionStatus, setTranscriptionStatus] = useState("Upload a clip to create editable captions.");
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportQuality, setExportQuality] = useState<ExportQuality>("full");
  const [exportFileName, setExportFileName] = useState("captrix-captioned-video");
  const [exportFileType, setExportFileType] = useState<ExportFileType>("webm");
  const [includeAudio, setIncludeAudio] = useState(true);
  const [exportProgress, setExportProgress] = useState({
    percent: 0,
    etaSeconds: null as number | null
  });
  const selectedPlatform = platformPresets[platform];
  const status = video ? "Clip loaded" : "Ready for a clip";
  const trackWidth = timelinePercent(start, end);
  const playbackSegment = useMemo(
    () => segments.find((segment) => currentTime >= segment.start && currentTime < segment.end) ?? null,
    [currentTime, segments]
  );
  const previewCaption = segments.length > 0 ? playbackSegment?.text ?? "" : caption;
  const activeTimelineSegmentId = playbackSegment?.id ?? null;
  const showCaptionActivity =
    isGeneratingCaptions ||
    transcriptionStatus.startsWith("Preparing caption engine") ||
    transcriptionStatus.startsWith("Preparing speech recognition") ||
    transcriptionStatus.startsWith("Analyzing speech") ||
    transcriptionStatus.startsWith("Trying another captioning method");

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

  function updateSegment(segmentId: string, updates: Partial<CaptionSegment>) {
    setSegments((currentSegments) =>
      currentSegments.map((segment) => (segment.id === segmentId ? { ...segment, ...updates } : segment))
    );

    if (segmentId !== activeSegmentId) {
      return;
    }

    if (updates.text !== undefined) {
      setCaption(updates.text);
    }
    if (updates.start !== undefined) {
      setStart(updates.start);
    }
    if (updates.end !== undefined) {
      setEnd(updates.end);
    }
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
    if (!matchingSegment) {
      setActiveSegmentId(null);
      setCaption("");
      return;
    }

    if (matchingSegment.id === activeSegmentId) {
      return;
    }

    setActiveSegmentId(matchingSegment.id);
    setCaption(matchingSegment.text);
    setStart(matchingSegment.start);
    setEnd(matchingSegment.end);
  }

  function loadVideoFile(file: File) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      setMessage({
        text: "Choose a video file to create a caption preview.",
        tone: "error"
      });
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
      setTranscriptionStatus("Clip ready. Generate captions when you are ready.");
    };
    probe.src = url;
  }

  function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    loadVideoFile(file);
    event.target.value = "";
  }

  function applyStudioPreset(preset: StudioPreset) {
    setPlatform(preset.platform);
    setStyle(preset.style);
    setPosition(preset.position);
    setCaptionSize(preset.captionSize);
    setMessage({
      text: `Applied ${preset.title}.`,
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
    setTranscriptionStatus("Preparing your captions...");

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
        text: "Caption generation could not finish.",
        tone: "error"
      });
      setTranscriptionStatus(error instanceof Error ? error.message : "Try again with a clip that has clearer speech.");
    } finally {
      setIsGeneratingCaptions(false);
    }
  }

  function parseExportSize(size: string) {
    const [width, height] = size.split("x").map((part) => Number(part.trim()));
    const scale = exportQuality === "half" ? 0.5 : 1;
    return {
      width: Math.round((Number.isFinite(width) ? width : 1080) * scale),
      height: Math.round((Number.isFinite(height) ? height : 1920) * scale)
    };
  }

  function openExportModal() {
    if (!video) {
      setExportMessage({
        text: "Upload a valid clip before exporting video.",
        tone: "error"
      });
      return;
    }

    setExportProgress({ percent: 0, etaSeconds: null });
    setExportModalOpen(true);
  }

  function getExportMimeTypes(fileType: ExportFileType) {
    if (fileType === "mp4") {
      return ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4;codecs=h264,aac", "video/mp4"];
    }

    return ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  }

  function sanitizeExportFileName(fileName: string) {
    const cleanName = fileName
      .trim()
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-z0-9-_ ]/gi, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    return cleanName || "captrix-captioned-video";
  }

  function getCaptionAtTime(time: number) {
    if (segments.length > 0) {
      return segments.find((segment) => time >= segment.start && time < segment.end)?.text ?? "";
    }

    return time >= start && time <= end ? caption : "";
  }

  function wrapCanvasText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
    const words = text.trim().toUpperCase().split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";

    words.forEach((word) => {
      const nextLine = line ? `${line} ${word}` : word;
      if (context.measureText(nextLine).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = nextLine;
      }
    });

    if (line) {
      lines.push(line);
    }

    return lines.slice(0, 4);
  }

  function drawRoundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  function drawCaption(context: CanvasRenderingContext2D, text: string, width: number, height: number) {
    const cleanText = text.trim();
    if (!cleanText) {
      return;
    }

    const fontSize = Math.max(36, Math.round(captionSize * Math.min(width / 390, height / 720)));
    const lineHeight = Math.round(fontSize * 1.05);
    const maxTextWidth = width * 0.82;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
    const lines = wrapCanvasText(context, cleanText, maxTextWidth);
    const blockHeight = lines.length * lineHeight;
    const centerX = width / 2;
    const centerY =
      position === "top" ? height * 0.16 : position === "middle" ? height / 2 : height - height * 0.16 - blockHeight / 2;
    const firstY = centerY - blockHeight / 2 + lineHeight / 2;

    lines.forEach((line, index) => {
      const y = firstY + index * lineHeight;

      if (style === "creator") {
        const metrics = context.measureText(line);
        const boxWidth = Math.min(maxTextWidth + fontSize * 0.5, metrics.width + fontSize * 0.62);
        context.fillStyle = "#e9ff12";
        context.shadowColor = "rgba(0,0,0,0.88)";
        context.shadowBlur = 0;
        context.shadowOffsetX = fontSize * 0.12;
        context.shadowOffsetY = fontSize * 0.12;
        context.fillRect(centerX - boxWidth / 2, y - lineHeight / 2, boxWidth, lineHeight * 0.9);
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.fillStyle = "#050509";
        context.fillText(line, centerX, y);
        return;
      }

      if (style === "minimal") {
        const metrics = context.measureText(line);
        const boxWidth = Math.min(maxTextWidth + fontSize, metrics.width + fontSize);
        drawRoundedRect(context, centerX - boxWidth / 2, y - lineHeight / 2, boxWidth, lineHeight, fontSize * 0.22);
        context.fillStyle = "rgba(0,0,0,0.72)";
        context.fill();
      }

      context.lineWidth = style === "meme" ? fontSize * 0.13 : fontSize * 0.08;
      context.strokeStyle = style === "neon" ? "#00f5d4" : "#050509";
      context.shadowColor = style === "neon" ? "#e9ff12" : "rgba(0,0,0,0.85)";
      context.shadowBlur = style === "neon" ? fontSize * 0.35 : fontSize * 0.18;
      context.fillStyle = "#ffffff";
      context.strokeText(line, centerX, y);
      context.fillText(line, centerX, y);
      context.shadowBlur = 0;

      if (style === "karaoke") {
        const underlineWidth = Math.min(maxTextWidth, context.measureText(line).width);
        context.fillStyle = "#e9ff12";
        context.fillRect(centerX - underlineWidth / 2, y + lineHeight * 0.38, underlineWidth, Math.max(6, fontSize * 0.08));
      }
    });
  }

  async function exportCaptionedVideo() {
    if (!video) {
      setExportMessage({
        text: "Upload a valid clip before exporting video.",
        tone: "error"
      });
      return;
    }
    const exportVideo = video;

    if (typeof MediaRecorder === "undefined") {
      setExportMessage({
        text: "This browser cannot render video exports. Try Chrome or Edge.",
        tone: "error"
      });
      return;
    }

    setIsExporting(true);
    setExportProgress({ percent: 0, etaSeconds: null });
    setExportMessage({
      text: "Rendering your captioned video...",
      tone: "neutral"
    });

    const { width, height } = parseExportSize(selectedPlatform.size);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      setIsExporting(false);
      setExportMessage({
        text: "Video export is not available in this browser.",
        tone: "error"
      });
      return;
    }
    const renderContext = context;

    const source = document.createElement("video");
    source.src = exportVideo.url;
    source.playsInline = true;
    source.preload = "auto";
    source.muted = false;
    source.crossOrigin = "anonymous";
    source.style.position = "fixed";
    source.style.left = "-99999px";
    source.style.top = "0";
    source.style.width = "1px";
    source.style.height = "1px";
    source.style.opacity = "0";
    source.style.pointerEvents = "none";
    source.setAttribute("aria-hidden", "true");
    document.body.appendChild(source);

    const mimeType = getExportMimeTypes(exportFileType).find((type) =>
      MediaRecorder.isTypeSupported(type)
    );
    if (!mimeType) {
      setIsExporting(false);
      setExportMessage({
        text: `${exportFileType.toUpperCase()} export is not supported in this browser.`,
        tone: "error"
      });
      source.remove();
      return;
    }
    let audioContext: AudioContext | null = null;
    let recorder: MediaRecorder | null = null;
    const startedAt = performance.now();

    try {
      if (source.readyState < 1) {
        await new Promise<void>((resolve, reject) => {
          source.onloadedmetadata = () => resolve();
          source.onerror = () => reject(new Error("Could not load the source video for export."));
        });
      }
      source.currentTime = 0;

      const canvasStream = canvas.captureStream(30);

      if (includeAudio) {
        try {
          audioContext = new AudioContext();
          const audioSource = audioContext.createMediaElementSource(source);
          const audioDestination = audioContext.createMediaStreamDestination();
          audioSource.connect(audioDestination);
          audioDestination.stream.getAudioTracks().forEach((track) => canvasStream.addTrack(track));
          await audioContext.resume();
        } catch {
          audioContext = null;
        }
      }

      const activeRecorder = new MediaRecorder(canvasStream, mimeType ? { mimeType } : undefined);
      recorder = activeRecorder;
      const chunks: BlobPart[] = [];
      const stopped = new Promise<Blob>((resolve) => {
        activeRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        activeRecorder.onstop = () => resolve(new Blob(chunks, { type: activeRecorder.mimeType || "video/webm" }));
      });

      function drawFrame() {
        const duration = source.duration || exportVideo.duration || 1;
        const elapsedSeconds = (performance.now() - startedAt) / 1000;
        const mediaPercent = (source.currentTime / duration) * 100;
        const elapsedPercent = (elapsedSeconds / duration) * 100;
        const percent = Math.min(99, Math.max(mediaPercent, elapsedPercent));
        const etaSeconds = percent > 1 ? Math.max(1, (elapsedSeconds / percent) * (100 - percent)) : null;
        setExportProgress({ percent, etaSeconds });

        renderContext.fillStyle = "#050509";
        renderContext.fillRect(0, 0, width, height);

        const scale = Math.min(width / source.videoWidth, height / source.videoHeight);
        const drawWidth = source.videoWidth * scale;
        const drawHeight = source.videoHeight * scale;
        const drawX = (width - drawWidth) / 2;
        const drawY = (height - drawHeight) / 2;
        renderContext.drawImage(source, drawX, drawY, drawWidth, drawHeight);
        drawCaption(renderContext, getCaptionAtTime(source.currentTime), width, height);

        if (!source.ended && !source.paused) {
          requestAnimationFrame(drawFrame);
        }
      }

      activeRecorder.start(500);
      await source.play();
      drawFrame();
      await new Promise<void>((resolve) => {
        source.onended = () => {
          if (activeRecorder.state === "recording") {
            activeRecorder.stop();
          }
          resolve();
        };
      });

      const blob = await stopped;
      setExportProgress({ percent: 100, etaSeconds: 0 });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${sanitizeExportFileName(exportFileName)}.${exportFileType}`;
      anchor.click();
      URL.revokeObjectURL(url);
      setExportMessage({
        text: "Captioned video exported.",
        tone: "success"
      });
      setExportModalOpen(false);
    } catch (error) {
      setExportMessage({
        text: error instanceof Error ? error.message : "Video export failed.",
        tone: "error"
      });
    } finally {
      source.pause();
      if (recorder?.state === "recording") {
        recorder.stop();
      }
      if (audioContext && audioContext.state !== "closed") {
        await audioContext.close();
      }
      source.removeAttribute("src");
      source.load();
      source.remove();
      setIsExporting(false);
    }
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
    setExportProgress({ percent: 0, etaSeconds: null });
    setExportModalOpen(false);
    setTranscriptionStatus("Upload a clip to create editable captions.");
  }

  return (
    <main className="h-[100svh] overflow-hidden bg-[#050509] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(233,255,18,0.16),transparent_24%),radial-gradient(circle_at_86%_10%,rgba(0,245,212,0.16),transparent_28%),linear-gradient(135deg,#050509_0%,#0b1020_48%,#050509_100%)]" />
      <div className="relative grid h-full min-h-0 grid-rows-[56px_minmax(0,1fr)]">
        <TopBar
          status={status}
          exportStatus={exportMessage}
          isExporting={isExporting}
          onExportVideo={openExportModal}
          onResetStudio={resetStudio}
        />

        <section className="grid min-h-0 p-3" id="editor" aria-labelledby="app-title">
          <h1 id="app-title" className="sr-only">
            Make captions move.
          </h1>

          <div className="grid min-h-0 grid-cols-[76px_minmax(0,1fr)_370px] gap-3 overflow-hidden">
            <aside className="grid content-start gap-2 rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl" aria-label="Caption presets">
              {studioPresets.map((preset) => {
                const Icon = preset.icon;
                const active = platform === preset.platform && style === preset.style && position === preset.position && captionSize === preset.captionSize;
                return (
                <button
                  className={`grid h-[3.75rem] w-full place-items-center rounded-2xl border px-1 py-2 text-[9px] font-black transition ${active ? "border-[#e9ff12] bg-[#e9ff12] text-black shadow-[0_0_24px_rgba(233,255,18,0.24)]" : "border-white/10 bg-white/[0.06] text-white/65 hover:bg-white/[0.12] hover:text-white"}`}
                  key={preset.label}
                  type="button"
                  title={preset.title}
                  onClick={() => applyStudioPreset(preset)}
                >
                  <Icon aria-hidden="true" size={22} strokeWidth={2.4} />
                  <span className="truncate">{preset.label}</span>
                </button>
                );
              })}
            </aside>

            <section className="grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto] gap-3 overflow-hidden">
              <PreviewStage
                video={video}
                caption={previewCaption}
                style={style}
                position={position}
                captionSize={captionSize}
                platform={selectedPlatform}
                segmentCount={segments.length}
                seekRequest={seekRequest}
                isGeneratingCaptions={showCaptionActivity}
                generationStatus={transcriptionStatus}
                onTimeUpdate={handlePlaybackTimeUpdate}
                onVideoFile={loadVideoFile}
              />
              <TimelinePanel
                caption={caption}
                start={start}
                end={end}
                width={trackWidth}
                duration={video?.duration ?? 120}
                currentTime={currentTime}
                segments={segments}
                activeSegmentId={activeTimelineSegmentId}
                onSelectSegment={selectSegment}
                onUpdateSegment={updateSegment}
                onUpdateManualCaption={updateCaption}
              />
            </section>

            <InspectorPanel
              segments={segments}
              style={style}
              position={position}
              captionSize={captionSize}
              platform={platform}
              selectedPlatform={selectedPlatform}
              message={message}
              transcriptionStatus={transcriptionStatus}
              isGeneratingCaptions={isGeneratingCaptions}
              onVideoChange={handleVideoChange}
              setStyle={setStyle}
              setPosition={setPosition}
              setCaptionSize={setCaptionSize}
              setPlatform={setPlatform}
              generateCaptionsFromVideo={generateCaptionsFromVideo}
            />
          </div>
        </section>
        <ExportModal
          open={exportModalOpen}
          formatLabel={selectedPlatform.label}
          exportSize={selectedPlatform.size}
          quality={exportQuality}
          fileName={exportFileName}
          fileType={exportFileType}
          includeAudio={includeAudio}
          isExporting={isExporting}
          progress={exportProgress}
          status={exportMessage}
          onQualityChange={setExportQuality}
          onFileNameChange={setExportFileName}
          onFileTypeChange={setExportFileType}
          onIncludeAudioChange={setIncludeAudio}
          onClose={() => setExportModalOpen(false)}
          onStartExport={exportCaptionedVideo}
        />
      </div>
    </main>
  );
}
