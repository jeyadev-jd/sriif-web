"use client";

import { FilePlus2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card, Field, PageTitle, Stat, Table } from "@/components/ui";
import { brand } from "@/lib/site";
import { inr, invoiceTotals, today, uid, useStore, fmtDate } from "@/lib/store";
import type { InvoiceLine, Startup } from "@/lib/types";

const LAB = new Set(["Instrument Facility (wet lab)", "Instrumentation lab", "Clinical testing lab"]);
const HOURS: Record<string, number> = { "09:00–10:00": 1, "10:00–12:00": 2, "12:00–14:00": 2, "14:00–17:00": 3, "Full day": 8 };
const LAB_RATE = 300;

/** Seat rent plus approved lab usage in the month. */
function draftLines(s: Startup, month: string): InvoiceLine[] {
  const lines: InvoiceLine[] = [{ label: s.seat.type, sac: s.program === "Virtual Incubation" ? "998599" : "997212", qty: s.seat.count, rate: s.seat.rate, amount: s.seat.count * s.seat.rate }];
  const hrs = s.bookings.filter((b) => b.status === "Approved" && LAB.has(b.facility) && b.date.startsWith(month)).reduce((a, b) => a + (HOURS[b.slot] ?? 0), 0);
  if (hrs) lines.push({ label: "Lab usage (hours)", sac: "998346", qty: hrs, rate: LAB_RATE, amount: hrs * LAB_RATE });
  return lines;
}

export default function Billing() {
  const { db, update } = useStore();
  const [month, setMonth] = useState(today().slice(0, 7));
  const [msg, setMsg] = useState("");
  const period = new Date(month + "-01").toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  const all = db.startups.flatMap((s) => s.invoices.map((i) => ({ s, i, t: invoiceTotals(i.lines, brand.gstRate) })));
  const sum = (f: (x: (typeof all)[number]) => boolean) => inr(all.filter(f).reduce((a, x) => a + x.t.total, 0));
  const toBill = db.startups.filter((s) => s.status === "Active" && s.seat.count > 0 && !s.invoices.some((i) => i.period === period));

  const generate = () => {
    const issued = today();
    const due = new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10);
    update((d) => {
      toBill.forEach((s, k) => {
        const x = d.startups.find((y) => y.id === s.id)!;
        x.invoices.push({ id: uid(), no: `SRIIF/${month.slice(0, 4)}/${String(Date.now() + k).slice(-4)}`, period, issued, due, lines: draftLines(s, month), status: "Due" });
      });
    }, `Generated ${toBill.length} invoice(s) for ${period}`);
    setMsg(`${toBill.length} invoice(s) raised for ${period}.`);
  };

  const verify = (sid: string, iid: string, no: string) => update((d) => {
    const y = d.startups.find((x) => x.id === sid)!.invoices.find((z) => z.id === iid)!;
    y.status = "Paid"; y.paidOn = today(); y.receiptNo = "RCPT-" + y.no.split("/").pop();
  }, `Reconciled ${no} against UTR`);

  return (
    <>
      <PageTitle title="Invoices & billing" sub="Generate monthly invoices, edit them before payment and reconcile UTR payments." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Collected" value={sum((x) => x.i.status === "Paid")} tone="green" />
        <Stat label="Awaiting reconciliation" value={sum((x) => x.i.status === "Due" && !!x.i.utr)} tone="amber" />
        <Stat label="Overdue" value={sum((x) => x.i.status === "Due" && !x.i.utr && x.i.due < today())} tone="red" />
      </div>

      <Card className="mt-6" title="Generate monthly invoices">
        <div className="flex flex-wrap items-end gap-4">
          <Field label="Billing month"><input className="field" type="month" value={month} onChange={(e) => { setMonth(e.target.value); setMsg(""); }} /></Field>
          <Button className="min-h-11" disabled={toBill.length === 0} onClick={generate}><FilePlus2 size={18} aria-hidden />Generate {toBill.length} invoice(s) for {period}</Button>
          {msg && <p className="text-sm text-emerald-700" role="status">{msg}</p>}
        </div>
        {toBill.length > 0 && (
          <div className="mt-4">
            <Table head={["Startup", "Lines", "Taxable", "Total with GST"]} rows={toBill.map((s) => {
              const l = draftLines(s, month);
              const t = invoiceTotals(l, brand.gstRate);
              return [s.name, l.map((x) => `${x.label} × ${x.qty}`).join(", "), inr(t.sub), inr(t.total)];
            })} />
          </div>
        )}
        <p className="mt-3 text-xs text-slate-500">Seat rent from Facility control → Seating, plus approved lab bookings at {inr(LAB_RATE)}/hour. Edit any invoice from the startup&apos;s Invoices tab before it is paid.</p>
      </Card>

      <Card className="mt-6" title="All invoices">
        <Table head={["Startup", "Invoice", "Period", "Due", "Total", "Status", ""]} rows={all.sort((a, b) => b.i.issued.localeCompare(a.i.issued)).map(({ s, i, t }) => [
          s.name, i.no, i.period, fmtDate(i.due), inr(t.total),
          <Badge key="b">{i.status === "Due" ? (i.utr ? "Pending" : i.due < today() ? "Overdue" : "Due") : i.status}</Badge>,
          <span key="l" className="flex flex-wrap items-center gap-2">
            {i.status === "Due" && i.utr && <Button size="sm" onClick={() => verify(s.id, i.id, i.no)}>Verify UTR {i.utr}</Button>}
            <Link className="text-brand underline" href={`/admin/startups/view?id=${s.id}&tab=invoices`}>Open</Link>
          </span>,
        ])} />
      </Card>
    </>
  );
}
