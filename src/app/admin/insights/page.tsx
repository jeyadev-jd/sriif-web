"use client";

// One page with every data insight as a chart, grouped by area. Print / save as PDF from the browser.
import { Printer } from "lucide-react";
import type { ReactNode } from "react";
import { BarList, Columns, Donut, MultiLine } from "@/components/charts";
import { Button, Card, PageTitle } from "@/components/ui";
import { brand } from "@/lib/site";
import { inr, invoiceTotals, MONTHS, useStore } from "@/lib/store";

const short = (v: number) => (v >= 1e7 ? `₹${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `₹${(v / 1e5).toFixed(1)}L` : v >= 1e3 ? `₹${Math.round(v / 1e3)}k` : inr(v));
const qKey = (p: string) => `${p.slice(3)}-${p[1]}`;
/** Count items by a key, largest first. */
function count<T>(list: T[], key: (x: T) => string | string[], value: (x: T) => number = () => 1) {
  const m = new Map<string, number>();
  list.forEach((x) => { const k = key(x); (Array.isArray(k) ? k : [k]).forEach((kk) => m.set(kk || "—", (m.get(kk || "—") ?? 0) + value(x))); });
  return [...m].map(([label, v]) => ({ label, value: v })).sort((a, b) => b.value - a.value);
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-20 break-inside-avoid">
      <h2 className="display mb-4 text-3xl text-brand-dark">{title}</h2>
      <div className="grid gap-6 lg:grid-cols-2">{children}</div>
    </section>
  );
}

export default function Insights() {
  const { db, day } = useStore();
  const S = db.startups;
  const periods = Array.from(new Set(S.flatMap((s) => s.reports.map((r) => r.period)))).sort((a, b) => qKey(a).localeCompare(qKey(b)));
  const sumQ = (f: "revenue" | "users" | "pilots" | "partnerships") => periods.map((p) => S.reduce((a, s) => a + (s.reports.find((r) => r.period === p)?.[f] ?? 0), 0));
  const funds = S.flatMap((s) => s.funding.map((f) => ({ s, f })));
  const invs = S.flatMap((s) => s.invoices.map((i) => ({ s, i, t: invoiceTotals(i.lines, brand.gstRate, i.discount).total })));
  const invState = (i: (typeof invs)[number]["i"]) => (i.status === "Due" ? (i.due < day ? "Overdue" : "Due") : i.status);
  const billPeriods = Array.from(new Set(invs.map((x) => x.i.issued.slice(0, 7)))).sort();
  const billLabel = (m: string) => `${MONTHS[Number(m.slice(5)) - 1]} ${m.slice(2, 4)}`;
  const bookings = S.flatMap((s) => s.bookings.map((b) => ({ s, b })));
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const team = db.users.filter((u) => u.role === "startup");
  const kyc = team.flatMap((u) => u.kyc ?? []);
  const sections = [["portfolio", "Portfolio"], ["growth", "Growth"], ["funding", "Funding"], ["billing", "Billing"], ["facilities", "Facilities"], ["helpdesk", "Helpdesk"], ["pipeline", "Pipeline"], ["team", "Team & KYC"], ["website", "Website"]];

  return (
    <>
      <PageTitle title="All insights" sub={`Every metric in one place · ${S.length} startups · ${periods.length} quarters of reviews`}
        action={<Button className="no-print min-h-11" onClick={() => window.print()}><Printer size={18} aria-hidden />Print / save PDF</Button>} />
      <nav aria-label="Jump to section" className="no-print sticky top-16 z-10 -mx-1 flex gap-1 overflow-x-auto bg-slate-50/95 py-2 backdrop-blur">
        {sections.map(([id, l]) => <a key={id} href={`#${id}`} className="flex min-h-10 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 text-sm hover:border-brand hover:text-brand">{l}</a>)}
      </nav>

      <Section id="portfolio" title="Portfolio">
        <Card title="Status"><Donut data={count(S, (s) => s.status)} /></Card>
        <Card title="Program"><Donut data={count(S, (s) => s.program)} /></Card>
        <Card title="Sectors"><Donut data={count(S, (s) => s.sectors)} /></Card>
        <Card title="Stage"><Columns labels={count(S, (s) => s.stage).map((x) => x.label)} series={[{ name: "Startups", values: count(S, (s) => s.stage).map((x) => x.value) }]} /></Card>
        <Card title="Technology readiness (TRL)">{(() => { const d = count(S, (s) => `TRL ${s.trl}`).sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true })); return <Columns labels={d.map((x) => x.label)} series={[{ name: "Startups", values: d.map((x) => x.value) }]} />; })()}</Card>
        <Card title="Onboarded per year">{(() => { const d = count(S, (s) => s.onboardedOn.slice(0, 4)).sort((a, b) => a.label.localeCompare(b.label)); return <Columns labels={d.map((x) => x.label)} series={[{ name: "Startups", values: d.map((x) => x.value) }]} />; })()}</Card>
        <Card title="Cohorts"><BarList data={count(S, (s) => s.cohort)} /></Card>
        <Card title="Seats in use by type"><Donut data={count(S.filter((s) => s.status === "Active"), (s) => s.seat.type, (s) => s.seat.count)} /></Card>
      </Section>

      <Section id="growth" title="Growth">
        <Card title="Revenue per quarter (all startups)" className="lg:col-span-2"><Columns labels={periods} series={[{ name: "Revenue", values: sumQ("revenue") }]} format={short} /></Card>
        <Card title="Revenue by startup per quarter" className="lg:col-span-2"><MultiLine labels={periods} series={S.filter((s) => s.reports.length).map((s) => ({ name: s.name, values: periods.map((p) => s.reports.find((r) => r.period === p)?.revenue ?? 0) }))} format={short} /></Card>
        <Card title="Users reached per quarter"><MultiLine labels={periods} series={[{ name: "Users", values: sumQ("users") }]} format={(v) => Math.round(v).toLocaleString("en-IN")} /></Card>
        <Card title="Pilots and partnerships per quarter"><Columns labels={periods} series={[{ name: "Pilots", values: sumQ("pilots") }, { name: "Partnerships", values: sumQ("partnerships") }]} /></Card>
        <Card title="Latest revenue by startup"><BarList data={S.map((s) => ({ label: s.name, value: s.reports.at(-1)?.revenue ?? 0 })).sort((a, b) => b.value - a.value).map((x) => ({ ...x, value: x.value, note: short(x.value) }))} /></Card>
        <Card title="Progress reviews submitted per quarter"><Columns labels={periods} series={[{ name: "Reviews", values: periods.map((p) => S.filter((s) => s.reports.some((r) => r.period === p)).length) }]} /></Card>
      </Section>

      <Section id="funding" title="Funding">
        <Card title="By type"><Donut data={count(funds, (x) => x.f.type, (x) => x.f.amount)} format={short} /></Card>
        <Card title="By startup"><Donut data={count(funds, (x) => x.s.name, (x) => x.f.amount)} format={short} /></Card>
        <Card title="Raised per year">{(() => { const d = count(funds, (x) => x.f.date.slice(0, 4), (x) => x.f.amount).sort((a, b) => a.label.localeCompare(b.label)); return <Columns labels={d.map((x) => x.label)} series={[{ name: "Funding", values: d.map((x) => x.value) }]} format={short} />; })()}</Card>
        <Card title="Rounds by stage"><BarList data={count(funds, (x) => x.f.round)} /></Card>
      </Section>

      <Section id="billing" title="Billing">
        <Card title="Billed vs collected per month" className="lg:col-span-2"><Columns labels={billPeriods.map(billLabel)} series={[
          { name: "Billed", values: billPeriods.map((m) => invs.filter((x) => x.i.issued.startsWith(m) && x.i.status !== "Cancelled").reduce((a, x) => a + x.t, 0)) },
          { name: "Collected", values: billPeriods.map((m) => invs.filter((x) => x.i.issued.startsWith(m) && x.i.status === "Paid").reduce((a, x) => a + x.t, 0)) },
        ]} format={short} /></Card>
        <Card title="Invoice status (by value)"><Donut data={count(invs, (x) => invState(x.i), (x) => x.t)} format={short} /></Card>
        <Card title="Outstanding by startup"><BarList data={count(invs.filter((x) => x.i.status === "Due"), (x) => x.s.name, (x) => x.t).map((x) => ({ ...x, note: inr(x.value) }))} tone="bg-accent" /></Card>
        <Card title="Revenue by service (taxable)"><Donut data={count(invs.filter((x) => x.i.status !== "Cancelled").flatMap((x) => x.i.lines), (l) => l.label, (l) => l.amount)} format={short} /></Card>
        <Card title="Monthly vs custom invoices"><Donut data={count(invs, (x) => x.i.kind ?? "Monthly")} /></Card>
      </Section>

      <Section id="facilities" title="Facilities">
        <Card title="Bookings by facility"><BarList data={count(bookings, (x) => x.b.facility)} /></Card>
        <Card title="Booking status"><Donut data={count(bookings, (x) => x.b.status)} /></Card>
        <Card title="Busiest weekdays"><Columns labels={WD} series={[{ name: "Bookings", values: WD.map((_, k) => bookings.filter((x) => new Date(x.b.date + "T00:00:00Z").getUTCDay() === k).length) }]} /></Card>
        <Card title="Popular time slots"><BarList data={count(bookings, (x) => x.b.slot)} /></Card>
        <Card title="Bookings by startup"><BarList data={count(bookings, (x) => x.s.name)} /></Card>
        <Card title="Slot holds by reason"><Donut data={count(db.blocks, (b) => b.kind)} /></Card>
      </Section>

      <Section id="helpdesk" title="Helpdesk">
        <Card title="Ticket status"><Donut data={count(db.tickets, (t) => t.status)} /></Card>
        <Card title="Ticket priority"><Donut data={count(db.tickets, (t) => t.priority)} /></Card>
        <Card title="Tickets by category"><BarList data={count(db.tickets, (t) => t.category)} /></Card>
        <Card title="Tickets by startup"><BarList data={count(db.tickets, (t) => S.find((s) => s.id === t.startupId)?.name ?? "—")} /></Card>
        <Card title="Messages by sender" className="lg:col-span-2"><Columns labels={S.map((s) => s.name)} series={[
          { name: "From startup", values: S.map((s) => db.messages.filter((m) => m.startupId === s.id && m.role === "startup").length) },
          { name: "From SRIIF", values: S.map((s) => db.messages.filter((m) => m.startupId === s.id && m.role === "admin").length) },
        ]} /></Card>
      </Section>

      <Section id="pipeline" title="Pipeline">
        <Card title="Onboarding requests by status"><Donut data={count(db.requests, (r) => r.status)} /></Card>
        <Card title="Requests by channel"><Donut data={count(db.requests, (r) => r.via)} /></Card>
        <Card title="Website inquiries by type"><BarList data={count(db.inquiries, (q) => q.type)} /></Card>
        <Card title="Website inquiries by status"><Donut data={count(db.inquiries, (q) => q.status)} /></Card>
      </Section>

      <Section id="team" title="Team & KYC">
        <Card title="Team size by startup"><BarList data={count(team, (u) => S.find((s) => s.id === u.startupId)?.name ?? "—")} /></Card>
        <Card title="KYC documents"><Donut data={count(kyc, (k) => k.status)} /></Card>
        <Card title="Member requests"><Donut data={count(S.flatMap((s) => s.memberRequests), (r) => r.status)} /></Card>
        <Card title="Documents uploaded by startup"><BarList data={S.map((s) => ({ label: s.name, value: s.docs.length })).sort((a, b) => b.value - a.value)} /></Card>
      </Section>

      <Section id="website" title="Website">
        <Card title="Events by category"><Donut data={count(db.cms.events, (e) => e.category)} /></Card>
        <Card title="Upcoming vs past events"><Donut data={count(db.cms.events, (e) => (e.date >= day ? "Upcoming" : "Past"))} /></Card>
        <Card title="Gallery by category"><BarList data={count(db.cms.gallery, (g) => g.category)} /></Card>
        <Card title="Showcase startups"><Donut data={count(db.cms.showcase, (s) => (s.show ? "Shown" : "Hidden"))} /></Card>
      </Section>
    </>
  );
}
