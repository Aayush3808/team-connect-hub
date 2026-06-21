import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/swamn/Logo";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string;
  cover_url: string | null;
  author: string;
  published_at: string | null;
};

const UpdatePost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .not("published_at", "is", null)
      .maybeSingle()
      .then(({ data }) => {
        setPost((data as Post) ?? null);
        setLoading(false);
      });
  }, [slug]);

  return (
    <main className="min-h-dvh bg-background">
      <Helmet>
        <title>{post ? `${post.title} — SWAMN Updates` : "Update — SWAMN"}</title>
        {post?.excerpt && <meta name="description" content={post.excerpt} />}
        <link rel="canonical" href={`https://swamn.com/updates/${slug}`} />
        {post && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            datePublished: post.published_at,
            author: { "@type": "Organization", name: post.author },
            publisher: { "@type": "Organization", name: "SWAMN" },
          })}</script>
        )}
      </Helmet>

      <header className="container flex items-center justify-between py-6">
        <Link to="/" aria-label="SWAMN home"><Logo size={26} /></Link>
        <Link to="/updates" className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-navy hover:bg-secondary">← All updates</Link>
      </header>

      <article className="container mx-auto max-w-3xl pb-24 pt-6 md:pt-12">
        {loading && <div className="text-center text-sm text-muted-foreground">Loading…</div>}
        {!loading && !post && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Update not found. <Link to="/updates" className="story-link text-navy">Back to all updates</Link>
          </div>
        )}
        {post && (
          <>
            <div className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
              {post.published_at && new Date(post.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              {" · "}{post.author}
            </div>
            <h1 className="mt-4 h-display text-4xl text-navy md:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>}
            <div className="hairline my-10" />
            <div className="prose prose-neutral max-w-none prose-headings:h-display prose-headings:text-navy prose-a:text-navy prose-strong:text-navy">
              <ReactMarkdown>{post.content_md}</ReactMarkdown>
            </div>
          </>
        )}
      </article>
    </main>
  );
};

export default UpdatePost;
