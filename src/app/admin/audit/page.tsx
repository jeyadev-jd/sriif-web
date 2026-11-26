"use client";

import { Button, Card, PageTitle, Table } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function Audit() {
  const { db, reset } = useStore();
  return (
    <>
      <PageTitle title="Audit log" sub="Every change made in the portal: who, what, when." action={<Button variant="outline" onClick={() => { if (confirm("Reset all demo data?")) reset(); }}>Reset demo data</Button>} />
      <Card><Table head={["When", "Who", "Action"]} rows={db.audit.map((a) => [a.at, a.by, a.action])} /></Card>
    </>
  );
}
