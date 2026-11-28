"use client";

import { ChevronLeft, ChevronRight, Download, Pause, Play, Printer, RotateCcw, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AreaChart, BarList, Ring } from "@/components/charts";
import { Badge, Button, Card, cx, Field, PageTitle, Table } from "@/components/ui";
import { downloadCsv } from "@/lib/export";
import { DOC_TYPES, SECTORS } from "@/lib/seed";
import { brand } from "@/lib/site";
import { fmtDate, inr, invoiceTotals, upcomingEvents, useStore } from "@/lib/store";
import type { Startup } from "@/lib/types";

const short = (v: number) => (v >= 1e7 ? `₹${(v / 1e7).toFixed(1)} Cr` : v >= 1e5 ? `₹${(v / 1e5).toFixed(1)} L` : inr(v));
/** "Q3 2026" → sortable "2026-3". */
const qKey = (p: string) => `${p.slice(3)}-${p[1]}`;
const ALL = "All";

type Filters = { program: string; cohort: string; sector: string; status: string; from: string; to: string };
const NONE: Filters = { program: ALL, cohort: ALL, sector: ALL, status: ALL, from: "", to: "" };

/** Rotating highlight cards at the top of the dashboard. */
function Highlights({ items }: { items: { label: string; value: string; note: string; href: string }[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;
  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), 5000);
    return () => clearTimeout(t);
  }, [i, paused, n]);
  if (!n) return null;
  const cur = i % n;
  // On wide screens three cards show at once; the window slides by one.
  const view = [0, 1, 2].map((k) => items[(cur + k) % n]);
  return (
    <section aria-roledescription="carousel" aria-label="Highlights" className="rounded-2xl bg-brand-dark p-5 text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Highlights</p>
        <div className="flex gap-1">
          <button aria-label="Previous highlight" onClick={() => setI((v) => (v - 1 + n) % n)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10"><ChevronLeft size={18} aria-hidden /></button>
          <button aria-label={paused ? "Play highlights" : "Pause highlights"} onClick={() => setPaused((v) => !v)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10">{paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}</button>
          <button aria-label="Next highlight" onClick={() => setI((v) => (v + 1) % n)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10"><ChevronRight size={18} aria-hidden /></button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3" aria-live="polite">
        {view.map((h, k) => (
          <Link key={h.label + k} href={h.href} className={cx("rounded-xl bg-white/8 p-4 transition-colors hover:bg-white/15", k > 0 && "hidden md:block")}>
            <p className="text-sm text-white/70">{h.label}</p>
            <p className="display mt-1 text-4xl text-white">{h.value}</p>
            <p className="mt-1 text-xs text-white/60">{h.note}</p>
          </Link>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden>{items.map((_, k) => <span key={k} className={cx("h-1.5 rounded-full", k === cur ? "w-6 bg-accent" : "w-2 bg-white/30")} />)}</div>
    </section>
  );
}

function Sel({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return <Field label={label}><select className="field" value={value} onChange={(e) => onChange(e.target.value)}>{[ALL, ...options].map((o) => <option key={o}>{o}</option>)}</select></Field>;
}

export default function AdminHome() {
  const { db, day } = useStore();
  const [f, setF] = useState<Filters>(NONE);
  const set = (k: keyof Filters) => (v: string) => setF((x) => ({ ...x, [k]: v }));
  const periods = useMemo(() => Array.from(new Set(db.startups.flatMap((s) => s.reports.map((r) => r.period)))).sort((a, b) => qKey(a).localeCompare(qKey(b))), [db.startups]);
  const cohorts = Array.from(new Set(db.startups.map((s) => s.cohort))).sort();

  const list = db.startups.filter((s) =>
    (f.program === ALL || s.program === f.program) && (f.cohort === ALL || s.cohort === f.cohort) &&
    (f.sector === ALL || s.sectors.includes(f.sector)) && (f.status === ALL || s.status === f.status));
  const ids = new Set(list.map((s) => s.id));
  const inRange = (p: string) => (!f.from || qKey(p) >= qKey(f.from)) && (!f.to || qKey(p) <= qKey(f.to));
  const usedPeriods = periods.filter(inRange);
  const filtered = JSON.stringify(f) !== JSON.stringify(NONE);

  // Metrics over the filtered startups
  const total = list.length || 1;
  const byStatus = (st: Startup["status"]) => list.filter((s) => s.status === st).length;
  const perPeriod = usedPeriods.map((p) => list.reduce((a, s) => a + (s.reports.find((r) => r.period === p)?.revenue ?? 0), 0));
  const revenue = usedPeriods.map((p, i) => ({ x: p, y: perPeriod.slice(0, i + 1).reduce((a, v) => a + v, 0) }));
  const quarterly = usedPeriods.map((p, i) => ({ label: p, value: perPeriod[i] }));
  const lastIn = (s: Startup) => s.reports.filter((r) => inRange(r.period)).sort((a, b) => qKey(b.period).localeCompare(qKey(a.period)))[0];
  const partnerships = list.reduce((a, s) => a + (lastIn(s)?.partnerships ?? 0), 0);
  const usersReached = list.reduce((a, s) => a + (lastIn(s)?.users ?? 0), 0);
  const funds = list.flatMap((s) => s.funding.map((x) => ({ s, x })));
  const fundTotal = funds.reduce((a, { x }) => a + x.amount, 0);
  const fundByType = Object.entries(funds.reduce<Record<string, number>>((a, { x }) => ({ ...a, [x.type]: (a[x.type] ?? 0) + x.amount }), {})).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  const program = (["Pre-Incubation", "Incubation"] as const).map((p) => ({ label: p, value: list.filter((s) => s.program === p).length }));
  const sector = Object.entries(list.flatMap((s) => s.sectors).reduce<Record<string, number>>((a, x) => ({ ...a, [x]: (a[x] ?? 0) + 1 }), {})).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  const invs = list.flatMap((s) => s.invoices.filter((i) => i.status !== "Cancelled").map((i) => ({ s, i, t: invoiceTotals(i.lines, brand.gstRate, i.discount).total })));
  const billed = invs.reduce((a, x) => a + x.t, 0);
  const collected = invs.filter((x) => x.i.status === "Paid").reduce((a, x) => a + x.t, 0);
  const overdue = invs.filter((x) => x.i.status === "Due" && x.i.due < day);
  const tickets = db.tickets.filter((t) => ids.has(t.startupId));
  const ticketCat = Object.entries(tickets.reduce<Record<string, number>>((a, t) => ({ ...a, [t.category]: (a[t.category] ?? 0) + 1 }), {})).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  const bookings = list.flatMap((s) => s.bookings.filter((b) => b.status === "Approved"));
  const facilityUse = db.facilities.map((x) => ({ label: x, value: bookings.filter((b) => b.facility === x).length })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  const activeEvents = upcomingEvents(db.cms.events, day).length;
  const missingDocs = list.filter((s) => DOC_TYPES.some((t) => t.mandatory && !s.docs.some((d) => d.type === t.type)));
  const noReport = usedPeriods.length ? list.filter((s) => s.status === "Active" && !s.reports.some((r) => r.period === usedPeriods.at(-1))) : [];
  const openT = tickets.filter((t) => t.status === "Open" || t.status === "In progress");
  const newReq = db.requests.filter((r) => r.status === "New" || r.status === "In review");
  const pendingBookings = list.flatMap((s) => s.bookings.filter((b) => b.status === "Pending"));

  const highlights = [
    { label: "Revenue generated", value: short(revenue.at(-1)?.y ?? 0), note: usedPeriods.length ? `${usedPeriods[0]} to ${usedPeriods.at(-1)}` : "No reviews yet", href: "/admin/reviews" },
    { label: "Funding raised", value: short(fundTotal), note: `${funds.length} grants and rounds`, href: "/admin/startups" },
    { label: "Active startups", value: String(byStatus("Active")), note: `${list.length} in view`, href: "/admin/startups" },
    { label: "Collection rate", value: billed ? `${Math.round((collected / billed) * 100)}%` : "—", note: `${inr(collected)} of ${inr(billed)}`, href: "/admin/billing" },
    { label: "Open tickets", value: String(openT.length), note: "Open or in progress", href: "/admin/tickets" },
    { label: "Upcoming events", value: String(activeEvents), note: "From the website calendar", href: "/admin/cms" },
    { label: "Join requests", value: String(newReq.length), note: "New or in review", href: "/admin/requests" },
  ];

  const stamp = day || "export";
  const exportStartups = () => downloadCsv(`sriif-startups-${stamp}`,
    ["Startup", "Program", "Cohort", "Sectors", "Stage", "Status", "TRL", "Onboarded", "Latest revenue (INR)", "Users", "Partnerships", "Funding raised (INR)", "Billed (INR)", "Paid (INR)", "Open tickets"],
    list.map((s) => {
      const r = lastIn(s);
      const si = invs.filter((x) => x.s.id === s.id);
      return [s.name, s.program, s.cohort, s.sectors.join("; "), s.stage, s.status, s.trl, s.onboardedOn, r?.revenue ?? 0, r?.users ?? 0, r?.partnerships ?? 0,
        s.funding.reduce((a, x) => a + x.amount, 0), si.reduce((a, x) => a + x.t, 0), si.filter((x) => x.i.status === "Paid").reduce((a, x) => a + x.t, 0),
        tickets.filter((t) => t.startupId === s.id && t.status !== "Closed" && t.status !== "Resolved").length];
    }));
  const exportReviews = () => downloadCsv(`sriif-progress-reviews-${stamp}`, ["Startup", "Period", "Revenue (INR)", "Users", "Pilots", "Partnerships", "Milestones", "Submitted"],
    list.flatMap((s) => s.reports.filter((r) => inRange(r.period)).map((r) => [s.name, r.period, r.revenue, r.users, r.pilots, r.partnerships, r.milestones, r.submittedOn])));
  const exportFunding = () => downloadCsv(`sriif-funding-${stamp}`, ["Startup", "Date", "Type", "Source", "Round", "Amount (INR)"], funds.map(({ s, x }) => [s.name, x.date, x.type, x.source, x.round, x.amount]));
  const exportInvoices = () => downloadCsv(`sriif-invoices-${stamp}`, ["Startup", "Invoice", "Period", "Issued", "Due", "Total (INR)", "Status"], invs.map(({ s, i, t }) => [s.name, i.no, i.period, i.issued, i.due, t, i.status]));

  return (
    <>
      <PageTitle title="Dashboard" sub="Ecosystem analytics. Filter, then export what you see."
        action={<Link href="/admin/onboard" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"><UserPlus size={18} aria-hidden />Onboard a startup</Link>} />
      <Highlights items={highlights} />

      <Card className="no-print mt-6" title="Filters" action={filtered && <Button size="sm" variant="ghost" onClick={() => setF(NONE)}><RotateCcw size={16} aria-hidden />Clear</Button>}>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Sel label="Program" value={f.program} options={["Pre-Incubation", "Incubation"]} onChange={set("program")} />
          <Sel label="Cohort" value={f.cohort} options={cohorts} onChange={set("cohort")} />
          <Sel label="Sector" value={f.sector} options={SECTORS} onChange={set("sector")} />
          <Sel label="Status" value={f.status} options={["Active", "Graduated", "Exited"]} onChange={set("status")} />
          <Field label="From quarter"><select className="field" value={f.from} onChange={(e) => set("from")(e.target.value)}><option value="">First</option>{periods.map((p) => <option key={p}>{p}</option>)}</select></Field>
          <Field label="To quarter"><select className="field" value={f.to} onChange={(e) => set("to")(e.target.value)}><option value="">Latest</option>{periods.map((p) => <option key={p}>{p}</option>)}</select></Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="mr-1 text-sm text-slate-500">{list.length} startup(s) in view. Export:</span>
          <Button size="sm" variant="outline" onClick={exportStartups}><Download size={16} aria-hidden />Startups</Button>
          <Button size="sm" variant="outline" onClick={exportReviews}><Download size={16} aria-hidden />Progress reviews</Button>
          <Button size="sm" variant="outline" onClick={exportFunding}><Download size={16} aria-hidden />Funding</Button>
          <Button size="sm" variant="outline" onClick={exportInvoices}><Download size={16} aria-hidden />Invoices</Button>
          <Button size="sm" variant="ghost" onClick={() => window.print()}><Printer size={16} aria-hidden />Print / PDF</Button>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Revenue generated", short(revenue.at(-1)?.y ?? 0)], ["Funding raised", short(fundTotal)], ["Users reached", usersReached.toLocaleString("en-IN")], ["Partnerships", String(partnerships)]].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{l}</p><p className="mt-1 text-3xl font-bold tabular-nums text-brand-dark">{v}</p></div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Cumulative revenue" className="lg:col-span-2"><AreaChart points={revenue} format={short} label="Cumulative revenue" /></Card>
        <Card title="Survival & graduation">
          <div className="grid gap-5">
            <Ring value={((byStatus("Active") + byStatus("Graduated")) / total) * 100} label="Survival rate" sub={`${byStatus("Active") + byStatus("Graduated")} of ${list.length} operating`} />
            <Ring value={(byStatus("Graduated") / total) * 100} label="Graduation rate" sub={`${byStatus("Graduated")} graduated · ${byStatus("Exited")} exited`} />
          </div>
        </Card>
        <Card title="Revenue per quarter"><BarList data={quarterly.map((q) => ({ ...q, note: short(q.value) }))} /></Card>
        <Card title="Program distribution"><BarList data={program} /></Card>
        <Card title="Sectors"><BarList data={sector} /></Card>
        <Card title="Funding by type"><BarList data={fundByType.map((x) => ({ ...x, note: short(x.value) }))} tone="bg-accent" /></Card>
        <Card title="Billing">
          <Ring value={billed ? (collected / billed) * 100 : 0} label="Collected" sub={`${inr(collected)} of ${inr(billed)} billed`} />
          <p className="mt-4 text-sm text-slate-600">{overdue.length} overdue invoice(s) · {inr(overdue.reduce((a, x) => a + x.t, 0))}</p>
        </Card>
        <Card title="Tickets by category"><BarList data={ticketCat} /></Card>
        <Card title="Facility use (approved bookings)" className="lg:col-span-3"><BarList data={facilityUse} /></Card>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-slate-500">Needs attention</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Open tickets" action={<Link className="text-sm text-brand underline" href="/admin/tickets">All tickets</Link>}>
          <Table head={["Ticket", "Startup", "Status"]} rows={openT.map((t) => [<span key="t">{t.no}<br /><span className="text-xs text-slate-500">{t.subject}</span></span>, db.startups.find((s) => s.id === t.startupId)?.name, <Badge key="b">{t.status}</Badge>])} empty="No open tickets." />
        </Card>
        <Card title="Overdue invoices" action={<Link className="text-sm text-brand underline" href="/admin/billing">Billing</Link>}>
          <Table head={["Startup", "Invoice", "Due", "Amount"]} rows={overdue.map(({ s, i, t }) => [s.name, i.no, fmtDate(i.due), inr(t)])} empty="Nothing overdue." />
        </Card>
        <Card title={`Missing ${usedPeriods.at(-1) ?? ""} progress review`}>
          <Table head={["Startup", "Program"]} rows={noReport.map((s) => [<Link key="l" className="text-brand underline" href={`/admin/startups/view?id=${s.id}`}>{s.name}</Link>, s.program])} empty="All submitted." />
        </Card>
        <Card title="Missing mandatory documents">
          <Table head={["Startup", "Missing"]} rows={missingDocs.map((s) => [<Link key="l" className="text-brand underline" href={`/admin/startups/view?id=${s.id}&tab=documents`}>{s.name}</Link>, DOC_TYPES.filter((t) => t.mandatory && !s.docs.some((d) => d.type === t.type)).length + " docs"])} empty="All complete." />
        </Card>
      </div>
      <p className="mt-6 text-sm text-slate-500">{pendingBookings.length} booking(s) and {newReq.length} join request(s) waiting. <Link className="text-brand underline" href="/admin/bookings">Facilities</Link> · <Link className="text-brand underline" href="/admin/requests">Requests</Link></p>
    </>
  );
}
