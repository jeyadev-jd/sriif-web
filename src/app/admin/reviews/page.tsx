"use client";

import Link from "next/link";
import { Badge, Card, PageTitle, Table } from "@/components/ui";
import { fmtDate, useStore } from "@/lib/store";

export default function Reviews() {
  const { db } = useStore();
  const year = String(new Date().getFullYear());
  const q = ["Q1", "Q2", "Q3", "Q4"].map((x) => `${x} ${year}`);
  return (
    <>
      <PageTitle title="Reviews & scorecards" sub="Quarterly report status and yearly review (Team / Product / Market / Execution / Compliance)." />
      <Card title={`Quarterly reports ${year}`}>
        <Table head={["Startup", ...q, "Last submitted"]} rows={db.startups.filter((s) => s.status === "Active").map((s) => [
          <Link key="l" className="text-brand underline" href={`/admin/startups/view?id=${s.id}&tab=progress`}>{s.name}</Link>,
          ...q.map((p) => s.reports.some((r) => r.period === p) ? <Badge key={p} tone="green">Submitted</Badge> : <Badge key={p} tone="slate">—</Badge>),
          fmtDate(s.reports.at(-1)?.submittedOn),
        ])} />
      </Card>
      <Card title={`Yearly review ${year}`} className="mt-6">
        <Table head={["Startup", "Onboarded", "Docs uploaded", "Average score", "Decision", ""]} rows={db.startups.map((s) => {
          const a = s.annual.find((x) => x.year === year);
          const avg = a?.score ? ((a.score.team + a.score.product + a.score.market + a.score.execution + a.score.compliance) / 5).toFixed(1) : "—";
          return [s.name, fmtDate(s.onboardedOn), `${a?.files.length ?? 0} / 4`, avg, a?.decision ? <Badge key="d" tone="blue">{a.decision}</Badge> : "—", <Link key="r" className="text-brand underline" href={`/admin/startups/view?id=${s.id}&tab=progress`}>Review</Link>];
        })} />
      </Card>
    </>
  );
}
