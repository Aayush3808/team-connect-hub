import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Logo } from "@/components/swamn/Logo";
import { Partners } from "@/components/swamn/Partners";

const tiers = [
  {
    name: "Friend",
    range: "₹5,000+",
    perks: [
      "Name listed on the sponsors page",
      "Quarterly progress updates",
      "Thank-you on social",
    ],
  },
  {
    name: "Catalyst",
    range: "₹25,000+",
    perks: [
      "Logo on sponsors page & press kit",
      "Invitation to demo days",
      "Behind-the-scenes prototype reports",
    ],
    featured: true,
  },
  {
    name: "Patron",
    range: "₹1,00,000+",
    perks: [
      "Co-branded pilot deployment naming",
      "Quarterly briefing with the team",
      "Featured profile in our annual report",
    ],
  },
];

const Sponsors = () => (
  <main className="min-h-dvh bg-background">
    <Helmet>
      <title>Sponsors &amp; Partners — SWAMN</title>
      <meta name="description" content="Sponsor SWAMN and help build autonomous AI systems that clean rivers, lakes, and oceans." />
      <link rel="canonical" href="https://swamn.com/sponsors" />
    </Helmet>

    <header className="container flex items-center justify-between py-6">
      <Link to="/" aria-label="SWAMN home"><Logo size={26} /></Link>
      <Link to="/" className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-navy hover:bg-secondary">← Back home</Link>
    </header>

    <section className="container pb-20 pt-10 md:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
          Sponsors &amp; Partners
        </div>
        <h1 className="h-display text-4xl text-navy md:text-5xl">
          Help fund a <span className="h-serif text-gradient">cleaner river</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          SWAMN runs on belief, late nights, and the support of partners who see what we see.
          Sponsorship directly funds prototypes, pilots, and the engineering work behind every cleanup run.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`flex flex-col rounded-3xl border p-8 shadow-card transition-all hover:-translate-y-0.5 ${
              t.featured
                ? "border-navy bg-navy text-primary-foreground"
                : "border-border bg-card"
            }`}
          >
            <div className={`text-[0.7rem] uppercase tracking-[0.22em] ${t.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {t.name}
            </div>
            <div className={`mt-2 h-display text-3xl ${t.featured ? "text-primary-foreground" : "text-navy"}`}>
              {t.range}
            </div>
            <ul className={`mt-6 flex-1 space-y-3 text-sm ${t.featured ? "text-primary-foreground/90" : "text-navy"}`}>
              {t.perks.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden className={t.featured ? "text-aqua" : "text-navy"}>✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <Link
              to={`/join?intent=sponsor&tier=${encodeURIComponent(t.name)}`}
              className={`mt-8 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-all ${
                t.featured
                  ? "bg-primary-foreground text-navy hover:bg-secondary"
                  : "bg-navy text-primary-foreground hover:bg-navy-deep"
              }`}
            >
              Become a {t.name.toLowerCase()} →
            </Link>
          </div>
        ))}
      </div>
    </section>

    <Partners />
  </main>
);

export default Sponsors;
