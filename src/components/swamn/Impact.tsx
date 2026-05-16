import { SectionHeader } from "./SectionHeader";

const sdgs = [
  { id: "14", t: "Life Below Water", d: "Conserving and sustainably using marine resources." },
  { id: "12", t: "Responsible Consumption", d: "Reducing plastic waste through systemic recovery." },
  { id: "07", t: "Affordable Clean Energy", d: "Solar-powered, off-grid sustainable operation." },
];

const impacts = [
  { v: "Annual recovery", t: "Projected metric tonnes of plastic recovered per deployed fleet, scaling with unit count." },
  { v: "Fleet vision", t: "Coordinated multi-unit deployments across rivers, harbors and coastal regions." },
  { v: "Sustainable systems", t: "Solar-charged, low-impact, repairable hardware built for long-term operation." },
  { v: "Preservation goals", t: "Restoring biodiversity and water quality through continuous, autonomous cleanup." },
];

export const Impact = () => (
  <section id="impact" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Impact"
        title={<>Designed for <span className="h-serif text-gradient">real-world impact</span></>}
        description="SWAMN's mission is to make autonomous environmental cleanup ordinary — quietly working in the background, every day, everywhere there is water."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {impacts.map((i, idx) => (
          <div key={i.v} className="reveal card-premium p-8" style={{ transitionDelay: `${idx * 60}ms` }}>
            <div className="h-display text-2xl text-navy">{i.v}</div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{i.t}</p>
          </div>
        ))}
      </div>

      <div className="reveal mt-16">
        <div className="text-center text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">
          Aligned with United Nations
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {sdgs.map((s) => (
            <div key={s.id} className="group relative overflow-hidden rounded-2xl border border-border bg-navy p-7 text-primary-foreground">
              <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-aqua opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40" />
              <div className="relative">
                <div className="text-[0.65rem] uppercase tracking-[0.32em] text-primary-foreground/60">SDG {s.id}</div>
                <div className="mt-3 h-display text-2xl">{s.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
