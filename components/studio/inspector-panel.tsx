import type { ChangeEvent } from "react";
import { platformOrder, platformPresets, styleLabels } from "./data";
import type { CaptionPosition, CaptionStyle, PlatformKey, PlatformPreset, Tone } from "./types";

type InspectorPanelProps = {
  caption: string;
  style: CaptionStyle;
  position: CaptionPosition;
  platform: PlatformKey;
  selectedPlatform: PlatformPreset;
  coach: {
    score: number;
    summary: string;
    signals: string[];
  };
  message: { text: string; tone: Tone };
  exportMessage: { text: string; tone: Tone };
  start: number;
  end: number;
  onVideoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setCaption: (caption: string) => void;
  setStyle: (style: CaptionStyle) => void;
  setPosition: (position: CaptionPosition) => void;
  setPlatform: (platform: PlatformKey) => void;
  setStart: (start: number) => void;
  setEnd: (end: number) => void;
  suggestCaption: () => void;
  exportCaptionKit: () => void;
  resetStudio: () => void;
};

const messageClass: Record<Tone, string> = {
  neutral: "text-white/45",
  error: "text-red-300",
  success: "text-emerald-300"
};

export function InspectorPanel({
  caption,
  style,
  position,
  platform,
  selectedPlatform,
  coach,
  message,
  exportMessage,
  start,
  end,
  onVideoChange,
  setCaption,
  setStyle,
  setPosition,
  setPlatform,
  setStart,
  setEnd,
  suggestCaption,
  exportCaptionKit,
  resetStudio
}: InspectorPanelProps) {
  return (
    <aside className="min-h-0 overflow-auto rounded-[1.75rem] border border-white/10 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl" aria-label="Caption controls">
      <section className="border-b border-white/10 p-4" id="styles">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black text-white">Platform</h2>
          <span className="text-xs font-black text-white/45">{selectedPlatform.size}</span>
        </div>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Platform format">
          {platformOrder.map((platformName) => {
            const preset = platformPresets[platformName];
            const active = platform === platformName;

            return (
              <button
                className={`min-h-14 rounded-2xl border px-3 py-2 text-left transition ${active ? "border-[#e9ff12] bg-[#e9ff12] text-black shadow-[0_0_28px_rgba(233,255,18,0.3)]" : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"}`}
                type="button"
                data-testid={`platform-${platformName}`}
                key={platformName}
                onClick={() => setPlatform(platformName)}
              >
                <strong className="block text-xs font-black">{preset.shortLabel}</strong>
                <span className={`text-[11px] font-bold ${active ? "text-black/65" : "text-white/45"}`}>{preset.aspectRatio}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs leading-5 text-[#e9ff12]">{selectedPlatform.guidance}</p>
      </section>

      <section className="border-b border-white/10 p-4" id="styles">
        <label className="flex min-h-20 items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.05] p-4" htmlFor="videoInput">
          <input id="videoInput" className="sr-only" type="file" accept="video/*" data-testid="video-input" onChange={onVideoChange} />
          <span className="grid size-11 place-items-center rounded-2xl bg-[#0b63f6] text-2xl font-black text-white">+</span>
          <span>
            <strong className="block text-sm font-black text-white">Choose video</strong>
            <small className="mt-1 block text-xs text-white/45">Validated locally before editing</small>
          </span>
        </label>
        <p className={`mt-3 text-xs ${messageClass[message.tone]}`} role="status">
          {message.text}
        </p>
      </section>

      <section className="border-b border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black text-white">Caption</h2>
          <button className="grid size-10 place-items-center rounded-2xl bg-[#0b63f6] text-sm font-black text-white shadow-[0_0_28px_rgba(11,99,246,0.38)]" type="button" title="Suggest caption" data-testid="ai-suggest" onClick={suggestCaption}>
            AI
          </button>
        </div>
        <textarea
          className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#e9ff12]"
          value={caption}
          data-testid="caption-input"
          rows={3}
          maxLength={120}
          placeholder="Type a bold short caption..."
          onChange={(event) => setCaption(event.target.value)}
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-[10px] font-black uppercase text-white/45">
            Start
            <input className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-[#e9ff12]" type="number" min={0} max={120} value={start} step={0.5} onChange={(event) => setStart(Number(event.target.value))} />
          </label>
          <label className="text-[10px] font-black uppercase text-white/45">
            End
            <input className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-[#e9ff12]" type="number" min={0.5} max={120} value={end} step={0.5} onChange={(event) => setEnd(Number(event.target.value))} />
          </label>
        </div>
      </section>

      <section className="border-b border-white/10 bg-cyan-300/8 p-4" aria-label="Local AI caption coach">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black text-white">Local AI coach</h2>
          <span className="grid size-11 place-items-center rounded-full bg-[#0b63f6] text-sm font-black text-white" data-testid="ai-score">
            {coach.score}
          </span>
        </div>
        <p className="text-sm leading-5 text-white/72" data-testid="ai-summary">
          {coach.summary}
        </p>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Caption quality signals">
          {coach.signals.map((signal) => (
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black text-white" key={signal}>
              {signal}
            </span>
          ))}
        </div>
      </section>

      <section className="border-b border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-black text-white">Style</h2>
          <button
            className="h-9 rounded-xl border border-white/10 bg-white/8 px-3 text-xs font-black text-white transition hover:bg-white/14"
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
              className={`min-h-11 rounded-xl border px-3 text-sm font-black transition ${style === styleName ? "border-[#0b63f6] bg-[#0b63f6] text-white" : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"}`}
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

      <section className="border-b border-white/10 p-4">
        <h2 className="mb-3 text-sm font-black text-white">Position</h2>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Caption position">
          {(["top", "middle", "bottom"] as CaptionPosition[]).map((positionName) => (
            <button
              className={`h-11 rounded-xl border text-sm font-black transition ${position === positionName ? "border-[#0b63f6] bg-[#0b63f6] text-white" : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"}`}
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

      <section className="grid grid-cols-2 gap-2 p-4" id="export">
        <button className="min-h-12 rounded-2xl bg-[#ff3856] px-4 text-sm font-black text-white shadow-[0_0_28px_rgba(255,56,86,0.3)]" type="button" data-testid="export-kit" onClick={exportCaptionKit}>
          Export kit
        </button>
        <button className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-white" type="button" data-testid="reset-studio" onClick={resetStudio}>
          Reset
        </button>
        <p className={`col-span-2 min-h-5 text-xs ${messageClass[exportMessage.tone]}`} role="status">
          {exportMessage.text}
        </p>
      </section>
    </aside>
  );
}
