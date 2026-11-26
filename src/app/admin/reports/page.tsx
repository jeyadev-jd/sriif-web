"use client";

import { Card, PageTitle, Stat, Table } from "@/components/ui";
import { inr, useStore } from "@/lib/store";

function Bars({ data }: { data: [string, number][] }) {
  const max = Math.max(1, ...data.map(([, v]) => v));
  if (data.length === 0) return <p className="text-sm text-slate-500">No data.</p>;
  return (
    <div className="grid gap-2">
      {data.map(([k, v]) => (
        <div key={k} className="flex items-center gap-3 text-sm">
          <span className="w-36 shrink-0 truncate">{k}</span>
          <div className="h-5 flex-1 rounded bg-slate-100"><div className="h-5 rounded bg-brand" style={{ width: `${(v / max) * 100}%` }} /></div>
          <span className="w-28 text-right font-medium">{inr(v)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Reports() {
  const { db } = useStore();
  const f = db.startups.flatMap((s) => s.funding.filter((x) => x.currency === "INR").map((x) => ({ s, x })));
  const group = (key: (v: (typeof f)[number]) => string) => Object.entries(f.reduce<Record<string, number>>((a, v) => ({ ...a, [key(v)]: (a[key(v)] ?? 0) + v.x.amount }), {})).sort() as [string, number][];
  const total = f.reduce((a, v) => a + v.x.amount, 0);
  const latest = db.startups.map((s) => s.reports.at(-1)).filter(Boolean);
  const awards = db.startups.flatMap((s) => s.awards);

  const exportCsv = () => {
    const rows = [["Startup", "Program", "Cohort", "Status", "Stage", "TRL", "Funding INR", "Users", "Revenue", "Patents/IP", "Awards"]];
    for (const s of db.startups) {
      const r = s.reports.at(-1);
      rows.push([s.name, s.program, s.cohort, s.status, s.stage, String(s.trl), String(s.funding.filter((x) => x.currency === "INR").reduce((a, x) => a + x.amount, 0)), String(r?.users ?? 0), String(r?.revenue ?? 0), String(s.docs.filter((d) => d.type.startsWith("IP")).length), String(s.awards.length)]);
    }
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `sriif-impact-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <>
      <PageTitle title="Impact reports" sub="For SRIIF, SRIHER and funders (BIRAC, StartupTN, DST)." action={<div className="flex gap-2"><button onClick={exportCsv} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Export CSV</button><a href="/print/impact" target="_blank" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Impact report PDF</a></div>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Startups (all time)" value={db.startups.length} />
        <Stat label="Total funding" value={inr(total)} />
        <Stat label="Users (latest reports)" value={latest.reduce((a, r) => a + (r?.users ?? 0), 0)} />
        <Stat label="Awards & achievements" value={awards.length} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Funding by year"><Bars data={group((v) => v.x.date.slice(0, 4))} /></Card>
        <Card title="Funding by cohort"><Bars data={group((v) => v.s.cohort)} /></Card>
        <Card title="Funding by type"><Bars data={group((v) => v.x.type)} /></Card>
      </div>
      <Card title="By startup" className="mt-6">
        <Table head={["Startup", "Program", "Status", "Funding", "Users", "Revenue (last qtr)", "Awards"]} rows={db.startups.map((s) => [s.name, s.program, s.status, inr(s.funding.filter((x) => x.currency === "INR").reduce((a, x) => a + x.amount, 0)), s.reports.at(-1)?.users ?? 0, inr(s.reports.at(-1)?.revenue ?? 0), s.awards.length])} />
      </Card>
    </>
  );
}
