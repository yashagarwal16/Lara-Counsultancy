import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronDown, Clock, ShieldCheck } from "lucide-react";
import { MahPageFrame, MahOrderForm } from "./mah-public";
import { BlogIndex } from "./mah-blog-index";
import { CategoryArt } from "./blog-art";
import { formatDate, getPost, posts, readingMinutes } from "./blog-data";
import "./mah-public-pages.css";
import "./mah-content-pages.css";

export function OrderPage() {
  return (
    <MahPageFrame>
      <main className="mah-content-page">
        {/* Hero */}
        <section className="mah-content-hero">
          <p className="mah-kicker">Order now</p>
          <h1>Get academic support matched to your <em>requirements.</em></h1>
          <p>
            Share your subject, deadline, academic level, and guidelines. The support team will review them and send you a personalised quote.
          </p>
          <div className="mah-contact-points">
            <div>
              <Clock size={18} aria-hidden="true" />
              <span>
                <strong>Available 24x7</strong>
                <small>Send your requirements at any time and the team will respond.</small>
              </span>
            </div>
            <div>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <strong>Private by design</strong>
                <small>Your enquiry is handled responsibly. Do not send sensitive personal information.</small>
              </span>
            </div>
            <div>
              <Check size={18} aria-hidden="true" />
              <span>
                <strong>Revision support</strong>
                <small>Review your materials and request changes when needed.</small>
              </span>
            </div>
          </div>
        </section>

        {/* Order form */}
        <section className="mah-content-section">
          <div className="mah-section-heading">
            <div>
              <p className="mah-kicker">Your requirements</p>
              <h2>Tell us what you <em>need.</em></h2>
            </div>
            <p className="mah-side-copy">Fill in the form below and we will get back to you with the next steps.</p>
          </div>
          <MahOrderForm service="your assignment" />
        </section>

        {/* Legal note + links */}
        <section className="mah-content-section mah-legal-note">
          <p>
            Academic support should be used in line with your university’s academic-integrity, authorship, and assessment rules.
            Please read our <Link href="/terms-of-use">Terms of Use</Link> and <Link href="/revision-refund-policy">Refund Policy</Link> before placing an order.
          </p>
        </section>
      </main>
    </MahPageFrame>
  );
}

export function BlogPage() {
  return (
    <MahPageFrame>
      <BlogIndex />
    </MahPageFrame>
  );
}

export function BlogArticlePage({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) notFound();

  const related = [
    ...posts.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...posts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);

  return (
    <MahPageFrame>
      <main className="mah-content-page mah-blog">
        {/* Hero */}
        <section className="mah-content-hero compact">
          <p className="mah-kicker"><Link href="/blog/">Blog</Link> · {post.category}</p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="mah-bpost-meta">
            <span>{formatDate(post.date)}</span>
            <span><Clock size={12} aria-hidden="true" /> {readingMinutes(post)} min read</span>
          </div>
        </section>

        {/* Article + sidebar */}
        <section className="mah-content-section" style={{ display: "flex", flexWrap: "wrap", gap: 40, alignItems: "flex-start" }}>
          <article style={{ flex: "1 1 560px", minWidth: 0, maxWidth: 760 }}>
            <div style={{ padding: "20px 24px", marginBottom: 32, border: "1px solid #eee5dc", borderRadius: 14, background: "#fffaf2" }}>
              <p className="mah-kicker" style={{ marginTop: 0 }}>Key takeaways</p>
              <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
                {post.takeaways.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            {post.sections.map((section) => (
              <section key={section.id} id={section.id} style={{ marginBottom: 32, scrollMarginTop: 96 }}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.list && (
                  <ul style={{ paddingLeft: 20, display: "grid", gap: 8 }}>
                    {section.list.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </section>
            ))}

            <p className="mah-legal-inline">
              Academic support should be used in line with your university’s academic-integrity, authorship, and assessment rules.
            </p>
          </article>

          <aside style={{ flex: "0 1 280px", minWidth: 240, position: "sticky", top: 96, display: "grid", gap: 20 }}>
            <nav aria-label="On this page" style={{ padding: 20, border: "1px solid #e9e5df", borderRadius: 14, background: "#fff" }}>
              <p className="mah-kicker" style={{ marginTop: 0 }}>On this page</p>
              <div style={{ display: "grid", gap: 8 }}>
                {post.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.heading}</a>)}
              </div>
            </nav>
            <div className="mah-side-cta">
              <p className="mah-kicker">Need support?</p>
              <h3>Tell us about your assignment.</h3>
              <p>Share your subject, deadline, and requirements to get started.</p>
              <Link className="mah-orange-button" href="/order">Get started now <span>→</span></Link>
            </div>
          </aside>
        </section>

        {/* Related articles */}
        <section className="mah-content-section">
          <div className="mah-section-heading">
            <div>
              <p className="mah-kicker">Keep reading</p>
              <h2>Related <em>articles.</em></h2>
            </div>
            <Link className="mah-text-link" href="/blog/">All articles <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 18 }}>
            {related.map((item) => (
              <article key={item.slug} className="mah-bpost">
                <Link href={`/blog/${item.slug}/`} aria-label={item.title}>
                  <CategoryArt category={item.category} />
                </Link>
                <div className="mah-bpost-meta">
                  <span className="mah-bpost-tag">{item.category}</span>
                  <span><Clock size={12} aria-hidden="true" /> {readingMinutes(item)} min read</span>
                </div>
                <h3><Link href={`/blog/${item.slug}/`}>{item.title}</Link></h3>
                <p>{item.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </MahPageFrame>
  );
}

/* =====================================================================
   FAQ PAGE: stand-in content. Edit the FAQS list below, or replace
   this whole component with your original FaqPage if you recover it.
   ===================================================================== */

const FAQS = [
  {
    q: "What kind of academic support is available?",
    a: "Support can cover planning, research direction, structure, referencing, editing, proofreading, and feedback, depending on the details and requirements you provide.",
  },
  {
    q: "How do I get started?",
    a: "Share your subject, deadline, academic level, and assignment guidelines through the order form. The support team reviews your requirements and sends a personalised quote.",
  },
  {
    q: "Can I request a particular referencing style?",
    a: "Yes. Include the required style and any university-specific guidance with your brief.",
  },
  {
    q: "How do revisions work?",
    a: "Revision requests should be tied to the original instructions and are handled according to the service policy. Please read the Revision & Refund policy for details.",
  },
  {
    q: "Is my information kept private?",
    a: "We are committed to handling student enquiries and academic information responsibly. Please do not send sensitive personal information through the enquiry forms.",
  },
  {
    q: "How should I use the support materials?",
    a: "Materials are intended as reference and learning aids. Please use them in line with your university's academic-integrity, authorship, and assessment rules.",
  },
  {
    q: "Can urgent requests be supported?",
    a: "Availability depends on the subject, scope, and deadline. The order form records those details so the team can assess whether your timeline is possible.",
  },
];

export function FaqPage() {
  return (
    <MahPageFrame>
      <main className="mah-content-page">
        <section className="mah-content-hero">
          <p className="mah-kicker">FAQs</p>
          <h1>Frequently asked <em>questions.</em></h1>
          <p>Answers to common questions about how academic support works. Can&apos;t find what you need? Contact the support team.</p>
        </section>

        <section className="mah-content-section">
          <div className="mah-faq-list">
            {FAQS.map(({ q, a }) => (
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

        <section className="mah-content-section">
          <p>Still have a question? <Link href="/contact_us.html">Contact us</Link> and the team will get back to you.</p>
        </section>
      </main>
    </MahPageFrame>
  );
}

const LEGAL_CONTENT = {
  "terms-of-use": {
    label: "Terms of use",
    title: "Terms of use.",
    intro: "These terms explain how Lara Consultancy provides academic support and how visitors should use this website.",
    sections: [
      ["Using the service", "Academic support is provided for learning, planning, research, editing, and feedback. You remain responsible for your own submissions, decisions, and compliance with your institution’s rules."],
      ["Enquiries and quotes", "An enquiry does not create a contract or guarantee availability. Requirements, timelines, scope, and pricing must be confirmed by the support team before work begins."],
      ["Acceptable use", "Do not use the website to submit unlawful material, impersonate another person, infringe rights, or request assistance that violates academic-integrity requirements."],
    ],
  },
  "privacy-policy": {
    label: "Privacy policy",
    title: "Privacy, explained clearly.",
    intro: "This page describes the information the website may receive when you contact Lara Consultancy.",
    sections: [
      ["Information you provide", "Contact and order forms may ask for your name, email, phone number, subject, deadline, and assignment requirements. Do not send passwords, payment credentials, or unnecessary sensitive information."],
      ["How information is used", "Information is used to understand your enquiry, respond to you, assess service fit, and maintain necessary business records. It is not sold as a mailing list."],
      ["Retention and requests", "Information should be retained only as long as needed for the enquiry or legal obligations. Contact the team to request correction or deletion where applicable."],
    ],
  },
  "revision-refund-policy": {
    label: "Revision & refund policy",
    title: "Revision and refund guidance.",
    intro: "Any revision or refund arrangement depends on the agreed brief, delivered materials, timeline, and circumstances of the enquiry.",
    sections: [
      ["Revisions", "Raise a revision request promptly and describe the specific requirement that was not met against the agreed brief. New requirements or a changed brief may require a new quote."],
      ["Refund requests", "Refund eligibility is assessed case by case against the agreed scope, work already completed, and communication history. Contact the team before initiating a payment dispute."],
      ["Limits", "No outcome, grade, admission, or assessment result is guaranteed. Academic support must be used responsibly and in line with institutional rules."],
    ],
  },
  "fair-use-policy": {
    label: "Fair use policy",
    title: "Fair use and academic responsibility.",
    intro: "Lara Consultancy supports learning and responsible academic work. This policy sets boundaries for use of the service.",
    sections: [
      ["Learning-first use", "Use support materials as references, explanations, examples, or feedback. Your submitted work must reflect your own responsibility and your institution’s authorship requirements."],
      ["Restricted requests", "We may decline requests involving impersonation, exam completion, credential misuse, plagiarism, fraud, or other activity that undermines academic or professional integrity."],
      ["Questions", "If you are unsure whether a request is appropriate, contact the team before sharing the full brief."],
    ],
  },
} as const;

export function LegalPage({ kind }: { kind: keyof typeof LEGAL_CONTENT }) {
  const content = LEGAL_CONTENT[kind];
  return (
    <MahPageFrame>
      <main className="mah-content-page">
        <section className="mah-content-hero">
          <p className="mah-kicker">{content.label}</p>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </section>
        <section className="mah-content-section">
          <div className="mah-faq-list">
            {content.sections.map(([heading, body]) => (
              <details key={heading} open>
                <summary>{heading}<ChevronDown size={18} aria-hidden="true" /></summary>
                <p>{body}</p>
              </details>
            ))}
          </div>
          <p className="mah-legal-inline">For questions about an enquiry or these policies, <Link href="/contact_us.html">contact the support team</Link>.</p>
        </section>
      </main>
    </MahPageFrame>
  );
}