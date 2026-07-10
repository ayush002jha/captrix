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
    <main className="relative h-[100svh] overflow-hidden bg-[#e5e8ec] p-2 text-[#14161b] sm:p-3">
      <section
        className={`relative h-full overflow-hidden rounded-[1.4rem] border border-black/10 bg-[#f6f7f9] shadow-[0_28px_90px_rgba(20,22,27,0.14)] transition-[transform,opacity] duration-500 ease-out ${
          studioOpen ? "-translate-x-8 opacity-0" : "translate-x-0 opacity-100"
        }`}
        aria-hidden={studioOpen}
        onWheel={handleLandingWheel}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#fafbfc_0%,#f1f3f6_52%,#e9edf3_100%)]" />
        <div className="captrix-landing-grid absolute inset-0 opacity-40" />

        <div className="relative grid h-full grid-rows-[4.75rem_minmax(0,1fr)]">
          <header className="grid grid-cols-[auto_1fr_auto] items-center gap-5 px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#15171c] text-sm font-black text-[#e9ff12] shadow-[0_10px_28px_rgba(20,22,27,0.16)]">C</span>
              <div>
                <strong className="block text-sm font-black">Captrix AI</strong>
                <span className="hidden text-[10px] font-bold text-black/38 sm:block">AI caption studio</span>
              </div>
            </div>
            <div />
            <button
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#15171c] px-5 text-sm font-black text-white shadow-[0_16px_38px_rgba(20,22,27,0.18)] transition hover:-translate-y-0.5 hover:bg-black"
              type="button"
              data-testid="landing-open-studio-header"
              onClick={openStudio}
            >
              Get started
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2.8} />
            </button>
          </header>

          <section className="grid min-h-0 grid-cols-[minmax(24rem,0.82fr)_minmax(36rem,1.18fr)] items-center gap-8 px-5 pb-5 sm:px-8 lg:px-10 lg:pb-8 max-lg:grid-cols-1">
            <div className="min-w-0 max-lg:mx-auto max-lg:max-w-[42rem] max-lg:text-center">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/78 px-3 py-2 text-xs font-black text-black/56 shadow-[0_10px_28px_rgba(20,22,27,0.06)] backdrop-blur">
                <Sparkles aria-hidden="true" size={14} />
                YOUR CLIP. CAPTRIX TIMING.
              </p>

              <h1 className="max-w-[10.5ch] text-6xl font-black leading-[0.9] tracking-normal xl:text-7xl 2xl:text-[5.5rem] max-lg:mx-auto">
                Captions that make <span className="captrix-headline-accent">clips land.</span>
              </h1>

              <p className="mt-7 max-w-[32rem] text-base font-semibold leading-7 text-black/54 2xl:text-lg 2xl:leading-8 max-lg:mx-auto">
                Turn speech into timed, styled captions. Fine-tune every beat, frame for any feed, and export the finished video.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 max-lg:justify-center">
                <button
                  className="inline-flex h-14 items-center gap-3 rounded-full bg-[#15171c] px-6 text-sm font-black text-white shadow-[0_22px_55px_rgba(20,22,27,0.22)] transition hover:-translate-y-0.5 hover:bg-black"
                  type="button"
                  data-testid="landing-open-studio"
                  onClick={openStudio}
                >
                  Open studio
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={2.8} />
                </button>
                <span className="inline-flex items-center gap-2 text-xs font-black text-black/42">
                  <span className="size-2 rounded-full bg-[#0b63f6] shadow-[0_0_0_4px_rgba(11,99,246,0.10)]" />
                  No install. Start with a clip.
                </span>
              </div>

              <div className="mt-10 flex max-w-[31rem] items-center gap-6 border-t border-black/10 pt-5 text-xs font-bold text-black/42 max-lg:mx-auto max-lg:justify-center">
                <span><strong className="mr-1 text-base font-black text-[#15171c]">7</strong> formats</span>
                <span className="h-4 w-px bg-black/12" />
                <span><strong className="mr-1 text-base font-black text-[#15171c]">5</strong> caption styles</span>
                <span className="h-4 w-px bg-black/12" />
                <span><strong className="mr-1 text-base font-black text-[#15171c]">1</strong> focused studio</span>
              </div>
            </div>

            <div className="relative h-full min-h-[36rem] max-lg:hidden">
              <div className="captrix-float-slow absolute left-[3%] top-[17%] z-20 w-56 rounded-lg border border-black/10 bg-[#e9ff12] p-4 text-[#15171c] shadow-[0_24px_60px_rgba(0,0,0,0.25)] 2xl:left-[6%]">
                <div className="mb-2 flex items-center gap-2">
                  <WandSparkles aria-hidden="true" size={17} />
                  <strong className="text-sm font-black">Speech to captions</strong>
                </div>
                <p className="text-xs font-bold leading-5 text-black/58">Editable blocks timed to the words that matter.</p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="h-1.5 w-8 rounded-full bg-[#15171c]" />
                  <span className="h-1.5 w-5 rounded-full bg-[#15171c]/45" />
                  <span className="h-1.5 w-11 rounded-full bg-[#15171c]/20" />
                </div>
              </div>

              <div className="captrix-float-reverse absolute right-[2%] top-[19%] z-20 rounded-lg border border-white/12 bg-[#0b63f6] p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.34)] 2xl:right-[5%]">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 aria-hidden="true" size={17} />
                  <strong className="text-sm font-black">Visual timeline</strong>
                </div>
                <div className="relative h-11 w-44 overflow-hidden rounded-md bg-black/16 p-2 2xl:w-52">
                  <div className="absolute inset-y-3 left-4 w-12 rounded bg-white/72" />
                  <div className="absolute inset-y-3 left-20 w-16 rounded bg-[#e9ff12]" />
                  <div className="absolute inset-y-3 right-4 w-9 rounded bg-white/38" />
                  <div className="captrix-mini-playhead absolute inset-y-0 w-0.5 bg-[#ff4d1a] shadow-[0_0_12px_rgba(255,77,26,0.9)]" />
                </div>
              </div>

              <div className="absolute inset-0 z-10 grid place-items-center pt-3">
                <div className="grid translate-x-2 justify-items-center">
                  <div className="relative aspect-[9/16] h-[31rem] rounded-[2.7rem] border-[10px] border-black bg-[#111827] p-4 shadow-[0_32px_85px_rgba(0,0,0,0.48)] 2xl:h-[37rem] 2xl:rounded-[3rem] 2xl:border-[11px] 2xl:p-5">
                    <div className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
                    <div className="flex justify-between text-[10px] font-black text-white/42">
                      <span>Shorts</span>
                      <span>1080 x 1920</span>
                    </div>
                    <div className="relative mt-4 h-[calc(100%-2.5rem)] overflow-hidden rounded-[1.8rem] bg-black 2xl:mt-5 2xl:h-[calc(100%-3rem)] 2xl:rounded-[2rem]">
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
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_54%,rgba(0,0,0,0.24)_100%)]" />
                      <div className="absolute inset-x-8 bottom-7 h-1.5 rounded-full bg-white/48">
                        <div className="h-full w-[62%] rounded-full bg-white" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="absolute bottom-[12%] left-[3%] z-20 rounded-lg border border-white/10 bg-[#24272e]/96 p-3 text-white shadow-[0_20px_50px_rgba(20,22,27,0.24)] backdrop-blur-xl 2xl:left-[6%]">
                <div className="mb-2 flex items-center justify-between gap-8 px-1">
                  <span className="flex items-center gap-2">
                    <Captions aria-hidden="true" className="text-[#e9ff12]" size={15} />
                    <strong className="text-[11px] font-black text-white/70">Style preview</strong>
                  </span>
                  <span className="text-[9px] font-black text-white/32">AUTO</span>
                </div>
                <div className="captrix-style-loop relative h-12 w-64 overflow-hidden rounded-md bg-[#111318] 2xl:w-72">
                  <span className="captrix-style-sample captrix-style-meme">So let&apos;s take this photo</span>
                  <span className="captrix-style-sample captrix-style-minimal">So let&apos;s take this photo</span>
                  <span className="captrix-style-sample captrix-style-neon">So let&apos;s take this photo</span>
                </div>
              </div>

              <div className="captrix-float-slow absolute bottom-[14%] right-[3%] z-20 rounded-lg border border-black/10 bg-white/94 px-4 py-3 shadow-[0_22px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl 2xl:right-[6%]">
                <div className="flex items-center gap-2">
                  <Download aria-hidden="true" className="text-[#0b63f6]" size={17} />
                  <strong className="text-sm font-black">Export with captions</strong>
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
