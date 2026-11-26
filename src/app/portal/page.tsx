"use client";

import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, ChartColumn, Coins, FileWarning, LifeBuoy, Megaphone, MessagesSquare, Receipt, ShieldAlert, Upload } from "lucide-react";
import { kycStatus } from "@/components/team-section";
import Link from "next/link";
import { Badge, Card, PageTitle, Progress, Stat } from "@/components/ui";
import { DOC_TYPES } from "@/lib/seed";
import { brand } from "@/lib/site";
import { daysUntil, fmtDate, inr, invoiceTotals, useStartup, useStore } from "@/lib/store";

export default function Dashboard() {
  const { db, user } = useStore();
  const s = useStartup();
  if (!s || !user) return null;

  const missing = DOC_TYPES.filter((t) => t.mandatory && !s.docs.some((d) => d.type === t.type));
  const expiring = s.docs.filter((d) => d.expiry && daysUntil(d.expiry) < 45);
  const due = s.invoices.filter((i) => i.status === "Due" && !i.utr);
  const dueAmt = due.reduce((a, i) => a + invoiceTotals(i.lines, brand.gstRate).total, 0);
  const lastReport = s.reports.at(-1);
  const unread = db.messages.filter((m) => m.startupId === s.id && m.role === "admin" && !m.read).length;
  const pendingKyc = db.users.filter((u) => u.startupId === s.id && kycStatus(u.kyc) !== "Verified");
  const openTickets = db.tickets.filter((t) => t.startupId === s.id && (t.status === "Open" || t.status === "In progress"));
  const funding = s.funding.filter((f) => f.currency === "INR").reduce((a, f) => a + f.amount, 0);

  // Profile completeness: profile fields + mandatory documents + at least one progress report.
  const checks = [s.website, s.regAddress, s.commAddress, s.email, s.phone, s.oneLiner, s.logo, s.sectors.length > 0, ...DOC_TYPES.filter((t) => t.mandatory).map((t) => s.docs.some((d) => d.type === t.type)), s.reports.length > 0];
  const complete = (checks.filter(Boolean).length / checks.length) * 100;

  const todo = [
    ...missing.map((m) => ({ icon: Upload, text: `Upload ${m.type}`, href: "/portal/documents", tone: "text-red-600" })),
    ...expiring.map((d) => ({ icon: FileWarning, text: `Renew ${d.type} – expires ${fmtDate(d.expiry)}`, href: "/portal/documents", tone: "text-amber-600" })),
    ...pendingKyc.filter((u) => kycStatus(u.kyc) === "Missing" || kycStatus(u.kyc) === "Rejected").map((u) => ({ icon: ShieldAlert, text: `Upload KYC documents for ${u.name}`, href: "/portal/team", tone: "text-red-600" })),
    ...due.map((i) => ({ icon: Receipt, text: `Pay invoice ${i.no} (${inr(invoiceTotals(i.lines, brand.gstRate).total)})`, href: "/portal/invoices", tone: "text-amber-600" })),
  ];

  return (
    <>
      <PageTitle title={`Welcome, ${user.name.split(" ")[0]}`} sub={`${s.name} · ${s.cohort} · onboarded ${fmtDate(s.onboardedOn)}`} action={<Link href="/portal/tickets" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"><LifeBuoy size={18} aria-hidden />Raise a ticket</Link>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={ChartColumn} label="Stage · TRL" value={`${s.stage} · ${s.trl}`} />
        <Stat icon={Coins} label="Funding raised" value={inr(funding)} tone="green" />
        <Stat icon={Receipt} label="Outstanding dues" value={inr(dueAmt)} tone={dueAmt > 0 ? "amber" : "green"} />
        <Stat icon={LifeBuoy} label="Open tickets" value={openTickets.length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Things to do" className="lg:col-span-2">
          <Progress value={complete} label="Startup record completeness" />
          {todo.length === 0 ? (
            <p className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700"><CheckCircle2 size={18} aria-hidden />All caught up.</p>
          ) : (
            <ul className="mt-5 divide-y divide-slate-100">
              {todo.map(({ icon: I, text, href, tone }) => (
                <li key={text}>
                  <Link href={href} className="group flex min-h-12 items-center gap-3 rounded-lg px-2 text-sm hover:bg-slate-50">
                    <I size={18} className={tone} aria-hidden />
                    <span className="flex-1 text-slate-800">{text}</span>
                    <ArrowRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Progress review" action={<Badge tone={lastReport ? "green" : "amber"}>Top priority</Badge>}>
          <div className="flex gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand"><CalendarClock size={22} aria-hidden /></span>
            <div className="text-sm">
              <p className="font-semibold text-slate-900">{lastReport ? `Last submitted: ${lastReport.period}` : "No report submitted yet"}</p>
              <p className="text-slate-600">{lastReport ? `${fmtDate(lastReport.submittedOn)} · revenue ${inr(lastReport.revenue)}` : "Share KPIs, revenue and growth with SRIIF."}</p>
              <Link className="mt-3 inline-flex min-h-10 items-center gap-1 font-semibold text-brand underline" href="/portal/progress">Submit progress update<ArrowRight size={15} aria-hidden /></Link>
            </div>
          </div>
          {unread > 0 && <Link href="/portal/messages" className="mt-4 flex min-h-11 items-center gap-2 rounded-lg bg-accent/15 px-3 text-sm font-semibold text-brand-dark"><MessagesSquare size={18} aria-hidden />{unread} new message{unread > 1 ? "s" : ""} from SRIIF</Link>}
        </Card>

        <Card title="Notices from SRIIF" className="lg:col-span-3">
          {db.notices.length === 0 ? <p className="text-sm text-slate-500">No notices.</p> : (
            <ul className="grid gap-3 md:grid-cols-2">
              {db.notices.map((n) => (
                <li key={n.id} className="flex gap-3 rounded-xl bg-surface p-4">
                  <Megaphone size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                  <div className="text-sm"><p className="font-semibold text-slate-900">{n.title}</p><p className="text-slate-600">{n.body}</p><p className="mt-1 text-xs text-slate-500">{fmtDate(n.date)}</p></div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      {s.status !== "Active" && <p className="mt-6 flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"><AlertTriangle size={18} aria-hidden />This startup is marked {s.status}. Some actions are limited.</p>}
    </>
  );
}
