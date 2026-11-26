"use client";

import { Megaphone, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { nowStamp, today, uid, useStore } from "@/lib/store";
import { Button, Card, cx, Empty, Field } from "./ui";

/** One startup's direct thread with SRIIF admins. Startups only ever see their own thread. */
export function Thread({ startupId, mode }: { startupId: string; mode: "startup" | "admin" }) {
  const { db, user, update } = useStore();
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const msgs = db.messages.filter((m) => m.startupId === startupId);
  const other = mode === "startup" ? "admin" : "startup";
  const unread = msgs.some((m) => m.role === other && !m.read);

  useEffect(() => {
    if (unread) update((d) => { d.messages.forEach((m) => { if (m.startupId === startupId && m.role === other) m.read = true; }); });
  }, [unread, startupId, other, update]);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [msgs.length]);

  const send = () => {
    const t = text.trim();
    if (!t || !user) return;
    update((d) => { d.messages.push({ id: uid(), startupId, by: user.name, role: user.role, text: t, at: nowStamp(), read: false }); });
    setText("");
  };

  return (
    <div className="flex h-[32rem] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 space-y-3 overflow-y-auto p-5" aria-live="polite">
        {msgs.length === 0 && <Empty>No messages yet. Start the conversation below.</Empty>}
        {msgs.map((m) => {
          const mine = m.role === mode;
          return (
            <div key={m.id} className={cx("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cx("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm", mine ? "rounded-br-sm bg-brand text-white" : "rounded-bl-sm bg-slate-100 text-slate-800")}>
                <p className={cx("text-xs font-semibold", mine ? "text-white/75" : "text-slate-500")}>{m.role === "admin" ? `${m.by} · SRIIF` : m.by}</p>
                <p className="mt-0.5 whitespace-pre-wrap">{m.text}</p>
                <p className={cx("mt-1 text-[11px]", mine ? "text-white/60" : "text-slate-400")}>{m.at}</p>
              </div>
            </div>
          );
        })}
        <div ref={end} />
      </div>
      <form className="flex gap-2 border-t border-slate-200 p-3" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <label className="sr-only" htmlFor={`msg-${startupId}`}>Message</label>
        <textarea id={`msg-${startupId}`} className="field min-h-11 flex-1 resize-none" rows={1} placeholder={mode === "startup" ? "Message the SRIIF team" : "Reply to the startup"} value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <Button type="submit" disabled={!text.trim()} className="min-h-11" aria-label="Send message"><Send size={18} aria-hidden /><span className="hidden sm:inline">Send</span></Button>
      </form>
    </div>
  );
}

/** Admin messaging console: all startup threads plus a broadcast announcement. */
export function MessageConsole() {
  const { db, update } = useStore();
  const [sel, setSel] = useState(db.startups[0]?.id ?? "");
  const [b, setB] = useState({ title: "", body: "" });
  const [sent, setSent] = useState(false);
  const rows = db.startups.map((s) => {
    const msgs = db.messages.filter((m) => m.startupId === s.id);
    return { s, last: msgs.at(-1), unread: msgs.filter((m) => m.role === "startup" && !m.read).length };
  }).sort((a, z) => (z.last?.at ?? "").localeCompare(a.last?.at ?? ""));
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <ul className="grid content-start gap-2" aria-label="Startup threads">
          {rows.map(({ s, last, unread }) => (
            <li key={s.id}>
              <button onClick={() => setSel(s.id)} aria-current={sel === s.id} className={cx("w-full rounded-xl border p-3 text-left transition", sel === s.id ? "border-brand bg-brand-50" : "border-slate-200 bg-white hover:border-brand")}>
                <span className="flex items-center justify-between gap-2"><b className="truncate text-sm text-slate-900">{s.name}</b>{unread > 0 && <span className="min-w-5 rounded-full bg-accent px-1.5 text-center text-[11px] font-bold leading-5 text-brand-dark" aria-label={`${unread} unread`}>{unread}</span>}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{last ? `${last.by}: ${last.text}` : "No messages yet"}</span>
              </button>
            </li>
          ))}
        </ul>
        {sel && <Thread key={sel} startupId={sel} mode="admin" />}
      </div>
      <Card title={<span className="flex items-center gap-2"><Megaphone size={18} className="text-brand" aria-hidden />Broadcast to all startups</span>}>
        <form className="grid gap-3" onSubmit={(e) => {
          e.preventDefault();
          update((d) => { d.notices.unshift({ id: uid(), title: b.title.trim(), body: b.body.trim(), date: today() }); }, `Broadcast announcement: ${b.title.trim()}`);
          setB({ title: "", body: "" }); setSent(true); setTimeout(() => setSent(false), 2500);
        }}>
          <Field label="Title"><input className="field" required value={b.title} onChange={(e) => setB({ ...b, title: e.target.value })} /></Field>
          <Field label="Announcement"><textarea className="field" required value={b.body} onChange={(e) => setB({ ...b, body: e.target.value })} /></Field>
          <div className="flex items-center gap-3"><Button type="submit">Send to every startup dashboard</Button>{sent && <span className="text-sm text-emerald-700" role="status">Sent</span>}</div>
        </form>
      </Card>
    </div>
  );
}
