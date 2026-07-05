import type { PlatformPreset } from "./types";

type TimelinePanelProps = {
  caption: string;
  start: number;
  end: number;
  width: number;
  platform: PlatformPreset;
};

export function TimelinePanel({ caption, start, end, width, platform }: TimelinePanelProps) {
  return (
    <section className="grid grid-cols-[minmax(0,1fr)_220px] gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[10px] font-black uppercase text-white/40">Caption track</span>
          <strong className="text-xs font-black text-white">
            {start}s - {end}s
          </strong>
        </div>
        <div className="flex min-h-11 items-center overflow-hidden rounded-xl border border-white/10 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_48px)] p-1.5">
          <div className="flex min-h-8 min-w-28 max-w-full items-center overflow-hidden rounded-lg bg-[#0b63f6] px-3 text-xs font-black text-white" style={{ width: `${width}%` }}>
            <span className="truncate">{caption.trim() || "Caption segment"}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <span className="text-[10px] font-black uppercase text-white/40">Export target</span>
        <strong className="mt-2 block text-lg font-black text-white">{platform.size}</strong>
        <p className="mt-2 text-xs leading-5 text-white/55">{platform.guidance}</p>
      </div>
    </section>
  );
}
