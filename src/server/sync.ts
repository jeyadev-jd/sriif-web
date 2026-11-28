import "server-only";
// Access rules. The browser sends {base, next}: the state it last received and the state after its
// edits. Only the entities that changed between the two are considered, each is checked against the
// user's role, and the allowed changes are applied to the current database state.
import type { Booking, DB, Invoice, Message, Startup, Ticket, User } from "@/lib/types";
import { CHILDREN, type ChildKey } from "./data";

type Obj = Record<string, unknown>;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const byId = <T extends { id: string }>(l: T[]) => new Map(l.map((x) => [x.id, x]));
const clone = <T,>(x: T): T => structuredClone(x);

/** Changes between two lists: added, changed (with base version) and removed ids. */
function diff<T extends { id: string }>(base: T[], next: T[]) {
  const b = byId(base), n = byId(next);
  return {
    added: next.filter((x) => !b.has(x.id)),
    changed: next.filter((x) => b.has(x.id) && !same(b.get(x.id), x)).map((x) => ({ before: b.get(x.id)!, after: x })),
    removed: base.filter((x) => !n.has(x.id)).map((x) => x.id),
  };
}

/** Apply a list diff onto the current list (new items go to the front, matching the app's unshift). */
function applyList<T extends { id: string }>(cur: T[], d: ReturnType<typeof diff<T>>, front = false) {
  let out = cur.filter((x) => !d.removed.includes(x.id));
  out = out.map((x) => d.changed.find((c) => c.after.id === x.id)?.after ?? x);
  const fresh = d.added.filter((a) => !out.some((x) => x.id === a.id));
  return front ? [...fresh, ...out] : [...out, ...fresh];
}

// ── What each role may see ─────────────────────────────────────────────

const PUBLIC_CMS = (db: DB) => ({ ...db, users: [], startups: [], tickets: [], requests: [], notices: [], audit: [], messages: [], inquiries: [] });

/** Other startups as anonymous stubs that only carry facility bookings (needed for slot availability). */
function stub(s: Startup): Startup {
  return {
    id: s.id, name: "Another startup", logo: "", gstin: "", trl: 0, sectors: [], stage: s.stage, program: s.program, cohort: "", onboardedOn: "",
    website: "", linkedin: "", regAddress: "", commAddress: "", email: "", phone: "", oneLiner: "", status: s.status, mentorIds: [],
    seat: { type: "", count: 0, rate: 0 }, equityTaken: false, docs: [], founders: [], holdings: [], shareClasses: "", funding: [], awards: [],
    reports: [], annual: [], meetings: [], invoices: [], memberRequests: [],
    bookings: s.bookings.filter((b) => b.status === "Pending" || b.status === "Approved").map((b) => ({ id: b.id, facility: b.facility, date: b.date, slot: b.slot, purpose: "", status: b.status })),
  };
}

export function scope(db: DB, user: User | null): DB {
  if (!user) return PUBLIC_CMS(db);
  if (user.role === "admin") return db;
  const sid = user.startupId!;
  return {
    ...PUBLIC_CMS(db),
    startups: db.startups.map((s) => (s.id === sid ? s : stub(s))),
    users: db.users.filter((u) => u.startupId === sid || u.role === "admin").map((u) => (u.role === "admin" ? { id: u.id, name: u.name, email: "", phone: "", role: u.role, designation: u.designation, active: u.active } : u)),
    tickets: db.tickets.filter((t) => t.startupId === sid),
    messages: db.messages.filter((m) => m.startupId === sid),
    notices: db.notices,
  };
}

// ── Applying changes ───────────────────────────────────────────────────

/** Fields a startup team may edit on its own profile. Everything else is set by SRIIF. */
const STARTUP_EDITABLE = new Set(["name", "logo", "pitchDeck", "gstin", "trl", "sectors", "stage", "website", "linkedin", "regAddress", "commAddress", "email", "phone", "oneLiner", "founders", "holdings", "shareClasses", "capTableFile", "annual", "memberRequests"]);
const FREE_CHILDREN = new Set<ChildKey>(["docs", "funding", "awards", "reports"]);

export function apply(cur: DB, base: DB, next: DB, user: User | null, now: string): DB {
  const out = clone(cur);
  if (user?.role === "admin") return applyAdmin(out, base, next, now);
  if (!user) {
    // Visitors may only send website forms (Contact Us / Join Us).
    for (const q of diff(base.inquiries, next.inquiries).added.slice(0, 3)) {
      if (q.kind !== "Contact" && q.kind !== "Join Us") continue;
      out.inquiries.unshift({ id: q.id, kind: q.kind, type: str(q.type, 80), name: str(q.name, 120), email: str(q.email, 200), phone: str(q.phone, 30), org: str(q.org, 200), message: str(q.message, 4000), at: now, status: "New" });
    }
    return out;
  }
  return applyStartup(out, base, next, user, now);
}

const str = (v: unknown, max: number) => String(v ?? "").slice(0, max);
/** Only the expected fields of an uploaded KYC document; the status is always set by the server. */
const kycDoc = (d: { type?: unknown; name?: unknown; uploadedOn?: unknown }) => ({ type: str(d.type, 80), name: str(d.name, 200), uploadedOn: str(d.uploadedOn, 10), status: "Pending" as const });

function applyAdmin(out: DB, base: DB, next: DB, now: string): DB {
  // Startups: whole-entity add/remove, field-level and child-level changes so concurrent edits by teams survive.
  const d = diff(base.startups, next.startups);
  out.startups = out.startups.filter((s) => !d.removed.includes(s.id));
  for (const s of d.added) if (!out.startups.some((x) => x.id === s.id)) out.startups.push(s);
  for (const { before, after } of d.changed) {
    const tgt = out.startups.find((s) => s.id === after.id);
    if (tgt) mergeStartup(tgt, before, after, () => true);
  }
  for (const k of ["users", "tickets", "requests", "notices", "blocks", "messages", "inquiries"] as const) {
    (out as unknown as Obj)[k] = applyList(out[k] as { id: string }[], diff(base[k] as { id: string }[], next[k] as { id: string }[]), k !== "users" && k !== "messages" && k !== "blocks");
  }
  for (const k of Object.keys(next.cms) as (keyof DB["cms"])[]) if (!same(base.cms[k], next.cms[k])) (out.cms as unknown as Obj)[k] = next.cms[k];
  if (!same(base.facilities, next.facilities)) out.facilities = next.facilities;
  addAudit(out, base, next, null, now);
  return out;
}

/** Copy changed fields and child items from after onto tgt, where allowed. */
function mergeStartup(tgt: Startup, before: Startup, after: Startup, fieldOk: (k: string) => boolean) {
  const t = tgt as unknown as Obj, b = before as unknown as Obj, a = after as unknown as Obj;
  for (const k of Object.keys(a)) {
    if ((CHILDREN as readonly string[]).includes(k)) continue;
    if (!same(b[k], a[k]) && fieldOk(k)) t[k] = a[k];
  }
  for (const k of CHILDREN) (t[k] as unknown) = applyList(tgt[k] as { id: string }[], diff(before[k] as { id: string }[], after[k] as { id: string }[]));
}

/** Audit lines describe the client's own edit; the server sets who and when (startups: max 5 per save). */
function addAudit(out: DB, base: DB, next: DB, forceBy: string | null, now: string) {
  const added = Math.max(0, next.audit.length - base.audit.length);
  const fresh = next.audit.slice(0, Math.min(added, forceBy ? 5 : 20)).map((a) => ({ at: now, by: forceBy ?? str(a.by, 120), action: str(a.action, 300) }));
  out.audit = [...fresh, ...out.audit];
}

function applyStartup(out: DB, base: DB, next: DB, user: User, now: string): DB {
  const sid = user.startupId!;
  const tgt = out.startups.find((s) => s.id === sid);
  const b = base.startups.find((s) => s.id === sid), n = next.startups.find((s) => s.id === sid);
  if (tgt && b && n) {
    const t = tgt as unknown as Obj, bo = b as unknown as Obj, no = n as unknown as Obj;
    for (const k of Object.keys(no)) {
      if ((CHILDREN as readonly string[]).includes(k) || !STARTUP_EDITABLE.has(k) || same(bo[k], no[k])) continue;
      if (k === "annual") {
        // Teams upload review files; scores and decisions stay with SRIIF.
        tgt.annual = n.annual.map((y) => { const c = tgt.annual.find((x) => x.year === y.year); return { year: y.year, files: y.files, score: c?.score, decision: c?.decision }; });
      } else if (k === "memberRequests") {
        // New member requests only, always pending; existing requests are decided by SRIIF.
        const fresh = n.memberRequests.filter((r) => !b.memberRequests.some((x) => x.id === r.id) && !tgt.memberRequests.some((x) => x.id === r.id));
        tgt.memberRequests = [...tgt.memberRequests, ...fresh.slice(0, 5).map((r) => ({
          id: str(r.id, 40), name: str(r.name, 120), email: str(r.email, 200), phone: str(r.phone, 30), designation: str(r.designation, 120),
          kyc: (r.kyc ?? []).slice(0, 6).map(kycDoc), requestedBy: user.name, on: now.slice(0, 10), status: "Pending" as const, note: "",
        }))];
      } else t[k] = no[k];
    }
    for (const k of CHILDREN) {
      const d = diff(b[k] as { id: string }[], n[k] as { id: string }[]);
      if (FREE_CHILDREN.has(k)) { (t[k] as unknown) = applyList(tgt[k] as { id: string }[], d); continue; }
      if (k === "bookings") {
        for (const x of d.added as Booking[]) if (!tgt.bookings.some((y) => y.id === x.id)) tgt.bookings.push({ id: x.id, facility: x.facility, date: x.date, slot: x.slot, purpose: str(x.purpose, 300), status: "Pending" });
        for (const { after } of d.changed as unknown as { after: Booking }[]) {
          const c = tgt.bookings.find((y) => y.id === after.id);
          if (c && after.status === "Cancelled" && (c.status === "Pending" || c.status === "Approved")) c.status = "Cancelled";
        }
      }
      if (k === "invoices") {
        for (const { after } of d.changed as unknown as { after: Invoice }[]) {
          const c = tgt.invoices.find((y) => y.id === after.id);
          if (c && c.status === "Due" && !c.utr && after.utr) c.utr = str(after.utr, 40);
        }
      }
    }
  }
  // Support tickets: own startup only; new messages are always from this user.
  const td = diff(base.tickets, next.tickets);
  for (const x of td.added as Ticket[]) {
    if (out.tickets.some((y) => y.id === x.id)) continue;
    out.tickets.unshift({ ...x, startupId: sid, raisedBy: user.name, status: "Open", created: x.created, messages: x.messages.slice(0, 1).map((m) => ({ ...m, by: user.name, role: "startup" })) });
  }
  for (const { before, after } of td.changed as { before: Ticket; after: Ticket }[]) {
    const c = out.tickets.find((y) => y.id === after.id && y.startupId === sid);
    if (!c) continue;
    const added = after.messages.slice(before.messages.length).map((m) => ({ ...m, text: str(m.text, 4000), by: user.name, role: "startup" as const }));
    c.messages = [...c.messages, ...added];
    if (after.status !== before.status && (after.status === "Closed" || after.status === "Open")) c.status = after.status;
  }
  // Direct messages: new ones from this user; may mark SRIIF messages read.
  const md = diff(base.messages, next.messages);
  for (const m of md.added as Message[]) if (!out.messages.some((y) => y.id === m.id)) out.messages.push({ id: m.id, startupId: sid, by: user.name, role: "startup", text: str(m.text, 4000), at: now, read: false });
  for (const { after } of md.changed as { after: Message }[]) {
    const c = out.messages.find((y) => y.id === after.id && y.startupId === sid && y.role === "admin");
    if (c && after.read) c.read = true;
  }
  // Team e-verification: upload KYC documents for own team; statuses stay with SRIIF.
  for (const { after } of diff(base.users, next.users).changed as { after: User }[]) {
    const c = out.users.find((u) => u.id === after.id && u.startupId === sid);
    if (!c) continue;
    const kept = (c.kyc ?? []).filter((k) => (after.kyc ?? []).some((a) => a.type === k.type && a.name === k.name) || k.status === "Verified");
    const fresh = (after.kyc ?? []).filter((a) => !kept.some((k) => k.type === a.type && k.name === a.name)).slice(0, 6).map(kycDoc);
    c.kyc = [...kept, ...fresh];
  }
  addAudit(out, base, next, user.name, now);
  return out;
}
