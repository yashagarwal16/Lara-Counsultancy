import { NextResponse } from "next/server";
import { connectDatabase } from "../../../lib/db";
import Enquiry from "../../../models/Enquiry";
import { getSiteSettings } from "../../../lib/site-settings";
import { rateLimit, rememberIdempotencyKey } from "../../../lib/request-protection";

export const runtime = "nodejs";

type ChatTurn = { role: "user" | "model"; text: string };
type RawChatTurn = { role: unknown; text: unknown };

function isRawChatTurn(value: unknown): value is RawChatTurn {
  return value !== null && typeof value === "object" && "role" in value && "text" in value;
}

export async function POST(request: Request) {
  if (!rateLimit(request, "chat", 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }
  const parsedBody: unknown = await request.json().catch(() => null);
  const body = parsedBody !== null && typeof parsedBody === "object"
    ? parsedBody as { message?: unknown; history?: unknown }
    : {};
  const message = body && typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 2000) return NextResponse.json({ error: "Enter a message up to 2,000 characters." }, { status: 400 });
  const history: ChatTurn[] = [];
  if (Array.isArray(body.history)) {
    for (const turn of body.history.filter(isRawChatTurn).slice(-10)) {
      if ((turn.role === "user" || turn.role === "model") && typeof turn.text === "string" && turn.text.trim()) {
        history.push({ role: turn.role, text: turn.text.trim().slice(0, 2000) });
      }
    }
  }
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey || idempotencyKey.length > 120 || !/^[a-zA-Z0-9._:-]+$/.test(idempotencyKey)) {
    return NextResponse.json({ error: "A message key is required. Please try again." }, { status: 400 });
  }
  let enquiry;
  try {
    await connectDatabase();
    enquiry = await Enquiry.create({ type: "chat", description: message, source: "chatbot", idempotencyKey });
  } catch (error) {
    console.error("Chat enquiry persistence failed:", error);
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "This message has already been sent." }, { status: 409 });
    }
    return NextResponse.json({ error: "Chat history could not be saved. Please try again." }, { status: 503 });
  }
  rememberIdempotencyKey("chat", idempotencyKey);
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    await Enquiry.findByIdAndUpdate(enquiry._id, { status: "resolved", assistantResponse: "Chatbot is not configured yet." });
    return NextResponse.json({ error: "Chatbot is not configured yet." }, { status: 503 });
  }

  try {
    const settings = await getSiteSettings();
    const requestBody = JSON.stringify({
      systemInstruction: { parts: [{ text: `You are ${settings.brandName}'s helpful website assistant. Answer the user's latest question using the conversation context. Do not repeat a previous answer verbatim unless the user asks you to repeat it. Keep replies concise and easy to scan: use a short opening sentence, then at most four numbered steps when explaining a process. Use bold labels sparingly and never use headings, tables, or long paragraphs. Answer FAQs about services, order process, privacy, fair use, deadlines, and contact options. Do not complete assessed work, promise grades, give legal/medical advice, or claim a human has reviewed an enquiry. If the user needs a quote or personal help, direct them to /order or /contact_us.html.` }] },
      contents: [...history, { role: "user", parts: [{ text: message }] }].map((turn) => ({
        role: turn.role,
        parts: [{ text: "parts" in turn ? turn.parts[0].text : turn.text }],
      })),
    });
    const configuredModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const models = [configuredModel, "gemini-2.5-flash", "gemini-2.0-flash"].filter((model, index, list) => list.indexOf(model) === index);
    let response: Response | undefined;
    for (const model of models) {
      const candidate = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
      if (candidate.ok || candidate.status !== 404) {
        response = candidate;
        break;
      }
    }
    if (!response?.ok) {
      const fallback = "I can help you get started. Please use the Order Now form to share your subject, deadline, pages, and requirements, or use the Contact page to reach the support team.";
      await Enquiry.findByIdAndUpdate(enquiry._id, { status: "resolved", assistantResponse: fallback });
      return NextResponse.json({ message: fallback, fallback: true });
    }
    const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Chatbot returned no answer.");
    await Enquiry.findByIdAndUpdate(enquiry._id, { status: "resolved", assistantResponse: text });
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Chatbot response failed:", error);
    await Enquiry.findByIdAndUpdate(enquiry._id, { assistantResponse: "The assistant was unavailable for this message." });
    return NextResponse.json({ error: "Chatbot provider unavailable." }, { status: 502 });
  }
}
