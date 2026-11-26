"use client";

import Link from "next/link";
import { Badge, Empty, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function MentorHome() {
  const { db, user } = useStore();
  const mine = db.startups.filter((s) => user && s.mentorIds.includes(user.id));
  return (
    <>
      <PageTitle title="My startups" sub="Startups SRIIF has assigned to you. You see non-financial information only." />
      {mine.length === 0 ? <Empty>No startups assigned yet.</Empty> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {mine.map((s) => (
            <Link key={s.id} href={`/mentor/startups/view?id=${s.id}`} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-brand">
              <div className="flex items-center justify-between"><p className="font-semibold text-brand-dark">{s.name}</p><Badge>{s.status}</Badge></div>
              <p className="mt-1 text-sm text-slate-600">{s.oneLiner}</p>
              <p className="mt-2 text-xs text-slate-500">{s.program} · {s.stage} · TRL {s.trl} · {s.sectors.join(", ")}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
