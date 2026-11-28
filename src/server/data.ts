import "server-only";
// Maps between Postgres rows and the app's DB object (src/lib/types.ts).
// Rows mirror the app types field for field; `position` keeps list order, `startupId` links children.
import type { Prisma } from "@/generated/prisma/client";
import { seed } from "@/lib/seed";
import type { AuditEntry, Cms, DB, Startup } from "@/lib/types";
import { prisma } from "./prisma";

type Tx = Prisma.TransactionClient;
type Obj = Record<string, unknown>;

/** Child collections of a startup that live in their own tables. */
export const CHILDREN = ["docs", "funding", "awards", "reports", "bookings", "invoices"] as const;
export type ChildKey = (typeof CHILDREN)[number];
const CHILD_MODEL: Record<ChildKey, string> = { docs: "document", funding: "funding", awards: "award", reports: "report", bookings: "booking", invoices: "invoice" };

/** Top-level collections with their own tables. */
export const TOP = ["users", "tickets", "requests", "notices", "blocks", "messages", "inquiries"] as const;
export type TopKey = (typeof TOP)[number];
const TOP_MODEL: Record<TopKey, string> = { users: "user", tickets: "ticket", requests: "joinRequest", notices: "notice", blocks: "facilityBlock", messages: "message", inquiries: "inquiry" };
const ORDERED = new Set<TopKey>(["tickets", "requests", "notices", "blocks", "messages", "inquiries"]);

// Dynamic model access by name (all models share the id-keyed shape used here).
type Delegate = {
  findMany(a?: object): Promise<Obj[]>;
  upsert(a: object): Promise<unknown>;
  deleteMany(a: object): Promise<unknown>;
};
const model = (db: Tx | typeof prisma, name: string) => (db as unknown as Record<string, Delegate>)[name];

/** Row → app object: drop link/order columns and turn nulls into missing fields. */
function fromRow(r: Obj, drop: string[] = []): Obj {
  const o: Obj = {};
  for (const [k, v] of Object.entries(r)) if (v !== null && k !== "position" && !drop.includes(k)) o[k] = v;
  return o;
}
/** App object → row data: undefined fields become null so updates clear them. */
function toRow(o: Obj, extra: Obj = {}, omit: string[] = []): Obj {
  const r: Obj = {};
  for (const [k, v] of Object.entries(o)) if (!omit.includes(k)) r[k] = v === undefined ? null : v;
  return { ...r, ...extra };
}

const STARTUP_JSON_DEFAULTS = { founders: [], holdings: [], annual: [], meetings: [], memberRequests: [] };
const ALL_CHILD_KEYS = [...CHILDREN] as string[];

export async function loadDb(): Promise<DB> {
  const [startups, children, tops, audit, settings] = await Promise.all([
    prisma.startup.findMany({ orderBy: { position: "asc" } }),
    Promise.all(CHILDREN.map((k) => model(prisma, CHILD_MODEL[k]).findMany({ orderBy: { position: "asc" } }))),
    Promise.all(TOP.map((k) => model(prisma, TOP_MODEL[k]).findMany(ORDERED.has(k) ? { orderBy: { position: "asc" } } : { orderBy: { id: "asc" } }))),
    prisma.auditEntry.findMany({ orderBy: { id: "desc" }, take: 500 }),
    prisma.setting.findMany(),
  ]);
  const set = Object.fromEntries(settings.map((s) => [s.key, s.value])) as { cms?: Cms; facilities?: string[] };
  const db: DB = {
    startups: startups.map((s) => {
      const o = { ...STARTUP_JSON_DEFAULTS, ...fromRow(s as unknown as Obj) } as unknown as Startup;
      CHILDREN.forEach((k, i) => { (o as unknown as Obj)[k] = children[i].filter((c) => c.startupId === s.id).map((c) => fromRow(c, ["startupId"])); });
      return o;
    }),
    users: [], tickets: [], requests: [], notices: [], blocks: [], messages: [], inquiries: [],
    audit: audit.map((a): AuditEntry => ({ at: a.at, by: a.by, action: a.action })),
    facilities: set.facilities ?? seed.facilities,
    cms: { ...seed.cms, ...(set.cms ?? {}) },
  };
  TOP.forEach((k, i) => { (db as unknown as Obj)[k] = tops[i].map((r) => fromRow(r)); });
  return db;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Upsert changed items and delete removed ones, keeping list order in `position`. */
async function syncList(tx: Tx, name: string, prev: Obj[], next: Obj[], extra: Obj = {}, ordered = true, omit: string[] = []) {
  const old = new Map(prev.map((x, i) => [x.id as string, { x, i }]));
  const keep = new Set(next.map((x) => x.id as string));
  const gone = prev.filter((x) => !keep.has(x.id as string)).map((x) => x.id);
  if (gone.length) await model(tx, name).deleteMany({ where: { id: { in: gone } } });
  for (const [i, x] of next.entries()) {
    const o = old.get(x.id as string);
    if (o && same(o.x, x) && (!ordered || o.i === i)) continue;
    const data = toRow(x, { ...extra, ...(ordered ? { position: i } : {}) }, omit);
    await model(tx, name).upsert({ where: { id: x.id }, create: data, update: data });
  }
}

/** Write the difference between two full DB snapshots in one transaction. */
export async function persist(prev: DB, next: DB) {
  await prisma.$transaction(async (tx) => {
    // Startups first (users and children reference them).
    const keep = new Set(next.startups.map((s) => s.id));
    const gone = prev.startups.filter((s) => !keep.has(s.id)).map((s) => s.id);
    if (gone.length) await tx.startup.deleteMany({ where: { id: { in: gone } } });
    const old = new Map(prev.startups.map((s, i) => [s.id, { s, i }]));
    for (const [i, s] of next.startups.entries()) {
      const o = old.get(s.id);
      const strip = (x: Startup) => Object.fromEntries(Object.entries(x).filter(([k]) => !ALL_CHILD_KEYS.includes(k)));
      if (!o || !same(strip(o.s), strip(s)) || o.i !== i) {
        const data = toRow(strip(s), { position: i }) as Prisma.StartupUncheckedCreateInput;
        await tx.startup.upsert({ where: { id: s.id }, create: data, update: data });
      }
      for (const k of CHILDREN) await syncList(tx, CHILD_MODEL[k], (o?.s[k] ?? []) as unknown as Obj[], s[k] as unknown as Obj[], { startupId: s.id });
    }
    for (const k of TOP) await syncList(tx, TOP_MODEL[k], prev[k] as unknown as Obj[], next[k] as unknown as Obj[], {}, ORDERED.has(k));
    // Audit is newest-first; new entries are the ones in front of the previous head.
    const added = next.audit.length - prev.audit.length;
    if (added > 0) await tx.auditEntry.createMany({ data: next.audit.slice(0, added).reverse() });
    if (!same(prev.cms, next.cms)) await tx.setting.upsert({ where: { key: "cms" }, create: { key: "cms", value: next.cms as unknown as Prisma.InputJsonValue }, update: { value: next.cms as unknown as Prisma.InputJsonValue } });
    if (!same(prev.facilities, next.facilities)) await tx.setting.upsert({ where: { key: "facilities" }, create: { key: "facilities", value: next.facilities }, update: { value: next.facilities } });
  }, { timeout: 30_000 });
}

export const EMPTY: DB = { users: [], startups: [], tickets: [], requests: [], notices: [], audit: [], facilities: [], blocks: [], messages: [], inquiries: [], cms: seed.cms };
