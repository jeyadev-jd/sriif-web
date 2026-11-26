"use client";

import { useState } from "react";
import { Button, Card, Field, PageTitle, Table } from "@/components/ui";
import { fmtDate, today, uid, useStore } from "@/lib/store";

export default function Notices() {
  const { db, update } = useStore();
  const [f, setF] = useState({ title: "", body: "" });
  return (
    <>
      <PageTitle title="Notices" sub="Shown on every startup's dashboard." />
      <Card title="Post a notice">
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); update((d) => { d.notices.unshift({ id: uid(), ...f, date: today() }); }, `Posted notice: ${f.title}`); setF({ title: "", body: "" }); }}>
          <Field label="Title"><input className="field" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
          <Field label="Message"><textarea className="field" required value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} /></Field>
          <div><Button type="submit">Post</Button></div>
        </form>
      </Card>
      <Card title="Posted" className="mt-6">
        <Table head={["Date", "Notice", ""]} rows={db.notices.map((n) => [fmtDate(n.date), <span key="n"><b>{n.title}</b><br />{n.body}</span>, <button key="d" className="text-xs text-red-600" onClick={() => update((d) => { d.notices = d.notices.filter((x) => x.id !== n.id); }, `Removed notice: ${n.title}`)}>Remove</button>])} />
      </Card>
    </>
  );
}
