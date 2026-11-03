"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Check, ChevronDown, Copy, Menu, MessageCircle, Minus, Phone, Plus, ShieldCheck, UserRound, X } from "lucide-react";
import { defaultSiteSettings, type EditableSiteSettings } from "../lib/site-settings-shared";
import Chatbot from "./Chatbot";
import { useSiteSettings } from "./use-site-settings";
import "./mah-public.css";

export type MahServiceConfig = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  cta: string;
  proof: string;
  benefits: string[];
  steps: { title: string; text: string }[];
  features: { title: string; text: string }[];
  subjects: string[];
  faq: { question: string; answer: string }[];
  related: { label: string; href: string }[];
};

const services = [
  ["Assignment Help", "/assignment-help"],
  ["Essay Help", "/essay-help"],
  ["Dissertation Help", "/dissertation"],
  ["Coursework Help", "/coursework"],
  ["Proofreading & Editing", "/proofreading-editing"],
  ["Programming & Technical Guidance", "/programming-technical"],
];

export function LaraLogo({ className = "", brandName = "Lara Consultancy", logoImage = "" }: { className?: string; brandName?: string; logoImage?: string }) {
  return (
    <Link className={`mah-shared-logo ${className}`.trim()} href="/" aria-label="Lara Consultancy home">
      <img className="mah-shared-logo-image" src={logoImage || "/lara-consultancy-icon.png"} alt="" />
      <span className="mah-shared-logo-mark" aria-hidden="true" />
      <strong>{brandName}</strong>
    </Link>
  );
}

export function MahHeader() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const settings = useSiteSettings();
  return <header className="mah-shared-header"><LaraLogo brandName={settings.brandName} logoImage={settings.logoImage} /><nav className={`mah-shared-nav ${open ? "open" : ""}`} aria-label="Primary navigation">
    <div className={`mah-menu ${servicesOpen ? "services-open" : ""}`}><button type="button" aria-expanded={servicesOpen} onClick={() => setServicesOpen((value) => !value)}>Services <ChevronDown size={14} /></button><div className="mah-menu-panel"><span>Popular services</span>{services.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div></div>
   <Link href="/reviews/">Reviews</Link><Link href="/about-us.html">About us</Link>
    <Link href="/blog/">Blog</Link>
    <Link className="mah-mobile-order" href="/order">Order Now</Link>
     </nav><div className="mah-shared-actions"><Link className="mah-shared-order" href="/order">Order Now</Link><button className="mah-shared-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X size={23} /> : <Menu size={23} />}</button></div></header>;
}

export function MahOrderForm({ service = "Assignment help" }: { service?: string }) {
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const submissionKey = useRef(crypto.randomUUID());
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus("Sending...");
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": submissionKey.current }, body: JSON.stringify({ ...Object.fromEntries(new FormData(event.currentTarget)), type: "order", service, pages, source: "order-form" }) });
      const data = await response.json().catch(() => ({}));
      setStatus(response.ok ? "Enquiry received. We will contact you shortly." : data.error || "We could not send this enquiry. Please try again.");
      if (response.ok) {
        event.currentTarget.reset();
        submissionKey.current = crypto.randomUUID();
      }
    } catch (error) {
      console.error("Order enquiry failed:", error);
      setStatus("We could not connect. Please check your connection and try again.");
    }
    setBusy(false);
  }
  return <section className="mah-order-card" aria-labelledby="mah-order-title"><div className="mah-order-heading"><div><p className="mah-kicker">Start your order</p><h2 id="mah-order-title">Human-led academic support</h2></div><span className="mah-safe-badge"><ShieldCheck size={14} /> Private enquiry</span></div><p className="mah-order-intro">Tell us about your {service.toLowerCase()} requirements and get practical support from a subject specialist.</p><form onSubmit={submit}>
    <div className="mah-mode-row" role="radiogroup" aria-label="Assignment type"><label><input type="radio" name="assignmentType" value="Writing" defaultChecked /> Writing</label><label><input type="radio" name="assignmentType" value="Technical" /> Technical</label><label><input type="radio" name="assignmentType" value="Online Class" /> Online Class</label></div>
    <div className="mah-input-grid"><label>Email<input name="email" type="email" required placeholder="you@example.com" /></label><label>Subject / course code<input name="subject" required placeholder="e.g. Business 101" /></label><label>Deadline<input name="deadline" type="date" required /></label><label>Time<select name="time" defaultValue="2"><option value="2">2:00 AM</option><option value="12">12:00 PM</option><option value="18">6:00 PM</option></select></label></div>
    <div className="mah-pages-row"><label htmlFor="mah-pages">Pages</label><div className="mah-stepper"><button type="button" aria-label="Remove one page" onClick={() => setPages((value) => Math.max(1, value - 1))}><Minus size={14} /></button><output id="mah-pages" aria-live="polite">{pages} {pages === 1 ? "page" : "pages"}</output><button type="button" aria-label="Add one page" onClick={() => setPages((value) => value + 1)}><Plus size={14} /></button></div></div>
    <label>Country / phone<input name="phone" type="tel" placeholder="+1 000 000 0000" /></label><label>Description<textarea name="description" required placeholder="Write your assignment requirements here..." /></label>
    <label className="mah-consent"><input type="checkbox" name="consent" required /> <span>I accept the T&amp;C and agree to receive offers &amp; updates.</span></label><button className="mah-submit" type="submit" disabled={busy}>{busy ? "Sending..." : "Do My Assignment"} <span>→</span></button>
  </form>{status && <p className="mah-form-status" role="status">{status}</p>}<p className="mah-order-note">Your details are private and secure. No payment is taken here.</p></section>;
}

type SocialIconProps = { size?: number };

function SocialSvg({ size = 17, children }: SocialIconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const FacebookIcon = (props: SocialIconProps) => <SocialSvg {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></SocialSvg>;
const TwitterIcon = (props: SocialIconProps) => <SocialSvg {...props}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></SocialSvg>;
const YoutubeIcon = (props: SocialIconProps) => <SocialSvg {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></SocialSvg>;
const InstagramIcon = (props: SocialIconProps) => <SocialSvg {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></SocialSvg>;
const LinkedinIcon = (props: SocialIconProps) => <SocialSvg {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></SocialSvg>;

const SOCIAL_ICONS = { facebook: FacebookIcon, twitter: TwitterIcon, youtube: YoutubeIcon, instagram: InstagramIcon, linkedin: LinkedinIcon } as const;
const SOCIAL_LABELS = { facebook: "Facebook", twitter: "X (Twitter)", youtube: "YouTube", instagram: "Instagram", linkedin: "LinkedIn" } as const;

const companyLinks = [
  ["About us", "/about-us.html"],
  ["Blog", "/blog/"],
  ["Reviews", "/reviews/"],
  ["FAQs", "/faqs.html"],
  ["Contact us", "/contact_us.html"],
];

const resourceLinks = [
  ["Essay writing guide", "/blog/essay-writing-guide"],
  ["Essay length guide", "/blog/how-long-is-an-essay"],
  ["Research paper outline", "/blog/research-paper-outline"],
  ["Academic FAQs", "/faqs.html"],
  ["Terms & conditions", "/terms-of-use"],
  ["Privacy & data", "/privacy-policy"],
  ["Revision & refund rules", "/revision-refund-policy"],
  ["Fair use guidance", "/fair-use-policy"],
];

function OfferBanner({ settings }: { settings: EditableSiteSettings }) {
  const [copied, setCopied] = useState(false);
  const offer = settings.offer;
  const endMs = offer.endsOn ? Date.parse(`${offer.endsOn}T23:59:59Z`) : null;
  if (!offer.enabled || (endMs !== null && Date.now() > endMs)) return null;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available: the code is still visible to copy by hand */
    }
  }

  const endLabel = endMs !== null
    ? new Date(endMs).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    : "";

  return (
    <section className="mah-offer" aria-label="Current offer">
      <div className="mah-offer-text">
        <p className="mah-kicker">{offer.kicker}</p>
        <h2>{offer.title}</h2>
        <p>{offer.description}</p>
        {(endLabel || offer.terms) && (
          <p className="mah-offer-fine">
            {endLabel && <span className="mah-offer-pill">Ends {endLabel}</span>}
            {offer.terms && <span>{offer.terms}</span>}
          </p>
        )}
      </div>
      <div className="mah-offer-actions">
        {offer.code && (
          <div className="mah-offer-code">
            <span>Code</span>
            <strong>{offer.code}</strong>
            <button type="button" onClick={copyCode} aria-label={`Copy code ${offer.code}`}>
              {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
        <Link className="mah-orange-button" href={offer.ctaHref}>{offer.ctaLabel} <span>→</span></Link>
      </div>
    </section>
  );
}

export function MahFooter() {
  const [settings, setSettings] = useState<EditableSiteSettings>(defaultSiteSettings);
  useEffect(() => {
    fetch("/api/site-settings", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((value) => {
      if (value) setSettings(value as EditableSiteSettings);
    }).catch((error) => console.error("Site settings could not be loaded:", error));
  }, []);
  const { legalName, phone, email, whatsapp, hours, socials } = settings;
  const socialKeys = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).filter((key) => socials[key]);

  return (
    <footer className="mah-shared-footer">
      <OfferBanner settings={settings} />

      <div className="mah-f-grid">
        <div className="mah-f-brand">
          <LaraLogo brandName={settings.brandName} logoImage={settings.logoImage} />
          <p>{settings.brandTagline}</p>
          <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
        </div>

        <div className="mah-f-col">
          <h3>Services</h3>
          {services.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>

        <div className="mah-f-col">
          <h3>Company</h3>
          {companyLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>

        <div className="mah-f-col">
          <h3>Resources</h3>
          {resourceLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>

        <div className="mah-f-col">
          <h3>Contact us</h3>
          <a href={`tel:${phone.replace(/\s/g, "")}`}><Phone size={14} aria-hidden="true" /> {phone}</a>
          {email && <a href={`mailto:${email}`}>{email}</a>}
          {whatsapp && (
            <a href={`https://api.whatsapp.com/send?phone=${whatsapp}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={14} aria-hidden="true" /> Chat on WhatsApp
            </a>
          )}
          {hours && <p className="mah-f-hours">{hours}</p>}
          {socialKeys.length > 0 && (
            <div className="mah-f-social" aria-label="Social media">
              {socialKeys.map((key) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <a key={key} href={socials[key]} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LABELS[key]}>
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mah-f-bottom">
        <span>© {new Date().getFullYear()} {legalName}. All rights reserved.</span>
        <span>
          <Link href="/terms-of-use">Terms of use</Link>
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/revision-refund-policy">Revision &amp; Refund policy</Link>
          <Link href="/fair-use-policy">Fair use policy</Link>
        </span>
      </div>
    </footer>
  );
}

export function MahPageFrame({ children }: { children: ReactNode }) {
  const settings = useSiteSettings();
  const themeStyle = { "--mah-orange": settings.theme.primary, "--mah-orange-dark": settings.theme.primaryDark, "--mah-blue": settings.theme.accent, "--mah-ink": settings.theme.ink } as CSSProperties;
  return <div className="mah-public-site" style={themeStyle}><MahHeader />{children}<MahFooter /><Chatbot /></div>;
}

export function MahServicePage({ config }: { config: MahServiceConfig }) {
  return <MahPageFrame><main><section className="mah-service-hero"><div><p className="mah-kicker">{config.eyebrow}</p><h1>{config.title} <em>{config.accent}</em></h1><p className="mah-lead">{config.intro}</p><div className="mah-hero-links"><Link className="mah-orange-button" href="/order">{config.cta} <span>→</span></Link><span className="mah-proof-pill"><Check size={15} /> {config.proof}</span></div></div><MahOrderForm service={config.eyebrow} /></section><section className="mah-benefit-bar">{config.benefits.map((benefit) => <div key={benefit}><Check size={17} />{benefit}</div>)}</section><section className="mah-service-section mah-process-section"><div className="mah-section-intro"><p className="mah-kicker">A clear process</p><h2>How this support <em>works.</em></h2><p>Share the details of your task, connect with the right specialist, and review the completed support against your requirements.</p></div><div className="mah-step-list">{config.steps.map((step, index) => <article key={step.title}><span>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></section><section className="mah-service-section"><div className="mah-section-heading"><p className="mah-kicker">What to expect</p><h2>Support shaped around <em>your work.</em></h2></div><div className="mah-feature-grid">{config.features.map((feature, index) => <article key={feature.title}><span>0{index + 1}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></section><section className="mah-subject-section"><div><p className="mah-kicker">Subject coverage</p><h2>Find help for your <em>course.</em></h2><p>Support is matched to your academic level, brief, subject method, and required referencing style.</p></div><div className="mah-subject-links">{config.subjects.map((subject) => <Link key={subject} href="/order">{subject}<span>↗</span></Link>)}</div></section><section className="mah-service-section mah-faq-section"><div className="mah-section-heading"><p className="mah-kicker">Questions, answered</p><h2>Before you <em>order.</em></h2></div><div className="mah-faq-list">{config.faq.map((item) => <details key={item.question}><summary>{item.question}<ChevronDown size={17} /></summary><p>{item.answer}</p></details>)}</div></section><section className="mah-related-section"><p className="mah-kicker">Explore more</p>{config.related.map((item) => <Link key={item.href} href={item.href}>{item.label}<span>→</span></Link>)}</section></main></MahPageFrame>;
}