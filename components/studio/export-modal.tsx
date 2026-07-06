import { Download, Volume2, VolumeX, X } from "lucide-react";
import type { Tone } from "./types";

export type ExportQuality = "full" | "half";
export type ExportFileType = "webm" | "mp4";

type ExportProgress = {
  percent: number;
  etaSeconds: number | null;
};

type ExportModalProps = {
  open: boolean;
  formatLabel: string;
  exportSize: string;
  quality: ExportQuality;
  fileName: string;
  fileType: ExportFileType;
  includeAudio: boolean;
  isExporting: boolean;
  progress: ExportProgress;
  status: { text: string; tone: Tone };
  onQualityChange: (quality: ExportQuality) => void;
  onFileNameChange: (fileName: string) => void;
  onFileTypeChange: (fileType: ExportFileType) => void;
  onIncludeAudioChange: (includeAudio: boolean) => void;
  onClose: () => void;
  onStartExport: () => void;
};

const statusClass: Record<Tone, string> = {
  neutral: "text-white/55",
  error: "text-red-300",
  success: "text-emerald-300"
};

function formatEta(seconds: number | null) {
  if (seconds === null || !Number.isFinite(seconds)) {
    return "--";
  }

  if (seconds < 60) {
    return `${Math.max(1, Math.ceil(seconds))}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.ceil(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export function ExportModal({
  open,
  formatLabel,
  exportSize,
  quality,
  fileName,
  fileType,
  includeAudio,
  isExporting,
  progress,
  status,
  onQualityChange,
  onFileNameChange,
  onFileTypeChange,
  onIncludeAudioChange,
  onClose,
  onStartExport
}: ExportModalProps) {
  if (!open) {
    return null;
  }

  const displayPercent = Math.max(isExporting && progress.percent > 0 ? 4 : 0, Math.min(100, progress.percent));
  const roundedPercent = Math.max(0, Math.min(100, Math.round(displayPercent)));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Export video">
      <section className="w-full max-w-[520px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#12141d] shadow-[0_32px_120px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <h2 className="text-lg font-black text-white">Export video</h2>
            <p className="mt-1 text-xs text-white/50">
              {formatLabel}. Captions are rendered directly onto the video.
            </p>
          </div>
          <button
            className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/[0.12] hover:text-white disabled:opacity-40"
            type="button"
            aria-label="Close export modal"
            disabled={isExporting}
            onClick={onClose}
          >
            <X aria-hidden="true" size={17} strokeWidth={2.5} />
          </button>
        </div>

        <div className="grid gap-4 p-4">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase text-white/45">File name</span>
            <input
              className="h-11 w-full rounded-2xl border border-white/10 bg-black/25 px-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35 focus:border-[#e9ff12] disabled:opacity-60"
              type="text"
              value={fileName}
              maxLength={80}
              disabled={isExporting}
              placeholder="captrix-captioned-video"
              onChange={(event) => onFileNameChange(event.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "webm" as ExportFileType, label: "WebM", detail: "Recommended" },
              { value: "mp4" as ExportFileType, label: "MP4", detail: "Availability varies" }
            ].map((option) => (
              <button
                className={`min-h-16 rounded-2xl border p-3 text-left transition ${fileType === option.value ? "border-[#e9ff12] bg-[#e9ff12] text-black" : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"}`}
                type="button"
                key={option.value}
                disabled={isExporting}
                onClick={() => onFileTypeChange(option.value)}
              >
                <strong className="block text-sm font-black">{option.label}</strong>
                <span className={`mt-1 block text-xs font-bold ${fileType === option.value ? "text-black/65" : "text-white/45"}`}>{option.detail}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "full" as ExportQuality, label: "Full quality", detail: exportSize },
              { value: "half" as ExportQuality, label: "Fast preview", detail: "50% resolution" }
            ].map((option) => (
              <button
                className={`min-h-20 rounded-2xl border p-3 text-left transition ${quality === option.value ? "border-[#e9ff12] bg-[#e9ff12] text-black" : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"}`}
                type="button"
                key={option.value}
                disabled={isExporting}
                onClick={() => onQualityChange(option.value)}
              >
                <strong className="block text-sm font-black">{option.label}</strong>
                <span className={`mt-1 block text-xs font-bold ${quality === option.value ? "text-black/65" : "text-white/45"}`}>{option.detail}</span>
              </button>
            ))}
          </div>

          <button
            className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-left text-white transition hover:bg-white/[0.1] disabled:opacity-60"
            type="button"
            disabled={isExporting}
            onClick={() => onIncludeAudioChange(!includeAudio)}
          >
            <span>
              <strong className="block text-sm font-black">Audio track</strong>
              <span className="mt-1 block text-xs text-white/45">{includeAudio ? "Keep the original sound" : "Export without sound"}</span>
            </span>
            <span className="grid size-10 place-items-center rounded-2xl bg-white/[0.08] text-white">
              {includeAudio ? <Volume2 aria-hidden="true" size={19} /> : <VolumeX aria-hidden="true" size={19} />}
            </span>
          </button>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-black uppercase text-white/45">Progress</span>
              <strong className="text-xs font-black text-white">
                {roundedPercent}% · ETA {formatEta(progress.etaSeconds)}
              </strong>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full w-full origin-left rounded-full bg-[#e9ff12] transition-transform"
                style={{ transform: `scaleX(${displayPercent / 100})` }}
              />
            </div>
            <p className={`mt-2 min-h-4 text-xs ${statusClass[status.tone]}`}>{status.text}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/10 p-4">
          <button
            className="h-10 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm font-black text-white transition hover:bg-white/[0.1] disabled:opacity-40"
            type="button"
            disabled={isExporting}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#ff3856] px-4 text-sm font-black text-white shadow-[0_0_28px_rgba(255,56,86,0.28)] transition hover:bg-[#ff4d68] disabled:cursor-wait disabled:opacity-65"
            type="button"
            disabled={isExporting}
            onClick={onStartExport}
          >
            <Download aria-hidden="true" size={16} strokeWidth={2.5} />
            <span>{isExporting ? "Rendering" : "Start export"}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
