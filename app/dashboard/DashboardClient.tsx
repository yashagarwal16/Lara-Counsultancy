"use client";

import { useState } from "react";
import type { EditableSiteSettings } from "../../lib/site-settings-shared";
import "./dashboard.css";

type Enquiry = { _id: string; type: string; name?: string; email?: string; subject?: string; description?: string; assistantResponse?: string; status: string; createdAt: string; notification?: { email?: string; whatsapp?: string } };

function formatEnquiryDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function DashboardClient({ enquiries, settings: initialSettings, page, hasNextPage }: { enquiries: Enquiry[]; settings: EditableSiteSettings; page: number; hasNextPage: boolean }) {
  const [settings, setSettings] = useState(initialSettings);
  const [settingsStatus, setSettingsStatus] = useState("");
  const [formVersion, setFormVersion] = useState(0);
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
    window.location.replace("/dashboard/login");
  }
  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSettingsStatus("Saving settings...");
    const form = new FormData(event.currentTarget);
    const next = {
      ...settings,
      theme: {
        primary: String(form.get("themePrimary") || ""),
        primaryDark: String(form.get("themePrimaryDark") || ""),
        accent: String(form.get("themeAccent") || ""),
        ink: String(form.get("themeInk") || ""),
      },
      logoImage: String(form.get("logoImage") || settings.logoImage),
      brandName: String(form.get("brandName") || ""),
      brandTagline: String(form.get("brandTagline") || ""),
      legalName: String(form.get("legalName") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      whatsapp: String(form.get("whatsapp") || ""),
      hours: String(form.get("hours") || ""),
      socials: {
        facebook: String(form.get("facebook") || ""),
        twitter: String(form.get("twitter") || ""),
        youtube: String(form.get("youtube") || ""),
        instagram: String(form.get("instagram") || ""),
        linkedin: String(form.get("linkedin") || ""),
      },
      offer: {
        ...settings.offer,
        enabled: form.get("offerEnabled") === "on",
        kicker: String(form.get("offerKicker") || ""),
        title: String(form.get("offerTitle") || ""),
        description: String(form.get("offerDescription") || ""),
        code: String(form.get("offerCode") || ""),
        ctaLabel: String(form.get("offerCtaLabel") || ""),
        ctaHref: String(form.get("offerCtaHref") || ""),
        endsOn: String(form.get("offerEndsOn") || ""),
        terms: String(form.get("offerTerms") || ""),
      },
      chatbot: {
        enabled: form.get("chatbotEnabled") === "on",
        title: String(form.get("chatbotTitle") || ""),
        intro: String(form.get("chatbotIntro") || ""),
        buttonLabel: String(form.get("chatbotButtonLabel") || ""),
      },
    };
    const response = await fetch("/api/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setSettingsStatus(data.error || "Settings could not be saved."); return; }
    setSettings(data);
    setFormVersion((value) => value + 1);
    setSettingsStatus("Settings saved. Public pages will update shortly.");
  }
  async function readLogo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 1000000) {
      setSettingsStatus("Logo must be PNG, JPG, or WebP and smaller than 1 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSettings((current) => ({ ...current, logoImage: String(reader.result || "") }));
    reader.onerror = () => setSettingsStatus("Logo could not be read.");
    reader.readAsDataURL(file);
  }
  return <main className="dashboard-shell">
    <header className="dashboard-topbar">
      <div className="dashboard-brand"><img src="/lara-consultancy-icon.png" alt="Lara Consultancy" /><div><span>Workspace</span><strong>Client dashboard</strong></div></div>
      <button className="dashboard-signout" onClick={logout}>Sign out</button>
    </header>
    <section className="dashboard-hero"><div><p className="dashboard-kicker">Lara Consultancy / Control centre</p><h1>Make every student touchpoint feel <em>intentional.</em></h1><p>Manage your public brand, conversations, and enquiry pipeline from one calm workspace.</p></div><div className="dashboard-hero-meta"><span className="dashboard-live-dot" /> <strong>Workspace online</strong><small>Settings sync to the public site</small></div></section>
    <div className="dashboard-stats"><div><span>Open enquiries</span><strong>{enquiries.filter((item) => item.status !== "resolved").length}</strong></div><div><span>Conversations saved</span><strong>{enquiries.filter((item) => item.type === "chat").length}</strong></div><div><span>Current page</span><strong>{page}</strong></div></div>
    <section className="dashboard-card dashboard-settings-card">
      <div className="dashboard-section-heading"><div><p className="dashboard-kicker">Public experience</p><h2>Website settings</h2></div><p>Shape the brand, contact points, offer banner, and Lara chatbot without touching code.</p></div>
      <form key={formVersion} onSubmit={saveSettings} className="dashboard-form">
        <fieldset><legend>Theme system</legend><div className="dashboard-color-grid">
          <label>Primary colour<input name="themePrimary" type="color" defaultValue={settings.theme.primary} /></label><label>Hover colour<input name="themePrimaryDark" type="color" defaultValue={settings.theme.primaryDark} /></label><label>Accent colour<input name="themeAccent" type="color" defaultValue={settings.theme.accent} /></label><label>Text colour<input name="themeInk" type="color" defaultValue={settings.theme.ink} /></label>
        </div><small>These colours update buttons, links, highlights, chatbot controls, and headings across public pages.</small></fieldset>
        <fieldset><legend>Brand and contact</legend><div className="dashboard-logo-row"><div className="dashboard-logo-preview"><img src={settings.logoImage || "/lara-consultancy-icon.png"} alt="Current Lara Consultancy logo" /></div><div><label>Upload replacement logo<input name="logoFile" type="file" accept="image/png,image/jpeg,image/webp" onChange={readLogo} /></label><small>PNG, JPG, or WebP under 1 MB. The orange L icon is used by default.</small>{settings.logoImage && <button className="dashboard-text-button" type="button" onClick={() => setSettings((current) => ({ ...current, logoImage: "" }))}>Restore default logo</button>}</div></div><input type="hidden" name="logoImage" value={settings.logoImage} readOnly />
          <div className="dashboard-field-grid"><label>Brand name<input name="brandName" required maxLength={120} defaultValue={settings.brandName} /></label><label>Footer tagline<input name="brandTagline" maxLength={160} defaultValue={settings.brandTagline} /></label><label>Business name<input name="legalName" defaultValue={settings.legalName} /></label><label>Phone<input name="phone" defaultValue={settings.phone} /></label><label>Public email<input name="email" type="email" defaultValue={settings.email} /></label><label>WhatsApp number<input name="whatsapp" defaultValue={settings.whatsapp} placeholder="Digits with country code" /></label><label>Support hours<input name="hours" defaultValue={settings.hours} /></label></div>
        </fieldset>
        <fieldset><legend>Lara chatbot</legend><div className="dashboard-toggle"><label><input name="chatbotEnabled" type="checkbox" defaultChecked={settings.chatbot.enabled} /> Show chatbot on public pages</label></div><div className="dashboard-field-grid"><label>Assistant title<input name="chatbotTitle" maxLength={80} defaultValue={settings.chatbot.title} /></label><label>Chat button label<input name="chatbotButtonLabel" maxLength={40} defaultValue={settings.chatbot.buttonLabel} /></label></div><label>Welcome text<textarea name="chatbotIntro" maxLength={300} defaultValue={settings.chatbot.intro} rows={2} /></label><small>Chat messages are saved in Enquiries. Gemini and infrastructure credentials remain server-only.</small></fieldset>
        <fieldset><legend>Social links</legend><div className="dashboard-field-grid">{(["facebook", "twitter", "youtube", "instagram", "linkedin"] as const).map((key) => <label key={key}>{key}<input name={key} type="url" defaultValue={settings.socials[key]} placeholder={`https://${key}.com/...`} /></label>)}</div></fieldset>
        <fieldset><legend>Offer banner</legend><div className="dashboard-toggle"><label><input name="offerEnabled" type="checkbox" defaultChecked={settings.offer.enabled} /> Show offer banner</label></div><div className="dashboard-field-grid"><label>Small label<input name="offerKicker" defaultValue={settings.offer.kicker} /></label><label>Offer title<input name="offerTitle" defaultValue={settings.offer.title} /></label><label>Discount code<input name="offerCode" defaultValue={settings.offer.code} /></label><label>Button label<input name="offerCtaLabel" defaultValue={settings.offer.ctaLabel} /></label><label>Button link<input name="offerCtaHref" defaultValue={settings.offer.ctaHref} /></label><label>Expiry date<input name="offerEndsOn" type="date" defaultValue={settings.offer.endsOn} /></label></div><label>Description<textarea name="offerDescription" defaultValue={settings.offer.description} rows={3} /></label><label>Terms<textarea name="offerTerms" defaultValue={settings.offer.terms} rows={2} /></label></fieldset>
        <div className="dashboard-form-actions"><button className="dashboard-save" type="submit">Save website settings <span>→</span></button>{settingsStatus && <p role="status">{settingsStatus}</p>}</div>
      </form>
    </section>
    <section className="dashboard-card dashboard-enquiries"><div className="dashboard-section-heading"><div><p className="dashboard-kicker">Inbox</p><h2>Enquiries and conversations</h2></div><span className="dashboard-count">{enquiries.length} shown</span></div>{enquiries.length ? <div className="dashboard-enquiry-list">{enquiries.map((item) => <article key={item._id} className="dashboard-enquiry"><div className="dashboard-enquiry-top"><span className={`dashboard-type dashboard-type-${item.type}`}>{item.type}</span><time>{formatEnquiryDate(item.createdAt)}</time></div><h3>{item.subject || item.type}</h3><p className="dashboard-enquiry-contact">{item.name || "Visitor"} · {item.email || "Chat visitor"}</p>{item.description && <p className="dashboard-enquiry-description">{item.description}</p>}{item.assistantResponse && <details><summary>Assistant response</summary><p>{item.assistantResponse}</p></details>}<small>Status: {item.status} · Email: {item.notification?.email || "not applicable"} · WhatsApp: {item.notification?.whatsapp || "not applicable"}</small></article>)}</div> : <div className="dashboard-empty"><strong>Your inbox is clear.</strong><span>New website enquiries and chatbot conversations will appear here.</span></div>}<nav className="dashboard-pagination" aria-label="Enquiry pages"><span>Page {page}</span>{page > 1 && <a href={`/dashboard?page=${page - 1}`}>Previous</a>}{hasNextPage && <a href={`/dashboard?page=${page + 1}`}>Next</a>}</nav></section>
  </main>;
}
