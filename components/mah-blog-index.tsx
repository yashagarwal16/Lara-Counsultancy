"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";
import { categories, formatDate, posts, readingMinutes, type Category, type Post } from "./blog-data";
import { CategoryArt } from "./blog-art";

function PostCard({ post }: { post: Post }) {
  return (
    <article className="mah-bpost">
      <Link href={`/blog/${post.slug}/`} aria-label={post.title}>
        <CategoryArt category={post.category} />
      </Link>
      <div className="mah-bpost-meta">
        <span className="mah-bpost-tag">{post.category}</span>
        <span><Clock size={12} aria-hidden="true" /> {readingMinutes(post)} min read</span>
      </div>
      <h3><Link href={`/blog/${post.slug}/`}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
      <div className="mah-bpost-foot">
        <small>{formatDate(post.date)}</small>
        <Link className="mah-text-link" href={`/blog/${post.slug}/`}>Read article <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

export function BlogIndex() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"All" | Category>("All");

  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!q || `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q))
    );
  }, [sorted, query, cat]);

  const featured = !query.trim() && cat === "All" ? sorted[0] : null;
  const list = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered;

  function reset() {
    setQuery("");
    setCat("All");
  }

  return (
    <main className="mah-content-page mah-blog">
      <section className="mah-content-hero compact mah-blog-hero">
        <p className="mah-kicker">Lara Assignment resources</p>
        <h1>Blog <em>&amp; Articles</em></h1>
        <p>Practical study guides on essays, research, referencing, and assignment planning.</p>
        <div className="mah-blog-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, e.g. abstract, outline, word count"
            aria-label="Search articles"
          />
        </div>
      </section>

      {featured && (
        <section className="mah-blog-featured-wrap">
          <article className="mah-feature-card">
            <Link href={`/blog/${featured.slug}/`} aria-label={featured.title}>
              <CategoryArt category={featured.category} large />
            </Link>
            <div>
              <p className="mah-kicker">Featured · {featured.category}</p>
              <h2><Link href={`/blog/${featured.slug}/`}>{featured.title}</Link></h2>
              <p>{featured.excerpt}</p>
              <div className="mah-bpost-meta">
                <span>{formatDate(featured.date)}</span>
                <span><Clock size={12} aria-hidden="true" /> {readingMinutes(featured)} min read</span>
              </div>
              <Link className="mah-orange-button" href={`/blog/${featured.slug}/`}>Read article <span>→</span></Link>
            </div>
          </article>
        </section>
      )}

      <section className="mah-blog-shell">
        <aside className="mah-blog-side">
          <h2>Categories</h2>
          <div className="mah-cat-list" role="group" aria-label="Filter by category">
            <button type="button" className={cat === "All" ? "active" : ""} onClick={() => setCat("All")}>
              All articles <span>{posts.length}</span>
            </button>
            {categories.map((name) => (
              <button key={name} type="button" className={cat === name ? "active" : ""} onClick={() => setCat(name)}>
                {name} <span>{posts.filter((p) => p.category === name).length}</span>
              </button>
            ))}
          </div>

          <div className="mah-side-cta">
            <p className="mah-kicker">Need support?</p>
            <h3>Tell us about your assignment.</h3>
            <p>Share your subject, deadline, and requirements to get started.</p>
            <Link className="mah-orange-button" href="/order">Get started now <span>→</span></Link>
          </div>
        </aside>

        <div>
          <div className="mah-section-heading">
            <div>
              <p className="mah-kicker">{featured ? "More guidance" : "Search results"}</p>
              <h2>Ideas for your <em>next paper.</em></h2>
            </div>
            <span className="mah-blog-count">
              {filtered.length} article{filtered.length === 1 ? "" : "s"}
            </span>
          </div>

          {list.length ? (
            <div className="mah-bpost-grid">
              {list.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          ) : (
            !featured && (
              <div className="mah-blog-empty">
                <h3>No articles found</h3>
                <p>Try a different keyword or category.</p>
                <button type="button" className="mah-more" onClick={reset}>Clear search</button>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}