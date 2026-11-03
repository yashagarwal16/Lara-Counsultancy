"use client";

import { useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSiteSettings } from "./use-site-settings";
import "./chatbot.css";
import "./chatbot-overrides.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const messageKey = useRef(crypto.randomUUID());
  const settings = useSiteSettings();
  const quickPrompts = ["What services do you offer?", "How does ordering work?", "Can I speak to a person?"];

  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    setAnswer("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": messageKey.current }, body: JSON.stringify({ message }) });
      const data = await response.json().catch(() => ({}));
      setAnswer(response.ok ? data.message : data.error || "The assistant is unavailable.");
      if (response.ok) messageKey.current = crypto.randomUUID();
    } catch (error) {
      console.error("Chatbot request failed:", error);
      setAnswer("The assistant could not connect. Please use the order form or contact page instead.");
    }
    setBusy(false);
  }

  function useQuickPrompt(prompt: string) {
    setMessage(prompt);
  }

  if (!settings.chatbot.enabled) return null;
  return <aside className={`lara-chat ${open ? "lara-chat-open" : ""}`} aria-label={settings.chatbot.title}>
    {open && <section className="lara-chat-panel" aria-label={settings.chatbot.title}>
      <header className="lara-chat-header">
        <span className="lara-chat-avatar"><MessageCircle size={18} /></span>
        <div><small className="lara-chat-eyebrow">Lara academic desk</small><strong>{settings.chatbot.title}</strong><small>Usually replies in a few seconds</small></div>
        <button className="lara-chat-dismiss" type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
      </header>
      <div className="lara-chat-body">
        <p className="lara-chat-welcome"><span className="lara-chat-status-dot" />{settings.chatbot.intro}</p>
        {!answer && !busy && <div className="lara-chat-prompts" aria-label="Suggested questions">
          {quickPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => useQuickPrompt(prompt)}>{prompt}</button>)}
        </div>}
        {answer && <p className="lara-chat-answer" role="status">{answer}</p>}
        {busy && <p className="lara-chat-typing" role="status" aria-live="polite"><span /><span /><span /> Lara is thinking…</p>}
      </div>
      <form className="lara-chat-form" onSubmit={ask}>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} required placeholder="Type your question here…" rows={2} aria-label="Your message" />
        <button type="submit" disabled={busy}>{busy ? "Sending…" : "Send message"} <span>→</span></button>
      </form>
      <footer className="lara-chat-footer">
        <span>Need a person?</span>
        <a href="/contact_us.html">Contact support</a>
        <a href="/order">Start an enquiry</a>
      </footer>
    </section>}
    {!open && <button className="lara-chat-trigger" type="button" onClick={() => setOpen(true)} aria-expanded={false} aria-label={settings.chatbot.buttonLabel}>{<MessageCircle size={18} />}<span>{settings.chatbot.buttonLabel}</span></button>}
  </aside>;
}
