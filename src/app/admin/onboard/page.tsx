"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button, Card, Field, PageTitle } from "@/components/ui";
import { SECTORS } from "@/lib/seed";
import { today, uid, useStore } from "@/lib/store";
import type { Startup } from "@/lib/types";

type Member = { name: string; designation: string; email: string; phone: string };

export default function Page() {
  return <Suspense><WithQuery /></Suspense>;
}

function WithQuery() {
  const reqId = useSearchParams().get("req");
  // key: a fresh form for each request being onboarded
  return <Onboard key={reqId ?? "new"} reqId={reqId} />;
}

function Onboard({ reqId }: { reqId: string | null }) {
  const { db, update } = useStore();
  const router = useRouter();
  const req = db.requests.find((r) => r.id === reqId);

  const [s, setS] = useState({
    name: req?.startupName ?? "", oneLiner: req?.idea ?? "", program: "Incubation" as Startup["program"], cohort: "Cohort 2027-A",
    stage: "Idea" as Startup["stage"], sectors: [] as string[], email: req?.email ?? "", phone: req?.phone ?? "",
    seatType: "Dedicated desk", seatCount: 1, seatRate: 3000, equityTaken: false, mentorIds: [] as string[],
  });
  const [team, setTeam] = useState<Member[]>([{ name: req?.name ?? "", designation: "Founder", email: req?.email ?? "", phone: req?.phone ?? "" }]);
  const [err, setErr] = useState("");
  const mentors = db.users.filter((u) => u.role === "mentor" && u.active);

  const submit = () => {
    setErr("");
    if (!s.name.trim()) return setErr("Startup name is required.");
    if (team.length === 0 || team.some((m) => !m.name.trim() || !/^\S+@\S+\.\S+$/.test(m.email))) return setErr("Every team member needs a name and a valid email.");
    const emails = team.map((m) => m.email.trim().toLowerCase());
    if (new Set(emails).size !== emails.length) return setErr("Two members have the same email.");
    const taken = emails.find((e) => db.users.some((u) => u.email.toLowerCase() === e));
    if (taken) return setErr(`${taken} already has a portal account.`);

    const id = uid();
    update((d) => {
      d.startups.push({
        id, name: s.name.trim(), logo: "", trl: 1, sectors: s.sectors, stage: s.stage, program: s.program, cohort: s.cohort, onboardedOn: today(),
        website: "", linkedin: "", regAddress: "", commAddress: "", email: s.email, phone: s.phone, oneLiner: s.oneLiner, status: "Active",
        mentorIds: s.mentorIds, seat: { type: s.seatType, count: Number(s.seatCount), rate: Number(s.seatRate) }, equityTaken: s.equityTaken,
        docs: [], founders: team.filter((m) => /founder/i.test(m.designation)).map((m) => ({ name: m.name, designation: m.designation, equity: 0, din: "" })),
        holdings: [], shareClasses: "", funding: [], awards: [], reports: [], annual: [], meetings: [], bookings: [], invoices: [], gstin: "", memberRequests: [],
      });
      for (const m of team) d.users.push({ id: uid(), name: m.name.trim(), designation: m.designation, email: m.email.trim(), phone: m.phone, role: "startup", startupId: id, active: true });
      const r = d.requests.find((x) => x.id === reqId);
      if (r) r.status = "Onboarded";
    }, `Onboarded ${s.name} with ${team.length} member(s)`);
    router.push(`/admin/startups/view?id=${id}`);
  };

  return (
    <>
      <PageTitle title="Onboard a startup" sub={req ? `From request: ${req.startupName} (${req.via}, ${req.receivedOn})` : "Only SRIIF admins create startups and team logins."} />
      <div className="grid gap-6">
        <Card title="1. Startup">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Startup name"><input className="field" value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} /></Field>
            <Field label="One-liner"><input className="field" value={s.oneLiner} onChange={(e) => setS({ ...s, oneLiner: e.target.value })} /></Field>
            <Field label="Program"><select className="field" value={s.program} onChange={(e) => setS({ ...s, program: e.target.value as Startup["program"] })}>{["Pre-Incubation", "Incubation"].map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Cohort"><input className="field" value={s.cohort} onChange={(e) => setS({ ...s, cohort: e.target.value })} /></Field>
            <Field label="Stage"><select className="field" value={s.stage} onChange={(e) => setS({ ...s, stage: e.target.value as Startup["stage"] })}>{["Idea", "MVP", "Revenue", "Scaling"].map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Startup email"><input className="field" type="email" value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <p className="mb-1 text-sm font-medium text-slate-700">Sectors</p>
              <div className="flex flex-wrap gap-2">{SECTORS.map((t) => { const on = s.sectors.includes(t); return <button type="button" key={t} onClick={() => setS({ ...s, sectors: on ? s.sectors.filter((x) => x !== t) : [...s.sectors, t] })} className={`rounded-full px-3 py-1 text-xs ring-1 ${on ? "bg-brand text-white ring-brand" : "ring-slate-300"}`}>{t}</button>; })}</div>
            </div>
          </div>
        </Card>
        <Card title="2. Seat & terms">
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Seat type"><select className="field" value={s.seatType} onChange={(e) => setS({ ...s, seatType: e.target.value })}>{["Hot desk", "Dedicated desk", "Cabin"].map((x) => <option key={x}>{x}</option>)}</select></Field>
            <Field label="Seats"><input className="field" type="number" min={1} value={s.seatCount} onChange={(e) => setS({ ...s, seatCount: Number(e.target.value) })} /></Field>
            <Field label="Rate per seat / month (₹)"><input className="field" type="number" min={0} value={s.seatRate} onChange={(e) => setS({ ...s, seatRate: Number(e.target.value) })} /></Field>
            <label className="flex items-center gap-2 pt-6 text-sm"><input type="checkbox" checked={s.equityTaken} onChange={(e) => setS({ ...s, equityTaken: e.target.checked })} /> SRIIF takes equity</label>
          </div>
        </Card>
        <Card title="3. Team members (each gets a login)" action={<Button size="sm" variant="ghost" onClick={() => setTeam([...team, { name: "", designation: "Team member", email: "", phone: "" }])}>+ Add member</Button>}>
          <div className="grid gap-3">
            {team.map((m, i) => (
              <div key={i} className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_140px_auto]">
                <input className="field" placeholder="Name" value={m.name} onChange={(e) => setTeam(team.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                <input className="field" placeholder="Designation" value={m.designation} onChange={(e) => setTeam(team.map((x, j) => j === i ? { ...x, designation: e.target.value } : x))} />
                <input className="field" placeholder="Email (login)" type="email" value={m.email} onChange={(e) => setTeam(team.map((x, j) => j === i ? { ...x, email: e.target.value } : x))} />
                <input className="field" placeholder="Mobile" value={m.phone} onChange={(e) => setTeam(team.map((x, j) => j === i ? { ...x, phone: e.target.value } : x))} />
                <button className="text-xs text-red-600" onClick={() => setTeam(team.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
          </div>
        </Card>
        <Card title="4. Mentors (optional)">
          <div className="flex flex-wrap gap-2">{mentors.map((m) => { const on = s.mentorIds.includes(m.id); return <button key={m.id} type="button" onClick={() => setS({ ...s, mentorIds: on ? s.mentorIds.filter((x) => x !== m.id) : [...s.mentorIds, m.id] })} className={`rounded-full px-3 py-1 text-sm ring-1 ${on ? "bg-brand text-white ring-brand" : "ring-slate-300"}`}>{m.name}</button>; })}</div>
        </Card>
        {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
        <div><Button onClick={submit}>Create startup & send logins</Button></div>
      </div>
    </>
  );
}
