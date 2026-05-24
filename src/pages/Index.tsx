import { Helmet } from "react-helmet-async";
import { useReveal } from "@/hooks/useReveal";
import { Nav } from "@/components/swamn/Nav";
import { Hero } from "@/components/swamn/Hero";
import { Problem } from "@/components/swamn/Problem";
import { About } from "@/components/swamn/About";
import { Architecture } from "@/components/swamn/Architecture";
import { Workflow } from "@/components/swamn/Workflow";
import { Performance } from "@/components/swamn/Performance";
import { Hardware } from "@/components/swamn/Hardware";
import { Impact } from "@/components/swamn/Impact";
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
        <title>SWAMN — Autonomous AI Systems for Cleaner Oceans & Rivers</title>
        <meta name="description" content="SWAMN builds autonomous, AI-assisted surface bots and smart docking stations that detect and collect floating plastic waste from oceans, rivers, and lakes." />
        <link rel="canonical" href="https://swamn.com/" />
        <meta property="og:url" content="https://swamn.com/" />
      </Helmet>
      <Nav />
      <Hero />
      <Problem />
      <About />
      <Architecture />
      <Workflow />
      <Performance />
      <Hardware />
      <Impact />
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
