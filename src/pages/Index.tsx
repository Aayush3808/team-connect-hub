import { Helmet } from "react-helmet-async";
import { useReveal } from "@/hooks/useReveal";
import { Nav } from "@/components/swamn/Nav";
import { Hero } from "@/components/swamn/Hero";
import { Problem } from "@/components/swamn/Problem";
import { About } from "@/components/swamn/About";
import { Architecture } from "@/components/swamn/Architecture";
import { Workflow } from "@/components/swamn/Workflow";
import { Performance } from "@/components/swamn/Performance";
import { Impact } from "@/components/swamn/Impact";
import { Commercial } from "@/components/swamn/Commercial";
import { Algae } from "@/components/swamn/Algae";
import { Challenges } from "@/components/swamn/Challenges";
import { FutureScope } from "@/components/swamn/FutureScope";
import { Achievements } from "@/components/swamn/Achievements";
import { Team } from "@/components/swamn/Team";
import { Roadmap } from "@/components/swamn/Roadmap";
import { CTA } from "@/components/swamn/CTA";
import { FAQ } from "@/components/swamn/FAQ";
import { Footer } from "@/components/swamn/Footer";
import { Chatbot } from "@/components/swamn/Chatbot";

const Index = () => {
  useReveal();
  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>SWAMN — Autonomous AI Cleanup for Rivers & Oceans</title>
        <meta name="description" content="SWAMN deploys autonomous AI bots and self-sealing pods to clean rivers, lakes and harbours continuously, 24/7." />
        <link rel="canonical" href="https://member-magic-nest.lovable.app/" />
        <meta property="og:title" content="SWAMN — Autonomous AI Cleanup for Rivers & Oceans" />
        <meta property="og:description" content="A three-part autonomous fleet — Aggregation Bots, Containment Pods, Retrieval Bots — cleaning waterways around the clock." />
        <meta property="og:url" content="https://member-magic-nest.lovable.app/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What exactly is SWAMN?", "acceptedAnswer": { "@type": "Answer", "text": "SWAMN — the Autonomous Marine Waste Aggregation and Retrieval Ecosystem — is a three-component fleet of Aggregation Bots, self-sealing Containment Pods and Retrieval Bots that clean rivers, harbours, urban lakes and flood-affected zones around the clock." } },
            { "@type": "Question", "name": "Why split the system into three units instead of one robot?", "acceptedAnswer": { "@type": "Answer", "text": "Role separation. The Aggregation Bot never carries waste, the Retrieval Bot is purpose-built for towing, and the pods need no power at all. This keeps each unit lean, dramatically lowers cost per tonne recovered, and enables true 24-hour operation." } },
            { "@type": "Question", "name": "How does the autonomous sealing work?", "acceptedAnswer": { "@type": "Answer", "text": "Once onboard AI detects that the U-shaped containment boom is full, high-strength neodymium magnets at both ends connect automatically, closing it into a sealed floating pod that broadcasts its GPS location for retrieval." } },
            { "@type": "Question", "name": "Is it safe for marine and aquatic life?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The 0.5 m submerged skirt deliberately has no bottom, reducing entanglement risk, and AI-based obstacle detection triggers an automated abort if fauna is detected near the boom." } },
            { "@type": "Question", "name": "Where will SWAMN be deployed?", "acceptedAnswer": { "@type": "Answer", "text": "Pilot zones include the Ganga, Yamuna and Godavari, followed by harbours, urban lakes and flood-response deployments — scaling toward open-water and coastal applications." } },
            { "@type": "Question", "name": "How does it pay for itself?", "acceptedAnswer": { "@type": "Answer", "text": "Recovered PET and HDPE fetch ₹6,000–15,000 per tonne, coconut shells become activated carbon, and ceremonial flowers turn into natural dyes and compost. Combined with municipal contracts, CSR funding and Namami Gange schemes, the river funds its own cleanup." } },
            { "@type": "Question", "name": "How can I support or join the mission?", "acceptedAnswer": { "@type": "Answer", "text": "Use the Join the Mission button to send us a message, suggest an idea, or apply to join the team. Anything you submit goes straight to support@swamn.com." } }
          ]
        })}</script>
      </Helmet>
      <Nav />
      <Hero />
      <Problem />
      <About />
      <Architecture />
      <Workflow />
      <Performance />
      <Impact />
      <Commercial />
      <Algae />
      <Challenges />
      <FutureScope />
      <Achievements />
      <Team />
      <Roadmap />
      <CTA />
      <FAQ />
      <Footer />
      <Chatbot />
    </main>
  );
};

export default Index;
