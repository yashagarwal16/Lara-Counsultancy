import { NextResponse } from "next/server";
import { createSession, cookieName } from "../../../../lib/auth";
import { rateLimit } from "../../../../lib/request-protection";

export async function POST(request: Request) {
  if (!rateLimit(request, "login", 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const email = body && typeof body.email === "string" ? body.email : "";
  const password = body && typeof body.password === "string" ? body.password : "";
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 12, path: "/" });
  return response;
}
