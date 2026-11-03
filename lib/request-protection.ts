const buckets = new Map<string, { count: number; resetAt: number }>();
const idempotencyKeys = new Map<string, number>();

function clientAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export function rateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const key = `${scope}:${clientAddress(request)}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function rememberIdempotencyKey(scope: string, value: string) {
  const now = Date.now();
  for (const [key, expiresAt] of idempotencyKeys) {
    if (expiresAt <= now) idempotencyKeys.delete(key);
  }
  const key = `${scope}:${value}`;
  if (idempotencyKeys.has(key)) return false;
  idempotencyKeys.set(key, now + 24 * 60 * 60 * 1000);
  return true;
}
