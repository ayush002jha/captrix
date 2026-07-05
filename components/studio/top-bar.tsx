type TopBarProps = {
  status: string;
};

export function TopBar({ status }: TopBarProps) {
  return (
    <header className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/10 px-5">
      <div className="flex items-center gap-3" aria-label="Captrix AI">
        <span className="grid size-9 place-items-center rounded-xl bg-[#e9ff12] font-black text-black shadow-[0_0_30px_rgba(233,255,18,0.35)]">
          C
        </span>
        <strong className="text-sm font-black text-white">Captrix AI</strong>
      </div>

      <nav className="hidden justify-center gap-6 text-xs font-semibold text-white/55 md:flex" aria-label="Product">
        <a className="transition hover:text-white" href="#editor">
          Studio
        </a>
        <a className="transition hover:text-white" href="#styles">
          Styles
        </a>
        <a className="transition hover:text-white" href="#export">
          Export
        </a>
      </nav>

      <div
        className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold text-white/75"
        aria-live="polite"
        data-testid="project-status"
      >
        {status}
      </div>
    </header>
  );
}
