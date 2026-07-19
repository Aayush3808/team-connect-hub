import { SectionHeader } from "./SectionHeader";

const shots = [
  { src: "/images/gallery/7.24.55.jpeg", caption: "Rishi sampling contaminated river water at the ghat" },
  { src: "/images/gallery/7.24.56.jpeg", caption: "Rishi & Adarsh on-site during prototype field testing" },
  { src: "/images/gallery/7.24.54.jpeg", caption: "Field water testing — evaluating pollutant load" },
  { src: "/images/gallery/7.25.00_1.jpeg", caption: "Manan collecting a surface water sample near the boats" },
  { src: "/images/gallery/7.25.00.jpeg", caption: "Debris and dumped waste along the riverbank" },
  { src: "/images/gallery/7.24.58_1.jpeg", caption: "Documenting shoreline waste for aggregation planning" },
  { src: "/images/gallery/7.24.58.jpeg", caption: "Boat-side survey — mapping floating waste hotspots" },
  { src: "/images/gallery/7.24.57.jpeg", caption: "Close-up: plastic, organic waste and hyacinth on the surface" },
];

export const Gallery = () => (
  <section id="gallery" className="relative py-28 md:py-36 bg-secondary/30">
    <div className="container">
      <SectionHeader
        eyebrow="Gallery"
        title={<>On the ground with <span className="h-serif text-gradient">SWAMN</span></>}
        description="Rishi, Adarsh and Manan testing the prototype and surveying river conditions across pilot sites."
      />

      <div className="mt-16 columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
        {shots.map((s, i) => (
          <figure
            key={i}
            className="reveal group mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-glow"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="overflow-hidden">
              <img
                src={s.src}
                alt={s.caption}
                loading="lazy"
                decoding="async"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <figcaption className="p-4 text-xs text-muted-foreground">{s.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
