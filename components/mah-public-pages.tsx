"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Award, BookOpen, Check, ChevronDown, Clock, ClipboardCheck, Globe2, GraduationCap, Mail, MessageCircle, Phone, Quote, RefreshCw, Search, ShieldCheck, Star, Users } from "lucide-react";
import { reviews, SHOW_PLACEHOLDER_CARDS as SHOWING_SAMPLES, type Review } from "./reviews-data";
import { useSiteSettings } from "./use-site-settings";
import { MahPageFrame } from "./mah-public";
import "./mah-public-pages.css";

/* =====================================================================
   REVIEWS PAGE (new version)
   ===================================================================== */

const FILTERS = ["All", "Dissertation Support", "Assignment Assistance", "Research Guidance", "Coursework Guidance", "Proofreading & Editing"] as const;
type Filter = (typeof FILTERS)[number];

const SORTS = ["Newest", "Highest rated"] as const;
type Sort = (typeof SORTS)[number];

const PAGE_SIZE = 8;

const SERVICE_ICON = {
  "Dissertation Support": BookOpen,
  "Assignment Assistance": ClipboardCheck,
  "Research Guidance": Search,
  "Coursework Guidance": GraduationCap,
  "Proofreading & Editing": Check,
} as const;

const HIGHLIGHTS = [
  { icon: Clock, title: "Deadline awareness", text: "Students often mention how support was planned around their submission dates." },
  { icon: MessageCircle, title: "Clear communication", text: "Prompt replies and progress updates are a common theme in student feedback." },
  { icon: GraduationCap, title: "Subject knowledge", text: "Feedback highlights research quality and understanding of course requirements." },
  { icon: RefreshCw, title: "Revision support", text: "Students value being able to request changes when something needs adjusting." },
];

const REVIEW_FAQS = [
  {
    q: "How are these reviews collected?",
    a: SHOWING_SAMPLES
      ? "The feedback currently shown is sample content used to preview this page. Once the site goes live, only feedback shared by students with their permission will be displayed."
      : "Feedback is shared by students after their support is completed, and shown with their permission.",
  },
  { q: "Will my personal details be shown?", a: "No. Reviews show only the subject, service type, rating, and date. Names, emails, and university details are not published." },
  { q: "Can I share my own feedback?", a: "Yes. Use the contact page to send your feedback to the support team and tell us which subject or service it relates to." },
  { q: "Do reviews guarantee a particular result?", a: "No. Individual experiences and requirements vary, so reviews are a reference point and not a promise of outcome." },
];

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="mah-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} fill={n <= rating ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const Icon = SERVICE_ICON[review.service as keyof typeof SERVICE_ICON] ?? BookOpen;
  return (
    <article>
      <div className="mah-review-head">
        <div className="mah-review-profile">
          <img className="mah-review-photo" src={review.photo} alt={`${review.name} profile`} />
          <span className="mah-review-badge"><Icon size={18} aria-hidden="true" /></span>
        </div>
        <Stars rating={review.rating ?? 0} />
      </div>
      <h3>{review.name}</h3>
      <p>{review.text ?? "Approved student feedback will be added here."}</p>
      <small>{review.service}{review.date ? ` · ${formatDate(review.date)}` : ""}</small>
    </article>
  );
}

export function MahReviewsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("Newest");
  const [shown, setShown] = useState(PAGE_SIZE);

  const { average, count, distribution } = useMemo(() => {
    const ratedReviews = reviews.filter((r) => r.rating !== undefined);
    const total = ratedReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0);
    return {
      average: ratedReviews.length ? (total / ratedReviews.length).toFixed(1) : "–",
      count: ratedReviews.length,
      distribution: [5, 4, 3, 2, 1].map((star) => {
        const n = reviews.filter((r) => r.rating === star).length;
        return { star, n, pct: ratedReviews.length ? Math.round((n / ratedReviews.length) * 100) : 0 };
      }),
    };
  }, []);

  const featured = reviews.find((r) => r.text && r.rating) ?? reviews[0];

  const visible = useMemo(() => {
    const list = filter === "All" ? [...reviews] : reviews.filter((r) => r.service === filter);
    list.sort((a, b) =>
      sort === "Newest"
        ? (b.date ?? "").localeCompare(a.date ?? "")
        : (b.rating ?? 0) - (a.rating ?? 0) || (b.date ?? "").localeCompare(a.date ?? "")
    );
    return list;
  }, [filter, sort]);

  return (
    <MahPageFrame>
      <main className="mah-content-page">
        {/* Hero */}
        <section className="mah-content-hero mah-review-hero">
          <p className="mah-kicker">Student feedback</p>
          <h1>Lara Assignment <em>Reviews</em></h1>
          <p>Read feedback from students who have used academic support for research, writing, editing, and other coursework needs.</p>
          <div className="mah-rating-summary">
            <strong>{average}/5</strong>
            <span><Star size={16} fill="currentColor" /> Based on {count} review{count === 1 ? "" : "s"}</span>
          </div>
        </section>

        {/* Rating breakdown + featured quote */}
        {featured && (
          <section className="mah-content-section mah-review-overview">
            <div className="mah-score-card">
              <p className="mah-kicker">Rating breakdown</p>
              <div className="mah-score-big">
                <strong>{average}</strong>
                <div>
                  <Stars rating={Math.round(Number(average)) || 0} size={18} />
                  <small>{count} review{count === 1 ? "" : "s"}</small>
                </div>
              </div>
              {distribution.map(({ star, n, pct }) => (
                <div className="mah-bar-row" key={star}>
                  <span>{star} ★</span>
                  <div className="mah-bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
                  <span>{n}</span>
                </div>
              ))}
            </div>

            <figure className="mah-featured">
              <Quote size={30} aria-hidden="true" />
              <blockquote>{featured.text}</blockquote>
              <Stars rating={featured.rating ?? 0} size={16} />
              <figcaption>{featured.name} · {featured.service}{featured.date ? ` · ${formatDate(featured.date)}` : ""}</figcaption>
            </figure>
          </section>
        )}

        {/* What students mention */}
        <section className="mah-content-section mah-review-highlights">
          <div className="mah-section-heading">
            <div>
              <p className="mah-kicker">Common themes</p>
              <h2>What students often <em>mention.</em></h2>
            </div>
            <p className="mah-side-copy">A summary of the topics that come up most in student feedback.</p>
          </div>
          <div className="mah-highlight-grid">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <span><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* All reviews */}
        <section className="mah-content-section mah-review-list">
          <div className="mah-section-heading">
            <div>
              <p className="mah-kicker">Your experience matters</p>
              <h2>Read what students <em>say.</em></h2>
            </div>
            <div className="mah-review-tabs" role="tablist" aria-label="Filter reviews by service">
              {FILTERS.map((label) => (
                <button key={label} type="button" role="tab" aria-selected={filter === label}
                  className={filter === label ? "active" : ""}
                  onClick={() => { setFilter(label); setShown(PAGE_SIZE); }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mah-review-toolbar">
            <p className="mah-tab-note">
              {SHOWING_SAMPLES ? "Sample feedback shown for layout purposes. " : ""}
              Individual experiences and requirements vary.
            </p>
            <label>
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {SORTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>

          {visible.length ? (
            <>
              <div className="mah-review-grid">
                {visible.slice(0, shown).map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
              {shown < visible.length && (
                <button type="button" className="mah-more" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                  Show more reviews
                </button>
              )}
            </>
          ) : (
            <p className="mah-tab-note">No reviews for this service yet.</p>
          )}
        </section>

        {/* FAQ */}
        <section className="mah-content-section mah-review-faq">
          <div className="mah-section-heading">
            <div>
              <p className="mah-kicker">About our reviews</p>
              <h2>Questions about <em>feedback.</em></h2>
            </div>
          </div>
          <div className="mah-faq-list">
            {REVIEW_FAQS.map(({ q, a }) => (
              <details key={q}>
                <summary>{q}<ChevronDown size={18} aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
          <p className="mah-legal-inline">
            Academic support should be used in line with your university’s academic-integrity, authorship, and assessment rules.
          </p>
        </section>

        {/* CTA */}
        <section className="mah-review-cta">
          <ShieldCheck size={24} />
          <div>
            <p className="mah-kicker">Need support?</p>
            <h2>Get help matched to your <em>requirements.</em></h2>
          </div>
          <Link className="mah-orange-button" href="/order">Get started now <span>→</span></Link>
        </section>

        <section className="mah-content-section mah-review-share">
          <p>Used our support? <Link href="/contact_us.html">Share your feedback</Link> with the team.</p>
        </section>
      </main>
    </MahPageFrame>
  );
}

/* =====================================================================
   ABOUT PAGE (copied unchanged from your old file)
   ===================================================================== */

export function MahAboutPage() {
  return <MahPageFrame><main className="mah-content-page"><section className="mah-content-hero"><p className="mah-kicker">About Lara Consultancy</p><h1>Empowering Students Through <em>Quality Academic Support</em></h1><p>Lara Assignment, an academic support initiative by Lara Consultancy, is dedicated to helping university students navigate their academic journey with confidence.
We understand that studying at a university can be challenging, especially when balancing complex assignments, research projects, tight deadlines, and personal responsibilities.
Our goal is to simplify academic challenges by providing personalized guidance, research support, writing improvement, and subject-specific assistance tailored to the needs of students studying in different educational systems.
Whether you are pursuing your degree in the United Kingdom, Canada, Australia, India, Singapore, Germany, or elsewhere, Lara Assignment is here to help you strengthen your academic skills and work towards educational success.
Our Mission: To make quality academic guidance accessible, supportive, and student-focused for learners across the globe.
Our Vision: To become a trusted international academic support platform that empowers students through knowledge, confidence, and continuous learning.</p><Link className="mah-orange-button" href="/order">Hire us <span>→</span></Link></section>

<section className="mah-content-section">
  <div className="mah-section-heading">
    <div>
      <p className="mah-kicker">Our Core Values</p>
      <h2>
        Empowering Students Through Trust, <em>Quality &amp; Academic Excellence.</em>
      </h2>
    </div>
    <p className="mah-side-copy">
      Our values guide how we support students: with integrity, dependable guidance, and a commitment to continuous learning.
    </p>
  </div>
  <div className="mah-value-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
    <article style={{ padding: 32, border: "1px solid #e9e5df", borderRadius: 14, background: "#fffaf2" }}>
      <strong>01</strong>
      <h3>Academic Excellence </h3>
      <p>We strive to maintain high standards of quality, accuracy, and professionalism in every academic support service we provide.</p>
    </article>
    <article style={{ padding: 32, border: "1px solid #e6e1ef", borderRadius: 14, background: "#f6f2ff" }}>
      <strong>02</strong>
      <h3>Integrity &amp; Transparency</h3>
      <p>We believe in honesty, ethical academic practices, and clear communication, building lasting relationships based on trust.</p>
    </article>
    <article style={{ padding: 32, border: "1px solid #eee4cc", borderRadius: 14, background: "#fff8e8" }}>
      <strong>03</strong>
      <h3>Student-Centric Approach</h3>
      <p>Every student is unique. We focus on understanding individual academic needs and providing personalized guidance to support their goals.</p>
    </article>
    <article style={{ padding: 32, border: "1px solid #dfeae1", borderRadius: 14, background: "#f1f8f2" }}>
      <strong>04</strong>
      <h3>Global Accessibility</h3>
      <p>We are committed to making academic assistance accessible to students across the UK, Canada, Australia, India, Singapore, Germany, and beyond.</p>
    </article>
    <article style={{ padding: 32, border: "1px solid #dfe8ed", borderRadius: 14, background: "#f1f7fa" }}>
      <strong>05</strong>
      <h3>Reliability &amp; Commitment</h3>
      <p>We value every student's time and work towards providing responsive communication, dependable guidance, and deadline-conscious support.</p>
    </article>
    <article style={{ padding: 32, border: "1px solid #eedfd9", borderRadius: 14, background: "#fff4ef" }}>
      <strong>06</strong>
      <h3>Continuous Learning &amp; Innovation</h3>
      <p>We embrace new ideas, evolving educational practices, and modern learning tools to help students adapt and grow academically.</p>
    </article>
  </div>
</section>


  <section className="mah-content-section mah-lavender-block"><p className="mah-kicker">Our Achievements</p><h2>Building Trust Through <em>Academic Excellence</em></h2><div className="mah-mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 18 }}>
    {[
      { icon: GraduationCap, title: "Qualified Academic Professionals", text: "Our academic support approach focuses on subject-specific knowledge and personalised guidance for university students." },
      { icon: Globe2, title: "Global Academic Reach", text: "Supporting students across the UK, Canada, Australia, India, Singapore, Germany, and beyond." },
      { icon: BookOpen, title: "Wide Range of Subjects", text: "From business and management to engineering, nursing, finance, and computer science, we cover diverse academic disciplines." },
      { icon: ClipboardCheck, title: "Comprehensive Academic Support", text: "Helping students with coursework, research projects, dissertations, essays, and academic skill development." },
      { icon: Award, title: "Commitment to Quality", text: "We emphasize research quality, clear explanations, academic standards, and continuous improvement." },
      { icon: Users, title: "Student-Centric Approach", text: "We prioritize individual learning needs, transparent communication, and dependable academic guidance." },
    ].map(({ icon: Icon, title, text }) => <article key={title} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 20, borderRadius: 14, background: "#fff" }}><span style={{ display: "grid", placeItems: "center", flex: "0 0 52px", width: 52, height: 52, borderRadius: "50%", background: "#f3f3f3" }}><Icon size={24} aria-hidden="true" /></span><div><h3 style={{ marginTop: 4 }}>{title}</h3><p>{text}</p></div></article>)}
  </div></section><section className="mah-content-section mah-legal-note"><p>Academic support should be used in line with your university’s academic-integrity, authorship, and assessment rules. The site’s reference materials describe model or support work and not a substitute for a student’s own responsibilities.</p></section>

  <section className="mah-content-section" style={{ padding: "clamp(28px, 5vw, 56px)", borderRadius: 24, background: "linear-gradient(135deg, #fff7ed 0%, #f7f4ff 100%)" }}>
    <div className="mah-section-heading"><div><p className="mah-kicker">Leading Advantages</p><h2>Why Students Choose <em>Lara Assignment</em></h2></div></div>
    <div className="mah-value-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
      <article style={{ padding: 22, border: "1px solid #eee5dc", borderRadius: 16, background: "#fff" }}><strong style={{ color: "#f07835" }}>01 / ORIGINALITY</strong><h3>Originality-Focused Guidance</h3><p>We encourage original thinking, proper research practices, and accurate academic referencing.</p></article>
      <article style={{ padding: 22, border: "1px solid #eee5dc", borderRadius: 16, background: "#fff" }}><strong style={{ color: "#f07835" }}>02 / PERSONAL</strong><h3>Personalized Academic Support</h3><p>Receive guidance tailored to your subject, university requirements, and academic goals.</p></article>
      <article style={{ padding: 22, border: "1px solid #eee5dc", borderRadius: 16, background: "#fff" }}><strong style={{ color: "#f07835" }}>03 / ON TIME</strong><h3>Deadline-Conscious Assistance</h3><p>We value your time and help you plan academic tasks effectively around important deadlines.</p></article>
      <article style={{ padding: 22, border: "1px solid #eee5dc", borderRadius: 16, background: "#fff" }}><strong style={{ color: "#f07835" }}>04 / RESPONSIVE</strong><h3>Responsive Student Support</h3><p>Our student-focused communication approach aims to provide clear answers and helpful guidance.</p></article>
      <article style={{ padding: 22, border: "1px solid #eee5dc", borderRadius: 16, background: "#fff" }}><strong style={{ color: "#f07835" }}>05 / IMPROVEMENT</strong><h3>Feedback &amp; Improvement</h3><p>Improve the clarity, structure, formatting, and quality of your work through constructive academic feedback.</p></article>
      <article style={{ padding: 22, border: "1px solid #eee5dc", borderRadius: 16, background: "#fff" }}><strong style={{ color: "#f07835" }}>06 / PRIVACY</strong><h3>Privacy &amp; Confidentiality</h3><p>We are committed to handling student enquiries and academic information responsibly.</p></article>
    </div>
  </section>

  <section className="mah-content-section" style={{ padding: "clamp(24px, 5vw, 56px)", border: "1px solid #e4ebef", borderRadius: 24, background: "linear-gradient(145deg, #f5fbfa 0%, #f7f6fc 100%)", boxShadow: "0 16px 42px rgba(23, 43, 58, 0.08)" }}>
    <div style={{ maxWidth: 760, margin: "0 auto 40px", textAlign: "center" }}>
      <p className="mah-kicker" style={{ color: "#087f82", fontWeight: 700, letterSpacing: "0.12em" }}>How it works</p>
      <h2 style={{ color: "#172b3a", lineHeight: 1.2 }}>A simple route from question to <em style={{ color: "#e96e32" }}>clear next steps.</em></h2>
      <p className="mah-side-copy" style={{ maxWidth: 620, margin: "14px auto 0", color: "#5d6b76", lineHeight: 1.7 }}>Getting academic assistance with Lara Assignment is simple and secure. Follow these five steps to get started.</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: 16, textAlign: "center" }}>
      {[
        { icon: ClipboardCheck, title: "Submit your requirements", text: "Share your subject, deadline, academic level, and assignment guidelines." },
        { icon: Search, title: "Get a free quote", text: "We review your requirements and provide a personalized quote." },
        { icon: Check, title: "Confirm your plan", text: "Review the service details and confirm how you would like to proceed." },
        { icon: BookOpen, title: "Receive academic support", text: "Get subject-specific guidance, research support, and academic feedback." },
        { icon: Award, title: "Review your materials", text: "Review the support materials and request changes when needed." },
      ].map(({ icon: Icon, title, text }, index) => <article key={title} style={{ padding: "24px 18px", border: "1px solid #e3eaee", borderRadius: 18, background: "#fff", boxShadow: "0 8px 22px rgba(23, 43, 58, 0.05)" }}>
        <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, margin: "0 auto 16px", border: "1px solid #d6ecea", borderRadius: "50%", background: "#eaf6f5", color: "#087f82" }}><Icon size={23} aria-hidden="true" /></span>
        <p className="mah-kicker" style={{ margin: "0 0 8px", color: "#e96e32", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>STEP 0{index + 1}</p>
        <h3 style={{ margin: "0 0 10px", color: "#172b3a", fontSize: 17, lineHeight: 1.35 }}>{title}</h3>
        <p style={{ margin: 0, color: "#64727d", fontSize: 14, lineHeight: 1.65 }}>{text}</p>
      </article>)}
    </div>
    <div style={{ marginTop: 36, textAlign: "center" }}>
      <h3 style={{ margin: "0 0 18px", color: "#172b3a", fontSize: "clamp(18px, 2.5vw, 22px)" }}>Simple steps. Expert guidance. Academic confidence.</h3>
      <Link className="mah-orange-button" href="/order">Get started now <span>→</span></Link>
    </div>
  </section>

  </main></MahPageFrame>;
}

export function MahContactPage() {
  const siteSettings = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const submissionKey = useRef(crypto.randomUUID());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    setBusy(true);
    setStatus("Sending...");
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": submissionKey.current }, body: JSON.stringify({ ...Object.fromEntries(formData), type: "contact", source: "contact-page" }) });
      const data = await response.json().catch(() => ({}));
      setSubmitted(response.ok);
      setStatus(response.ok ? "Enquiry received. We will contact you shortly." : data.error || "We could not send this enquiry. Please try again.");
      if (response.ok) {
        form.reset();
        submissionKey.current = crypto.randomUUID();
      }
    } catch (error) {
      console.error("Contact enquiry failed:", error);
      setSubmitted(false);
      setStatus("We could not connect. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <MahPageFrame>
      <main className="mah-content-page">
        <section className="mah-contact-layout">
          <div className="mah-content-hero">
            <p className="mah-kicker">Contact Lara Consultancy</p>
            <h1>Tell us what you <em>need.</em></h1>
            <p>
              Share your subject, deadline, and requirements. The support team will review your enquiry and explain the next steps.
            </p>
            <div className="mah-contact-points">
              <div>
                <Phone size={18} aria-hidden="true" />
                <span><strong>Call us</strong><small><a href={`tel:${siteSettings.phone.replace(/\s/g, "")}`}>{siteSettings.phone}</a></small></span>
              </div>
              {siteSettings.email && (
                <div>
                  <Mail size={18} aria-hidden="true" />
                  <span><strong>Email</strong><small><a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a></small></span>
                </div>
              )}
              <div>
                <Clock size={18} aria-hidden="true" />
                <span><strong>{siteSettings.hours}</strong><small>Send your enquiry whenever it is convenient.</small></span>
              </div>
            </div>
          </div>

          <form className="mah-contact-form" onSubmit={handleSubmit}>
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
            <label>Subject / course code<input name="subject" required placeholder="e.g. Business 101" /></label>
            <label>How can we help?<textarea name="message" required placeholder="Tell us about your assignment, deadline, and requirements." /></label>
            <label style={{ display: "flex", gridTemplateColumns: "auto 1fr", alignItems: "flex-start", gap: 8, textTransform: "none", fontWeight: 400 }}>
              <input name="consent" type="checkbox" required />
              <span>I agree that Lara Consultancy may use these details to respond to my enquiry.</span>
            </label>
            <button className="mah-submit" type="submit" disabled={busy}>{busy ? "Sending..." : "Submit Enquiry"} <span>→</span></button>
            {status && (
              <p className={`mah-form-status ${submitted ? "is-success" : "is-error"}`} role="status">
                {submitted && <Check size={15} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }} />}
                {status}
              </p>
            )}
          </form>
        </section>

        <section className="mah-content-section mah-legal-note">
          <p>Academic support should be used in line with your university’s academic-integrity, authorship, and assessment rules. Please do not include sensitive personal information in your message.</p>
        </section>
      </main>
    </MahPageFrame>
  );
}