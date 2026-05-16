import { SectionHeader } from "./SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What exactly is SWAMN?",
    a: "SWAMN is a student-led initiative building autonomous surface bots and smart docking stations that help clean rivers, lakes, and other water bodies using AI-driven navigation.",
  },
  {
    q: "Who is behind SWAMN?",
    a: "A small team of young innovators handling engineering, business strategy, branding, finance, and storytelling — see the Team section for everyone involved.",
  },
  {
    q: "How can I support or join the mission?",
    a: "Use the Join the Mission button to send us a message, suggest an idea, or apply to join the team. Anything you submit goes straight to support@swamn.com.",
  },
  {
    q: "Is SWAMN open for partnerships or sponsorships?",
    a: "Yes — schools, NGOs, sponsors and municipalities can reach out via support@swamn.com. We're actively looking for partners to deploy pilot units.",
  },
  {
    q: "Where will SWAMN be deployed?",
    a: "Our roadmap starts with local rivers, lakes and ponds, then scales to larger rivers, harbors and coastal zones — and ultimately to the open ocean. SWAMN is built for all water bodies, not just small ones.",
  },
  {
    q: "Do you have a working prototype?",
    a: "We're iterating on the bot and docking station design. Follow our updates or get in touch for the latest progress.",
  },
];

export const FAQ = () => (
  <section id="faq" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="FAQ"
        title={
          <>
            Frequently <span className="h-serif text-gradient">asked</span>
          </>
        }
        description="Quick answers about SWAMN, the team, and how to get involved."
      />

      <div className="mx-auto mt-14 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="reveal rounded-2xl border border-border bg-card px-6 shadow-card"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <AccordionTrigger className="text-left text-base font-medium text-navy hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);
