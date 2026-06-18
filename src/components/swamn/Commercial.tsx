import { SectionHeader } from "./SectionHeader";

const costs = [
  { label: "Aggregation Bot", scope: "River / Lake", v: "₹50k–60k", note: "Per unit at prototype scale" },
  { label: "Aggregation Bot", scope: "Ocean Variant", v: "₹1.3 Lakh", note: "Ruggedised for open-water ops" },
  { label: "Containment Pod", scope: "Passive Unit", v: "₹3k–5k", note: "No motor · No battery · Passive" },
];

const throughput = [
  { v: "200–500 kg", l: "Waste collected per bot per day", s: "At low patrol speed · 10–12 hr ops" },
  { v: "₹1,600–7,500", l: "PET revenue potential per bot per day", s: "At ₹8k–15k per tonne" },
  { v: "1–2.5 tonnes", l: "Daily collection · 5-bot fleet", s: "Covering a 2 km river stretch" },
  { v: "₹8,000–37,500", l: "Daily recoverable material value", s: "PET alone, before HDPE & organics" },
];

const compare = [
  { c: "Primary Environment", a: "Open ocean gyres", b: "Harbours, marinas", s: "Rivers, lakes, harbours, flood zones" },
  { c: "Collection", a: "Passive boom + tow vessels", b: "Onboard conveyor & bin", s: "U-shaped boom + sealed pods" },
  { c: "Waste Storage", a: "Onboard; offload trip needed", b: "Onboard bin (~500 L)", s: "Floating pods — no shore trip" },
  { c: "Continuous Operation", a: "Vessel return cycle", b: "Limited by bin capacity", s: "24-hour pod-release model" },
  { c: "Cost per Unit", a: "Multi-million USD", b: "€24k–40k", s: "₹50k–1.3 Lakh per bot" },
  { c: "Scalability", a: "Centralised, low", b: "Independent units", s: "Swarm architecture, modular" },
  { c: "Developing-World Fit", a: "Not designed for it", b: "Cost still high", s: "Core design goal" },
];

export const Commercial = () => (
  <section id="commercial" className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Commercial Viability"
        title={<>Built to actually <span className="h-serif text-gradient">pay for itself</span></>}
        description="Environmental projects fail for two reasons: they run out of money, or nobody wants to pay for them. SWAMN is engineered with both problems in mind — role separation drops unit cost, and what comes out of the water funds keeping it clean."
      />

      {/* Cost cards */}
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {costs.map((c, i) => (
          <div key={c.label + c.scope} className="reveal card-premium p-8" style={{ transitionDelay: `${i * 60}ms` }}>
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">{c.scope}</div>
            <div className="mt-3 h-display text-2xl text-navy">{c.label}</div>
            <div className="mt-5 h-serif text-4xl text-gradient">{c.v}</div>
            <div className="mt-2 text-xs text-muted-foreground">{c.note}</div>
          </div>
        ))}
      </div>

      {/* Throughput */}
      <div className="reveal mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
        {throughput.map((t) => (
          <div key={t.l} className="bg-card p-7">
            <div className="h-display text-2xl text-navy">{t.v}</div>
            <div className="mt-2 text-sm text-navy/80">{t.l}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t.s}</div>
          </div>
        ))}
      </div>

      {/* Competitive Landscape */}
      <div className="reveal mt-20">
        <div className="text-center text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">
          Competitive Landscape
        </div>
        <h3 className="mt-4 text-center h-display text-2xl text-navy md:text-3xl">
          Where SWAMN stands against the field
        </h3>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-4 gap-px bg-border text-sm">
            <div className="bg-card p-4 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">Criterion</div>
            <div className="bg-card p-4 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">The Ocean Cleanup</div>
            <div className="bg-card p-4 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">WasteShark</div>
            <div className="bg-navy p-4 text-[0.7rem] uppercase tracking-[0.18em] text-aqua">SWAMN</div>
            {compare.map((row) => (
              <div key={row.c} className="contents">
                <div className="bg-card p-4 text-navy/90">{row.c}</div>
                <div className="bg-card p-4 text-muted-foreground">{row.a}</div>
                <div className="bg-card p-4 text-muted-foreground">{row.b}</div>
                <div className="bg-card p-4 text-navy font-medium">{row.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
