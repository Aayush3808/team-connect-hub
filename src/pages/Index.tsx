import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useReveal } from "@/hooks/useReveal";
import { Nav } from "@/components/swamn/Nav";
import { Hero } from "@/components/swamn/Hero";
import { Problem } from "@/components/swamn/Problem";
import { About } from "@/components/swamn/About";
import { Architecture } from "@/components/swamn/Architecture";
import { Workflow } from "@/components/swamn/Workflow";
import { ScrollProgress } from "@/components/swamn/ScrollProgress";
import { BackToTop } from "@/components/swamn/BackToTop";
import { Footer } from "@/components/swamn/Footer";
import { Chatbot } from "@/components/swamn/Chatbot";

// Lazy-load below-the-fold sections
const Performance = lazy(() => import("@/components/swamn/Performance").then(m => ({ default: m.Performance })));
const Impact = lazy(() => import("@/components/swamn/Impact").then(m => ({ default: m.Impact })));
const Commercial = lazy(() => import("@/components/swamn/Commercial").then(m => ({ default: m.Commercial })));
const Algae = lazy(() => import("@/components/swamn/Algae").then(m => ({ default: m.Algae })));
const Challenges = lazy(() => import("@/components/swamn/Challenges").then(m => ({ default: m.Challenges })));
const FutureScope = lazy(() => import("@/components/swamn/FutureScope").then(m => ({ default: m.FutureScope })));
const Achievements = lazy(() => import("@/components/swamn/Achievements").then(m => ({ default: m.Achievements })));
const Testimonials = lazy(() => import("@/components/swamn/Testimonials").then(m => ({ default: m.Testimonials })));
const Team = lazy(() => import("@/components/swamn/Team").then(m => ({ default: m.Team })));
const Roadmap = lazy(() => import("@/components/swamn/Roadmap").then(m => ({ default: m.Roadmap })));
const CTA = lazy(() => import("@/components/swamn/CTA").then(m => ({ default: m.CTA })));
const FAQ = lazy(() => import("@/components/swamn/FAQ").then(m => ({ default: m.FAQ })));
const Partners = lazy(() => import("@/components/swamn/Partners").then(m => ({ default: m.Partners })));

const Fallback = () => <div className="py-20" aria-hidden />;

const Index = () => {
  useReveal();
  return (
    <main className="min-h-dvh bg-background">
      <Helmet>
        <title>SWAMN — Autonomous AI Cleanup for Rivers & Oceans</title>
        <meta name="description" content="SWAMN deploys autonomous AI bots and self-sealing pods to clean rivers, lakes and harbours continuously, 24/7." />
        <link rel="canonical" href="https://swamn.com/" />
        <meta property="og:title" content="SWAMN — Autonomous AI Cleanup for Rivers & Oceans" />
        <meta property="og:description" content="A three-part autonomous fleet — Aggregation Bots, Containment Pods, Retrieval Bots — cleaning waterways around the clock." />
        <meta property="og:url" content="https://swamn.com/" />
      </Helmet>
      <ScrollProgress />
      <Nav />
      <Hero />
      <Problem />
      <About />
      <Architecture />
      <Workflow />
      <Suspense fallback={<Fallback />}>
        <Performance />
        <Impact />
        <Commercial />
        <Algae />
        <Challenges />
        <FutureScope />
        <Achievements />
        <Testimonials />
        <Team />
        <Roadmap />
        <CTA />
        <FAQ />
        <Partners />
      </Suspense>
      <Footer />
      <Chatbot />
      <BackToTop />
    </main>
  );
};

export default Index;
