"use client";

import { useState } from "react";
import { Badge, Button, Card, Field, Modal, PageTitle, Table } from "@/components/ui";
import { links } from "@/lib/site";
import { uid, useStore } from "@/lib/store";

export default function Mentors() {
  const { db, update } = useStore();
  const [open, setOpen] = useState(false);
  const blank = { name: "", email: "", phone: "", designation: "", expertise: "" };
  const [f, setF] = useState(blank);
  const mentors = db.users.filter((u) => u.role === "mentor");
  const taken = db.users.some((u) => u.email.toLowerCase() === f.email.trim().toLowerCase());
  return (
    <>
      <PageTitle title="Mentors" sub="Mentor directory. Mentors have no portal login; admin assigns them to startups and records meetings." action={<div className="flex gap-2"><a className="rounded-lg border border-slate-300 px-4 py-2 text-sm" href={links.mentorForm} target="_blank" rel="noreferrer">Mentor form</a><Button onClick={() => setOpen(true)}>+ Add mentor</Button></div>} />
      <Card>
        <Table head={["Name", "Designation", "Expertise", "Email", "Startups", "Status", ""]} rows={mentors.map((m) => [
          m.name, m.designation, m.expertise, m.email, db.startups.filter((s) => s.mentorIds.includes(m.id)).map((s) => s.name).join(", ") || "—",
          <Badge key="b" tone={m.active ? "green" : "slate"}>{m.active ? "Active" : "Archived"}</Badge>,
          <button key="t" className="text-xs text-brand underline" onClick={() => update((d) => { const x = d.users.find((y) => y.id === m.id)!; x.active = !x.active; }, `${m.active ? "Archived" : "Restored"} mentor ${m.name}`)}>{m.active ? "Archive" : "Restore"}</button>,
        ])} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Add mentor">
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); if (taken) return; update((d) => { d.users.push({ id: uid(), ...f, role: "mentor", active: true }); }, `Added mentor ${f.name}`); setF(blank); setOpen(false); }}>
          <Field label="Name"><input className="field" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Designation"><input className="field" value={f.designation} onChange={(e) => setF({ ...f, designation: e.target.value })} /></Field>
          <Field label="Expertise"><input className="field" value={f.expertise} onChange={(e) => setF({ ...f, expertise: e.target.value })} /></Field>
          <Field label="Email"><input className="field" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />{taken && <span className="text-xs text-red-600">Email already in use.</span>}</Field>
          <Field label="Phone"><input className="field" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Button type="submit" disabled={taken}>Add mentor</Button>
        </form>
      </Modal>
    </>
  );
}
