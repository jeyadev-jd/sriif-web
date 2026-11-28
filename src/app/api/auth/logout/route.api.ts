import { clearSession, sameOrigin } from "@/server/session";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  await clearSession();
  return Response.json({ ok: true });
}
