"use client";

// Support tickets: startups raise them, only SRIIF admins answer and close them.
// A startup sees only its own tickets; admins see every startup's tickets.
import { useState } from "react";
import { TICKET_CATEGORIES } from "@/lib/seed";
import { fmtDate, nowStamp, today, uid, useStore } from "@/lib/store";
import type { Ticket } from "@/lib/types";
import { Badge, Button, Card, cx, Empty, Field, Modal } from "./ui";

export function Tickets({ mode }: { mode: "startup" | "admin" }) {
  const { db, user, update } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"Active" | "All">("Active");
  const [reply, setReply] = useState("");
  const [f, setF] = useState({ category: TICKET_CATEGORIES[0], subject: "", body: "", priority: "Normal" as Ticket["priority"] });

  if (!user) return null;
  const mine = mode === "startup" ? db.tickets.filter((t) => t.startupId === user.startupId) : db.tickets;
  const list = mine.filter((t) => filter === "All" || t.status === "Open" || t.status === "In progress").sort((a, b) => b.created.localeCompare(a.created));
  const t = mine.find((x) => x.id === sel) ?? null;
  const startupName = (id: string) => db.startups.find((s) => s.id === id)?.name ?? "—";

  const create = () => {
    const no = `TCK-${1000 + db.tickets.length + 1}`;
    update((d) => {
      d.tickets.push({ id: uid(), no, startupId: user.startupId!, raisedBy: user.name, category: f.category, subject: f.subject, priority: f.priority, status: "Open", created: today(), messages: [{ by: user.name, role: "startup", text: f.body, at: nowStamp() }] });
    }, `Raised ticket ${no}`);
    setF({ ...f, subject: "", body: "" });
    setOpen(false);
  };

  const patch = (fn: (x: Ticket) => void, audit?: string) => update((d) => { const x = d.tickets.find((y) => y.id === sel); if (x) fn(x); }, audit);

  const send = () => {
    if (!reply.trim()) return;
    patch((x) => {
      x.messages.push({ by: user.name, role: user.role, text: reply.trim(), at: nowStamp() });
      if (mode === "admin" && x.status === "Open") x.status = "In progress";
      if (mode === "startup" && x.status === "Resolved") x.status = "Open"; // reply re-opens
    }, mode === "admin" ? `Replied on ${t?.no}` : undefined);
    setReply("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="grid content-start gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs">
            {(["Active", "All"] as const).map((x) => <button key={x} onClick={() => setFilter(x)} className={cx("rounded-md px-3 py-1", filter === x && "bg-white font-semibold shadow-sm")}>{x}</button>)}
          </div>
          {mode === "startup" && <Button size="sm" onClick={() => setOpen(true)}>+ Raise ticket</Button>}
        </div>
        {list.length === 0 ? <Empty>No tickets.</Empty> : list.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} className={cx("rounded-xl border bg-white p-3 text-left", sel === x.id ? "border-brand ring-2 ring-brand/20" : "border-slate-200 hover:border-slate-300")}>
            <div className="flex items-center justify-between gap-2"><span className="text-xs text-slate-500">{x.no} · {x.category}</span><Badge>{x.status}</Badge></div>
            <p className="mt-1 font-medium">{x.subject}</p>
            <p className="text-xs text-slate-500">{mode === "admin" && <>{startupName(x.startupId)} · </>}{x.raisedBy} · {fmtDate(x.created)} {x.priority === "High" && <Badge>High</Badge>}</p>
          </button>
        ))}
      </div>
      {t ? (
        <Card title={<>{t.no} · {t.subject}</>} action={<Badge>{t.status}</Badge>}>
          <p className="mb-4 text-xs text-slate-500">{startupName(t.startupId)} · {t.category} · priority {t.priority} · raised by {t.raisedBy} on {fmtDate(t.created)}</p>
          <div className="grid gap-3">
            {t.messages.map((m, i) => (
              <div key={i} className={cx("max-w-[85%] rounded-xl p-3 text-sm", m.role === "admin" ? "justify-self-end bg-brand text-white" : "bg-slate-100")}>
                <p className={cx("mb-1 text-xs", m.role === "admin" ? "text-white/70" : "text-slate-500")}>{m.by}{m.role === "admin" && " (SRIIF)"} · {m.at}</p>
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            ))}
          </div>
          {t.status !== "Closed" ? (
            <div className="mt-4 grid gap-2">
              <textarea className="field min-h-20" placeholder="Write a reply…" value={reply} onChange={(e) => setReply(e.target.value)} />
              <div className="flex flex-wrap gap-2">
                <Button onClick={send} disabled={!reply.trim()}>Send</Button>
                {mode === "admin" && t.status !== "Resolved" && <Button variant="outline" onClick={() => patch((x) => { x.status = "Resolved"; }, `Resolved ${t.no}`)}>Mark resolved</Button>}
                {mode === "admin" && <Button variant="outline" onClick={() => patch((x) => { x.status = "Closed"; }, `Closed ${t.no}`)}>Close</Button>}
                {mode === "startup" && t.status === "Resolved" && <Button variant="outline" onClick={() => patch((x) => { x.status = "Closed"; })}>Confirm & close</Button>}
              </div>
            </div>
          ) : <p className="mt-4 text-sm text-slate-500">This ticket is closed.</p>}
        </Card>
      ) : <Empty>Select a ticket to see the conversation.</Empty>}
      <Modal open={open} onClose={() => setOpen(false)} title="Raise a ticket to SRIIF">
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); create(); }}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"><select className="field" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{TICKET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Priority"><select className="field" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Ticket["priority"] })}>{["Low", "Normal", "High"].map((c) => <option key={c}>{c}</option>)}</select></Field>
          </div>
          <Field label="Subject"><input className="field" required value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} /></Field>
          <Field label="Details"><textarea className="field min-h-28" required value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} /></Field>
          <Button type="submit">Submit ticket</Button>
          <p className="text-xs text-slate-500">Only SRIIF admins see and answer tickets. Use this also to request team changes.</p>
        </form>
      </Modal>
    </div>
  );
}
