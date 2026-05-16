import { SectionHeader } from "./SectionHeader";

const layers = [
  {
    n: "01",
    title: "Perception Layer",
    tag: "Vision & AI",
    desc: "Pi Camera Module v2 provides continuous live monitoring of the water surface. An AI-assisted classification pipeline identifies floating plastics in real time, even amid surface noise and reflections.",
    points: ["Pi Camera Module v2", "AI-assisted detection", "Real-time waste recognition"],
  },
  {
    n: "02",
    title: "Control Layer",
    tag: "Compute & Navigation",
    desc: "A Raspberry Pi 5 paired with ESP32 modules orchestrates motors, sensors, and GPS telemetry. Together they coordinate intelligent, autonomous movement toward identified targets.",
    points: ["Raspberry Pi 5 core", "ESP32 sensor mesh", "GPS guided navigation"],
  },
  {
    n: "03",
    title: "Power Layer",
    tag: "Sustainable Energy",
    desc: "A solar charging dock and integrated battery management keep systems running for hours of continuous operation, with autonomous return-to-dock for sustained, off-grid deployment.",
    points: ["Solar charging dock", "Battery management", "Auto return-to-dock"],
  },
];

export const Architecture = () => (
  <section id="technology" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="System Architecture"
        title={<>Three layers of <span className="h-serif text-gradient">intelligence</span></>}
        description="A modular architecture that combines perception, control, and power into a single coordinated system — engineered to be reliable, sustainable, and elegantly simple."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {layers.map((l, i) => (
          <article
            key={l.n}
            className="reveal group relative card-premium overflow-hidden p-8 transition-all duration-500 hover:-translate-y-1"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aqua/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="flex items-center justify-between">
              <span className="h-display text-sm tracking-[0.22em] text-muted-foreground">{l.n}</span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                {l.tag}
              </span>
            </div>
            <h3 className="mt-6 h-display text-2xl text-navy">{l.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l.desc}</p>
            <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
              {l.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-navy/90">
                  <span className="h-1 w-1 rounded-full bg-aqua" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  </section>
);
