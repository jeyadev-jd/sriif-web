import "server-only";
import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "sriif_session";
const DAYS = 7;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ characters).");
  return s;
}
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");

export async function setSession(userId: string) {
  const exp = Date.now() + DAYS * 864e5;
  const v = `${userId}.${exp}`;
  (await cookies()).set(COOKIE, `${v}.${sign(v)}`, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: DAYS * 86400,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

/** User id from a valid, unexpired session cookie, else null. */
export async function sessionUserId(): Promise<string | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const i = raw.lastIndexOf(".");
  const v = raw.slice(0, i), sig = raw.slice(i + 1);
  const a = Buffer.from(sig), b = Buffer.from(sign(v));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const [id, exp] = v.split(".");
  return Number(exp) > Date.now() ? id : null;
}

export const hashOtp = (email: string, code: string) => createHash("sha256").update(`${secret()}:${email}:${code}`).digest("hex");
export const newOtp = () => process.env.DEV_OTP || String(randomInt(0, 1e6)).padStart(6, "0");

/** Reject cross-site POSTs: JSON body required (forms cannot send it) and Origin, when present, must match Host. */
export function sameOrigin(req: Request) {
  if (!req.headers.get("content-type")?.startsWith("application/json")) return false;
  const o = req.headers.get("origin");
  if (!o) return true;
  try { return new URL(o).host === req.headers.get("host"); } catch { return false; }
}

// Simple in-memory rate limit per client IP (one server process; use Redis or similar when scaling out).
const hits = new Map<string, number[]>();
export function rateLimited(req: Request, bucket: string, max: number, windowMs: number) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const key = `${bucket}:${ip}`, now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 10_000) hits.clear();
  return list.length > max;
}
