"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";

const MIN_DURATION_SECONDS = 30;
const MAX_DURATION_SECONDS = 120;

type CaptionStyle = "creator" | "karaoke" | "meme" | "minimal" | "neon";
type CaptionPosition = "top" | "middle" | "bottom";

type VideoState = {
  name: string;
  duration: number;
  url: string;
};

const styleLabels: Record<CaptionStyle, string> = {
  creator: "Creator Pop",
  karaoke: "Karaoke",
  meme: "Meme Stack",
  minimal: "Minimal",
  neon: "Neon Punch"
};

const captionSuggestions = [
  "Wait for the twist at the end.",
  "This one change made the whole clip land.",
  "The fastest way to make this moment clear.",
  "Watch how the before turns into the after.",
  "Small detail. Huge difference.",
  "Here is the part everyone misses.",
  "Make the first second impossible to skip."
];

function formatDuration(seconds: number | null) {
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

function validateDuration(duration: number) {
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

function analyzeCaption(text: string) {
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

export function CaptionStudio() {
  const [video, setVideo] = useState<VideoState | null>(null);
  const [caption, setCaption] = useState("Turn rough clips into scroll-stopping captions.");
  const [style, setStyle] = useState<CaptionStyle>("creator");
  const [position, setPosition] = useState<CaptionPosition>("middle");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(8);
  const [message, setMessage] = useState({
    text: "No video selected yet.",
    tone: "neutral" as "neutral" | "error" | "success"
  });
  const [exportMessage, setExportMessage] = useState({
    text: "",
    tone: "neutral" as "neutral" | "error" | "success"
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  const coach = useMemo(() => analyzeCaption(caption), [caption]);
  const status = video ? "Clip loaded" : "Ready for a clip";

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
    setStart(0);
    setEnd(8);
    setMessage({
      text: "Studio reset. Choose another short clip when ready.",
      tone: "neutral"
    });
    setExportMessage({ text: "", tone: "neutral" });
  }

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="app-title">
        <header className="topbar">
          <div>
            <p className="eyebrow">Captrix</p>
            <h1 id="app-title">Make captions move.</h1>
          </div>
          <div className="status-pill" aria-live="polite" data-testid="project-status">
            {status}
          </div>
        </header>

        <section className="studio-grid">
          <div className="preview-column">
            <div className={`video-stage ${video ? "has-video" : ""}`} data-testid="video-stage">
              {video ? (
                <video
                  ref={videoRef}
                  src={video.url}
                  controls
                  playsInline
                  preload="metadata"
                  data-testid="video-preview"
                />
              ) : null}
              <div className={`caption-layer ${style} ${position}`} data-testid="caption-overlay">
                <span>{caption.trim() || "Add a caption to preview it here."}</span>
              </div>
              {!video ? (
                <div className="stage-empty">
                  <strong>Drop in a creator clip</strong>
                  <span>30 seconds to 2 minutes, MP4/WebM/MOV.</span>
                </div>
              ) : null}
            </div>

            <div className="playback-panel">
              <div>
                <span className="metric-label">Duration</span>
                <strong>{formatDuration(video?.duration ?? null)}</strong>
              </div>
              <div>
                <span className="metric-label">Active Style</span>
                <strong>{styleLabels[style]}</strong>
              </div>
              <div>
                <span className="metric-label">Segments</span>
                <strong>{caption.trim() ? "1" : "0"}</strong>
              </div>
            </div>
          </div>

          <aside className="controls-panel" aria-label="Caption controls">
            <section className="panel-section">
              <label className="upload-zone" htmlFor="videoInput">
                <input id="videoInput" type="file" accept="video/*" data-testid="video-input" onChange={handleVideoChange} />
                <span className="upload-icon" aria-hidden="true">
                  +
                </span>
                <span>
                  <strong>Choose video</strong>
                  <small>Validated locally before editing</small>
                </span>
              </label>
              <p className={`validation-message ${message.tone}`} role="status">
                {message.text}
              </p>
            </section>

            <section className="panel-section">
              <div className="section-heading">
                <h2>Caption</h2>
                <button className="icon-button" type="button" title="Suggest caption" data-testid="ai-suggest" onClick={suggestCaption}>
                  AI
                </button>
              </div>
              <textarea
                value={caption}
                data-testid="caption-input"
                rows={3}
                maxLength={120}
                placeholder="Type a bold short caption..."
                onChange={(event) => setCaption(event.target.value)}
              />

              <div className="field-grid">
                <label>
                  Start
                  <input type="number" min={0} max={120} value={start} step={0.5} onChange={(event) => setStart(Number(event.target.value))} />
                </label>
                <label>
                  End
                  <input type="number" min={0.5} max={120} value={end} step={0.5} onChange={(event) => setEnd(Number(event.target.value))} />
                </label>
              </div>
            </section>

            <section className="panel-section ai-panel" aria-label="Local AI caption coach">
              <div className="section-heading">
                <h2>Local AI coach</h2>
                <span className="coach-score" data-testid="ai-score">
                  {coach.score}
                </span>
              </div>
              <p className="coach-summary" data-testid="ai-summary">
                {coach.summary}
              </p>
              <div className="coach-signals" aria-label="Caption quality signals">
                {coach.signals.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </section>

            <section className="panel-section">
              <div className="section-heading">
                <h2>Style</h2>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => {
                    const styles = Object.keys(styleLabels) as CaptionStyle[];
                    setStyle(styles[Math.floor(Math.random() * styles.length)]);
                  }}
                >
                  Shuffle
                </button>
              </div>
              <div className="style-options" role="radiogroup" aria-label="Caption style">
                {(Object.keys(styleLabels) as CaptionStyle[]).map((styleName) => (
                  <button
                    className={`style-chip ${style === styleName ? "active" : ""}`}
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

            <section className="panel-section">
              <h2>Position</h2>
              <div className="position-options" role="radiogroup" aria-label="Caption position">
                {(["top", "middle", "bottom"] as CaptionPosition[]).map((positionName) => (
                  <button
                    className={`position-button ${position === positionName ? "active" : ""}`}
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

            <section className="panel-section export-section">
              <button className="primary-button" type="button" data-testid="export-kit" onClick={exportCaptionKit}>
                Export caption kit
              </button>
              <button className="secondary-button" type="button" data-testid="reset-studio" onClick={resetStudio}>
                Reset studio
              </button>
              <p className={`validation-message ${exportMessage.tone}`} role="status">
                {exportMessage.text}
              </p>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
