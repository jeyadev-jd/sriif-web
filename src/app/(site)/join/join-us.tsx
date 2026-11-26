"use client";

import { useSearchParams } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { Container } from "@/components/site-chrome";
import { JOIN_ROLES } from "@/lib/seed";

export function JoinUs() {
  const role = useSearchParams().get("role") ?? undefined;
  return (
    <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
      <ul className="grid content-start gap-3">
        {JOIN_ROLES.map((r) => (
          <li key={r.role} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-bold text-brand-dark">{r.role}</p>
            <p className="mt-1 text-sm text-slate-600">{r.desc}</p>
          </li>
        ))}
      </ul>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="display text-3xl text-brand-dark">Express interest</h2>
        <p className="mb-6 mt-2 text-sm text-slate-600">Investors do not get a portal login. You meet SRIIF startups at Demo Day and Investor Connect.</p>
        <InquiryForm key={role} kind="Join Us" types={JOIN_ROLES.map((r) => r.role)} initialType={role} />
      </div>
    </Container>
  );
}
