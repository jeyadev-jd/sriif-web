"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AwardsSection, CapTableSection, DocumentsSection, FacilitiesSection, FundingSection, InvoicesSection, LettersSection, MentorshipSection, ProfileSection, ProgressSection, TeamSection } from "@/components/startup-sections";
import { Badge, cx, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";

const TABS = [
  ["profile", "Profile"], ["team", "Team"], ["documents", "Documents"], ["cap-table", "Cap table"], ["funding", "Funding"], ["awards", "Awards"],
  ["progress", "Progress & review"], ["mentorship", "Mentorship"], ["facilities", "Facilities"], ["invoices", "Invoices"], ["letters", "PDFs"],
] as const;

function Detail() {
  const q = useSearchParams();
  const id = q.get("id") ?? "";
  const tab = q.get("tab") ?? "profile";
  const router = useRouter();
  const { db } = useStore();
  const s = db.startups.find((x) => x.id === id);
  if (!s) return <p>Startup not found. <Link className="text-brand underline" href="/admin/startups">Back</Link></p>;
  const p = { s, mode: "admin" as const };
  return (
    <>
      <PageTitle title={s.name} sub={`${s.program} · ${s.cohort} · ${s.oneLiner}`} action={<Badge>{s.status}</Badge>} />
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200">
        {TABS.map(([k, l]) => <button key={k} onClick={() => router.replace(`/admin/startups/view?id=${s.id}&tab=${k}`)} className={cx("whitespace-nowrap border-b-2 px-3 py-2 text-sm", tab === k ? "border-brand font-semibold text-brand" : "border-transparent text-slate-500 hover:text-slate-800")}>{l}</button>)}
      </div>
      {tab === "profile" && <ProfileSection key={s.id} {...p} />}
      {tab === "team" && <TeamSection {...p} />}
      {tab === "documents" && <DocumentsSection {...p} />}
      {tab === "cap-table" && <CapTableSection key={s.id + s.equityTaken} {...p} />}
      {tab === "funding" && <FundingSection {...p} />}
      {tab === "awards" && <AwardsSection {...p} />}
      {tab === "progress" && <ProgressSection {...p} />}
      {tab === "mentorship" && <MentorshipSection {...p} />}
      {tab === "facilities" && <FacilitiesSection {...p} />}
      {tab === "invoices" && <InvoicesSection {...p} />}
      {tab === "letters" && <LettersSection s={s} />}
    </>
  );
}

export default function Page() {
  return <Suspense><Detail /></Suspense>;
}
