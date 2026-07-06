import type { CaptionSegment } from "./types";
import { useEffect, useState } from "react";

type TimelinePanelProps = {
  caption: string;
  start: number;
  end: number;
  width: number;
  duration: number;
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
  segments,
  activeSegmentId,
  onSelectSegment,
  onUpdateSegment,
  onUpdateManualCaption
}: TimelinePanelProps) {
  const safeDuration = Math.max(1, duration);
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

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase text-white/40">Caption timeline</span>
          <p className="mt-1 text-xs text-white/45">{segments.length > 0 ? `${segments.length} generated segments` : "Manual caption layer"}</p>
        </div>
        <strong className="text-xs font-black text-white">
          {start}s - {end}s
        </strong>
      </div>
      <div className="relative min-h-16 overflow-hidden rounded-2xl border border-white/10 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_52px)] p-2">
        {segments.length > 0 ? (
          <div className="relative h-12">
            {segments.map((segment) => {
              const left = Math.max(0, Math.min(96, (segment.start / safeDuration) * 100));
              const segmentWidth = Math.max(8, Math.min(100 - left, ((segment.end - segment.start) / safeDuration) * 100));
              const active = segment.id === activeSegmentId;
              const editing = segment.id === editingSegmentId;

              return editing ? (
                <input
                  autoFocus
                  className="absolute top-0 h-12 min-w-28 rounded-xl border border-[#e9ff12] bg-black/80 px-3 text-xs font-black text-white outline-none shadow-[0_0_20px_rgba(233,255,18,0.2)]"
                  data-testid="caption-input"
                  key={segment.id}
                  style={{ left: `${left}%`, width: `${segmentWidth}%` }}
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
                    style={{ left: `${left}%`, width: `${segmentWidth}%` }}
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
            className="h-12 min-w-40 max-w-full rounded-xl border border-[#e9ff12] bg-black/80 px-3 text-xs font-black text-white outline-none shadow-[0_0_20px_rgba(233,255,18,0.2)]"
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
            className="flex h-12 min-w-40 max-w-full items-center overflow-hidden rounded-xl border border-white/10 bg-[#0b63f6] px-3 text-left text-xs font-black text-white transition hover:bg-[#2d7dff]"
            type="button"
            data-testid="caption-segment-manual"
            style={{ width: `${width}%` }}
            onDoubleClick={() => beginEditing("manual", caption)}
          >
            <span className="truncate">{caption.trim() || "Add a caption to preview it here."}</span>
          </button>
        )}
      </div>
    </section>
  );
}
