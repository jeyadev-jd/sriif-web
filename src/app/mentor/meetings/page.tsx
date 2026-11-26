"use client";

import Link from "next/link";
import { Badge, Card, PageTitle, Table } from "@/components/ui";
import { fmtDate, useStore } from "@/lib/store";

export default function Meetings() {
  const { db, user } = useStore();
  const rows = db.startups.flatMap((s) => s.meetings.filter((m) => m.mentorId === user?.id).map((m) => ({ s, m }))).sort((a, b) => b.m.date.localeCompare(a.m.date));
  return (
    <>
      <PageTitle title="Meetings" sub="Confirm requests and record notes from the startup's page." />
      <Card>
        <Table head={["Date", "Startup", "Agenda", "Status", ""]} rows={rows.map(({ s, m }) => [`${fmtDate(m.date)} ${m.time}`, s.name, m.agenda, <Badge key="b">{m.status}</Badge>, <Link key="l" className="text-brand underline" href={`/mentor/startups/view?id=${s.id}`}>Open</Link>])} />
      </Card>
    </>
  );
}
