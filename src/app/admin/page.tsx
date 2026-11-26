"use client";

import { Building2, CalendarDays, Inbox, LifeBuoy, Receipt, UserPlus } from "lucide-react";
import Link from "next/link";
import { Badge, Card, PageTitle, Stat, Table } from "@/components/ui";
import { DOC_TYPES } from "@/lib/seed";
import { brand } from "@/lib/site";
import { fmtDate, inr, invoiceTotals, today, useStore } from "@/lib/store";

export default function AdminHome() {
  const { db } = useStore();
  const active = db.startups.filter((s) => s.status === "Active");
  const newReq = db.requests.filter((r) => r.status === "New" || r.status === "In review");
  const openT = db.tickets.filter((t) => t.status === "Open" || t.status === "In progress");
  const dues = db.startups.flatMap((s) => s.invoices.filter((i) => i.status === "Due").map((i) => ({ s, i })));
  const dueAmt = dues.reduce((a, x) => a + invoiceTotals(x.i.lines, brand.gstRate).total, 0);
  const pendingBookings = db.startups.flatMap((s) => s.bookings.filter((b) => b.status === "Pending").map((b) => ({ s, b })));
  const missingDocs = db.startups.filter((s) => DOC_TYPES.some((t) => t.mandatory && !s.docs.some((d) => d.type === t.type)));

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
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
          <Table head={["Startup", "Missing"]} rows={missingDocs.map((s) => [<Link key="l" className="text-brand underline" href={`/admin/startups/${s.id}?tab=documents`}>{s.name}</Link>, DOC_TYPES.filter((t) => t.mandatory && !s.docs.some((d) => d.type === t.type)).length + " docs"])} empty="All complete." />
        </Card>
      </div>
    </>
  );
}
