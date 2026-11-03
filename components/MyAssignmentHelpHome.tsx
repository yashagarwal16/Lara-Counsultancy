"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";

import Link from "next/link";
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Globe2,
  GraduationCap,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { LaraLogo, MahFooter } from "./mah-public";
import Chatbot from "./Chatbot";
import { useSiteSettings } from "./use-site-settings";
import "./myassignmenthelp-home.css";

const serviceLinks = [
  ["Assignment Help", "/assignment-help/"],
  ["Essay Help", "/essay-help/"],
  ["Dissertation Help", "/dissertation/"],
  ["Coursework Help", "/coursework/"],
  ["Proofreading & Editing", "/proofreading-editing/"],
  ["Programming & Technical Guidance", "/programming-technical/"] 

];


const menuLinks = [

  ["Reviews", "/reviews/"],
  ["About us", "/about-us.html"],
];



const reviewCards = [
  ["HRM Essay", "8 Pages, Deadline: 21 days", "The assignment was informative and helped me develop my understanding of the subject.", "/reviews/student-1.jpg"],
  ["Biology Essay", "8 Pages, Deadline: 7 days", "Research quality and speed of delivery were excellent. Communication was smooth and professional.", "/reviews/student-2.jpg"],
  ["Statistics Programming", "2 Pages, Deadline: 7 hours", "The assignment was completed quickly and was thorough—exactly the help I needed.", "/reviews/student-3.jpg"],
  ["Nursing Assignment", "2 Pages, Deadline: 5 days", "It was a good experience and the work was delivered clearly and on time.", "/reviews/student-4.jpg"],
];

const faqs = [
  ["Where can I get help with my assignment?", "Start with the order form and share the subject, deadline, pages, and requirements so the task can be reviewed."],
  ["What is assignment help for students?", "It can include guidance with research, structure, writing, editing, proofreading, referencing, and subject-specific methods."],
  ["How can I get help without losing my own ideas?", "Share your brief and existing notes so support can be organised around your own requirements and learning goals."],
  ["What should I do if I need help with an assignment?", "Identify the main difficulty first, then provide the question, rubric, sources, and deadline."],
  ["What does online assignment help include?", "Available support varies by subject and assignment type and can include planning, analysis, drafting, editing, and review."],
  ["How can assignment services help with difficult coursework?", "A subject specialist can break a complex task into requirements, evidence, analysis, and a clear structure."],
];

const experts = [
  ["Gen Meng", "Management and business", "Academic support specialist with a focus on stakeholder communication, resource allocation, and project planning."],
  ["Gary Bambrick", "Programming and technical subjects", "Academic support specialist who helps students understand programming concepts and technical project requirements."],
  ["Jack Arens", "Law and labour relations", "Academic support specialist who explains complex employment, labour law, and workplace policy concepts."],
  ["Charlotte Wendt", "Literature and English", "Academic support specialist focused on clear structure, academic style, and subject-specific requirements."],
];

const howItWorksSteps = [
  { icon: ClipboardCheck, title: "Submit your requirements", text: "Share your subject, deadline, academic level, and assignment guidelines." },
  { icon: Search, title: "Get a free quote", text: "We review your requirements and provide a personalized quote." },
  { icon: Check, title: "Confirm your plan", text: "Review the service details and confirm how you would like to proceed." },
  { icon: BookOpen, title: "Receive academic support", text: "Get subject-specific guidance, research support, and academic feedback." },
  { icon: Award, title: "Review your materials", text: "Review the support materials and request changes when needed." },
];

// number, title, text, border colour, background colour
const coreValues = [
  ["01", "Academic Excellence", "We strive to maintain high standards of quality, accuracy, and professionalism in every academic support service we provide.", "#e9e5df", "#fffaf2"],
  ["02", "Integrity & Transparency", "We believe in honesty, ethical academic practices, and clear communication, building lasting relationships based on trust.", "#e6e1ef", "#f6f2ff"],
  ["03", "Student-Centric Approach", "Every student is unique. We focus on understanding individual academic needs and providing personalized guidance to support their goals.", "#eee4cc", "#fff8e8"],
  ["04", "Global Accessibility", "We are committed to making academic assistance accessible to students across the UK, Canada, Australia, India, Singapore, Germany, and beyond.", "#dfeae1", "#f1f8f2"],
  ["05", "Reliability & Commitment", "We value every student's time and work towards providing responsive communication, dependable guidance, and deadline-conscious support.", "#dfe8ed", "#f1f7fa"],
  ["06", "Continuous Learning & Innovation", "We embrace new ideas, evolving educational practices, and modern learning tools to help students adapt and grow academically.", "#eedfd9", "#fff4ef"],
];

const achievements = [
  { icon: GraduationCap, title: "Qualified Academic Professionals", text: "Our academic support approach focuses on subject-specific knowledge and personalised guidance for university students." },
  { icon: Globe2, title: "Global Academic Reach", text: "Supporting students across the UK, Canada, Australia, India, Singapore, Germany, and beyond." },
  { icon: BookOpen, title: "Wide Range of Subjects", text: "From business and management to engineering, nursing, finance, and computer science, we cover diverse academic disciplines." },
  { icon: ClipboardCheck, title: "Comprehensive Academic Support", text: "Helping students with coursework, research projects, dissertations, essays, and academic skill development." },
  { icon: Award, title: "Commitment to Quality", text: "We emphasize research quality, clear explanations, academic standards, and continuous improvement." },
  { icon: Users, title: "Student-Centric Approach", text: "We prioritize individual learning needs, transparent communication, and dependable academic guidance." },
];

const advantages = [
  ["01 / ORIGINALITY", "Originality-Focused Guidance", "We encourage original thinking, proper research practices, and accurate academic referencing."],
  ["02 / PERSONAL", "Personalized Academic Support", "Receive guidance tailored to your subject, university requirements, and academic goals."],
  ["03 / ON TIME", "Deadline-Conscious Assistance", "We value your time and help you plan academic tasks effectively around important deadlines."],
  ["04 / RESPONSIVE", "Responsive Student Support", "Our student-focused communication approach aims to provide clear answers and helpful guidance."],
  ["05 / IMPROVEMENT", "Feedback & Improvement", "Improve the clarity, structure, formatting, and quality of your work through constructive academic feedback."],
  ["06 / PRIVACY", "Privacy & Confidentiality", "We are committed to handling student enquiries and academic information responsibly."],
];

/* Shared sizing so padded/bordered sections never grow wider than the window.
   marginLeft/Right (not the `margin` shorthand) keeps any vertical spacing from the CSS file. */
const gutter = "clamp(16px, 5vw, 56px)";

// Side padding only (keeps any top/bottom spacing from the CSS file) so text never touches the screen edge
const sideGutter: CSSProperties = {
  boxSizing: "border-box",
  paddingLeft: gutter,
  paddingRight: gutter,
};

// Plain sections: centred, max 1200px, with side gutters
const fitSection: CSSProperties = {
  ...sideGutter,
  width: "100%",
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
};

// Boxed panels (they have their own padding/border): keep a 16px gap to the screen edge
const fitBox: CSSProperties = {
  width: "min(1200px, calc(100% - 32px))",
  marginLeft: "auto",
  marginRight: "auto",
  boxSizing: "border-box",
};

export default function MyAssignmentHelpHome() {
  const siteSettings = useSiteSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [pages, setPages] = useState(1);
  const [reviewTab, setReviewTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [formStatus, setFormStatus] = useState("");
  const [formBusy, setFormBusy] = useState(false);
  const submissionKey = useRef(crypto.randomUUID());

  async function preventSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formBusy) return;
    setFormBusy(true);
    setFormStatus("Sending...");
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": submissionKey.current }, body: JSON.stringify({ ...Object.fromEntries(new FormData(event.currentTarget)), type: "order", source: "homepage-form", pages }) });
      const data = await response.json().catch(() => ({}));
      setFormStatus(response.ok ? "Enquiry received. We will contact you shortly." : data.error || "We could not send this enquiry. Please try again.");
      if (response.ok) {
        event.currentTarget.reset();
        submissionKey.current = crypto.randomUUID();
      }
    } catch (error) {
      console.error("Homepage enquiry failed:", error);
      setFormStatus("We could not connect. Please check your connection and try again.");
      setFormBusy(false);
    }
  }

  return (
    <main className="mah-shell" style={{ "--mah-orange": siteSettings.theme.primary, "--mah-orange-dark": siteSettings.theme.primaryDark, "--mah-blue": siteSettings.theme.accent, "--mah-ink": siteSettings.theme.ink } as CSSProperties}>
      <header className="mah-header">
        <LaraLogo className="mah-logo" brandName={siteSettings.brandName} logoImage={siteSettings.logoImage} />

        <nav className={`mah-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation" style={{ minWidth: 0, maxWidth: "100%", flexWrap: "wrap", rowGap: 4 }}>
          <div className={`mah-nav-menu ${servicesOpen ? "services-open" : ""}`} style={{ position: "relative" }}>
            <button type="button" aria-expanded={servicesOpen} onClick={() => setServicesOpen((open) => !open)}>
              Services <ChevronDown size={15} aria-hidden="true" />
            </button>
            <div className="mah-dropdown mah-services-dropdown" style={{ left: 0, right: "auto", width: "max-content", minWidth: 240, maxWidth: "calc(100vw - 32px)", boxSizing: "border-box" }}>
              <p>Popular services</p>
              {serviceLinks.map(([label, href]) => (
                <Link key={href} href={href} style={{ display: "block", maxWidth: "100%", boxSizing: "border-box", whiteSpace: "normal", overflowWrap: "anywhere" }}>{label}</Link>
              ))}
            </div>
          </div>
          {menuLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/blog/">Blog</Link>
          <Link className="mah-mobile-order-link" href="/order">Order Now</Link>
        </nav>

        <div className="mah-header-actions">
          
          <Link className="mah-order-button" href="/order">Order Now</Link>
          <button className="mah-mobile-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </header>

      <section className="mah-hero" aria-labelledby="mah-hero-title">
        <div className="mah-hero-copy">
          <p className="mah-eyebrow"><span /> Online academic support for students</p>
          <h1 id="mah-hero-title"><span>Expert Assignment</span> <em>Help for Students</em> <strong>Worldwide</strong></h1>
          <p className="mah-hero-description">
            Achieve your academic goals with personalized assignment guidance from Lara Consultancy. We support university students across the UK, Canada, Australia, India, Singapore, Germany, and beyond with research assistance, academic mentoring, proofreading, and subject-specific support.
            <br />
            Learn Better. Write Smarter. Achieve More.
          </p>
          <div className="mah-hero-actions">
            <Link className="mah-primary-button" href="#assignment-form">Do My Assignment <span aria-hidden="true">→</span></Link>
            <Link className="mah-secondary-link" href="/faqs.html">How it works <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="mah-trust-line">
            <div className="mah-avatar-stack" aria-hidden="true"><span>J</span><span>A</span><span>M</span><span>+</span></div>
            <div><strong>Support for students worldwide</strong><small>Private, practical, and available 24/7</small></div>
          </div>
        </div>

        <div className="mah-form-stage">
          <div className="mah-form-glow" aria-hidden="true" />
          <div className="mah-form-card" id="assignment-form">
            <div className="mah-form-heading">
              <div><p className="mah-form-kicker">Start your order</p><h2>AI-Free Assignment Help from Real Experts</h2></div>
              <span className="mah-form-badge"><ShieldCheck size={14} /> Human-led</span>
            </div>
            <p className="mah-form-intro">Share your requirements and get practical academic support from an experienced assignment helper.</p>

            <form onSubmit={preventSubmit}>
              <div className="mah-form-modes" role="radiogroup" aria-label="Assignment type">
                <label><input type="radio" name="assignment-type" defaultChecked /> <span>Writing</span></label>
                <label><input type="radio" name="assignment-type" /> <span>Technical</span></label>
                <label><input type="radio" name="assignment-type" /> <span>Online Class</span></label>
              </div>
              <div className="mah-field-grid">
                <label>Email<input type="email" name="email" required placeholder="you@example.com" /></label>
                <label>Subject / course code<input name="subject" required placeholder="e.g. Business 101" /></label>
                <label>Deadline<input type="date" name="deadline" required /></label>
                <label>Time<select name="time" defaultValue="02:00"><option value="02:00">2:00 AM</option><option value="12:00">12:00 PM</option><option value="06:00">6:00 PM</option></select></label>
              </div>
              <div className="mah-pages-field">
                <label htmlFor="pages">Pages</label>
                <div className="mah-stepper">
                  <button type="button" aria-label="Remove one page" onClick={() => setPages((value) => Math.max(1, value - 1))}><Minus size={15} /></button>
                  <output id="pages" aria-live="polite">{pages} {pages === 1 ? "page" : "pages"}</output>
                  <button type="button" aria-label="Add one page" onClick={() => setPages((value) => value + 1)}><Plus size={15} /></button>
                </div>
              </div>
              <label>Country / phone<input type="tel" name="phone" placeholder="+1 000 000 0000" /></label>
              <label>Description<textarea name="description" required placeholder="Write your assignment requirements here..." /></label>
              <label className="mah-file-field"><span>Attach a file <small>(optional)</small></span><span className="mah-file-control"><FileText size={15} /> Choose file<input type="file" name="attachment" /></span></label>
              <label className="mah-check-field"><input type="checkbox" name="updates" required /> <span>I accept the T&amp;C and agree to receive offers &amp; updates.</span></label>
              <button className="mah-submit-button" type="submit" disabled={formBusy}>{formBusy ? "Sending..." : "Do My Assignment"} <span aria-hidden="true">→</span></button>
              {formStatus && <p className="mah-form-footnote" role="status">{formStatus}</p>}
            </form>
            <p className="mah-form-footnote">Your details are private and secure. No payment is taken here.</p>
          </div>
        </div>
      </section>



      <section className="mah-proof-strip" aria-label="Service benefits">
        <span className="mah-proof-label">Why students choose us</span>
        <div><Check size={17} /> Clear requirements</div><div><Check size={17} /> Human-led guidance</div><div><Check size={17} /> 24/7 Support</div>
      </section>



      <section className="mah-intro-section" style={{ display: "block", width: "100%", maxWidth: "100%", boxSizing: "border-box", background: "#f2f2f7", padding: "48px 24px 56px" }}>
        <div className="mah-section-heading-wide" style={{ display: "block", width: "auto", maxWidth: "1320px", margin: "0 auto 40px", padding: 0, textAlign: "center" }}>
          <h2 style={{ flex: "none", width: "auto", maxWidth: "1000px", margin: "0 auto 24px", padding: 0, fontSize: "clamp(1.9rem, 3.4vw, 3rem)", fontWeight: 700, lineHeight: 1.22, letterSpacing: "-0.01em", textAlign: "center", color: "#2a2a2e" }}>
            Meet Assignment Helpers Who Understand Your Academic Requirements
          </h2>
          <p style={{ flex: "none", width: "auto", maxWidth: "1300px", margin: "0 auto", padding: 0, fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.6, textAlign: "center", color: "#6b6b73" }}>
            Effective academic support starts with understanding each subject&apos;s specific requirements. Assignment writers understand that business cases require practical analysis, literature assignments include close textual analysis, and statistics coursework depends on accurate calculations and interpretation. Connect with subject specialists who understand your assignment requirements, develop your approach, and improve your final work.
          </p>
        </div>

        <div className="mah-expert-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px", width: "100%", maxWidth: "1320px", margin: "0 auto", padding: 0 }}>
          {experts.map(([name, specialty, bio]) => (
            <article className="mah-expert-card" key={name} style={{ display: "flex", flexDirection: "column", minWidth: 0, minHeight: "360px", margin: 0, padding: "24px 12px 20px", background: "#fff", border: 0, borderRadius: "10px", boxShadow: "none", textAlign: "left", boxSizing: "border-box" }}>
              <div className="mah-expert-profile" style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div className="mah-expert-avatar" aria-label={`${name} profile picture`} style={{ position: "relative", flex: "0 0 64px", width: "64px", height: "64px" }}>
                  <span aria-hidden="true" style={{ display: "grid", placeItems: "center", width: "64px", height: "64px", borderRadius: "50%", background: "#f3efff", color: "#235bd7", fontSize: "1.25rem", fontWeight: 700 }}>{name.split(" ").map((part) => part[0]).join("")}</span>
                  <span style={{ position: "absolute", right: 0, bottom: "2px", width: "12px", height: "12px", boxSizing: "border-box", borderRadius: "50%", background: "#1fbf7a", border: "2px solid #fff" }} />
                </div>
                <div className="mah-expert-heading" style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, lineHeight: 1.4, color: "#2a2a2e" }}>{name}</h3>
                  <p title={specialty} style={{ margin: 0, fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.45, color: "#6b6b73", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{specialty}</p>
                  <div className="mah-expert-stars" aria-label="5 out of 5 stars" style={{ marginTop: "4px", fontSize: "1.05rem", lineHeight: 1, letterSpacing: "0.12em", color: "#f2600c" }}>★★★★★</div>
                </div>
              </div>

              <p className="mah-expert-bio" style={{ flex: 1, margin: "18px 0 0", fontSize: "0.875rem", lineHeight: 1.5, color: "#111", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 5, overflow: "hidden" }}>{bio}</p>

              <div className="mah-expert-footer" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px", marginTop: "32px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.6875rem", color: "#6b6b73" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap" }}>
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><circle cx="8" cy="8" r="6.4" /><path d="M8 4.5V8l2.4 1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Subject-focused guidance
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap" }}>
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M2.5 3h11a1 1 0 0 1 1 1v6.2a1 1 0 0 1-1 1H8l-3 2.6v-2.6H2.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" /></svg>
                    Human-led academic support
                  </span>
                </div>
                <Link href="/order" style={{ flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "90px", height: "48px", padding: "0 16px", border: "1px solid #f2600c", borderRadius: "4px", background: "#fff", color: "#f2600c", fontSize: "1rem", fontWeight: 400, textDecoration: "none", boxSizing: "border-box" }}>Hire Me</Link>
              </div>
            </article>
          ))}
        </div>

      </section>




      <section className="mah-content-section" style={{ ...fitBox, padding: "clamp(24px, 5vw, 56px)", border: "1px solid #e4ebef", borderRadius: 24, background: "linear-gradient(145deg, #f5fbfa 0%, #f7f6fc 100%)", boxShadow: "0 16px 42px rgba(23, 43, 58, 0.08)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto 40px", textAlign: "center" }}>
          <p className="mah-kicker" style={{ color: "#087f82", fontWeight: 700, letterSpacing: "0.12em" }}>How it works</p>
          <h2 style={{ color: "#172b3a", lineHeight: 1.2 }}>A simple route from question to <em style={{ color: "#e96e32" }}>clear next steps.</em></h2>
          <p className="mah-side-copy" style={{ maxWidth: 620, margin: "14px auto 0", color: "#5d6b76", lineHeight: 1.7 }}>Getting academic assistance with Lara Assignment is simple and secure. Follow these five steps to get started.</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, textAlign: "center" }}>
          {howItWorksSteps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} style={{ flex: "1 1 170px", maxWidth: 220, minWidth: 0, padding: "24px 18px", border: "1px solid #e3eaee", borderRadius: 18, background: "#fff", boxShadow: "0 8px 22px rgba(23, 43, 58, 0.05)", boxSizing: "border-box" }}>
              <span style={{ display: "grid", placeItems: "center", width: 52, height: 52, margin: "0 auto 16px", border: "1px solid #d6ecea", borderRadius: "50%", background: "#eaf6f5", color: "#087f82" }}><Icon size={23} aria-hidden="true" /></span>
              <p className="mah-kicker" style={{ margin: "0 0 8px", color: "#e96e32", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>STEP 0{index + 1}</p>
              <h3 style={{ margin: "0 0 10px", color: "#172b3a", fontSize: 17, lineHeight: 1.35 }}>{title}</h3>
              <p style={{ margin: 0, color: "#64727d", fontSize: 14, lineHeight: 1.65 }}>{text}</p>
            </article>
          ))}
        </div>
        <div style={{ marginTop: 36, textAlign: "center" }}>
          <h3 style={{ margin: "0 0 18px", color: "#172b3a", fontSize: "clamp(18px, 2.5vw, 22px)" }}>Simple steps. Expert guidance. Academic confidence.</h3>
          <Link className="mah-orange-button" href="/order">Get started now <span>→</span></Link>
        </div>
      </section>








      {/* 1. CORE VALUES — dark navy panel, glass cards, gold numerals */}
      <section className="mah-content-section" style={{ ...fitBox, padding: "clamp(24px, 5vw, 56px)", border: "1px solid #1f3558", borderRadius: 24, background: "linear-gradient(145deg, #12213a 0%, #1b2f55 100%)", boxShadow: "0 20px 48px rgba(18, 33, 58, 0.28)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto 40px", textAlign: "center" }}>
          <p className="mah-kicker" style={{ color: "#f5c451", fontWeight: 700, letterSpacing: "0.12em" }}>Our Core Values</p>
          <h2 style={{ color: "#fff", lineHeight: 1.2 }}>Empowering Students Through Trust, <em style={{ color: "#f5c451" }}>Quality &amp; Academic Excellence.</em></h2>
          <p className="mah-side-copy" style={{ maxWidth: 620, margin: "14px auto 0", color: "#b9c5d8", lineHeight: 1.7 }}>Our values guide how we support students: with integrity, dependable guidance, and a commitment to continuous learning.</p>
        </div>
        <div className="mah-value-grid" style={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 16, alignItems: "stretch" }}>
          {coreValues.map(([num, title, text]) => (
            <article key={num} style={{ minWidth: 0, height: "100%", padding: "26px 24px", border: "1px solid rgba(255, 255, 255, 0.14)", borderRadius: 12, background: "rgba(255, 255, 255, 0.06)", boxSizing: "border-box" }}>
              <span style={{ display: "block", margin: "0 0 14px", color: "#f5c451", fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{num}</span>
              <h3 style={{ margin: "0 0 10px", color: "#fff", fontSize: 18, lineHeight: 1.35 }}>{title}</h3>
              <p style={{ margin: 0, color: "#b9c5d8", fontSize: 14, lineHeight: 1.65 }}>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 2. ACHIEVEMENTS — mint panel, white cards with green left accent, rounded-square icons */}
      <section className="mah-content-section" style={{ ...fitBox, padding: "clamp(24px, 5vw, 56px)", border: "1px solid #cfeadb", borderRadius: 20, background: "linear-gradient(145deg, #effaf3 0%, #e4f5ec 100%)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto 40px", textAlign: "center" }}>
          <p className="mah-kicker" style={{ color: "#117a52", fontWeight: 700, letterSpacing: "0.12em" }}>Our Achievements</p>
          <h2 style={{ color: "#12372a", lineHeight: 1.2 }}>Building Trust Through <em style={{ color: "#159a63" }}>Academic Excellence</em></h2>
        </div>
        <div className="mah-mini-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 16 }}>
          {achievements.map(({ icon: Icon, title, text }) => (
            <article key={title} style={{ minWidth: 0, height: "100%", display: "flex", alignItems: "flex-start", gap: 16, padding: "22px 22px 22px 20px", border: "1px solid #d3eede", borderLeft: "5px solid #1f9d6b", borderRadius: 10, background: "#fff", boxSizing: "border-box" }}>
              <span style={{ display: "grid", placeItems: "center", flex: "0 0 48px", width: 48, height: 48, borderRadius: 12, background: "#dff5e9", color: "#117a52" }}><Icon size={22} aria-hidden="true" /></span>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: "0 0 8px", color: "#12372a", fontSize: 17, lineHeight: 1.35 }}>{title}</h3>
                <p style={{ margin: 0, color: "#4d6a5d", fontSize: 14, lineHeight: 1.65 }}>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. LEGAL NOTE — amber notice bar */}
      <section className="mah-content-section mah-legal-note" style={{ ...fitBox, display: "flex", alignItems: "flex-start", gap: 14, padding: "18px 22px", border: "1px solid #f1dfae", borderLeft: "5px solid #e0a72b", borderRadius: 12, background: "#fff8e6" }}>
        <span style={{ display: "grid", placeItems: "center", flex: "0 0 36px", width: 36, height: 36, borderRadius: 10, background: "#fdeab8", color: "#946200" }}><ShieldCheck size={19} aria-hidden="true" /></span>
        <p style={{ margin: 0, minWidth: 0, color: "#6b5416", fontSize: 14, lineHeight: 1.65 }}>Academic support should be used in line with your university’s academic-integrity, authorship, and assessment rules. The site’s reference materials describe model or support work and not a substitute for a student’s own responsibilities.</p>
      </section>

      {/* 4. LEADING ADVANTAGES — violet/pink panel, borderless lifted cards, coloured pill labels */}
      <section className="mah-content-section" style={{ ...fitBox, padding: "clamp(24px, 5vw, 56px)", border: "1px solid #eadcf8", borderRadius: 28, background: "linear-gradient(135deg, #f4efff 0%, #fff0f6 100%)", boxShadow: "0 16px 42px rgba(109, 74, 255, 0.12)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto 40px", textAlign: "center" }}>
          <p className="mah-kicker" style={{ color: "#6d4aff", fontWeight: 700, letterSpacing: "0.12em" }}>Leading Advantages</p>
          <h2 style={{ color: "#2b1d5c", lineHeight: 1.2 }}>Why Students Choose <em style={{ color: "#6d4aff" }}>Lara Assignment</em></h2>
        </div>
        <div className="mah-value-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 18 }}>
          {advantages.map(([label, title, text], index) => {
            const accent = ["#6d4aff", "#d9480f", "#0b7a75", "#946200", "#1d5fd1", "#c2185b"][index % 6];
            return (
              <article key={label} style={{ minWidth: 0, height: "100%", padding: "26px 24px", border: 0, borderRadius: 22, background: "#fff", boxShadow: "0 10px 26px rgba(80, 50, 160, 0.1)", boxSizing: "border-box" }}>
                <span style={{ display: "inline-block", margin: "0 0 14px", padding: "4px 12px", borderRadius: 999, background: `${accent}1f`, color: accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>{label}</span>
                <h3 style={{ margin: "0 0 10px", color: "#2b1d5c", fontSize: 18, lineHeight: 1.35 }}>{title}</h3>
                <p style={{ margin: 0, color: "#5f5a78", fontSize: 14, lineHeight: 1.65 }}>{text}</p>
              </article>
            );
          })}
        </div>
      </section>






       {/* REVIEWS — light-grey panel, white cards, orange stars/tabs, charcoal CTA bar */}
      <section className="mah-content-section" style={{ ...fitBox, display: "block", padding: "clamp(24px, 5vw, 56px)", border: "1px solid #e6e6ee", borderRadius: 24, background: "#f2f2f7" }}>
        <div style={{ maxWidth: 780, margin: "0 auto 28px", textAlign: "center" }}>
          <p className="mah-section-kicker" style={{ color: "#f2600c", fontWeight: 700, letterSpacing: "0.12em" }}>Student feedback</p>
          <h2 style={{ color: "#2a2a2e", lineHeight: 1.2 }}>What Can Student Reviews Tell You About <em style={{ color: "#f2600c" }}>Assignment Writing Help?</em></h2>
          <p style={{ maxWidth: 620, margin: "14px auto 0", color: "#6b6b73", lineHeight: 1.7 }}>Read feedback from students who have used academic support for research, writing, editing, and other coursework needs.</p>
        </div>
 
        <div role="tablist" aria-label="Review sources" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, margin: "0 0 28px" }}>
          {["Our website reviews", "Sitejabbar", "Review.io"].map((label, index) => {
            const active = reviewTab === index;
            return (
              <button key={label} type="button" role="tab" aria-selected={active} onClick={() => setReviewTab(index)} style={{ padding: "10px 20px", border: `1px solid ${active ? "#f2600c" : "#dcdce6"}`, borderRadius: 999, background: active ? "#f2600c" : "#fff", color: active ? "#fff" : "#2a2a2e", fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{label}</button>
            );
          })}
        </div>
 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 16 }}>
          {reviewCards.map(([title, meta, text, photo]) => (
            <article key={title} style={{ position: "relative", display: "flex", flexDirection: "column", minWidth: 0, height: "100%", padding: "22px 20px 18px", border: "1px solid #e6e6ee", borderRadius: 16, background: "#fff", boxSizing: "border-box" }}>
              <span aria-hidden="true" style={{ position: "absolute", top: 8, right: 18, color: "#ffd9c4", fontSize: 54, fontWeight: 700, lineHeight: 1 }}>”</span>
              <img src={photo} alt="" width={48} height={48} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "50%", marginBottom: 12 }} />
              <div aria-label="5 star rating" style={{ margin: "0 0 12px", color: "#f2600c", fontSize: 16, letterSpacing: "0.12em", lineHeight: 1 }}>★★★★★</div>
              <strong style={{ color: "#2a2a2e", fontSize: 16, lineHeight: 1.35 }}>{title}</strong>
              <small style={{ alignSelf: "flex-start", margin: "8px 0 14px", padding: "3px 10px", borderRadius: 999, background: "#fff1e8", color: "#b8470a", fontSize: 12, fontWeight: 600 }}>{meta}</small>
              <p style={{ flex: 1, margin: 0, color: "#4a4a52", fontSize: 14, lineHeight: 1.65 }}>{text}</p>
              <time style={{ margin: "16px 0 0", paddingTop: 12, borderTop: "1px solid #eeeef3", color: "#8a8a94", fontSize: 12 }}>17 Oct 2026</time>
            </article>
          ))}
        </div>
 
        <Link className="mah-review-cta" href="/order" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "32px 0 0", padding: "18px 24px", borderRadius: 14, background: "#2a2a2e", color: "#fff", fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 600, lineHeight: 1.4, textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>
          <span>Searching for “Do My Assignment for Me”? Get the Support You Need</span>
          <span aria-hidden="true" style={{ color: "#f2600c", fontSize: 20 }}>→</span>
        </Link>
      </section>
 
      {/* FAQ — white panel, heading on the left, orange accordion on the right */}
      <section className="mah-content-section" style={{ ...fitBox, display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "clamp(24px, 4vw, 48px)", padding: "clamp(24px, 5vw, 56px)", border: "1px solid #e6e6ee", borderRadius: 24, background: "#fff", boxShadow: "0 16px 42px rgba(42, 42, 46, 0.08)" }}>
        <div style={{ flex: "1 1 280px", maxWidth: 380, minWidth: 0, position: "sticky", top: 24 }}>
          <p className="mah-section-kicker" style={{ color: "#f2600c", fontWeight: 700, letterSpacing: "0.12em" }}>Questions, answered</p>
          <h2 style={{ color: "#2a2a2e", lineHeight: 1.2 }}>Frequently Asked Questions Regarding <em style={{ color: "#f2600c" }}>Custom Academic Writing Support</em></h2>
        </div>
 
        <div style={{ flex: "2 1 380px", minWidth: 0, display: "grid", gap: 12 }}>
          {faqs.map(([question, answer], index) => {
            const open = openFaq === index;
            return (
              <div key={question} style={{ border: `1px solid ${open ? "#ffd2b8" : "#e6e6ee"}`, borderRadius: 14, background: open ? "#fff7f1" : "#fff", overflow: "hidden" }}>
                <button type="button" aria-expanded={open} aria-controls={`faq-panel-${index}`} onClick={() => setOpenFaq(open ? null : index)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, width: "100%", padding: "16px 18px", border: 0, background: "transparent", color: "#2a2a2e", fontFamily: "inherit", fontSize: 16, fontWeight: 600, lineHeight: 1.4, textAlign: "left", cursor: "pointer" }}>
                  <span style={{ minWidth: 0 }}>{question}</span>
                  <span aria-hidden="true" style={{ display: "grid", placeItems: "center", flex: "0 0 28px", width: 28, height: 28, borderRadius: "50%", background: open ? "#f2600c" : "#fff1e8", color: open ? "#fff" : "#f2600c" }}>
                    {open ? <Minus size={15} /> : <Plus size={15} />}
                  </span>
                </button>
                {open && <p id={`faq-panel-${index}`} style={{ margin: 0, padding: "0 18px 18px", color: "#5a5a63", fontSize: 14.5, lineHeight: 1.7 }}>{answer}</p>}
              </div>
            );
          })}
        </div>
      </section>



      <MahFooter />
      <Chatbot />



      <div className="mah-floating-actions" aria-label="Contact options">
        {siteSettings.whatsapp && (
          <a className="mah-whatsapp" href={`https://api.whatsapp.com/send?phone=${siteSettings.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp"><Phone size={22} /></a>
        )}
      </div>
    </main>
  );
}