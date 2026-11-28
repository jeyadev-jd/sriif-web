import { nowStamp } from "@/lib/store-utils";
import type { DB } from "@/lib/types";
import { currentUser } from "@/server/auth";
import { loadDb, persist } from "@/server/data";
import { rateLimited, sameOrigin } from "@/server/session";
import { apply, scope } from "@/server/sync";

// Serialise writes in this process so two saves never interleave.
let queue: Promise<unknown> = Promise.resolve();

export async function GET() {
  const user = await currentUser();
  const db = await loadDb();
  return Response.json({ userId: user?.id ?? null, db: scope(db, user) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  let body: { base?: DB; next?: DB };
  try { body = await req.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (!body.base || !body.next) return Response.json({ error: "base and next are required." }, { status: 400 });
  const user = await currentUser();
  // Visitors can only send website forms: 5 per 10 minutes per IP.
  if (!user && rateLimited(req, "public", 5, 10 * 60_000)) return Response.json({ error: "Too many messages. Try again later." }, { status: 429 });
  const run = queue.then(async () => {
    const cur = await loadDb();
    const merged = apply(cur, body.base!, body.next!, user, nowStamp());
    await persist(cur, merged);
    return scope(await loadDb(), user);
  });
  queue = run.catch(() => undefined);
  try {
    return Response.json({ userId: user?.id ?? null, db: await run }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[api/state] save failed", e);
    return Response.json({ error: "Could not save. Try again." }, { status: 500 });
  }
}
