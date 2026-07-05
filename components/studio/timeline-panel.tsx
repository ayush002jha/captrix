import type { CaptionSegment } from "./types";
import type { PlatformPreset } from "./types";

type TimelinePanelProps = {
  caption: string;
  start: number;
  end: number;
  width: number;
  platform: PlatformPreset;
  duration: number;
  segments: CaptionSegment[];
  activeSegmentId: string | null;
  onSelectSegment: (segment: CaptionSegment) => void;
};

export function TimelinePanel({
  caption,
  start,
  end,
  width,
  platform,
  duration,
  segments,
  activeSegmentId,
  onSelectSegment
}: TimelinePanelProps) {
  const safeDuration = Math.max(1, duration);

  return (
    <section className="grid grid-cols-[minmax(0,1fr)_220px] gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[10px] font-black uppercase text-white/40">Caption track</span>
          <strong className="text-xs font-black text-white">
            {start}s - {end}s
          </strong>
        </div>
        <div className="relative min-h-11 overflow-hidden rounded-xl border border-white/10 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_48px)] p-1.5">
          {segments.length > 0 ? (
            <div className="relative h-8">
              {segments.map((segment) => {
                const left = Math.max(0, Math.min(96, (segment.start / safeDuration) * 100));
                const segmentWidth = Math.max(8, Math.min(100 - left, ((segment.end - segment.start) / safeDuration) * 100));
                const active = segment.id === activeSegmentId;

                return (
                  <button
                    className={`absolute top-0 flex h-8 min-w-12 items-center overflow-hidden rounded-lg px-3 text-left text-xs font-black transition ${active ? "bg-[#e9ff12] text-black shadow-[0_0_18px_rgba(233,255,18,0.28)]" : "bg-[#0b63f6] text-white hover:bg-[#2d7dff]"}`}
                    key={segment.id}
                    type="button"
                    title={segment.text}
                    style={{ left: `${left}%`, width: `${segmentWidth}%` }}
                    onClick={() => onSelectSegment(segment)}
                  >
                    <span className="truncate">{segment.text}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-8 min-w-28 max-w-full items-center overflow-hidden rounded-lg bg-[#0b63f6] px-3 text-xs font-black text-white" style={{ width: `${width}%` }}>
              <span className="truncate">{caption.trim() || "Caption segment"}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <span className="text-[10px] font-black uppercase text-white/40">Export target</span>
        <strong className="mt-2 block text-lg font-black text-white">{platform.size}</strong>
        <p className="mt-2 text-xs leading-5 text-white/55">
          {segments.length > 0 ? `${segments.length} AI-generated caption segments ready.` : platform.guidance}
        </p>
      </div>
    </section>
  );
}
