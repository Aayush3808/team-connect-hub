import { SectionHeader } from "./SectionHeader";

const milestones = [
  { phase: "Now",   title: "Submerged debris detection", desc: "Extending perception below the surface for partially-submerged plastics." },
  { phase: "Next",  title: "Open-water testing",         desc: "Field validation across rivers and harbor environments." },
  { phase: "2026",  title: "Multi-system coordination",  desc: "Coordinated fleet behavior with shared mapping and tasking." },
  { phase: "2027",  title: "Scalable deployment",        desc: "Modular dock networks and standardized unit economics." },
  { phase: "Vision",title: "Smarter autonomy",           desc: "Adaptive learning systems for dynamic environmental conditions." },
];

export const Roadmap = () => (
  <section className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Roadmap"
        title={<>What comes <span className="h-serif text-gradient">next</span></>}
        description="A measured path from validated prototype to globally deployed cleanup systems."
      />

      <ol className="reveal mx-auto mt-16 max-w-3xl">
        {milestones.map((m, i) => (
          <li key={m.title} className="relative grid grid-cols-[110px_1fr] gap-6 pb-10 last:pb-0">
            <div className="text-right">
              <div className="h-display text-sm tracking-[0.2em] text-muted-foreground">{m.phase}</div>
            </div>
            <div className="relative pl-8">
              <span aria-hidden className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-aqua ring-4 ring-background" />
              {i < milestones.length - 1 && (
                <span aria-hidden className="absolute left-[5px] top-5 h-full w-px bg-border" />
              )}
              <div className="h-display text-xl text-navy">{m.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
