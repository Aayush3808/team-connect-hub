import { SectionHeader } from "./SectionHeader";

const capabilities = [
  {
    t: "Vision-Based Detection",
    d: "An onboard camera and AI model identify floating waste in real time across changing water conditions.",
  },
  {
    t: "Autonomous Navigation",
    d: "Coordinated, self-directed movement across the surface — designed to operate without manual control.",
  },
  {
    t: "Reliable Docking",
    d: "A return-to-base routine for unloading collected waste and recharging between operational cycles.",
  },
  {
    t: "Continuous Operation",
    d: "Solar-assisted endurance enables extended runs with minimal downtime and energy overhead.",
  },
  {
    t: "Sustainable Build",
    d: "Low-impact materials and reusable hardware keep the system aligned with its environmental purpose.",
  },
  {
    t: "Modular Architecture",
    d: "Engineered to scale across rivers, lakes, and coastal zones — adaptable to varied water bodies.",
  },
];

export const Performance = () => (
  <section id="performance" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Capabilities"
        title={<>Engineered for <span className="h-serif text-gradient">reliability</span></>}
        description="The principles guiding SWAMN's design — from perception and movement to endurance and scale."
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c, i) => (
          <div
            key={c.t}
            className="reveal card-premium group overflow-hidden p-7 transition-all hover:-translate-y-0.5"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-2 w-2 rounded-full bg-aqua" />
              <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Capability</div>
            </div>
            <div className="mt-5 h-display text-xl text-navy">{c.t}</div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
