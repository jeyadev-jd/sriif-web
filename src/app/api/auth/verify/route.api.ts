import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/server/prisma";
import { rateLimited, hashOtp, sameOrigin, setSession } from "@/server/session";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  if (rateLimited(req, "auth", 20, 15 * 60_000)) return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const { email, otp } = (await req.json().catch(() => ({}))) as { email?: string; otp?: string };
  const e = String(email ?? "").trim().toLowerCase();
  const rec = await prisma.otpCode.findUnique({ where: { email: e } });
  const bad = () => Response.json({ error: "Wrong or expired OTP." }, { status: 401 });
  if (!rec || rec.expiresAt < new Date() || rec.attempts >= 5) return bad();
  const a = Buffer.from(rec.codeHash), b = Buffer.from(hashOtp(e, String(otp ?? "")));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    await prisma.otpCode.update({ where: { email: e }, data: { attempts: { increment: 1 } } });
    return bad();
  }
  await prisma.otpCode.delete({ where: { email: e } });
  const user = await prisma.user.findFirst({ where: { email: { equals: e, mode: "insensitive" }, active: true, role: { not: "mentor" } } });
  if (!user) return bad();
  await setSession(user.id);
  return Response.json({ ok: true, role: user.role });
}
