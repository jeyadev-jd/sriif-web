"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { AwardsSection, DocumentsSection, MentorshipSection, ProfileSection, ProgressSection } from "@/components/startup-sections";
import { cx, Empty, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";

const TABS = ["Profile", "Documents", "Awards", "Progress", "Meetings"] as const;

export default function MentorStartup() {
  const { id } = useParams<{ id: string }>();
  const { db, user } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Meetings");
  const s = db.startups.find((x) => x.id === id && user && x.mentorIds.includes(user.id));
  if (!s) return <Empty>This startup is not assigned to you.</Empty>;
  const p = { s, mode: "mentor" as const };
  return (
    <>
      <PageTitle title={s.name} sub={s.oneLiner} />
      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={cx("border-b-2 px-3 py-2 text-sm", tab === t ? "border-brand font-semibold text-brand" : "border-transparent text-slate-500")}>{t}</button>)}
      </div>
      {tab === "Profile" && <ProfileSection {...p} />}
      {tab === "Documents" && <DocumentsSection {...p} />}
      {tab === "Awards" && <AwardsSection {...p} />}
      {tab === "Progress" && <ProgressSection {...p} />}
      {tab === "Meetings" && <MentorshipSection {...p} />}
    </>
  );
}
