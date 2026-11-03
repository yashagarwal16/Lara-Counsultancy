import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDatabase } from "../../../lib/db";
import { getSiteSettings, sanitizeSiteSettings } from "../../../lib/site-settings";
import SiteSettings from "../../../models/SiteSettings";
import { isValidSession } from "../../../lib/auth";
import { rateLimit, sameOrigin } from "../../../lib/request-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDatabase();
    const response = NextResponse.json(await getSiteSettings());
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Public site settings unavailable; using defaults:", error);
    return NextResponse.json({ error: "Site settings are temporarily unavailable." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!rateLimit(request, "settings", 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many settings updates. Please try again later." }, { status: 429 });
  }
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isValidSession((await cookies()).get("lara_admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid settings." }, { status: 400 });
  try {
    await connectDatabase();
    const settings = sanitizeSiteSettings(body);
    await SiteSettings.findOneAndUpdate({ key: "primary" }, { ...settings, key: "primary" }, { upsert: true, new: true, runValidators: true });
    const saved = await getSiteSettings();
    const response = NextResponse.json(saved);
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Site settings update failed:", error);
    return NextResponse.json({ error: "Settings could not be saved." }, { status: 503 });
  }
}
