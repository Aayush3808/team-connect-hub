import { SectionHeader } from "./SectionHeader";

const stages = [
  { t: "Patrol & Detection", d: "Aggregation Bots autonomously patrol assigned zones while onboard AI analyses live video and sensor data to locate elevated debris density." },
  { t: "Containment Deployment", d: "On detecting a hotspot, the bot deploys its U-shaped boom from the rear chamber, expanding 50–60 m wide across the surface." },
  { t: "Waste Aggregation", d: "Moving forward at low speed, the vessel uses hydrodynamic flow to passively funnel floating debris into the containment zone — no suction, no conveyors." },
  { t: "Autonomous Sealing", d: "Once fill level is reached, neodymium magnets at both ends connect automatically, sealing the boom into a self-contained floating pod." },
  { t: "Pod Release & Continued Ops", d: "The sealed pod is released and broadcasts its GPS position. The Aggregation Bot deploys a fresh boom and immediately resumes cleanup." },
  { t: "Retrieval & Transport", d: "A Retrieval Bot homes in on the pod's beacon, docks via magnetic connectors, and tows it to the nearest shore recovery or recycling station." },
];

export const Performance = () => (
  <section id="performance" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Methodology"
        title={<>How SWAMN <span className="h-serif text-gradient">actually works</span></>}
        description="Six continuous stages that run quietly in the background — cleaning a waterway while the city around it sleeps, wakes, or goes about its day."
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map((c, i) => (
          <div
            key={c.t}
            className="reveal card-premium group overflow-hidden p-7 transition-all hover:-translate-y-0.5"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-2 w-2 rounded-full bg-aqua" />
              <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Stage {String(i + 1).padStart(2, "0")}</div>
            </div>
            <div className="mt-5 h-display text-xl text-navy">{c.t}</div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
