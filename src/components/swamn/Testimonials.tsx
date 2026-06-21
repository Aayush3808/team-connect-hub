import { SectionHeader } from "./SectionHeader";

const quotes = [
  {
    quote:
      "SWAMN's approach to splitting roles between bots and pods is the kind of systems thinking we rarely see at the student level.",
    name: "Dr. A. Mehta",
    role: "Science Mentor, Sunbeam School",
  },
  {
    quote:
      "An exemplary student-led initiative — clearly designed, ethically grounded, and genuinely useful for rivers like the Ganga.",
    name: "District Innovation Coordinator",
    role: "Uttar Pradesh",
  },
  {
    quote:
      "Watching this team prototype, fail, and rebuild has been inspiring. They are building something that matters.",
    name: "Parent & Supporter",
    role: "Mughalsarai",
  },
];

export const Testimonials = () => (
  <section className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="What people say"
        title={<>Voices from <span className="h-serif text-gradient">our community</span></>}
        description="Words from mentors, educators, and supporters who have followed SWAMN's journey."
      />
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {quotes.map((q, i) => (
          <figure
            key={q.name}
            className="reveal card-premium relative flex h-full flex-col p-8"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <svg
              aria-hidden
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-aqua"
            >
              <path
                d="M9 7H4v6h3c0 2-1 3-3 3v2c4 0 6-2 6-6V7zm11 0h-5v6h3c0 2-1 3-3 3v2c4 0 6-2 6-6V7z"
                fill="currentColor"
                opacity="0.8"
              />
            </svg>
            <blockquote className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-navy">
              "{q.quote}"
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-5">
              <div className="text-sm font-medium text-navy">{q.name}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {q.role}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Quotes are representative placeholders — replace with real testimonials as they come in.
      </p>
    </div>
  </section>
);
