import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/swamn/Logo";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string | null;
  author: string;
};

const Updates = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id, slug, title, excerpt, published_at, author")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data ?? []) as Post[]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-dvh bg-background">
      <Helmet>
        <title>Updates — SWAMN</title>
        <meta name="description" content="Project updates, milestones, and field notes from the SWAMN team." />
        <link rel="canonical" href="https://swamn.com/updates" />
      </Helmet>

      <header className="container flex items-center justify-between py-6">
        <Link to="/" aria-label="SWAMN home"><Logo size={26} /></Link>
        <Link to="/" className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-navy hover:bg-secondary">← Back home</Link>
      </header>

      <section className="container pb-24 pt-10 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
            Updates
          </div>
          <h1 className="h-display text-4xl text-navy md:text-5xl">
            Field notes & <span className="h-serif text-gradient">milestones</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Progress reports, technical learnings, and stories from our journey toward cleaner waters.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5">
          {loading && <div className="text-center text-sm text-muted-foreground">Loading…</div>}
          {!loading && posts.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No updates yet. Check back soon.
            </div>
          )}
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/updates/${p.slug}`}
              className="group rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:border-navy/40"
            >
              <div className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
                {p.published_at && new Date(p.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                {" · "}{p.author}
              </div>
              <h2 className="mt-3 h-display text-2xl text-navy group-hover:text-navy-deep">{p.title}</h2>
              {p.excerpt && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>}
              <div className="mt-5 text-sm font-medium text-navy">Read update →</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Updates;
