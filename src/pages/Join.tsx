import { useEffect, useRef, useState, FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/swamn/Logo";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  intent: z.enum(["suggestion", "join", "sponsor"]),
  benefit: z.string().trim().max(1000).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Join = () => {
  const [params] = useSearchParams();
  const initialIntent = (params.get("intent") as "suggestion" | "join" | "sponsor") || "suggestion";
  const tier = params.get("tier");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState<"suggestion" | "join" | "sponsor">(initialIntent);
  const [benefit, setBenefit] = useState("");
  const [message, setMessage] = useState(tier ? `I'm interested in sponsoring at the ${tier} tier.\n\n` : "");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => { startedAt.current = Date.now(); }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (Date.now() - startedAt.current < 2000) {
      toast.error("Please take a moment to fill in the form.");
      return;
    }
    const parsed = schema.safeParse({ name, email, intent, benefit, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      intent: parsed.data.intent,
      benefit: parsed.data.benefit || null,
      message: parsed.data.message,
      source: tier ? `sponsor:${tier}` : "join",
    });
    setSubmitting(false);

    if (error) {
      toast.error("Could not send right now. Please email support@swamn.com.");
      return;
    }
    setSent(true);
    toast.success("Thank you — we'll be in touch soon.");
    setName(""); setEmail(""); setBenefit(""); setMessage("");
  };

  return (
    <main className="min-h-dvh bg-background">
      <Helmet>
        <title>Join the Mission — SWAMN</title>
        <meta name="description" content="Partner, sponsor, or join SWAMN — a student-led team building autonomous AI systems to clean oceans, rivers, and lakes." />
        <link rel="canonical" href="https://swamn.com/join" />
      </Helmet>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero" />
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-aqua opacity-25 blur-3xl" />

      <header className="relative z-10 container flex items-center justify-between py-6">
        <Link to="/" aria-label="SWAMN home"><Logo size={26} /></Link>
        <Link to="/" className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-navy hover:bg-secondary">← Back home</Link>
      </header>

      <section className="relative z-10 container pb-24 pt-10 md:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
            Join the Mission
          </div>
          <h1 className="h-display text-4xl text-navy md:text-5xl">
            Help shape <span className="h-serif text-gradient">cleaner waters</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Share an idea, sponsor the work, or tell us you want to join SWAMN. Submissions land in our team inbox.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-2xl rounded-3xl border border-border bg-card p-7 shadow-card md:p-10">
          {/* honeypot */}
          <div className="hidden" aria-hidden>
            <label>Leave this empty<input value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" /></label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Your name</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={100}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none focus:border-navy/40"
                placeholder="Your name" />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Email</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none focus:border-navy/40"
                placeholder="you@example.com" />
            </label>
          </div>

          <fieldset className="mt-6">
            <legend className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">I'd like to</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                { v: "suggestion", l: "Share a suggestion" },
                { v: "join", l: "Join the team" },
                { v: "sponsor", l: "Sponsor SWAMN" },
              ].map((o) => (
                <label key={o.v}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition-all ${
                    intent === o.v ? "border-navy bg-navy text-primary-foreground" : "border-border bg-background text-navy hover:border-navy/40"
                  }`}>
                  <input type="radio" name="intent" value={o.v} checked={intent === o.v}
                    onChange={() => setIntent(o.v as typeof intent)} className="sr-only" />
                  {o.l}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-6 block">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">How can you contribute? (optional)</span>
            <textarea value={benefit} onChange={(e) => setBenefit(e.target.value)} maxLength={1000} rows={3}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none focus:border-navy/40"
              placeholder="Skills, experience, or resources you bring." />
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Your message</span>
            <textarea required value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={5}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none focus:border-navy/40"
              placeholder="Tell us about your idea, sponsorship, or why you want to join." />
          </label>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={submitting}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-navy px-6 text-sm font-medium text-primary-foreground hover:bg-navy-deep shadow-glow disabled:opacity-60">
              {submitting ? "Sending…" : "Send message →"}
            </button>
            <a href="mailto:support@swamn.com" className="inline-flex h-12 items-center px-2 text-sm font-medium text-navy/80 hover:text-navy">
              Or email us directly
            </a>
          </div>

          {sent && (
            <p className="mt-5 text-xs text-muted-foreground">Your message was received. We'll follow up at the email you provided.</p>
          )}
        </form>
      </section>
    </main>
  );
};

export default Join;
