import { NextResponse } from "next/server";
import { connectDatabase } from "../../../lib/db";
import Enquiry from "../../../models/Enquiry";
import { getSiteSettings } from "../../../lib/site-settings";
import { rateLimit, rememberIdempotencyKey } from "../../../lib/request-protection";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!rateLimit(request, "chat", 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const message = body && typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 2000) return NextResponse.json({ error: "Enter a message up to 2,000 characters." }, { status: 400 });
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
    const requestBody = JSON.stringify({ systemInstruction: { parts: [{ text: `You are ${settings.brandName}'s helpful website assistant. Answer FAQs about services, order process, privacy, fair use, deadlines, and contact options. Do not complete assessed work, promise grades, give legal/medical advice, or claim a human has reviewed an enquiry. If the user needs a quote or personal help, direct them to /order or /contact_us.html.` }] }, contents: [{ role: "user", parts: [{ text: message }] }] });
    const configuredModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const models = [configuredModel, "gemini-3.8-flash"].filter((model, index, list) => list.indexOf(model) === index);
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
