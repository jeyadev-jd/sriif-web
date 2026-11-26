"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, cx, PageTitle, Table } from "@/components/ui";
import { INQUIRY_TYPES } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { Inquiry } from "@/lib/types";

/** Contact Us and Join Us submissions from the public website. */
export default function Inbox() {
  const { db, update } = useStore();
  const [kind, setKind] = useState<Inquiry["kind"] | "All">("All");
  const list = db.inquiries.filter((q) => kind === "All" || q.kind === kind);
  const set = (id: string, status: Inquiry["status"]) => update((d) => { d.inquiries.find((q) => q.id === id)!.status = status; }, `Marked website inquiry ${status.toLowerCase()}`);
  return (
    <>
      <PageTitle title="Website inbox" sub="Messages from the Contact Us form and Join Us interest from mentors, investors and partners." />
      <div className="mb-4 flex gap-2">
        {(["All", "Contact", "Join Us"] as const).map((k) => <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)} className={cx("min-h-10 rounded-full px-4 text-sm font-medium", kind === k ? "bg-brand-dark text-white" : "bg-white text-slate-700 ring-1 ring-slate-200")}>{k} <span className="opacity-70">{k === "All" ? db.inquiries.length : db.inquiries.filter((q) => q.kind === k).length}</span></button>)}
      </div>
      <Card>
        <Table empty="No messages." head={["Received", "From", "Type · routed to", "Message", "Status", ""]} rows={list.map((q) => [
          q.at,
          <span key="f"><b>{q.name}</b><span className="block text-xs text-slate-500">{q.email}{q.phone && ` · ${q.phone}`}</span>{q.org && <span className="block text-xs text-slate-500">{q.org}</span>}</span>,
          <span key="t"><Badge tone={q.kind === "Join Us" ? "blue" : "slate"}>{q.kind}</Badge><span className="mt-1 block text-xs">{q.type} · {q.kind === "Contact" ? INQUIRY_TYPES.find((t) => t.type === q.type)?.desk : "Partnerships team"}</span></span>,
          <span key="m" className="block max-w-md text-sm">{q.message}</span>,
          <Badge key="s">{q.status}</Badge>,
          <span key="a" className="flex flex-col gap-1">
            <a href={`mailto:${q.email}?subject=${encodeURIComponent("Re: your message to SRIIF")}`} onClick={() => q.status === "New" && set(q.id, "Replied")} className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-brand underline"><Mail size={14} aria-hidden />Reply by email</a>
            {q.status !== "Closed" && <Button size="sm" variant="outline" onClick={() => set(q.id, "Closed")}>Close</Button>}
          </span>,
        ])} />
      </Card>
      <p className="mt-3 text-xs text-slate-500">Demo: website submissions are stored in this browser only. A real deployment would store them on the server.</p>
    </>
  );
}
