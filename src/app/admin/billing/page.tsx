"use client";

// Billing desk: invoice list with filters, custom invoice builder, monthly run, payments ledger and export.
import { Ban, Bell, Copy, Download, Eye, FilePlus2, Pencil, Search, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LineEditor, LineTable } from "@/components/invoice-editor";
import { Badge, Button, Card, cx, Field, Modal, PageTitle, Stat, Table } from "@/components/ui";
import { downloadCsv } from "@/lib/export";
import { brand } from "@/lib/site";
import { fmtDate, inr, invoiceTotals, nowStamp, today, uid, useStore } from "@/lib/store";
import type { Invoice, InvoiceLine, Startup } from "@/lib/types";

const LAB = new Set(["Instrument Facility (wet lab)", "Instrumentation lab", "Clinical testing lab"]);
const HOURS: Record<string, number> = { "09:00–10:00": 1, "10:00–12:00": 2, "12:00–14:00": 2, "14:00–17:00": 3, "Full day": 8 };
const LAB_RATE = 300;
const TABS = ["Invoices", "Custom invoice", "Monthly run", "Payments"] as const;
const MODES = ["UPI", "NEFT / RTGS", "Cheque", "Cash", "Card"];

/** Seat rent plus approved lab usage in the month. */
function draftLines(s: Startup, month: string): InvoiceLine[] {
  const lines: InvoiceLine[] = [{ label: s.seat.type, sac: "997212", qty: s.seat.count, rate: s.seat.rate, amount: s.seat.count * s.seat.rate }];
  const hrs = s.bookings.filter((b) => b.status === "Approved" && LAB.has(b.facility) && b.date.startsWith(month)).reduce((a, b) => a + (HOURS[b.slot] ?? 0), 0);
  if (hrs) lines.push({ label: "Lab usage (hours)", sac: "998346", qty: hrs, rate: LAB_RATE, amount: hrs * LAB_RATE });
  return lines;
}
const addDays = (iso: string, n: number) => new Date(Date.parse(iso) + n * 864e5).toISOString().slice(0, 10);
const nextNo = () => `SRIIF/${today().slice(0, 4)}/${String(Date.now()).slice(-4)}`;
const paidSoFar = (i: Invoice) => (i.payments ?? []).reduce((a, p) => a + p.amount, 0);

type Draft = { id?: string; sid: string; title: string; period: string; issued: string; due: string; lines: InvoiceLine[]; discount: number; notes: string };

export default function Billing() {
  const { db, day } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Invoices");
  const [draft, setDraft] = useState<Draft | null>(null);

  const openBuilder = (d?: Partial<Draft>) => {
    const s = db.startups.find((x) => x.status === "Active");
    const t = today();
    setDraft({ sid: s?.id ?? "", title: "", period: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }), issued: t, due: addDays(t, 10), lines: [{ label: "Incubation support services", sac: "998599", qty: 1, rate: 0, amount: 0 }], discount: 0, notes: "", ...d });
    setTab("Custom invoice");
  };

  return (
    <>
      <PageTitle title="Billing" sub="Raise custom or monthly invoices, record payments and export ledgers. GST is split into CGST and SGST."
        action={<Button className="min-h-11" onClick={() => openBuilder()}><FilePlus2 size={18} aria-hidden />New custom invoice</Button>} />
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200" role="tablist">
        {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx("min-h-11 whitespace-nowrap border-b-2 px-4 text-sm", tab === t ? "border-brand font-semibold text-brand" : "border-transparent text-slate-500 hover:text-slate-800")}>{t}</button>)}
      </div>
      {tab === "Invoices" && <InvoiceList day={day} onEdit={openBuilder} />}
      {tab === "Custom invoice" && <Builder draft={draft} setDraft={setDraft} onStart={() => openBuilder()} onDone={() => { setDraft(null); setTab("Invoices"); }} />}
      {tab === "Monthly run" && <MonthlyRun />}
      {tab === "Payments" && <Payments />}
    </>
  );
}

function Builder({ draft, setDraft, onDone, onStart }: { draft: Draft | null; setDraft: (d: Draft | null) => void; onDone: () => void; onStart: () => void }) {
  const { db, update } = useStore();
  if (!draft) return <Card><p className="text-sm text-slate-600">Start a new custom invoice for any service: events, consulting, lab packages, deposits or one-off charges.</p><Button className="mt-4" onClick={onStart}>Start custom invoice</Button></Card>;
  const d = draft;
  const s = db.startups.find((x) => x.id === d.sid);
  const t = invoiceTotals(d.lines, brand.gstRate, d.discount);
  const set = (p: Partial<Draft>) => setDraft({ ...d, ...p });
  const save = () => update((db2) => {
    const x = db2.startups.find((y) => y.id === d.sid)!;
    if (d.id) {
      const inv = x.invoices.find((z) => z.id === d.id)!;
      Object.assign(inv, { title: d.title, period: d.period, issued: d.issued, due: d.due, lines: d.lines, discount: d.discount, notes: d.notes });
    } else {
      x.invoices.push({ id: uid(), no: nextNo(), kind: "Custom", title: d.title, period: d.period, issued: d.issued, due: d.due, lines: d.lines, discount: d.discount || undefined, notes: d.notes, status: "Due" });
    }
  }, `${d.id ? "Edited" : "Raised custom"} invoice ${d.title || d.period} for ${s?.name}`);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card title={d.id ? "Edit invoice" : "Custom invoice"}>
        <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); save(); onDone(); }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Bill to"><select className="field" required disabled={!!d.id} value={d.sid} onChange={(e) => set({ sid: e.target.value })}>{db.startups.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field>
            <Field label="Invoice title" hint="e.g. Demo Day stall, Consulting package"><input className="field" value={d.title} onChange={(e) => set({ title: e.target.value })} /></Field>
            <Field label="Billing period"><input className="field" required value={d.period} onChange={(e) => set({ period: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Issue date"><input className="field" type="date" required value={d.issued} onChange={(e) => set({ issued: e.target.value })} /></Field>
              <Field label="Due date"><input className="field" type="date" required min={d.issued} value={d.due} onChange={(e) => set({ due: e.target.value })} /></Field>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="self-center text-slate-500">Quick add:</span>
            {s && <button type="button" className="min-h-9 rounded-full bg-surface px-3" onClick={() => set({ lines: [...d.lines, { label: s.seat.type, sac: "997212", qty: s.seat.count, rate: s.seat.rate, amount: s.seat.count * s.seat.rate }] })}>Seat rent</button>}
            <button type="button" className="min-h-9 rounded-full bg-surface px-3" onClick={() => set({ lines: [...d.lines, { label: "Lab usage (hours)", sac: "998346", qty: 1, rate: LAB_RATE, amount: LAB_RATE }] })}>Lab hours</button>
            <button type="button" className="min-h-9 rounded-full bg-surface px-3" onClick={() => set({ lines: [...d.lines, { label: "Meeting room / event hall", sac: "997331", qty: 1, rate: 1500, amount: 1500 }] })}>Event hall</button>
            <button type="button" className="min-h-9 rounded-full bg-surface px-3" onClick={() => set({ lines: [...d.lines, { label: "Security deposit", sac: "997212", qty: 1, rate: 10000, amount: 10000 }] })}>Deposit</button>
          </div>
          <LineEditor lines={d.lines} onChange={(lines) => set({ lines })} discount={d.discount} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Discount (₹, before GST)"><input className="field" type="number" min={0} value={d.discount} onChange={(e) => set({ discount: Math.max(0, Number(e.target.value)) })} /></Field>
            <Field label="Notes on invoice" hint="Payment terms, PO number, thank-you note"><input className="field" value={d.notes} onChange={(e) => set({ notes: e.target.value })} /></Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!d.sid || d.lines.length === 0 || t.sub <= 0}>{d.id ? "Save changes" : "Raise invoice"}</Button>
            <Button type="button" variant="ghost" onClick={() => { setDraft(null); onDone(); }}>Cancel</Button>
          </div>
        </form>
      </Card>
      <Card title="Preview" className="self-start lg:sticky lg:top-20">
        <p className="text-xs text-slate-500">Billed to</p>
        <p className="font-semibold">{s?.name ?? "—"}</p>
        <p className="text-xs text-slate-500">GSTIN: {s?.gstin || "unregistered"}</p>
        <p className="mt-3 font-semibold text-brand-dark">{d.title || "Tax invoice"} · {d.period}</p>
        <p className="text-xs text-slate-500">Issued {fmtDate(d.issued)} · due {fmtDate(d.due)}</p>
        <div className="mt-3"><LineTable lines={d.lines} discount={d.discount} /></div>
        {d.notes && <p className="mt-2 text-xs text-slate-600">{d.notes}</p>}
      </Card>
    </div>
  );
}

function InvoiceList({ day, onEdit }: { day: string; onEdit: (d: Partial<Draft>) => void }) {
  const { db, update } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [sid, setSid] = useState("All");
  const [kind, setKind] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [view, setView] = useState<{ s: Startup; i: Invoice } | null>(null);
  const [pay, setPay] = useState<{ s: Startup; i: Invoice } | null>(null);
  const [msg, setMsg] = useState("");

  const label = (i: Invoice) => i.status === "Due" ? (i.utr ? "Pending" : paidSoFar(i) > 0 ? "Part paid" : i.due < day ? "Overdue" : "Due") : i.status;
  const all = db.startups.flatMap((s) => s.invoices.map((i) => ({ s, i, t: invoiceTotals(i.lines, brand.gstRate, i.discount) })));
  const list = all.filter(({ s, i }) =>
    (status === "All" || label(i) === status) && (sid === "All" || s.id === sid) && (kind === "All" || (i.kind ?? "Monthly") === kind) &&
    (!from || i.issued >= from) && (!to || i.issued <= to) &&
    (!q || `${i.no} ${s.name} ${i.title ?? ""} ${i.period}`.toLowerCase().includes(q.toLowerCase()))).sort((a, b) => b.i.issued.localeCompare(a.i.issued));
  const sum = (f: (x: (typeof all)[number]) => boolean) => inr(all.filter(f).reduce((a, x) => a + x.t.total - (x.i.status === "Due" ? paidSoFar(x.i) : 0), 0));

  const remind = (s: Startup, i: Invoice, total: number) => {
    update((d) => { d.messages.push({ id: uid(), startupId: s.id, by: "SRIIF Billing", role: "admin", text: `Reminder: invoice ${i.no} for ${inr(total)} was due on ${fmtDate(i.due)}. Please pay and share the UTR in Invoices & billing.`, at: nowStamp(), read: false }); }, `Sent payment reminder for ${i.no}`);
    setMsg(`Reminder sent to ${s.name} in Messages.`);
  };
  const cancel = (s: Startup, i: Invoice) => { if (window.confirm(`Cancel invoice ${i.no}? It stays on record as Cancelled.`)) update((d) => { d.startups.find((x) => x.id === s.id)!.invoices.find((z) => z.id === i.id)!.status = "Cancelled"; }, `Cancelled ${i.no}`); };
  const exportCsv = () => downloadCsv(`sriif-invoices-${day || "export"}`, ["Invoice", "Type", "Startup", "GSTIN", "Title", "Period", "Issued", "Due", "Taxable (INR)", "Discount (INR)", "CGST", "SGST", "Total (INR)", "Received (INR)", "Status", "UTR", "Receipt"],
    list.map(({ s, i, t }) => [i.no, i.kind ?? "Monthly", s.name, s.gstin, i.title ?? "", i.period, i.issued, i.due, t.sub, t.discount, t.cgst, t.sgst, t.total, i.status === "Paid" ? t.total : paidSoFar(i), label(i), i.utr ?? "", i.receiptNo ?? ""]));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Collected" value={sum((x) => x.i.status === "Paid")} tone="green" />
        <Stat label="Outstanding" value={sum((x) => x.i.status === "Due")} tone="amber" />
        <Stat label="Overdue" value={sum((x) => x.i.status === "Due" && !x.i.utr && x.i.due < day)} tone="red" />
        <Stat label="Awaiting UTR check" value={all.filter((x) => x.i.status === "Due" && x.i.utr).length} />
      </div>
      <Card className="mt-6">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Field label="Search" className="lg:col-span-2"><span className="relative block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden /><input className="field pl-9" placeholder="Invoice no, startup, title" value={q} onChange={(e) => setQ(e.target.value)} /></span></Field>
          <Field label="Status"><select className="field" value={status} onChange={(e) => setStatus(e.target.value)}>{["All", "Due", "Overdue", "Part paid", "Pending", "Paid", "Waived", "Cancelled"].map((o) => <option key={o}>{o}</option>)}</select></Field>
          <Field label="Startup"><select className="field" value={sid} onChange={(e) => setSid(e.target.value)}><option>All</option>{db.startups.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Type"><select className="field" value={kind} onChange={(e) => setKind(e.target.value)}>{["All", "Monthly", "Custom"].map((o) => <option key={o}>{o}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="From"><input className="field" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
            <Field label="To"><input className="field" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">{list.length} invoice(s) · {inr(list.reduce((a, x) => a + x.t.total, 0))}</span>
          <Button size="sm" variant="outline" onClick={exportCsv}><Download size={16} aria-hidden />Export CSV</Button>
          {msg && <span className="text-sm text-emerald-700" role="status">{msg}</span>}
        </div>
        <div className="mt-4">
          <Table head={["Invoice", "Startup", "Issued", "Due", "Total", "Status", ""]} rows={list.map(({ s, i, t }) => [
            <button key="n" className="min-h-10 text-left font-medium text-brand underline" onClick={() => setView({ s, i })}>{i.no}<span className="block text-xs font-normal text-slate-500 no-underline">{i.title || i.period}{i.kind === "Custom" ? " · custom" : ""}</span></button>,
            s.name, fmtDate(i.issued), fmtDate(i.due), <span key="t" className="tabular-nums">{inr(t.total)}{paidSoFar(i) > 0 && i.status === "Due" && <span className="block text-xs text-slate-500">{inr(paidSoFar(i))} received</span>}</span>,
            <Badge key="b">{label(i)}</Badge>,
            <span key="a" className="flex flex-wrap gap-1">
              <IconBtn label="View" onClick={() => setView({ s, i })}><Eye size={16} aria-hidden /></IconBtn>
              {i.status === "Due" && <IconBtn label="Record payment" onClick={() => setPay({ s, i })}><Wallet size={16} aria-hidden /></IconBtn>}
              {i.status === "Due" && !i.utr && <IconBtn label="Edit" onClick={() => onEdit({ id: i.id, sid: s.id, title: i.title ?? "", period: i.period, issued: i.issued, due: i.due, lines: structuredClone(i.lines), discount: i.discount ?? 0, notes: i.notes ?? "" })}><Pencil size={16} aria-hidden /></IconBtn>}
              <IconBtn label="Duplicate as new" onClick={() => onEdit({ sid: s.id, title: i.title ?? "", period: i.period, lines: structuredClone(i.lines), discount: i.discount ?? 0, notes: i.notes ?? "" })}><Copy size={16} aria-hidden /></IconBtn>
              {i.status === "Due" && <IconBtn label="Send reminder" onClick={() => remind(s, i, t.total)}><Bell size={16} aria-hidden /></IconBtn>}
              {i.status === "Due" && paidSoFar(i) === 0 && <IconBtn label="Cancel invoice" danger onClick={() => cancel(s, i)}><Ban size={16} aria-hidden /></IconBtn>}
            </span>,
          ])} empty="No invoices match these filters." />
        </div>
      </Card>

      <Modal wide open={!!view} onClose={() => setView(null)} title={view ? `Invoice ${view.i.no}` : ""}>
        {view && (
          <div className="grid gap-4 text-sm">
            <div className="grid gap-2 sm:grid-cols-3">
              <p><span className="block text-xs text-slate-500">Billed to</span>{view.s.name}<span className="block text-xs text-slate-500">GSTIN: {view.s.gstin || "not provided"}</span></p>
              <p><span className="block text-xs text-slate-500">{view.i.title || "Period"}</span>{view.i.period}<span className="block text-xs text-slate-500">Issued {fmtDate(view.i.issued)} · due {fmtDate(view.i.due)}</span></p>
              <p><span className="block text-xs text-slate-500">Status</span><Badge>{label(view.i)}</Badge>{view.i.utr && <span className="block text-xs">UTR {view.i.utr}</span>}</p>
            </div>
            <LineTable lines={view.i.lines} discount={view.i.discount} />
            {view.i.notes && <p className="text-slate-600"><b>Notes:</b> {view.i.notes}</p>}
            {(view.i.payments?.length ?? 0) > 0 && <Table head={["Received", "Mode", "Reference", "Amount"]} rows={view.i.payments!.map((p) => [fmtDate(p.on), p.mode, p.ref, inr(p.amount)])} />}
            <div className="flex flex-wrap gap-3">
              <Link className="text-brand underline" href={`/print/invoice?sid=${view.s.id}&iid=${view.i.id}`} target="_blank">Invoice PDF</Link>
              {view.i.status === "Paid" && <Link className="text-brand underline" href={`/print/receipt?sid=${view.s.id}&iid=${view.i.id}`} target="_blank">Receipt PDF</Link>}
              <Link className="text-brand underline" href={`/admin/startups/view?id=${view.s.id}&tab=invoices`}>Startup billing</Link>
            </div>
          </div>
        )}
      </Modal>
      {pay && <PaymentModal s={pay.s} i={pay.i} onClose={() => setPay(null)} />}
    </>
  );
}

function IconBtn({ label, onClick, children, danger }: { label: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={cx("flex h-10 w-10 items-center justify-center rounded-lg", danger ? "text-red-600 hover:bg-red-50" : "text-brand hover:bg-brand-50")}>{children}</button>;
}

/** Full or part payment. When the received total covers the invoice it is marked Paid and a receipt number is issued. */
function PaymentModal({ s, i, onClose }: { s: Startup; i: Invoice; onClose: () => void }) {
  const { update } = useStore();
  const total = invoiceTotals(i.lines, brand.gstRate, i.discount).total;
  const balance = total - paidSoFar(i);
  const [p, setP] = useState({ amount: balance, on: today(), ref: i.utr ?? "", mode: i.utr ? "UPI" : "NEFT / RTGS" });
  return (
    <Modal open onClose={onClose} title={`Record payment · ${i.no}`}>
      <form className="grid gap-3" onSubmit={(e) => {
        e.preventDefault();
        update((d) => {
          const y = d.startups.find((x) => x.id === s.id)!.invoices.find((z) => z.id === i.id)!;
          y.payments = [...(y.payments ?? []), { id: uid(), ...p }];
          if (!y.utr && p.ref) y.utr = p.ref;
          if (paidSoFar(y) >= total) { y.status = "Paid"; y.paidOn = p.on; y.receiptNo = "RCPT-" + y.no.split("/").pop(); }
        }, `Recorded ${inr(p.amount)} against ${i.no}`);
        onClose();
      }}>
        <p className="text-sm text-slate-600">{s.name} · total {inr(total)} · balance <b>{inr(balance)}</b></p>
        {i.utr && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">Startup submitted UTR <b>{i.utr}</b>. Check it in the bank statement before recording.</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Amount received (₹)"><input className="field" type="number" min={1} max={balance} required value={p.amount} onChange={(e) => setP({ ...p, amount: Number(e.target.value) })} /></Field>
          <Field label="Received on"><input className="field" type="date" required value={p.on} onChange={(e) => setP({ ...p, on: e.target.value })} /></Field>
          <Field label="Mode"><select className="field" value={p.mode} onChange={(e) => setP({ ...p, mode: e.target.value })}>{MODES.map((m) => <option key={m}>{m}</option>)}</select></Field>
          <Field label="Reference (UTR / cheque no)"><input className="field" required value={p.ref} onChange={(e) => setP({ ...p, ref: e.target.value })} /></Field>
        </div>
        <Button type="submit" disabled={p.amount <= 0 || p.amount > balance}>{p.amount >= balance ? "Record and mark paid" : "Record part payment"}</Button>
      </form>
    </Modal>
  );
}

function MonthlyRun() {
  const { db, update } = useStore();
  const [month, setMonth] = useState(today().slice(0, 7));
  const [msg, setMsg] = useState("");
  const period = new Date(month + "-01").toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  const toBill = db.startups.filter((s) => s.status === "Active" && s.seat.count > 0 && !s.invoices.some((i) => i.period === period && (i.kind ?? "Monthly") === "Monthly" && i.status !== "Cancelled"));
  const generate = () => {
    const issued = today();
    update((d) => {
      toBill.forEach((s, k) => {
        d.startups.find((y) => y.id === s.id)!.invoices.push({ id: uid(), no: `SRIIF/${month.slice(0, 4)}/${String(Date.now() + k).slice(-4)}`, kind: "Monthly", period, issued, due: addDays(issued, 10), lines: draftLines(s, month), status: "Due" });
      });
    }, `Generated ${toBill.length} invoice(s) for ${period}`);
    setMsg(`${toBill.length} invoice(s) raised for ${period}.`);
  };
  return (
    <Card title="Generate monthly invoices">
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
      <p className="mt-3 text-xs text-slate-500">Seat rent from Facilities → Seating, plus approved lab bookings at {inr(LAB_RATE)}/hour. Edit any invoice from the Invoices tab before it is paid.</p>
    </Card>
  );
}

function Payments() {
  const { db, day } = useStore();
  const rows = db.startups.flatMap((s) => s.invoices.flatMap((i) => {
    const total = invoiceTotals(i.lines, brand.gstRate, i.discount).total;
    const recorded = (i.payments ?? []).map((p) => ({ s, i, on: p.on, mode: p.mode, ref: p.ref, amount: p.amount }));
    // Older invoices marked paid before payments were itemised.
    if (!recorded.length && i.status === "Paid") recorded.push({ s, i, on: i.paidOn ?? i.issued, mode: i.utr ? "UPI" : "—", ref: i.utr ?? "—", amount: total });
    return recorded;
  })).sort((a, b) => b.on.localeCompare(a.on));
  const pending = db.startups.flatMap((s) => s.invoices.filter((i) => i.status === "Due" && i.utr).map((i) => ({ s, i })));
  return (
    <div className="grid gap-6">
      <Card title="UTRs waiting for verification">
        <Table head={["Startup", "Invoice", "UTR", "Amount"]} rows={pending.map(({ s, i }) => [s.name, i.no, i.utr, inr(invoiceTotals(i.lines, brand.gstRate, i.discount).total)])} empty="Nothing to verify. Use Record payment on the Invoices tab." />
      </Card>
      <Card title="Payments received" action={<Button size="sm" variant="outline" onClick={() => downloadCsv(`sriif-payments-${day || "export"}`, ["Received", "Startup", "Invoice", "Mode", "Reference", "Amount (INR)"], rows.map((r) => [r.on, r.s.name, r.i.no, r.mode, r.ref, r.amount]))}><Download size={16} aria-hidden />Export CSV</Button>}>
        <Table head={["Received", "Startup", "Invoice", "Mode", "Reference", "Amount"]} rows={rows.map((r) => [fmtDate(r.on), r.s.name, r.i.no, r.mode, r.ref, <b key="a" className="tabular-nums">{inr(r.amount)}</b>])} empty="No payments yet." />
        <p className="mt-3 text-sm text-slate-600">Total received: <b>{inr(rows.reduce((a, r) => a + r.amount, 0))}</b></p>
      </Card>
    </div>
  );
}
