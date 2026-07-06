import { Download, RotateCcw } from "lucide-react";
import type { Tone } from "./types";

type TopBarProps = {
  status: string;
  exportStatus: { text: string; tone: Tone };
  isExporting: boolean;
  onExportVideo: () => void;
  onResetStudio: () => void;
};

const statusClass: Record<Tone, string> = {
  neutral: "text-white/55",
  error: "text-red-300",
  success: "text-emerald-300"
};

export function TopBar({ status, exportStatus, isExporting, onExportVideo, onResetStudio }: TopBarProps) {
  return (
    <header className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/10 px-5">
      <div className="flex items-center gap-3" aria-label="Captrix AI">
        <span className="grid size-9 place-items-center rounded-xl bg-[#e9ff12] font-black text-black shadow-[0_0_30px_rgba(233,255,18,0.35)]">
          C
        </span>
        <strong className="text-sm font-black text-white">Captrix AI</strong>
      </div>

      <div className={`hidden truncate text-right text-xs font-bold md:block ${statusClass[exportStatus.tone]}`} role="status">
        {exportStatus.text}
      </div>

      <div className="flex items-center justify-end gap-2">
        <div
          className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold text-white/75"
          aria-live="polite"
          data-testid="project-status"
        >
          {status}
        </div>
        <button
          className="grid size-9 place-items-center rounded-full border border-white/12 bg-white/[0.06] text-white/70 transition hover:bg-white/[0.12] hover:text-white"
          type="button"
          title="Reset studio"
          aria-label="Reset studio"
          data-testid="reset-studio"
          onClick={onResetStudio}
        >
          <RotateCcw aria-hidden="true" size={17} strokeWidth={2.4} />
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#ff3856] px-4 text-xs font-black text-white shadow-[0_0_28px_rgba(255,56,86,0.28)] transition hover:bg-[#ff4d68] disabled:cursor-wait disabled:opacity-65"
          type="button"
          data-testid="export-kit"
          disabled={isExporting}
          onClick={onExportVideo}
        >
          <Download aria-hidden="true" size={16} strokeWidth={2.5} />
          <span>{isExporting ? "Rendering" : "Export video"}</span>
        </button>
      </div>
    </header>
  );
}
