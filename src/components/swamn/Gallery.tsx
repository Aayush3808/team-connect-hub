import { SectionHeader } from "./SectionHeader";
import img1 from "@/assets/gallery/7.24.54.jpeg.asset.json";
import img2 from "@/assets/gallery/7.24.55.jpeg.asset.json";
import img3 from "@/assets/gallery/7.24.56.jpeg.asset.json";
import img4 from "@/assets/gallery/7.24.57.jpeg.asset.json";
import img5 from "@/assets/gallery/7.24.58.jpeg.asset.json";
import img6 from "@/assets/gallery/7.24.58_1.jpeg.asset.json";
import img7 from "@/assets/gallery/7.25.00.jpeg.asset.json";
import img8 from "@/assets/gallery/7.25.00_1.jpeg.asset.json";

const shots = [
  { src: img2.url, caption: "Adarsh sampling contaminated river water at the ghat" },
  { src: img3.url, caption: "Rishi & Adarsh on-site during prototype field testing" },
  { src: img1.url, caption: "Field water testing — evaluating pollutant load" },
  { src: img8.url, caption: "Manan collecting a surface water sample near the boats" },
  { src: img7.url, caption: "Debris and dumped waste along the riverbank" },
  { src: img6.url, caption: "Documenting shoreline waste for aggregation planning" },
  { src: img5.url, caption: "Boat-side survey — mapping floating waste hotspots" },
  { src: img4.url, caption: "Close-up: plastic, organic waste and hyacinth on the surface" },
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
