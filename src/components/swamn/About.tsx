import { SectionHeader } from "./SectionHeader";

export const About = () => (
  <section className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="reveal">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
            What is SWAMN
          </div>
          <h2 className="h-display text-4xl text-navy md:text-5xl">
            An intelligent initiative for{" "}
            <span className="h-serif text-gradient">cleaner aquatic ecosystems.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            SWAMN builds autonomous systems that identify, collect, and manage floating plastic
            waste across oceans, rivers, and lakes. By combining AI-assisted monitoring, embedded
            systems, coordinated movement, and sustainable engineering, we are creating scalable
            solutions for the world's most critical waterways.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            {[
              ["Autonomous", "Self-navigating fleet"],
              ["Sustainable", "Solar-powered ops"],
              ["Scalable", "Modular by design"],
            ].map(([t, s]) => (
              <div key={t} className="card-premium p-4">
                <div className="font-medium text-navy">{t}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal relative">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border/70 bg-aqua shadow-card">
            <div aria-hidden className="absolute inset-0 opacity-90"
                 style={{ background: "var(--gradient-aqua)" }} />
            <div aria-hidden className="absolute inset-0 animate-drift opacity-40"
                 style={{ background: "radial-gradient(40% 50% at 30% 30%, hsl(0 0% 100%/0.5), transparent)" }} />
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <div className="text-center">
                <div className="h-display text-7xl text-primary-foreground md:text-8xl">2025</div>
                <div className="mt-3 text-sm uppercase tracking-[0.32em] text-primary-foreground/80">
                  Prototype demonstrated
                </div>
                <div className="mx-auto mt-6 h-px w-24 bg-primary-foreground/40" />
                <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-primary-foreground/90">
                  Built end-to-end by a self-driven team of student innovators.
                </p>
              </div>
            </div>
          </div>
          <div aria-hidden className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-aqua opacity-40 blur-3xl" />
        </div>
      </div>
    </div>
  </section>
);
