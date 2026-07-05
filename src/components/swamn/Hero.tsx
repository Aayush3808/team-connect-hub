import { Logo } from "./Logo";
import { HeroBot } from "./HeroBot";

const features = [
  { label: "AI-Assisted Monitoring" },
  { label: "Plastic Waste Collection" },
  { label: "Embedded Engineering" },
  { label: "Sustainable Impact" },
];

export const Hero = () => {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32"
      style={{
        background:
          "linear-gradient(180deg, #eef4fa 0%, #dfeaf5 45%, #cfe0ee 100%)",
      }}
    >
      {/* corner accents (dot grid + soft ring) — matches reference */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-6 top-10 h-24 w-24 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(215 55% 45%) 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-[420px] w-[420px] rounded-full border-2 border-sky-300/40"
      />

      <div className="container relative">
        {/* Top row: pill tags on the right */}
        <div className="flex items-start justify-between">
          <div className="w-16" />
          <div className="hidden md:flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-slate-700">
            <span>Autonomous</span>
            <span className="text-slate-400">|</span>
            <span>Intelligent</span>
            <span className="text-slate-400">|</span>
            <span>Sustainable</span>
          </div>
        </div>

        {/* Left-aligned logo + label */}
        <div className="flex flex-col items-start text-left">
          <Logo size={92} withWordmark={false} />
          <div
            className="mt-3 text-[1.6rem] font-black tracking-[0.28em]"
            style={{ color: "#0b1e3a", fontFamily: "Impact, 'Arial Black', system-ui, sans-serif" }}
          >
            SWAMN
          </div>
          <div className="mt-1.5 text-[0.7rem] uppercase tracking-[0.42em] text-slate-600">
            Intelligent Ocean Systems
          </div>
        </div>

        {/* Left-aligned two-line hero headline */}
        <div className="mt-10 max-w-5xl text-left">
          <h1
            className="text-[2.4rem] leading-[1.05] sm:text-6xl md:text-[5.2rem] font-black tracking-tight"
            style={{ fontFamily: "Impact, 'Arial Black', system-ui, sans-serif" }}
          >
            <span style={{ color: "#0b1e3a" }}>BUILT TO CLEAN.</span>
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #2f7ce0 0%, #1e88ff 60%, #1a6fd8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              DESIGNED TO PROTECT.
            </span>
          </h1>

          {/* dotted divider with circle */}
          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-16 bg-slate-400/60" />
            <span className="h-3 w-3 rounded-full border border-slate-400/70" />
            <span className="h-px w-16 bg-slate-400/60" />
          </div>

          <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-slate-700">
            Autonomous surface robots that detect, collect and remove floating
            plastic waste from our oceans.
          </p>
        </div>

        {/* Bot stage with mission/vision callouts */}
        <div className="relative mx-auto mt-10 max-w-6xl">
          <div className="relative">
            <HeroBot className="h-[52vh] min-h-[420px] w-full md:h-[62vh]" />

            {/* Mission callout — left */}
            <div className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 md:block max-w-[180px]">
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "#1e88ff" }}>
                  Mission
                </div>
                <div className="h-px w-16 bg-sky-400/60" />
                <span className="h-2 w-2 rounded-full bg-sky-400" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                Cleaner oceans through intelligent autonomous fleets.
              </p>
            </div>

            {/* Vision callout — right */}
            <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 text-right md:block max-w-[180px]">
              <div className="flex items-center justify-end gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <div className="h-px w-16 bg-sky-400/60" />
                <div className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "#1e88ff" }}>
                  Vision
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                A future where technology protects what matters most.
              </p>
            </div>

            {/* water reflection base */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(120,170,210,0.35) 40%, rgba(60,110,160,0.6) 100%)",
              }}
            />
          </div>

          {/* Feature chip bar */}
          <div className="relative mx-auto -mt-6 grid max-w-4xl grid-cols-2 gap-3 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-800 to-slate-900 p-3 shadow-2xl md:grid-cols-4">
            {features.map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1.5 rounded-xl px-3 py-4 text-center transition-colors hover:bg-white/5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-300/40 text-sky-300">
                  <span className="h-2 w-2 rounded-full bg-sky-300" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-100">
                  {f.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#technology"
              className="group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              style={{ background: "linear-gradient(90deg, #1e88ff, #0b1e3a)" }}
            >
              Explore Technology
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#team"
              className="inline-flex h-12 items-center rounded-full border border-slate-300 bg-white/60 px-6 text-sm font-semibold text-slate-800 backdrop-blur transition-all hover:bg-white"
            >
              Meet the Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
