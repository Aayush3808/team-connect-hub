import { MouseEvent } from "react";
import { SectionHeader } from "./SectionHeader";
import rishiPhoto from "@/assets/team/Rishi.jpeg.asset.json";
import mananPhoto from "@/assets/team/Manan.jpeg.asset.json";
import annapurnaPhoto from "@/assets/team/Annapurna.jpeg.asset.json";
import adarshPhoto from "@/assets/team/Adarsh.jpeg.asset.json";
import vaibhavPhoto from "@/assets/team/Vaibhav.jpeg.asset.json";

const team = [
  {
    name: "Rishi Singh",
    role: "Lead Innovator",
    sub: "Bot & Dock Designer",
    desc: "Leads the technical vision of SWAMN — designs the autonomous bot and docking model, and drives AI, embedded systems, and end-to-end engineering.",
    initials: "RS",
    email: "rishisingh@swamn.com",
    photo: rishiPhoto.url,
  },
  {
    name: "Vaibhav Raj",
    role: "Branding, Media & Communications",
    sub: "Identity & Outreach",
    desc: "Shapes SWAMN's visual identity, social presence, and digital communications — building a strong, premium identity for the initiative.",
    initials: "VR",
    email: "",
  },
  {
    name: "Aayush Kumar Singh",
    role: "Branding, Media & Communications",
    sub: "Identity & Outreach",
    desc: "Shapes SWAMN's visual identity, social presence, and digital communications — building a strong, premium identity for the initiative.",
    initials: "AK",
    email: "",
  },
  {
    name: "Manan",
    role: "Finance Manager",
    sub: "Budget & Resources",
    desc: "Oversees budgeting, resource planning, and the financial stewardship that keeps SWAMN's development sustainable and accountable.",
    initials: "MN",
    email: "",
    photo: mananPhoto.url,
  },
  {
    name: "Satvik",
    role: "Pitch Handler",
    sub: "Narrative & Presentation",
    desc: "Owns SWAMN's pitch end-to-end — shapes the narrative, builds the deck, and delivers it. Translates complex engineering and real-world impact into a clear, persuasive story that resonates with judges, partners, and investors.",
    initials: "SK",
    email: "",
  },
  {
    name: "Annapurna",
    role: "Human Resources",
    sub: "People & Culture",
    desc: "Leads people operations at SWAMN — onboarding, team coordination, and culture. Keeps the team aligned, motivated, and moving in sync, ensuring every member has the clarity and support they need to do their best work.",
    initials: "AN",
    email: "",
    photo: annapurnaPhoto.url,
  },
  {
    name: "Adarsh Kumar",
    role: "Human Resources",
    sub: "People & Culture",
    desc: "Supports people operations at SWAMN — helping onboard new members, coordinate team activities, and maintain a healthy, collaborative culture. Acts as a bridge across roles to keep everyone aligned and engaged.",
    initials: "AK",
    email: "",
    photo: adarshPhoto.url,
  },
];

const onMove = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export const Team = () => (
  <section id="team" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Team"
        title={<>The minds behind <span className="h-serif text-gradient">SWAMN</span></>}
        description="A young team of innovators building the next generation of autonomous environmental systems."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m, i) => (
          <article
            key={m.name}
            onMouseMove={onMove}
            className="reveal group card-premium spotlight-card overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-glow"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <div aria-hidden className="absolute inset-0 bg-aqua opacity-90" style={{ background: "var(--gradient-aqua)" }} />
              <div aria-hidden className="absolute inset-0 animate-drift opacity-30"
                   style={{ background: "radial-gradient(50% 50% at 30% 30%, hsl(0 0% 100%/0.6), transparent)" }} />
              {m.photo ? (
                <img
                  src={m.photo}
                  alt={`${m.name} — ${m.role}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  <div className="h-display text-7xl text-primary-foreground/90">{m.initials}</div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 group-hover:-translate-y-1">
                <div className="rounded-xl glass p-4">
                  <div className="h-display text-lg text-navy">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.role} · {m.sub}</div>
                </div>
              </div>
            </div>
            <div className="p-7">
              <p className="text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  className="story-link mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-navy transition-colors hover:text-aqua"
                >
                  {m.email}
                  <span aria-hidden>→</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
