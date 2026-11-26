"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card, Field, Modal, PageTitle, Table } from "@/components/ui";
import { fmtDate, today, uid, useStore } from "@/lib/store";
import type { JoinRequest } from "@/lib/types";

export default function Requests() {
  const { db, update } = useStore();
  const [open, setOpen] = useState(false);
  const blank = { name: "", email: "", phone: "", startupName: "", idea: "", stage: "Idea", via: "Email" as JoinRequest["via"], note: "" };
  const [f, setF] = useState(blank);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const setStatus = (id: string, status: JoinRequest["status"]) => update((d) => { d.requests.find((r) => r.id === id)!.status = status; }, `Request ${status.toLowerCase()}`);

  return (
    <>
      <PageTitle title="Onboarding requests" sub="People ask to join by email or the Google form. Log each one here, review, then onboard selected teams." action={<Button onClick={() => setOpen(true)}>+ Log request</Button>} />
      <Card>
        <Table head={["Received", "Founder", "Startup / idea", "Via", "Status", "Note", ""]} rows={[...db.requests].sort((a, b) => b.receivedOn.localeCompare(a.receivedOn)).map((r) => [
          fmtDate(r.receivedOn),
          <span key="f">{r.name}<br /><span className="text-xs text-slate-500">{r.email} · {r.phone}</span></span>,
          <span key="s"><b>{r.startupName}</b> <span className="text-xs">({r.stage})</span><br /><span className="text-xs text-slate-600">{r.idea}</span></span>,
          r.via, <Badge key="b">{r.status}</Badge>, r.note || "—",
          r.status === "New" || r.status === "In review" ? (
            <span key="a" className="flex flex-col gap-1">
              {r.status === "New" && <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "In review")}>Start review</Button>}
              <Link href={`/admin/onboard?req=${r.id}`} className="rounded-lg bg-brand px-3 py-1.5 text-center text-xs font-semibold text-white">Onboard</Link>
              <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "Declined")}>Decline</Button>
            </span>
          ) : null,
        ])} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Log an incoming request">
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); update((d) => { d.requests.push({ id: uid(), ...f, receivedOn: today(), status: "New" }); }, `Logged request from ${f.startupName}`); setF(blank); setOpen(false); }}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Founder name"><input className="field" required value={f.name} onChange={set("name")} /></Field>
            <Field label="Startup / idea"><input className="field" required value={f.startupName} onChange={set("startupName")} /></Field>
            <Field label="Email"><input className="field" type="email" required value={f.email} onChange={set("email")} /></Field>
            <Field label="Phone"><input className="field" value={f.phone} onChange={set("phone")} /></Field>
            <Field label="Stage"><select className="field" value={f.stage} onChange={set("stage")}>{["Idea", "Prototype", "MVP", "Revenue"].map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Received via"><select className="field" value={f.via} onChange={set("via")}>{["Email", "Google Form", "Walk-in"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          </div>
          <Field label="Idea"><textarea className="field" value={f.idea} onChange={set("idea")} /></Field>
          <Field label="Internal note"><input className="field" value={f.note} onChange={set("note")} /></Field>
          <Button type="submit">Save</Button>
        </form>
      </Modal>
    </>
  );
}
