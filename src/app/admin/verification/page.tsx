"use client";

import { useState } from "react";
import { kycStatus, TeamSection } from "@/components/team-section";
import { Badge, cx, Empty, PageTitle } from "@/components/ui";
import { useStore } from "@/lib/store";

/** Queue of member requests and KYC documents waiting for SRIIF verification. */
export default function Verification() {
  const { db } = useStore();
  const rows = db.startups.map((s) => {
    const members = db.users.filter((u) => u.startupId === s.id);
    return {
      s,
      requests: s.memberRequests.filter((r) => r.status === "Pending").length,
      docs: members.flatMap((u) => u.kyc ?? []).filter((k) => k.status === "Pending").length,
      missing: members.filter((u) => kycStatus(u.kyc) === "Missing").length,
    };
  });
  const [sel, setSel] = useState(() => rows.find((r) => r.requests || r.docs)?.s.id ?? rows[0]?.s.id);
  const s = db.startups.find((x) => x.id === sel);
  return (
    <>
      <PageTitle title="Team e-verification" sub="Approve member requests from startups and verify each member's KYC documents." />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ul className="grid content-start gap-2">
          {rows.map(({ s: x, requests, docs, missing }) => (
            <li key={x.id}>
              <button onClick={() => setSel(x.id)} aria-current={sel === x.id} className={cx("w-full rounded-xl border p-3 text-left", sel === x.id ? "border-brand bg-brand-50" : "border-slate-200 bg-white hover:border-brand")}>
                <b className="block text-sm text-slate-900">{x.name}</b>
                <span className="mt-1 flex flex-wrap gap-1">
                  {requests > 0 && <Badge tone="amber">{`${requests} request${requests > 1 ? "s" : ""}`}</Badge>}
                  {docs > 0 && <Badge tone="amber">{`${docs} doc${docs > 1 ? "s" : ""} to verify`}</Badge>}
                  {missing > 0 && <Badge tone="red">{`${missing} missing KYC`}</Badge>}
                  {!requests && !docs && !missing && <Badge tone="green">All verified</Badge>}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {s ? <TeamSection key={s.id} s={s} mode="admin" /> : <Empty>No startups yet.</Empty>}
      </div>
    </>
  );
}
