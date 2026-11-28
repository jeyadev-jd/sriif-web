import { prisma } from "@/server/prisma";
import { rateLimited, hashOtp, newOtp, sameOrigin } from "@/server/session";

const GENERIC = { ok: true, message: "If this email is registered, an OTP has been sent." };

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  if (rateLimited(req, "auth", 20, 15 * 60_000)) return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  const e = String(email ?? "").trim().toLowerCase();
  if (!e || e.length > 200) return Response.json({ error: "Enter your email." }, { status: 400 });
  const user = await prisma.user.findFirst({ where: { email: { equals: e, mode: "insensitive" }, active: true, role: { not: "mentor" } } });
  if (!user) return Response.json(GENERIC); // same answer either way: no account probing
  const prev = await prisma.otpCode.findUnique({ where: { email: e } });
  if (prev && prev.expiresAt.getTime() - 9 * 60_000 > Date.now()) return Response.json(GENERIC); // at most one code per minute
  const code = newOtp();
  await prisma.otpCode.upsert({
    where: { email: e },
    create: { email: e, codeHash: hashOtp(e, code), expiresAt: new Date(Date.now() + 10 * 60_000) },
    update: { codeHash: hashOtp(e, code), expiresAt: new Date(Date.now() + 10 * 60_000), attempts: 0 },
  });
  // No mail service yet: the code is printed in the server terminal (or DEV_OTP is used).
  if (process.env.NODE_ENV !== "production") console.log(`[auth] OTP for ${e}: ${code}`);
  return Response.json(GENERIC);
}
