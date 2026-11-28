import "server-only";
import type { User } from "@/lib/types";
import { prisma } from "./prisma";
import { sessionUserId } from "./session";

/** The logged-in user, if the session is valid and the account is still active. Mentors have no login. */
export async function currentUser(): Promise<User | null> {
  const id = await sessionUserId();
  if (!id) return null;
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u || !u.active || u.role === "mentor") return null;
  return { ...u, startupId: u.startupId ?? undefined, expertise: u.expertise ?? undefined, kyc: (u.kyc as User["kyc"]) ?? undefined, role: u.role as User["role"] };
}
