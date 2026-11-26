"use client";

// Team & e-verification. Startups can request a new member and upload KYC documents,
// but only a SRIIF admin approves the member, creates the login and verifies documents.
import { Clock, FileUp, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { KYC_TYPES, MANDATORY_KYC } from "@/lib/seed";
import { fmtDate, today, uid, useStore } from "@/lib/store";
import type { KycDoc, MemberRequest, Startup, User } from "@/lib/types";
import { Badge, Button, Card, Field, Modal, ReadOnlyNote, Table } from "./ui";

type Mode = "startup" | "admin" | "mentor";

/** Verified / pending / missing summary of a person's mandatory KYC. */
export function kycStatus(docs: KycDoc[] = []): "Verified" | "Pending" | "Missing" | "Rejected" {
  const m = MANDATORY_KYC.map((t) => docs.find((d) => d.type === t));
  if (m.some((d) => !d)) return "Missing";
  if (m.some((d) => d!.status === "Rejected")) return "Rejected";
  if (m.every((d) => d!.status === "Verified")) return "Verified";
  return "Pending";
}

const TONE = { Verified: "green", Pending: "amber", Missing: "red", Rejected: "red" } as const;

function PdfPick({ onPick, label }: { onPick: (name: string) => void; label: string }) {
  return (
    <label className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">
      <FileUp size={15} aria-hidden />{label}
      <input type="file" accept="application/pdf,image/png,image/jpeg" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f.name); e.target.value = ""; }} />
    </label>
  );
}

/** KYC document list for one member (or one pending request). */
function KycList({ docs, canUpload, canVerify, onUpload, onSet }: {
  docs: KycDoc[]; canUpload: boolean; canVerify: boolean;
  onUpload: (type: string, name: string) => void; onSet: (type: string, status: KycDoc["status"]) => void;
}) {
  return (
    <ul className="grid gap-2">
      {KYC_TYPES.map((t) => {
        const d = docs.find((x) => x.type === t);
        return (
          <li key={t} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span>
              <b className="text-slate-800">{t}</b>{MANDATORY_KYC.includes(t) && <span className="text-red-600"> *</span>}
              <span className="block text-xs text-slate-500">{d ? `${d.name} · ${fmtDate(d.uploadedOn)}` : "Not uploaded"}</span>
            </span>
            <span className="flex flex-wrap items-center gap-2">
              {d && <Badge>{d.status}</Badge>}
              {canUpload && <PdfPick label={d ? "Replace" : "Upload"} onPick={(n) => onUpload(t, n)} />}
              {canVerify && d && d.status !== "Verified" && <Button size="sm" className="min-h-10" onClick={() => onSet(t, "Verified")}>Verify</Button>}
              {canVerify && d && d.status !== "Rejected" && <Button size="sm" variant="outline" className="min-h-10" onClick={() => onSet(t, "Rejected")}>Reject</Button>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const upsert = (docs: KycDoc[], type: string, name: string): KycDoc[] => [...docs.filter((d) => d.type !== type), { type, name, uploadedOn: today(), status: "Pending" }];

export function TeamSection({ s, mode }: { s: Startup; mode: Mode }) {
  const { db, update } = useStore();
  const members = db.users.filter((u) => u.startupId === s.id);
  const [kycFor, setKycFor] = useState<string | null>(null);
  const [reqOpen, setReqOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const blank = { name: "", email: "", phone: "", designation: "" };
  const [f, setF] = useState(blank);
  const [docs, setDocs] = useState<KycDoc[]>([]);
  const bind = (k: keyof typeof blank) => ({ value: f[k], onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }) });
  const email = f.email.trim().toLowerCase();
  const emailTaken = !!email && (db.users.some((u) => u.email.toLowerCase() === email) || s.memberRequests.some((r) => r.status === "Pending" && r.email.toLowerCase() === email));
  const missingKyc = MANDATORY_KYC.filter((t) => !docs.some((d) => d.type === t));

  const editUser = (id: string, fn: (u: User) => void, audit?: string) => update((d) => { const u = d.users.find((x) => x.id === id); if (u) fn(u); }, audit);
  const editReq = (id: string, fn: (r: MemberRequest, st: Startup) => void, audit?: string) =>
    update((d) => { const st = d.startups.find((x) => x.id === s.id)!; const r = st.memberRequests.find((x) => x.id === id); if (r) fn(r, st); }, audit);

  const approve = (r: MemberRequest) => update((d) => {
    const st = d.startups.find((x) => x.id === s.id)!;
    const x = st.memberRequests.find((y) => y.id === r.id)!;
    x.status = "Approved";
    d.users.push({ id: uid(), name: r.name, email: r.email, phone: r.phone, designation: r.designation, role: "startup", startupId: s.id, active: true, kyc: r.kyc });
  }, `Approved team member ${r.name} for ${s.name}`);

  const current = members.find((u) => u.id === kycFor);
  const pending = s.memberRequests.filter((r) => r.status === "Pending");

  return (
    <div className="grid gap-6">
      <Card title="Team members" action={
        mode === "startup" ? <Button size="sm" className="min-h-10" onClick={() => { setF(blank); setDocs([]); setReqOpen(true); }}><UserPlus size={16} aria-hidden />Request new member</Button>
          : mode === "admin" ? <Button size="sm" className="min-h-10" onClick={() => { setF(blank); setAddOpen(true); }}><UserPlus size={16} aria-hidden />Add member</Button> : null}>
        {mode === "startup" && <ReadOnlyNote>You can request a new member and upload their KYC documents. SRIIF verifies the documents, approves the member and creates the login. To remove someone, raise a support ticket.</ReadOnlyNote>}
        <Table head={["Name", "Designation", "Email", "e-Verification", "Login", ""]} rows={members.map((u) => {
          const k = kycStatus(u.kyc);
          return [
            <span key="n" className="font-medium text-slate-900">{u.name}</span>, u.designation, u.email,
            <Badge key="k" tone={TONE[k]}>{k === "Verified" ? "KYC verified" : k === "Missing" ? "KYC missing" : k === "Rejected" ? "KYC rejected" : "KYC pending"}</Badge>,
            <Badge key="b" tone={u.active ? "green" : "slate"}>{u.active ? "Active" : "Disabled"}</Badge>,
            <span key="a" className="flex flex-wrap gap-2">
              {mode !== "mentor" && <button className="min-h-10 text-xs font-semibold text-brand underline" onClick={() => setKycFor(u.id)}>KYC documents</button>}
              {mode === "admin" && <button className="min-h-10 text-xs text-slate-600 underline" onClick={() => editUser(u.id, (x) => { x.active = !x.active; }, `${u.active ? "Disabled" : "Enabled"} login for ${u.name}`)}>{u.active ? "Disable login" : "Enable login"}</button>}
            </span>,
          ];
        })} />
      </Card>

      {mode !== "mentor" && (
        <Card title="Member requests">
          <Table head={["Requested", "Name", "Designation", "KYC", "Status", ""]} empty="No member requests." rows={[...s.memberRequests].reverse().map((r) => [
            fmtDate(r.on), <span key="n">{r.name}<span className="block text-xs text-slate-500">{r.email}</span></span>, r.designation,
            <Badge key="k" tone={TONE[kycStatus(r.kyc)]}>{kycStatus(r.kyc)}</Badge>, <Badge key="s">{r.status}</Badge>,
            r.status === "Pending" && mode === "admin" ? (
              <span key="a" className="flex flex-wrap gap-1">
                <Button size="sm" className="min-h-10" onClick={() => setKycFor("req:" + r.id)}>Review KYC</Button>
                <Button size="sm" className="min-h-10" disabled={kycStatus(r.kyc) !== "Verified"} title={kycStatus(r.kyc) !== "Verified" ? "Verify mandatory KYC first" : undefined} onClick={() => approve(r)}>Approve</Button>
                <Button size="sm" variant="outline" className="min-h-10" onClick={() => editReq(r.id, (x) => { x.status = "Rejected"; }, `Rejected member request ${r.name} (${s.name})`)}>Reject</Button>
              </span>
            ) : r.status === "Pending" ? <span key="w" className="flex items-center gap-1 text-xs text-slate-500"><Clock size={14} aria-hidden />Awaiting SRIIF</span> : null,
          ])} />
          {mode === "admin" && pending.some((r) => kycStatus(r.kyc) !== "Verified") && <p className="mt-3 text-xs text-slate-500">Approve is enabled once the mandatory KYC documents are verified.</p>}
        </Card>
      )}

      {/* KYC documents of a member or of a pending request */}
      <Modal wide open={!!kycFor} onClose={() => setKycFor(null)} title={current ? `e-Verification: ${current.name}` : "e-Verification: member request"}>
        {current && (
          <KycList docs={current.kyc ?? []} canUpload={mode === "startup"} canVerify={mode === "admin"}
            onUpload={(t, n) => editUser(current.id, (u) => { u.kyc = upsert(u.kyc ?? [], t, n); }, `Uploaded ${t} for ${current.name}`)}
            onSet={(t, st) => editUser(current.id, (u) => { u.kyc!.find((d) => d.type === t)!.status = st; }, `${st} ${t} of ${current.name}`)} />
        )}
        {kycFor?.startsWith("req:") && (() => {
          const r = s.memberRequests.find((x) => "req:" + x.id === kycFor);
          if (!r) return null;
          return (
            <KycList docs={r.kyc} canUpload={false} canVerify={mode === "admin"} onUpload={() => {}}
              onSet={(t, st) => editReq(r.id, (x) => { x.kyc.find((d) => d.type === t)!.status = st; }, `${st} ${t} of ${r.name} (request)`)} />
          );
        })()}
        <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck size={14} aria-hidden />Documents marked * are mandatory. Demo: only file names are stored.</p>
      </Modal>

      {/* Startup: request a member */}
      <Modal wide open={reqOpen} onClose={() => setReqOpen(false)} title="Request a new team member">
        <form className="grid gap-4" onSubmit={(e) => {
          e.preventDefault();
          if (emailTaken || missingKyc.length) return;
          update((d) => {
            const st = d.startups.find((x) => x.id === s.id)!;
            st.memberRequests.push({ id: uid(), ...f, email: f.email.trim(), kyc: docs, requestedBy: db.users.find((u) => u.startupId === s.id)?.name ?? s.name, on: today(), status: "Pending", note: "" });
          }, `Requested new team member ${f.name} (${s.name})`);
          setReqOpen(false);
        }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name *"><input className="field" required {...bind("name")} /></Field>
            <Field label="Designation *"><input className="field" required {...bind("designation")} /></Field>
            <Field label="Email (login ID) *"><input className="field" type="email" required {...bind("email")} />{emailTaken && <span className="mt-1 block text-xs text-red-600">This email already has an account or a pending request.</span>}</Field>
            <Field label="Mobile *"><input className="field" type="tel" pattern="[6-9][0-9]{9}" required {...bind("phone")} /></Field>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">KYC documents</p>
            <KycList docs={docs} canUpload canVerify={false} onUpload={(t, n) => setDocs(upsert(docs, t, n))} onSet={() => {}} />
            {missingKyc.length > 0 && <p className="mt-2 text-xs text-red-600">Upload: {missingKyc.join(", ")}.</p>}
          </div>
          <Button type="submit" className="min-h-11" disabled={emailTaken || missingKyc.length > 0}>Send request to SRIIF</Button>
        </form>
      </Modal>

      {/* Admin: add directly */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={`Add member to ${s.name}`}>
        <form className="grid gap-3" onSubmit={(e) => {
          e.preventDefault();
          if (emailTaken) return;
          update((d) => { d.users.push({ id: uid(), ...f, email: f.email.trim(), role: "startup", startupId: s.id, active: true, kyc: [] }); }, `Added ${f.name} to ${s.name}`);
          setAddOpen(false);
        }}>
          <Field label="Name"><input className="field" required {...bind("name")} /></Field>
          <Field label="Designation"><input className="field" required {...bind("designation")} /></Field>
          <Field label="Email (login ID)"><input className="field" type="email" required {...bind("email")} />{emailTaken && <span className="text-xs text-red-600">This email already has an account.</span>}</Field>
          <Field label="Mobile"><input className="field" type="tel" pattern="[6-9][0-9]{9}" required {...bind("phone")} /></Field>
          <Button type="submit" disabled={emailTaken}>Add & send login invite</Button>
          <p className="text-xs text-slate-500">The member uploads KYC after first login; you verify it here.</p>
        </form>
      </Modal>
    </div>
  );
}
