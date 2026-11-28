"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, cx, Field, Modal, PageTitle, Table } from "@/components/ui";
import { slotConflict } from "@/lib/facility";
import { FACILITY_RULES, SLOTS } from "@/lib/seed";
import { fmtDate, inr, today, uid, useStore } from "@/lib/store";
import type { Booking, FacilityBlock, Startup } from "@/lib/types";

const TABS = ["Schedule", "Requests", "Seating"] as const;
const SEATS = ["Hot desk", "Dedicated desk", "Cabin"];
// UTC date maths so the week grid does not shift with the browser timezone.
const addDays = (iso: string, n: number) => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const monday = (iso: string) => addDays(iso, -((new Date(iso + "T00:00:00Z").getUTCDay() + 6) % 7));
const overlaps = (a: string, b: string) => a === b || a === "Full day" || b === "Full day";

/** Master schedule: approve, block, override or allocate rooms, labs and seats. */
export default function FacilityControl() {
  const { db, update } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Schedule");
  const [week, setWeek] = useState(() => monday(today()));
  const [cell, setCell] = useState<{ facility: string; date: string } | null>(null);
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const bookings = db.startups.flatMap((s) => s.bookings.map((b) => ({ s, b })));
  const pending = bookings.filter((x) => x.b.status === "Pending").sort((a, b) => a.b.date.localeCompare(b.b.date));

  const setStatus = (sid: string, bid: string, status: Booking["status"], why: string) =>
    update((d) => { d.startups.find((x) => x.id === sid)!.bookings.find((x) => x.id === bid)!.status = status; }, why);

  return (
    <>
      <PageTitle title="Facility control" sub="Master schedule for rooms, labs and seating across all startups and external events." />
      <div className="mb-6 flex gap-1 border-b border-slate-200" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx("min-h-11 border-b-2 px-4 text-sm", tab === t ? "border-brand font-semibold text-brand" : "border-transparent text-slate-500 hover:text-slate-800")}>
            {t}{t === "Requests" && pending.length > 0 && <span className="ml-1.5 rounded-full bg-accent px-1.5 text-[11px] font-bold text-brand-dark">{pending.length}</span>}
          </button>
        ))}
      </div>

      {tab === "Schedule" && (
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button onClick={() => setWeek(addDays(week, -7))} aria-label="Previous week" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100"><ChevronLeft size={18} aria-hidden /></button>
              <p className="min-w-52 text-center font-semibold">{fmtDate(days[0])} – {fmtDate(days[6])}</p>
              <button onClick={() => setWeek(addDays(week, 7))} aria-label="Next week" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100"><ChevronRight size={18} aria-hidden /></button>
              <Button size="sm" variant="outline" onClick={() => setWeek(monday(today()))}>This week</Button>
            </div>
            <p className="flex flex-wrap gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-emerald-200" />Approved</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-200" />Pending</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-slate-300" />Blocked / event</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] table-fixed border-collapse text-xs">
              <thead>
                <tr><th className="w-44 p-2 text-left font-semibold text-slate-500">Facility</th>{days.map((d) => <th key={d} className={cx("p-2 text-left font-semibold", d === today() ? "text-brand" : "text-slate-500")}>{new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</th>)}</tr>
              </thead>
              <tbody>
                {db.facilities.map((f) => (
                  <tr key={f} className="border-t border-slate-100">
                    <th className="p-2 text-left align-top text-sm font-medium text-slate-800">{f}</th>
                    {days.map((d) => {
                      const bs = bookings.filter((x) => x.b.facility === f && x.b.date === d && (x.b.status === "Approved" || x.b.status === "Pending"));
                      const bl = db.blocks.filter((x) => x.facility === f && x.date === d);
                      return (
                        <td key={d} className="p-1 align-top">
                          <button onClick={() => setCell({ facility: f, date: d })} aria-label={`${f}, ${fmtDate(d)}: ${bs.length + bl.length} entries. Manage`} className={cx("flex min-h-16 w-full flex-col gap-1 rounded-lg border p-1 text-left transition hover:border-brand", d < today() ? "border-slate-100 bg-slate-50/60" : "border-slate-200 bg-white")}>
                            {bl.map((x) => <span key={x.id} className="truncate rounded bg-slate-300 px-1.5 py-0.5 font-medium text-slate-800">{x.slot === "Full day" ? "All day" : x.slot.slice(0, 5)} {x.kind}</span>)}
                            {bs.map(({ s, b }) => <span key={b.id} className={cx("truncate rounded px-1.5 py-0.5 font-medium", b.status === "Approved" ? "bg-emerald-200 text-emerald-950" : "bg-amber-200 text-amber-950")}>{b.slot === "Full day" ? "All day" : b.slot.slice(0, 5)} {s.name.split(" ")[0]}</span>)}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">Select a cell to approve requests, allocate a slot to a startup, block it for an external event or maintenance, or override an existing booking.</p>
        </Card>
      )}

      {tab === "Requests" && (
        <Card title="Pending booking requests">
          <Table empty="No pending requests." head={["Date", "Slot", "Facility", "Startup", "Purpose", "Clash", ""]} rows={pending.map(({ s, b }) => {
            const clash = slotConflict(db, b.facility, b.date, b.slot, b.id);
            return [fmtDate(b.date), b.slot, b.facility, s.name, b.purpose, clash ? <span key="c" className="text-xs text-red-700">{clash}</span> : <span key="c" className="text-xs text-emerald-700">Free</span>,
              <span key="a" className="flex gap-1"><Button size="sm" disabled={!!clash} onClick={() => setStatus(s.id, b.id, "Approved", `Approved ${b.facility} for ${s.name}`)}>Approve</Button><Button size="sm" variant="outline" onClick={() => setStatus(s.id, b.id, "Rejected", `Rejected ${b.facility} for ${s.name}`)}>Reject</Button></span>];
          })} />
        </Card>
      )}

      {tab === "Seating" && <Seating />}

      {cell && <CellModal key={cell.facility + cell.date} {...cell} onClose={() => setCell(null)} />}
    </>
  );
}

function CellModal({ facility, date, onClose }: { facility: string; date: string; onClose: () => void }) {
  const { db, update } = useStore();
  const eligible = db.startups.filter((s) => s.status === "Active" && (FACILITY_RULES[facility] ?? []).includes(s.program));
  const [mode, setMode] = useState<"allocate" | "block">("allocate");
  const [a, setA] = useState({ sid: eligible[0]?.id ?? "", slot: SLOTS[1], purpose: "" });
  const [bk, setBk] = useState<{ slot: string; kind: FacilityBlock["kind"]; reason: string }>({ slot: "Full day", kind: "External event", reason: "" });
  const entries = db.startups.flatMap((s) => s.bookings.filter((b) => b.facility === facility && b.date === date).map((b) => ({ s, b })));
  const blocks = db.blocks.filter((b) => b.facility === facility && b.date === date);
  const allocClash = slotConflict(db, facility, date, a.slot);
  const overridden = entries.filter(({ b }) => (b.status === "Approved" || b.status === "Pending") && overlaps(b.slot, bk.slot));
  const set = (s: Startup, b: Booking, status: Booking["status"], why: string) => update((d) => { d.startups.find((x) => x.id === s.id)!.bookings.find((x) => x.id === b.id)!.status = status; }, why);

  return (
    <Modal wide open onClose={onClose} title={`${facility} · ${fmtDate(date)}`}>
      <div className="grid gap-5">
        <Table empty="Nothing scheduled." head={["Slot", "Who", "Status", ""]} rows={[
          ...blocks.map((x) => [x.slot, <span key="w">{x.kind}<span className="block text-xs text-slate-500">{x.reason}</span></span>, <Badge key="s" tone="slate">Blocked</Badge>,
            <button key="r" className="min-h-10 text-xs text-red-700 underline" onClick={() => update((d) => { d.blocks = d.blocks.filter((y) => y.id !== x.id); }, `Removed block on ${facility} ${date}`)}>Remove block</button>]),
          ...entries.map(({ s, b }) => [b.slot, <span key="w">{s.name}<span className="block text-xs text-slate-500">{b.purpose}{b.byAdmin ? " · allocated by SRIIF" : ""}</span></span>, <Badge key="s">{b.status}</Badge>,
            <span key="a" className="flex flex-wrap gap-1">
              {b.status === "Pending" && <Button size="sm" disabled={!!slotConflict(db, facility, date, b.slot, b.id)} onClick={() => set(s, b, "Approved", `Approved ${facility} for ${s.name}`)}>Approve</Button>}
              {b.status === "Pending" && <Button size="sm" variant="outline" onClick={() => set(s, b, "Rejected", `Rejected ${facility} for ${s.name}`)}>Reject</Button>}
              {b.status === "Approved" && <Button size="sm" variant="outline" onClick={() => set(s, b, "Cancelled", `Override: cancelled ${facility} booking of ${s.name}`)}>Override (cancel)</Button>}
            </span>]),
        ]} />

        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex gap-1" role="tablist">
            {(["allocate", "block"] as const).map((m) => <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={cx("min-h-10 rounded-full px-4 text-sm font-medium", mode === m ? "bg-brand-dark text-white" : "bg-slate-100 text-slate-700")}>{m === "allocate" ? "Allocate to a startup" : "Block / external event"}</button>)}
          </div>
          {mode === "allocate" ? (
            <form className="grid gap-3 sm:grid-cols-3" onSubmit={(e) => {
              e.preventDefault();
              if (allocClash || !a.sid) return;
              const s = db.startups.find((x) => x.id === a.sid)!;
              update((d) => { d.startups.find((x) => x.id === a.sid)!.bookings.push({ id: uid(), facility, date, slot: a.slot, purpose: a.purpose, status: "Approved", byAdmin: true }); }, `Allocated ${facility} ${date} to ${s.name}`);
              setA({ ...a, purpose: "" });
            }}>
              <Field label="Startup" hint={eligible.length === 0 ? "No eligible startup for this facility" : `Tiers: ${(FACILITY_RULES[facility] ?? []).join(", ")}`}><select className="field" value={a.sid} onChange={(e) => setA({ ...a, sid: e.target.value })}>{eligible.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
              <Field label="Slot"><select className="field" value={a.slot} onChange={(e) => setA({ ...a, slot: e.target.value })}>{SLOTS.map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Purpose"><input className="field" required value={a.purpose} onChange={(e) => setA({ ...a, purpose: e.target.value })} /></Field>
              {allocClash && <p className="text-sm text-red-700 sm:col-span-3" role="alert">Slot not free: {allocClash}. Override the existing booking first.</p>}
              <Button type="submit" className="sm:col-span-3 sm:justify-self-start" disabled={!!allocClash || !a.sid}>Allocate (approved)</Button>
            </form>
          ) : (
            <form className="grid gap-3 sm:grid-cols-3" onSubmit={(e) => {
              e.preventDefault();
              update((d) => {
                d.blocks.push({ id: uid(), facility, date, ...bk });
                for (const { s, b } of overridden) d.startups.find((x) => x.id === s.id)!.bookings.find((x) => x.id === b.id)!.status = "Cancelled";
              }, `Blocked ${facility} ${date} (${bk.kind})${overridden.length ? `, overriding ${overridden.length} booking(s)` : ""}`);
              setBk({ ...bk, reason: "" });
            }}>
              <Field label="Type"><select className="field" value={bk.kind} onChange={(e) => setBk({ ...bk, kind: e.target.value as FacilityBlock["kind"] })}>{["External event", "Maintenance", "Blocked"].map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Slot"><select className="field" value={bk.slot} onChange={(e) => setBk({ ...bk, slot: e.target.value })}>{SLOTS.map((x) => <option key={x}>{x}</option>)}</select></Field>
              <Field label="Reason"><input className="field" required value={bk.reason} onChange={(e) => setBk({ ...bk, reason: e.target.value })} /></Field>
              {overridden.length > 0 && <p className="text-sm text-amber-800 sm:col-span-3" role="alert">This overrides {overridden.length} booking(s): {overridden.map(({ s }) => s.name).join(", ")}. They will be cancelled.</p>}
              <Button type="submit" variant={overridden.length ? "danger" : "primary"} className="sm:col-span-3 sm:justify-self-start">{overridden.length ? "Block and override" : "Block slot"}</Button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Seating() {
  const { db, update } = useStore();
  const [draft, setDraft] = useState(() => Object.fromEntries(db.startups.map((s) => [s.id, { ...s.seat }])));
  const used = db.startups.filter((s) => s.status === "Active").reduce((a, s) => a + s.seat.count, 0);
  return (
    <Card title={`Seat allocation · ${used} of 30 co-working seats in use`}>
      <Table head={["Startup", "Tier", "Seat type", "Seats", "Rate / seat", "Monthly", ""]} rows={db.startups.map((s) => {
        const d = draft[s.id];
        const changed = d.type !== s.seat.type || d.count !== s.seat.count || d.rate !== s.seat.rate;
        const set = (p: Partial<typeof d>) => setDraft({ ...draft, [s.id]: { ...d, ...p } });
        return [
          <span key="n" className="font-medium">{s.name}<span className="block text-xs text-slate-500">{s.status}</span></span>, s.program.replace(" Incubation", ""),
          <select key="t" aria-label={`Seat type for ${s.name}`} className="field min-w-36" value={d.type} onChange={(e) => set({ type: e.target.value })}>{SEATS.map((x) => <option key={x}>{x}</option>)}</select>,
          <input key="c" aria-label={`Seats for ${s.name}`} className="field w-20" type="number" min={0} value={d.count} onChange={(e) => set({ count: Number(e.target.value) })} />,
          <input key="r" aria-label={`Rate for ${s.name}`} className="field w-28" type="number" min={0} value={d.rate} onChange={(e) => set({ rate: Number(e.target.value) })} />,
          inr(d.count * d.rate),
          <Button key="s" size="sm" disabled={!changed} onClick={() => update((x) => { x.startups.find((y) => y.id === s.id)!.seat = d; }, `Seat allocation for ${s.name}: ${d.type} × ${d.count}`)}>Save</Button>,
        ];
      })} />
      <p className="mt-3 text-xs text-slate-500">Seat changes apply to the next invoice generated for the startup.</p>
    </Card>
  );
}
