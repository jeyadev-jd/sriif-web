"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Card, PageTitle, Table } from "@/components/ui";
import { fmtDate, inr, useStore } from "@/lib/store";

export default function Startups() {
  const { db } = useStore();
  const [q, setQ] = useState("");
  const [st, setSt] = useState("All");
  const list = db.startups.filter((s) => (st === "All" || s.status === st) && s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageTitle title="All startups" sub="Only admins can see every startup. Startups see only their own data." action={<Link href="/admin/onboard" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">+ Onboard</Link>} />
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="field max-w-xs" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search startups" />
        <select className="field max-w-40" value={st} onChange={(e) => setSt(e.target.value)} aria-label="Status">{["All", "Active", "Graduated", "Exited"].map((x) => <option key={x}>{x}</option>)}</select>
      </div>
      <Card>
        <Table head={["Startup", "Program", "Cohort", "Stage / TRL", "Team", "Funding", "Onboarded", "Status"]} rows={list.map((s) => [
          <Link key="l" href={`/admin/startups/view?id=${s.id}`} className="font-semibold text-brand underline">{s.name}</Link>,
          s.program, s.cohort, `${s.stage} · ${s.trl}`, db.users.filter((u) => u.startupId === s.id).length,
          inr(s.funding.filter((f) => f.currency === "INR").reduce((a, f) => a + f.amount, 0)), fmtDate(s.onboardedOn), <Badge key="b">{s.status}</Badge>,
        ])} />
      </Card>
    </>
  );
}
