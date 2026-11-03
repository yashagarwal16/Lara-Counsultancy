import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "lara_admin_session";

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET is not configured.");
  return value;
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSession() {
  const value = `admin.${Date.now() + 1000 * 60 * 60 * 12}`;
  return `${value}.${signature(value)}`;
}

export function isValidSession(value?: string) {
  if (!value) return false;
  const [role, expiry, provided] = value.split(".");
  if (role !== "admin" || !expiry || !provided || Number(expiry) < Date.now()) return false;
  const expected = signature(`${role}.${expiry}`);
  return provided.length === expected.length && timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export async function requireAdmin() {
  const session = (await cookies()).get(cookieName)?.value;
  if (!isValidSession(session)) throw new Error("Unauthorized.");
}

export { cookieName };
