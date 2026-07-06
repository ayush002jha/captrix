import type { CaptionSegment } from "./types";
import { useEffect, useMemo, useRef, useState } from "react";

type TimelinePanelProps = {
  caption: string;
  start: number;
  end: number;
  width: number;
  duration: number;
  currentTime: number;
  segments: CaptionSegment[];
  activeSegmentId: string | null;
  onSelectSegment: (segment: CaptionSegment) => void;
  onUpdateSegment: (segmentId: string, updates: Partial<CaptionSegment>) => void;
  onUpdateManualCaption: (caption: string) => void;
};

export function TimelinePanel({
  caption,
  start,
  end,
  width,
  duration,
  currentTime,
  segments,
  activeSegmentId,
  onSelectSegment,
  onUpdateSegment,
  onUpdateManualCaption
}: TimelinePanelProps) {
  const safeDuration = Math.max(1, duration);
  const playheadPercent = Math.max(0, Math.min(100, (currentTime / safeDuration) * 100));
  const pixelsPerSecond = safeDuration > 90 ? 16 : safeDuration > 60 ? 20 : 28;
  const trackPixelWidth = Math.max(820, Math.ceil(safeDuration * pixelsPerSecond));
  const playheadLeft = Math.max(0, Math.min(trackPixelWidth, (currentTime / safeDuration) * trackPixelWidth));
  const rulerStep = safeDuration > 90 ? 15 : safeDuration > 45 ? 10 : 5;
  const rulerTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let tick = 0; tick <= safeDuration; tick += rulerStep) {
      ticks.push(tick);
    }
    if (ticks[ticks.length - 1] !== safeDuration) {
      ticks.push(safeDuration);
    }
    return ticks;
  }, [rulerStep, safeDuration]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    if (!editingSegmentId) {
      return;
    }

    if (editingSegmentId === "manual") {
      setDraftText(caption);
      return;
    }

    const segment = segments.find((item) => item.id === editingSegmentId);
    if (segment) {
      setDraftText(segment.text);
    }
  }, [caption, editingSegmentId, segments]);

  useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport || !segments.length) {
      return;
    }

    const visibleLeft = viewport.scrollLeft;
    const visibleRight = visibleLeft + viewport.clientWidth;
    const buffer = 140;

    if (playheadLeft < visibleLeft + buffer || playheadLeft > visibleRight - buffer) {
      viewport.scrollTo({
        left: Math.max(0, playheadLeft - viewport.clientWidth / 2),
        behavior: "smooth"
      });
    }
  }, [playheadLeft, segments.length]);

  function beginEditing(segmentId: string, text: string) {
    setEditingSegmentId(segmentId);
    setDraftText(text);
  }

  function commitEditing() {
    if (!editingSegmentId) {
      return;
    }

    const nextText = draftText.trim();
    if (editingSegmentId === "manual") {
      onUpdateManualCaption(nextText);
    } else {
      onUpdateSegment(editingSegmentId, { text: nextText });
    }

    setEditingSegmentId(null);
  }

  function formatTick(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase text-white/40">Caption timeline</span>
          <p className="mt-1 text-xs text-white/45">
            {segments.length > 0 ? `${segments.length} generated segments. Empty gaps stay silent.` : "Manual caption layer"}
          </p>
        </div>
        <strong className="text-xs font-black text-white">
          {formatTick(start)} - {formatTick(end)}
        </strong>
      </div>
      <div
        ref={scrollRef}
        className="max-w-full overflow-x-auto overflow-y-hidden rounded-2xl border border-white/10 bg-[#10131d] p-2 [scrollbar-color:rgba(233,255,18,0.55)_rgba(255,255,255,0.08)] [scrollbar-width:thin]"
        data-testid="caption-timeline-scroll"
      >
        <div className="relative" style={{ width: `${segments.length > 0 ? trackPixelWidth : 820}px` }}>
          <div className="relative h-6 border-b border-white/10">
            {rulerTicks.map((tick) => {
              const left = (tick / safeDuration) * trackPixelWidth;

              return (
                <div className="absolute top-0 h-full" key={tick} style={{ left }}>
                  <span className="absolute top-0 h-2 w-px bg-white/20" />
                  <span className="absolute top-2 translate-x-[-50%] text-[10px] font-black text-white/35">{formatTick(tick)}</span>
                </div>
              );
            })}
          </div>

          <div className="relative mt-2 min-h-16 overflow-hidden rounded-xl border border-white/10 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.07)_0_1px,transparent_1px_56px)] p-2">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(233,255,18,0.05),rgba(0,245,212,0.045),transparent)]" />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 origin-left bg-[linear-gradient(90deg,rgba(233,255,18,0.16),rgba(0,245,212,0.08),transparent)] transition-transform duration-150"
              style={{ width: "100%", transform: `scaleX(${playheadPercent / 100})` }}
            />
            <div
              className="pointer-events-none absolute inset-y-1.5 z-[3] w-[2px] bg-[#ff4d1a] shadow-[0_0_18px_rgba(255,77,26,0.82)] transition-[left] duration-150"
              style={{ left: `${playheadLeft}px` }}
            >
              <span className="absolute -left-1.5 -top-1 grid size-3 place-items-center rounded-full bg-[#ff4d1a] shadow-[0_0_16px_rgba(255,77,26,0.82)]" />
            </div>
            <div className="captrix-timeline-sweep pointer-events-none absolute inset-y-2 left-0 w-28 rounded-full bg-[linear-gradient(90deg,transparent,rgba(233,255,18,0.22),rgba(0,245,212,0.18),transparent)] blur-sm" />
            {segments.length > 0 ? (
              <div className="relative z-[1] h-12">
            {segments.map((segment) => {
              const segmentStart = Math.max(0, Math.min(safeDuration, segment.start));
              const segmentEnd = Math.max(segmentStart + 0.15, Math.min(safeDuration, segment.end));
              const left = Math.max(0, (segmentStart / safeDuration) * trackPixelWidth);
              const segmentWidth = Math.max(64, ((segmentEnd - segmentStart) / safeDuration) * trackPixelWidth);
              const active = segment.id === activeSegmentId;
              const editing = segment.id === editingSegmentId;

              return editing ? (
                <input
                  autoFocus
                  className="absolute top-0 h-12 min-w-28 rounded-xl border border-[#e9ff12] bg-black/80 px-3 text-xs font-black text-white outline-none shadow-[0_0_20px_rgba(233,255,18,0.2)]"
                  data-testid="caption-input"
                  key={segment.id}
                  style={{ left: `${left}px`, width: `${segmentWidth}px` }}
                  value={draftText}
                  onBlur={commitEditing}
                  onChange={(event) => setDraftText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commitEditing();
                    }
                    if (event.key === "Escape") {
                      setEditingSegmentId(null);
                    }
                  }}
                />
              ) : (
                  <button
                    className={`absolute top-0 flex h-12 min-w-16 items-center overflow-hidden rounded-xl border px-3 text-left text-xs font-black transition ${active ? "border-[#e9ff12] bg-[#e9ff12] text-black shadow-[0_0_18px_rgba(233,255,18,0.28)]" : "border-white/10 bg-[#0b63f6] text-white hover:bg-[#2d7dff]"}`}
                    key={segment.id}
                    type="button"
                    data-testid={`caption-segment-${segment.id}`}
                    title={segment.text}
                    style={{ left: `${left}px`, width: `${segmentWidth}px` }}
                    onClick={() => onSelectSegment(segment)}
                    onDoubleClick={() => beginEditing(segment.id, segment.text)}
                  >
                    <span className="truncate">{segment.text}</span>
                  </button>
              );
            })}
              </div>
            ) : editingSegmentId === "manual" ? (
              <input
                autoFocus
                className="relative z-[1] h-12 min-w-40 max-w-full rounded-xl border border-[#e9ff12] bg-black/80 px-3 text-xs font-black text-white outline-none shadow-[0_0_20px_rgba(233,255,18,0.2)]"
                data-testid="caption-input"
                style={{ width: `${width}%` }}
                value={draftText}
                onBlur={commitEditing}
                onChange={(event) => setDraftText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitEditing();
                  }
                  if (event.key === "Escape") {
                    setEditingSegmentId(null);
                  }
                }}
              />
            ) : (
              <button
                className="relative z-[1] flex h-12 min-w-40 max-w-full items-center overflow-hidden rounded-xl border border-white/10 bg-[#0b63f6] px-3 text-left text-xs font-black text-white transition hover:bg-[#2d7dff]"
                type="button"
                data-testid="caption-segment-manual"
                style={{ width: `${width}%` }}
                onDoubleClick={() => beginEditing("manual", caption)}
              >
                <span className="truncate">{caption.trim() || "Add a caption to preview it here."}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
