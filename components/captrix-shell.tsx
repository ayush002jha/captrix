"use client";

import { WheelEvent, useState } from "react";
import { ArrowRight, Captions, Clock3, Download, Sparkles, WandSparkles } from "lucide-react";
import { CaptionStudio } from "./caption-studio";

export function CaptrixShell() {
  const [studioOpen, setStudioOpen] = useState(false);

  function openStudio() {
    setStudioOpen(true);
  }

  function handleLandingWheel(event: WheelEvent<HTMLElement>) {
    if (event.deltaY > 24) {
      openStudio();
    }
  }

  return (
    <main className="relative h-[100svh] overflow-hidden bg-[#eceff3] p-5 text-[#111318]">
      <section
        className={`relative h-full overflow-hidden rounded-[1.8rem] border border-black/10 bg-[#f7f8fa] shadow-[0_30px_100px_rgba(18,21,27,0.16)] transition-[transform,opacity] duration-500 ease-out ${
          studioOpen ? "-translate-x-8 opacity-0" : "translate-x-0 opacity-100"
        }`}
        aria-hidden={studioOpen}
        onWheel={handleLandingWheel}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(233,255,18,0.34),transparent_22%),radial-gradient(circle_at_18%_18%,rgba(11,99,246,0.10),transparent_28%),linear-gradient(135deg,#fbfcfd_0%,#edf0f4_100%)]" />

        <div className="relative grid h-full grid-rows-[4.5rem_minmax(0,1fr)]">
          <header className="grid grid-cols-[auto_1fr_auto] items-center gap-5 px-9">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#111318] text-sm font-black text-[#e9ff12]">C</span>
              <strong className="text-sm font-black">Captrix AI</strong>
            </div>
            <div />
            <button
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#111318] px-5 text-sm font-black text-white shadow-[0_18px_44px_rgba(18,21,27,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
              type="button"
              onClick={openStudio}
            >
              Get started
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2.8} />
            </button>
          </header>

          <section className="grid min-h-0 grid-cols-[minmax(0,0.66fr)_minmax(38rem,1fr)] items-center gap-2 px-9 pb-9">
            <div className="min-w-0">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-black text-black/56 shadow-[0_12px_34px_rgba(18,21,27,0.06)]">
                <Sparkles aria-hidden="true" size={14} />
                AI captions for short clips
              </p>
              <h1 className="max-w-[12ch] text-[clamp(4rem,6vw,6.6rem)] font-black leading-[0.9] tracking-normal">
                Captions that make clips land.
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg font-semibold leading-8 text-black/58">
                Turn raw talking clips into captioned videos with AI transcription, drag-to-tune timing, creator styles, and export-ready output.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex h-14 items-center gap-3 rounded-full bg-[#111318] px-6 text-sm font-black text-white shadow-[0_22px_60px_rgba(18,21,27,0.22)] transition hover:-translate-y-0.5 hover:bg-black"
                  type="button"
                  onClick={openStudio}
                >
                  Open studio
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
                </button>
                <span className="text-xs font-black text-black/42">Scroll down to jump into the editor</span>
              </div>
              <div className="mt-9 grid max-w-[31rem] grid-cols-3 overflow-hidden rounded-3xl border border-black/10 bg-white/64 text-xs font-black text-black/54 shadow-[0_18px_55px_rgba(18,21,27,0.08)] backdrop-blur">
                <div className="border-r border-black/10 p-4">
                  <span className="block text-lg text-[#111318]">30s-2m</span>
                  Short clips
                </div>
                <div className="border-r border-black/10 p-4">
                  <span className="block text-lg text-[#111318]">Drag</span>
                  Timing blocks
                </div>
                <div className="p-4">
                  <span className="block text-lg text-[#111318]">Export</span>
                  Captions burned in
                </div>
              </div>
            </div>

            <div className="relative grid min-h-[47rem] place-items-center overflow-visible">
              <div className="absolute left-[2%] top-[13%] z-20 rounded-3xl border border-black/10 bg-white/88 p-5 shadow-[0_24px_70px_rgba(18,21,27,0.14)] backdrop-blur">
                <div className="mb-3 flex items-center gap-2">
                  <WandSparkles aria-hidden="true" className="text-[#0b63f6]" size={18} />
                  <strong className="text-sm font-black">Local AI captions</strong>
                </div>
                <p className="max-w-[13rem] text-xs font-bold leading-5 text-black/48">Generate editable caption blocks from speech, then tune every cut.</p>
              </div>

              <div className="absolute right-[2%] top-[17%] z-20 rounded-3xl border border-black/10 bg-[#111318] p-4 text-white shadow-[0_24px_70px_rgba(18,21,27,0.2)]">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 aria-hidden="true" className="text-[#e9ff12]" size={18} />
                  <strong className="text-sm font-black">AI timeline</strong>
                </div>
                <div className="relative h-12 w-52 rounded-2xl bg-white/10 p-2">
                  <div className="absolute inset-y-3 left-4 w-14 rounded-lg bg-[#0b63f6]" />
                  <div className="absolute inset-y-3 left-24 w-16 rounded-lg bg-[#e9ff12]" />
                  <div className="absolute inset-y-0 left-[58%] w-0.5 bg-[#ff4d1a]" />
                </div>
              </div>

              <div className="absolute bottom-[18%] right-[5%] z-20 rounded-3xl border border-black/10 bg-white/88 p-4 shadow-[0_24px_70px_rgba(18,21,27,0.14)] backdrop-blur">
                <div className="flex items-center gap-2">
                  <Download aria-hidden="true" className="text-[#0b63f6]" size={18} />
                  <strong className="text-sm font-black">Burned-in export</strong>
                </div>
              </div>

              <div className="absolute left-[12%] right-[4%] top-[7%] h-[80%] rounded-[5rem] bg-[radial-gradient(circle_at_50%_28%,rgba(233,255,18,0.35),transparent_34%),radial-gradient(circle_at_38%_62%,rgba(11,99,246,0.18),transparent_32%)] blur-2xl" />
              <div className="absolute inset-x-2 bottom-5 h-32 rounded-full bg-[#0b63f6]/12 blur-3xl" />
              <div className="relative z-10 grid translate-x-4 justify-items-center gap-4">
                <div className="aspect-[9/16] h-[38rem] rounded-[3rem] border-[11px] border-black bg-[#111827] p-5 shadow-[0_34px_100px_rgba(18,21,27,0.34)]">
                  <div className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
                  <div className="flex justify-between text-[10px] font-black text-white/45">
                    <span>Shorts</span>
                    <span>1080 x 1920</span>
                  </div>
                  <div className="relative mt-5 h-[calc(100%-3rem)] overflow-hidden rounded-[2rem] bg-black">
                    <video
                      className="h-full w-full object-cover"
                      src="/demo.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label="Demo clip with generated captions"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_100%)]" />
                    <div className="absolute inset-x-8 bottom-7 h-1.5 rounded-full bg-white/60">
                      <div className="h-full w-[62%] rounded-full bg-white" />
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-black/10 bg-white/92 p-3 shadow-[0_24px_70px_rgba(18,21,27,0.14)] backdrop-blur">
                  <div className="mb-2 flex items-center gap-2 px-1">
                    <Captions aria-hidden="true" className="text-[#0b63f6]" size={16} />
                    <strong className="text-xs font-black text-black/72">Caption style preview</strong>
                  </div>
                  <div className="captrix-style-loop relative h-16 w-72 overflow-hidden rounded-2xl bg-[#111318]">
                    <span className="captrix-style-sample captrix-style-meme">So let&apos;s take this photo</span>
                    <span className="captrix-style-sample captrix-style-minimal">So let&apos;s take this photo</span>
                    <span className="captrix-style-sample captrix-style-neon">So let&apos;s take this photo</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section
        className={`absolute inset-3 overflow-hidden rounded-[2rem] border border-black/12 bg-[#050509] shadow-[0_34px_120px_rgba(18,21,27,0.28)] transition-[transform,opacity] duration-500 ease-out ${
          studioOpen ? "translate-x-0 opacity-100" : "translate-x-[104%] opacity-60"
        }`}
        aria-hidden={!studioOpen}
      >
        <CaptionStudio />
      </section>
    </main>
  );
}
