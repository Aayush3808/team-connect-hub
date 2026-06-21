import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Logo } from "@/components/swamn/Logo";
import heroIllustration from "@/assets/hero-illustration.jpg";

const facts = [
  ["Founded", "2025 · Sunbeam School, Mughalsarai"],
  ["Mission", "Autonomous, AI-assisted systems to clean rivers, lakes, and oceans"],
  ["SDGs", "14 · 12 · 7"],
  ["Contact", "support@swamn.com"],
];

const Press = () => (
  <main className="min-h-dvh bg-background">
    <Helmet>
      <title>Press Kit — SWAMN</title>
      <meta name="description" content="SWAMN brand assets, boilerplate, and contact information for journalists and partners." />
      <link rel="canonical" href="https://swamn.com/press" />
    </Helmet>

    <header className="container flex items-center justify-between py-6">
      <Link to="/" aria-label="SWAMN home"><Logo size={26} /></Link>
      <Link to="/" className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-navy hover:bg-secondary">← Back home</Link>
    </header>

    <section className="container pb-24 pt-10 md:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
          Press Kit
        </div>
        <h1 className="h-display text-4xl text-navy md:text-5xl">Press &amp; <span className="h-serif text-gradient">media kit</span></h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Brand assets, boilerplate, and contacts for journalists, partners, and event organizers covering SWAMN.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-5xl space-y-10">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <img
            src={heroIllustration}
            alt="Illustration of SWAMN autonomous cleanup bots gathering plastic waste"
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className="aspect-video w-full object-cover"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="text-sm text-navy">Hero illustration — free for editorial use with credit to SWAMN.</div>
            <a href={heroIllustration} download className="inline-flex h-9 items-center rounded-full border border-border bg-secondary px-4 text-xs font-medium text-navy hover:bg-card">Download</a>
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h2 className="h-display text-2xl text-navy">Boilerplate</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            SWAMN is a student-led environmental engineering initiative from Sunbeam School, Mughalsarai (Uttar Pradesh, India).
            The team designs autonomous surface bots and self-sealing containment pods that use computer vision and AI-driven
            navigation to clean rivers, lakes, harbours, and coastal waters. SWAMN's work aligns with UN Sustainable Development
            Goals 14 (Life Below Water), 12 (Responsible Consumption), and 7 (Affordable Clean Energy).
          </p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h2 className="h-display text-2xl text-navy">Fact sheet</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-border bg-soft p-5">
                <dt className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">{k}</dt>
                <dd className="mt-2 text-sm text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h2 className="h-display text-2xl text-navy">Logo &amp; brand</h2>
          <p className="mt-3 text-sm text-muted-foreground">Use the SWAMN wordmark on light or dark backgrounds. Keep clear space equal to the cap height around the mark.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-center rounded-2xl border border-border bg-card p-10">
              <Logo size={56} />
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-border bg-navy p-10 text-primary-foreground">
              <Logo size={56} variant="light" />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <h2 className="h-display text-2xl text-navy">Press contact</h2>
          <p className="mt-3 text-sm text-muted-foreground">For interviews, quotes, or additional assets:</p>
          <a href="mailto:support@swamn.com" className="story-link mt-4 inline-block text-sm font-medium text-navy">support@swamn.com</a>
        </section>
      </div>
    </section>
  </main>
);

export default Press;
