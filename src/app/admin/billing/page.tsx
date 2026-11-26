"use client";

import Link from "next/link";
import { Badge, Card, PageTitle, Stat, Table } from "@/components/ui";
import { brand } from "@/lib/site";
import { fmtDate, inr, invoiceTotals, today, useStore } from "@/lib/store";

export default function Billing() {
  const { db } = useStore();
  const all = db.startups.flatMap((s) => s.invoices.map((i) => ({ s, i, t: invoiceTotals(i.lines, brand.gstRate) })));
  const sum = (f: (x: (typeof all)[number]) => boolean) => inr(all.filter(f).reduce((a, x) => a + x.t.total, 0));
  return (
    <>
      <PageTitle title="Invoices & billing" sub="Raise invoices and verify payments from each startup's Invoices tab." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Collected" value={sum((x) => x.i.status === "Paid")} />
        <Stat label="Awaiting verification" value={sum((x) => x.i.status === "Due" && !!x.i.utr)} />
        <Stat label="Overdue" value={sum((x) => x.i.status === "Due" && !x.i.utr && x.i.due < today())} />
      </div>
      <Card className="mt-6">
        <Table head={["Startup", "Invoice", "Period", "Due", "Total", "Status", ""]} rows={all.sort((a, b) => b.i.issued.localeCompare(a.i.issued)).map(({ s, i, t }) => [
          s.name, i.no, i.period, fmtDate(i.due), inr(t.total),
          <Badge key="b">{i.status === "Due" ? (i.utr ? "Pending" : i.due < today() ? "Overdue" : "Due") : i.status}</Badge>,
          <Link key="l" className="text-brand underline" href={`/admin/startups/${s.id}?tab=invoices`}>Open</Link>,
        ])} />
      </Card>
    </>
  );
}
