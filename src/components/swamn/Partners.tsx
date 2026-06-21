const partners = [
  "Sunbeam School",
  "Namami Gange",
  "INSPIRE Awards",
  "IIT Guwahati",
  "IIT Delhi",
  "UN SDG 14",
];

export const Partners = () => (
  <section className="border-t border-border bg-soft py-16">
    <div className="container">
      <div className="text-center">
        <div className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          Supported &amp; recognized by
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 md:grid-cols-6">
        {partners.map((p) => (
          <div
            key={p}
            className="flex h-20 items-center justify-center bg-card px-4 text-center text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-navy"
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  </section>
);
