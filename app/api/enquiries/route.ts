import { NextResponse } from "next/server";
import { connectDatabase } from "../../../lib/db";
import Enquiry from "../../../models/Enquiry";
import { sendEnquiryEmail, sendEnquiryWhatsApp } from "../../../lib/notifications";
import { rateLimit, rememberIdempotencyKey } from "../../../lib/request-protection";

export const runtime = "nodejs";

const allowedTypes = new Set(["contact", "order", "chat"]);

export async function POST(request: Request) {
  if (!rateLimit(request, "enquiry", 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!allowedTypes.has(String(input.type)) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "A valid type and email are required." }, { status: 400 });
  }
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey || idempotencyKey.length > 120 || !/^[a-zA-Z0-9._:-]+$/.test(idempotencyKey)) {
    return NextResponse.json({ error: "A submission key is required. Please refresh and try again." }, { status: 400 });
  }
  let enquiry;
  try {
    await connectDatabase();
    enquiry = await Enquiry.create({
      type: String(input.type),
      email,
      idempotencyKey,
      name: typeof input.name === "string" ? input.name : undefined,
      phone: typeof input.phone === "string" ? input.phone : undefined,
      service: typeof input.service === "string" ? input.service : undefined,
      subject: typeof input.subject === "string" ? input.subject : undefined,
      deadline: typeof input.deadline === "string" ? input.deadline : undefined,
      pages: typeof input.pages === "number" ? input.pages : Number(input.pages) || undefined,
      description: typeof input.description === "string"
        ? input.description
        : typeof input.message === "string"
          ? input.message
          : undefined,
      source: typeof input.source === "string" ? input.source : "website",
    });
  } catch (error) {
    console.error("Enquiry persistence failed:", error);
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "This enquiry has already been submitted." }, { status: 409 });
    }
    return NextResponse.json({ error: "Enquiries are temporarily unavailable. Please try again or contact us directly." }, { status: 503 });
  }
  rememberIdempotencyKey("enquiry", idempotencyKey);

  const payload = { id: String(enquiry._id), ...enquiry.toObject() };
  const notification: { email: "failed" | "sent"; whatsapp: "failed" | "sent" | "skipped" } = {
    email: "failed",
    whatsapp: "failed",
  };
  try { await sendEnquiryEmail(payload); notification.email = "sent"; } catch (error) { console.error("Email notification failed:", error); }
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM && process.env.TWILIO_WHATSAPP_TO) {
    try { await sendEnquiryWhatsApp(payload); notification.whatsapp = "sent"; } catch (error) { console.error("WhatsApp notification failed:", error); }
  } else {
    notification.whatsapp = "skipped";
  }
  await Enquiry.findByIdAndUpdate(enquiry._id, { notification });

  return NextResponse.json({ id: String(enquiry._id), message: "Enquiry received." }, { status: 201 });
}
