"use client";

import { useRef, useState, type ReactNode } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSiteSettings } from "./use-site-settings";
import "./chatbot.css";
import "./chatbot-overrides.css";

function inlineChatText(value: string): ReactNode[] {
  return value.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(\/(?:order|contact_us\.html)\)|\/(?:order|contact_us\.html))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    const markdownLink = part.match(/^\[([^\]]+)\]\((\/(?:order|contact_us\.html))\)$/);
    if (markdownLink) {
      return <a key={index} href={markdownLink[2]}>{markdownLink[1]}</a>;
    }
    if (part === "/order" || part === "/contact_us.html") {
      return <a key={index} href={part}>{part === "/order" ? "Order page" : "Contact page"}</a>;
    }
    return <span key={index}>{part}</span>;
  });
}

function ChatMessage({ text, role }: { text: string; role: "user" | "model" }) {
  const lines = text.split(/\r?\n/);
  const content: ReactNode[] = [];
  let listItems: ReactNode[] = [];
  const flushList = (key: string) => {
    if (listItems.length) {
      content.push(<ol key={key}>{listItems}</ol>);
      listItems = [];
    }
  };
  lines.forEach((line, index) => {
    const numbered = line.match(/^\s*(\d+)\.\s+(.*)$/);
    const bulleted = line.match(/^\s*[-*]\s+(.*)$/);
    if (numbered || bulleted) {
      listItems.push(<li key={`${index}-${line}`}>{inlineChatText((numbered || bulleted)?.[numbered ? 2 : 1] || "")}</li>);
    } else if (line.trim()) {
      flushList(`list-${index}`);
      content.push(<p key={`${index}-${line}`}>{inlineChatText(line)}</p>);
    } else {
      flushList(`list-${index}`);
    }
  });
  flushList("list-end");
  return <div className={`lara-chat-message lara-chat-${role === "user" ? "question" : "answer"}`} role={role === "model" ? "status" : undefined}>
    {content}
  </div>;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "model"; text: string }>>([]);
  const [busy, setBusy] = useState(false);
  const messageKey = useRef(crypto.randomUUID());
  const settings = useSiteSettings();
  const quickPrompts = ["What services do you offer?", "How does ordering work?", "Can I speak to a person?"];
  const recommendedPrompts = ["What are your deadlines?", "How much does support cost?", "How can I contact your team?"];

  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    try {
      const currentMessage = message.trim();
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": messageKey.current }, body: JSON.stringify({ message: currentMessage, history: messages }) });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setMessages((current) => [...current, { role: "user", text: currentMessage }, { role: "model", text: data.message }]);
        setMessage("");
        messageKey.current = crypto.randomUUID();
      } else {
        setMessages((current) => [...current, { role: "model", text: data.error || "The assistant is unavailable." }]);
      }
    } catch (error) {
      console.error("Chatbot request failed:", error);
      setMessages((current) => [...current, { role: "model", text: "The assistant could not connect. Please use the order form or contact page instead." }]);
    }
    setBusy(false);
  }

  function useQuickPrompt(prompt: string) {
    setMessage(prompt);
  }

  function handleMessageKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
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
        <div className="lara-chat-welcome">
          <span className="lara-chat-status-dot" />
          <p><strong>Welcome to Lara Consultancy.</strong> We provide practical, subject-specific academic guidance, research support, proofreading, and assignment help for students worldwide.</p>
          <p>{settings.chatbot.intro}</p>
        </div>
        {!messages.length && !busy && <div className="lara-chat-prompts" aria-label="Suggested questions">
          <small>Frequently asked</small>
          {quickPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => useQuickPrompt(prompt)}>{prompt}</button>)}
        </div>}
        {messages.map((item, index) => <ChatMessage key={`${item.role}-${index}`} role={item.role} text={item.text} />)}
        {busy && <p className="lara-chat-typing" role="status" aria-live="polite"><span /><span /><span /> Lara is thinking…</p>}
        {messages.length > 0 && !busy && <div className="lara-chat-prompts lara-chat-recommendations" aria-label="Recommended questions">
          <small>You may also ask</small>
          {recommendedPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => useQuickPrompt(prompt)}>{prompt}</button>)}
        </div>}
      </div>
      <form className="lara-chat-form" onSubmit={ask}>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={handleMessageKeyDown} maxLength={2000} required placeholder="Type your question here…" rows={2} aria-label="Your message" />
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
