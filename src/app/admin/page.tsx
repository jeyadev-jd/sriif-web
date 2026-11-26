"use client";

import { Building2, CalendarDays, Inbox, LifeBuoy, Receipt, UserPlus } from "lucide-react";
import Link from "next/link";
import { Badge, Card, PageTitle, Stat, Table } from "@/components/ui";
import { DOC_TYPES } from "@/lib/seed";
import { brand } from "@/lib/site";
import { fmtDate, inr, invoiceTotals, today, upcomingEvents, useStore } from "@/lib/store";
import { AreaChart, BarList, Ring } from "@/components/charts";

export default function AdminHome() {
  const { db } = useStore();
  const active = db.startups.filter((s) => s.status === "Active");
  const newReq = db.requests.filter((r) => r.status === "New" || r.status === "In review");
  const openT = db.tickets.filter((t) => t.status === "Open" || t.status === "In progress");
  const dues = db.startups.flatMap((s) => s.invoices.filter((i) => i.status === "Due").map((i) => ({ s, i })));
  const dueAmt = dues.reduce((a, x) => a + invoiceTotals(x.i.lines, brand.gstRate).total, 0);
  const pendingBookings = db.startups.flatMap((s) => s.bookings.filter((b) => b.status === "Pending").map((b) => ({ s, b })));
  const missingDocs = db.startups.filter((s) => DOC_TYPES.some((t) => t.mandatory && !s.docs.some((d) => d.type === t.type)));

  // Ecosystem analytics
  const total = db.startups.length || 1;
  const byStatus = (st: string) => db.startups.filter((s) => s.status === st).length;
  const cohort = (["Pre-Incubation", "Resident Incubation", "Virtual Incubation"] as const).map((p) => ({ label: p, value: db.startups.filter((s) => s.program === p).length }));
  const periods = Array.from(new Set(db.startups.flatMap((s) => s.reports.map((r) => r.period)))).sort((a, b) => a.slice(3).localeCompare(b.slice(3)) || a.localeCompare(b));
  const perPeriod = periods.map((p) => db.startups.reduce((a, s) => a + (s.reports.find((r) => r.period === p)?.revenue ?? 0), 0));
  const revenue = periods.map((p, i) => ({ x: p, y: perPeriod.slice(0, i + 1).reduce((a, v) => a + v, 0) }));
  const run = revenue.at(-1)?.y ?? 0;
  const partnerships = db.startups.reduce((a, s) => a + (s.reports.at(-1)?.partnerships ?? 0), 0);
  const activeEvents = upcomingEvents(db.cms.events, today()).length;
  const short = (v: number) => (v >= 1e7 ? `₹${(v / 1e7).toFixed(1)} Cr` : v >= 1e5 ? `₹${(v / 1e5).toFixed(1)} L` : inr(v));
  const verifyQueue = db.startups.flatMap((s) => s.memberRequests).filter((r) => r.status === "Pending").length + db.users.flatMap((u) => u.kyc ?? []).filter((k) => k.status === "Pending").length;

  return (
    <>
      <PageTitle title="Admin dashboard" sub="Everything that needs SRIIF attention today." action={<Link href="/admin/onboard" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"><UserPlus size={18} aria-hidden />Onboard a startup</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat icon={Building2} label="Active startups" value={active.length} />
        <Stat icon={Inbox} label="Join requests" value={newReq.length} tone={newReq.length ? "amber" : "brand"} />
        <Stat icon={LifeBuoy} label="Open tickets" value={openT.length} tone={openT.length ? "amber" : "brand"} />
        <Stat icon={Receipt} label="Dues" value={inr(dueAmt)} />
        <Stat icon={CalendarDays} label="Bookings to approve" value={pendingBookings.length} />
      </div>
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-slate-500">Ecosystem analytics</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Cohort distribution"><BarList data={cohort} /></Card>
        <Card title="Survival & graduation">
          <div className="grid gap-5">
            <Ring value={((byStatus("Active") + byStatus("Graduated")) / total) * 100} label="Survival rate" sub={`${byStatus("Active") + byStatus("Graduated")} of ${db.startups.length} still operating`} />
            <Ring value={(byStatus("Graduated") / total) * 100} label="Graduation rate" sub={`${byStatus("Graduated")} graduated · ${byStatus("Exited")} exited`} />
          </div>
        </Card>
        <Card title="Ecosystem totals">
          <dl className="grid grid-cols-2 gap-4">
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Revenue generated</dt><dd className="text-2xl font-bold tabular-nums">{short(run)}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Partnerships</dt><dd className="text-2xl font-bold tabular-nums">{partnerships}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Active events</dt><dd className="text-2xl font-bold tabular-nums">{activeEvents}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">KYC to verify</dt><dd className="text-2xl font-bold tabular-nums"><Link className="text-brand underline" href="/admin/verification">{verifyQueue}</Link></dd></div>
          </dl>
        </Card>
        <Card title="Cumulative revenue (from progress reviews)" className="lg:col-span-3"><AreaChart points={revenue} format={short} label="Cumulative revenue" /></Card>
      </div>
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-slate-500">Needs attention</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Open tickets" action={<Link className="text-sm text-brand underline" href="/admin/tickets">All tickets</Link>}>
          <Table head={["Ticket", "Startup", "Status"]} rows={openT.map((t) => [<span key="t">{t.no}<br /><span className="text-xs text-slate-500">{t.subject}</span></span>, db.startups.find((s) => s.id === t.startupId)?.name, <Badge key="b">{t.status}</Badge>])} empty="No open tickets." />
        </Card>
        <Card title="New onboarding requests" action={<Link className="text-sm text-brand underline" href="/admin/requests">Requests</Link>}>
          <Table head={["Received", "Startup", "Via", "Status"]} rows={newReq.map((r) => [fmtDate(r.receivedOn), r.startupName, r.via, <Badge key="b">{r.status}</Badge>])} empty="No pending requests." />
        </Card>
        <Card title="Dues">
          <Table head={["Startup", "Invoice", "Due", "Status"]} rows={dues.map(({ s, i }) => [s.name, `${i.no} · ${inr(invoiceTotals(i.lines, brand.gstRate).total)}`, fmtDate(i.due), <Badge key="b">{i.utr ? "Pending" : i.due < today() ? "Overdue" : "Due"}</Badge>])} empty="No dues." />
        </Card>
        <Card title="Missing mandatory documents">
          <Table head={["Startup", "Missing"]} rows={missingDocs.map((s) => [<Link key="l" className="text-brand underline" href={`/admin/startups/view?id=${s.id}&tab=documents`}>{s.name}</Link>, DOC_TYPES.filter((t) => t.mandatory && !s.docs.some((d) => d.type === t.type)).length + " docs"])} empty="All complete." />
        </Card>
      </div>
    </>
  );
}
