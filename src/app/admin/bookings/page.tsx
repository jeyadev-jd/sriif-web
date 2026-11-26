"use client";

import { Badge, Button, Card, PageTitle, Table } from "@/components/ui";
import { fmtDate, useStore } from "@/lib/store";

export default function Bookings() {
  const { db, update } = useStore();
  const all = db.startups.flatMap((s) => s.bookings.map((b) => ({ s, b }))).sort((a, b) => b.b.date.localeCompare(a.b.date));
  const set = (sid: string, bid: string, status: "Approved" | "Rejected") => update((d) => { d.startups.find((x) => x.id === sid)!.bookings.find((x) => x.id === bid)!.status = status; }, `${status} facility booking`);
  return (
    <>
      <PageTitle title="Facility bookings" sub="Approve lab, room and equipment bookings." />
      <Card>
        <Table head={["Date", "Slot", "Facility", "Startup", "Purpose", "Status", ""]} rows={all.map(({ s, b }) => [
          fmtDate(b.date), b.slot, b.facility, s.name, b.purpose, <Badge key="s">{b.status}</Badge>,
          b.status === "Pending" ? <span key="a" className="flex gap-1"><Button size="sm" onClick={() => set(s.id, b.id, "Approved")}>Approve</Button><Button size="sm" variant="outline" onClick={() => set(s.id, b.id, "Rejected")}>Reject</Button></span> : null,
        ])} />
      </Card>
    </>
  );
}
