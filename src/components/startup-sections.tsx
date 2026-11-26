"use client";

import { Check, Plus, Trash2 } from "lucide-react";

// The eight sections of the "startup login" sheet. Each one is used by:
//  - the startup portal (mode "startup": own data only),
//  - the admin startup detail page (mode "admin": everything, plus admin-only actions),
//  - the mentor view (mode "mentor": read-only, no financial data).
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { DOC_TYPES, SECTORS } from "@/lib/seed";
import { brand } from "@/lib/site";
import { daysUntil, fmtDate, inr, invoiceTotals, today, uid, useStore } from "@/lib/store";
import type { Award, FundingEntry, Startup } from "@/lib/types";
import { Badge, Button, Card, Empty, Field, Modal, readFile, ReadOnlyNote, Stat, Table } from "./ui";

export type Mode = "startup" | "admin" | "mentor";
type P = { s: Startup; mode: Mode };

function useEdit(s: Startup) {
  const { update } = useStore();
  return (fn: (x: Startup) => void, audit?: string) =>
    update((d) => {
      const x = d.startups.find((y) => y.id === s.id);
      if (x) fn(x);
    }, audit ? `${audit} (${s.name})` : undefined);
}

function useForm<T extends object>(init: T) {
  const [f, setF] = useState<T>(init);
  const bind = (k: keyof T) => ({
    value: String(f[k] ?? ""),
    onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }),
  });
  return { f, setF, bind };
}

/* ───────────── 1. Profile ───────────── */
export function ProfileSection({ s, mode }: P) {
  const edit = useEdit(s);
  const canEdit = mode !== "mentor";
  const { f, setF, bind } = useForm({ ...s, sectorsText: "" });
  const [saved, setSaved] = useState(false);

  const save = () => {
    edit((x) => {
      Object.assign(x, {
        name: f.name, logo: f.logo, trl: Number(f.trl), sectors: f.sectors, stage: f.stage, website: f.website, linkedin: f.linkedin,
        regAddress: f.regAddress, commAddress: f.commAddress, email: f.email, phone: f.phone, oneLiner: f.oneLiner,
      });
      if (mode === "admin") Object.assign(x, { program: f.program, cohort: f.cohort, onboardedOn: f.onboardedOn, status: f.status, equityTaken: f.equityTaken });
    }, "Updated startup profile");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card title="Startup profile" action={<a className="text-sm font-semibold text-brand underline" href={`/print/profile?sid=${s.id}`} target="_blank">Startup Profile PDF</a>}>
        {!canEdit && <ReadOnlyNote>Read-only view.</ReadOnlyNote>}
        <fieldset disabled={!canEdit} className="grid gap-4 md:grid-cols-2">
          <Field label="Startup name (as per incorporation)" className="md:col-span-2"><input className="field" {...bind("name")} /></Field>
          <Field label="One-line description" className="md:col-span-2"><input className="field" {...bind("oneLiner")} /></Field>
          <Field label="TRL level" hint="Technology Readiness Level 1–9">
            <select className="field" {...bind("trl")}>{Array.from({ length: 9 }, (_, i) => <option key={i + 1} value={i + 1}>TRL {i + 1}</option>)}</select>
          </Field>
          <Field label="Stage"><select className="field" {...bind("stage")}>{["Idea", "MVP", "Revenue", "Scaling"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <div className="md:col-span-2">
            <p className="mb-1 text-sm font-medium text-slate-700">Sector tags</p>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((t) => {
                const on = f.sectors.includes(t);
                return <button type="button" key={t} onClick={() => setF({ ...f, sectors: on ? f.sectors.filter((y) => y !== t) : [...f.sectors, t] })} className={`rounded-full px-3 py-1 text-xs ring-1 ${on ? "bg-brand text-white ring-brand" : "bg-white text-slate-700 ring-slate-300"}`}>{t}</button>;
              })}
            </div>
          </div>
          <Field label="Program">{mode === "admin" ? <select className="field" {...bind("program")}>{["Pre-Incubation", "Resident Incubation", "Virtual Incubation"].map((x) => <option key={x}>{x}</option>)}</select> : <input className="field" value={s.program} readOnly />}</Field>
          <Field label="Incubation cohort"><input className="field" {...bind("cohort")} readOnly={mode !== "admin"} /></Field>
          <Field label="Onboarding date"><input className="field" type="date" {...bind("onboardedOn")} readOnly={mode !== "admin"} /></Field>
          <Field label="Status">{mode === "admin" ? <select className="field" {...bind("status")}>{["Active", "Graduated", "Exited"].map((x) => <option key={x}>{x}</option>)}</select> : <input className="field" value={s.status} readOnly />}</Field>
          <Field label="Website"><input className="field" type="url" {...bind("website")} /></Field>
          <Field label="LinkedIn / social link"><input className="field" type="url" {...bind("linkedin")} /></Field>
          <Field label="Registered address"><textarea className="field" {...bind("regAddress")} /></Field>
          <Field label="Communication address"><textarea className="field" {...bind("commAddress")} /></Field>
          <Field label="Startup email"><input className="field" type="email" {...bind("email")} /></Field>
          <Field label="Startup phone"><input className="field" {...bind("phone")} /></Field>
          {mode === "admin" && (
            <label className="flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={f.equityTaken} onChange={(e) => setF({ ...f, equityTaken: e.target.checked })} /> SRIIF holds equity in this startup (enables section 3 – cap table)</label>
          )}
        </fieldset>
        {canEdit && <div className="mt-5 flex items-center gap-3"><Button onClick={save}>Save profile</Button>{saved && <span className="text-sm text-emerald-600">Saved</span>}</div>}
      </Card>
      <Card title="Logo">
        <div className="flex h-40 items-center justify-center rounded-lg bg-surface">
          {f.logo ? <Image src={f.logo} alt="Startup logo" width={140} height={140} className="max-h-36 w-auto object-contain" unoptimized /> : <span className="text-5xl font-bold text-brand">{s.name[0]}</span>}
        </div>
        {canEdit && (
          <label className="mt-3 block text-sm">
            <span className="mb-1 block text-slate-600">Upload logo (PNG/JPG, max 1 MB)</span>
            <input type="file" accept="image/png,image/jpeg" className="text-xs" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 1_000_000) return alert("Logo must be under 1 MB");
              setF({ ...f, logo: await readFile(file) });
            }} />
          </label>
        )}
        <p className="mt-4 text-xs text-slate-500">Seat: {s.seat.type} × {s.seat.count} at {inr(s.seat.rate)}/month each.</p>
      </Card>
    </div>
  );
}

/* ───────────── 2. Documents vault ───────────── */
export function DocumentsSection({ s, mode }: P) {
  const edit = useEdit(s);
  const [type, setType] = useState(DOC_TYPES[0].type);
  const [expiry, setExpiry] = useState("");
  const [err, setErr] = useState("");
  const visible = mode === "mentor" ? s.docs.filter((d) => !d.financial) : s.docs;
  const soon = (d?: string) => !!d && daysUntil(d) < 45;

  const upload = (file?: File) => {
    setErr("");
    if (!file) return;
    if (file.type !== "application/pdf") return setErr("Only PDF files are allowed.");
    if (file.size > 10_000_000) return setErr("Max file size is 10 MB.");
    const meta = DOC_TYPES.find((t) => t.type === type)!;
    edit((x) => {
      const prev = x.docs.filter((d) => d.type === type);
      const version = prev.length ? Math.max(...prev.map((d) => d.version)) + 1 : 1;
      x.docs.push({ id: uid(), type, name: file.name, version, uploadedOn: today(), expiry: expiry || undefined, financial: meta.financial });
    }, `Uploaded ${type}`);
    setExpiry("");
  };

  const latest = DOC_TYPES.map((t) => ({ ...t, doc: visible.filter((d) => d.type === t.type).sort((a, b) => b.version - a.version)[0] })).filter((t) => mode !== "mentor" || !t.financial);

  return (
    <div className="grid gap-6">
      {mode === "mentor" && <ReadOnlyNote>Mentors see only non-financial documents.</ReadOnlyNote>}
      {mode !== "mentor" && (
        <Card title="Upload a document">
          <div className="grid items-end gap-3 md:grid-cols-[2fr_1fr_1fr]">
            <Field label="Document type"><select className="field" value={type} onChange={(e) => setType(e.target.value)}>{DOC_TYPES.map((t) => <option key={t.type}>{t.type}{t.mandatory ? " *" : ""}</option>)}</select></Field>
            <Field label="Expiry date (if any)"><input type="date" className="field" value={expiry} onChange={(e) => setExpiry(e.target.value)} /></Field>
            <label className="cursor-pointer rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-dark">Choose PDF<input type="file" accept="application/pdf" className="sr-only" onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} /></label>
          </div>
          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          <p className="mt-2 text-xs text-slate-500">PDF only, 10 MB max. Uploading the same type again creates a new version (v1, v2…). * = mandatory.</p>
        </Card>
      )}
      <Card title="Checklist">
        <Table head={["Document", "Status", "Latest file", "Version", "Expiry"]} rows={latest.map((t) => [
          <span key="t">{t.type}{t.mandatory && <span className="text-red-500"> *</span>}</span>,
          t.doc ? <Badge tone="green">Uploaded</Badge> : t.mandatory ? <Badge tone="red">Missing</Badge> : <Badge>Optional</Badge>,
          t.doc?.name ?? "—",
          t.doc ? `v${t.doc.version}` : "—",
          t.doc?.expiry ? <span className={soon(t.doc.expiry) ? "font-semibold text-red-600" : ""}>{fmtDate(t.doc.expiry)}{soon(t.doc.expiry) && " · renew soon"}</span> : "—",
        ])} />
      </Card>
      <Card title="All versions">
        <Table head={["Type", "File", "Version", "Uploaded"]} rows={[...visible].sort((a, b) => b.uploadedOn.localeCompare(a.uploadedOn)).map((d) => [d.type, d.name, `v${d.version}`, fmtDate(d.uploadedOn)])} />
      </Card>
    </div>
  );
}

/* ───────────── 3. Cap table ───────────── */
export function CapTableSection({ s, mode }: P) {
  const edit = useEdit(s);
  const canEdit = mode !== "mentor";
  const [founders, setFounders] = useState(s.founders);
  const [holdings, setHoldings] = useState(s.holdings);
  const [classes, setClasses] = useState(s.shareClasses);
  const total = holdings.reduce((a, h) => a + Number(h.pct || 0), 0);

  if (mode === "mentor") return <Empty>Cap table is financial data and is not shown to mentors.</Empty>;
  if (!s.equityTaken) return <Empty>SRIIF does not hold equity in this startup, so the cap table is not required. Founder details are kept in the profile.</Empty>;

  return (
    <div className="grid gap-6">
      <Card title="Founders & directors">
        <Table head={["Name", "Designation", "Equity %", "DIN", ""]} rows={founders.map((fd, i) => [
          <input key="n" className="field" value={fd.name} onChange={(e) => setFounders(founders.map((y, j) => j === i ? { ...y, name: e.target.value } : y))} />,
          <input key="d" className="field" value={fd.designation} onChange={(e) => setFounders(founders.map((y, j) => j === i ? { ...y, designation: e.target.value } : y))} />,
          <input key="e" className="field w-20" type="number" min={0} max={100} value={fd.equity} onChange={(e) => setFounders(founders.map((y, j) => j === i ? { ...y, equity: Number(e.target.value) } : y))} />,
          <input key="i" className="field w-28" value={fd.din} placeholder="if director" onChange={(e) => setFounders(founders.map((y, j) => j === i ? { ...y, din: e.target.value } : y))} />,
          <button key="x" className="text-xs text-red-600" onClick={() => setFounders(founders.filter((_, j) => j !== i))}>Remove</button>,
        ])} />
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setFounders([...founders, { name: "", designation: "", equity: 0, din: "" }])}>+ Add founder</Button>
      </Card>
      <Card title="Shareholding pattern" action={<span className={total === 100 ? "text-sm text-emerald-600" : "text-sm font-semibold text-red-600"}>Total {total}%</span>}>
        <Table head={["Holder", "Category", "%", ""]} rows={holdings.map((h, i) => [
          <input key="h" className="field" value={h.holder} onChange={(e) => setHoldings(holdings.map((y, j) => j === i ? { ...y, holder: e.target.value } : y))} />,
          <select key="c" className="field" value={h.category} onChange={(e) => setHoldings(holdings.map((y, j) => j === i ? { ...y, category: e.target.value as typeof h.category } : y))}>{["Founder", "ESOP pool", "Investor", "SRIIF", "Other"].map((c) => <option key={c}>{c}</option>)}</select>,
          <input key="p" className="field w-20" type="number" step="0.01" value={h.pct} onChange={(e) => setHoldings(holdings.map((y, j) => j === i ? { ...y, pct: Number(e.target.value) } : y))} />,
          <button key="x" className="text-xs text-red-600" onClick={() => setHoldings(holdings.filter((_, j) => j !== i))}>Remove</button>,
        ])} />
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setHoldings([...holdings, { holder: "", category: "Investor", pct: 0 }])}>+ Add row</Button>
        <Field label="Share class details" className="mt-4"><textarea className="field" value={classes} onChange={(e) => setClasses(e.target.value)} /></Field>
        <label className="mt-4 block text-sm">Latest cap table document (CSV/PDF): <b>{s.capTableFile ?? "none"}</b>
          <input type="file" accept=".csv,application/pdf" className="ml-2 text-xs" onChange={(e) => { const n = e.target.files?.[0]?.name; if (n) edit((x) => { x.capTableFile = n; }, "Uploaded cap table"); }} />
        </label>
      </Card>
      {canEdit && <div><Button disabled={total !== 100} onClick={() => edit((x) => { x.founders = founders; x.holdings = holdings; x.shareClasses = classes; }, "Updated cap table")}>Save cap table</Button>{total !== 100 && <span className="ml-3 text-sm text-red-600">Shareholding must add up to 100%.</span>}</div>}
    </div>
  );
}

/* ───────────── 4. Funding ───────────── */
export function FundingSection({ s, mode }: P) {
  const edit = useEdit(s);
  const [open, setOpen] = useState(false);
  const blank: Omit<FundingEntry, "id"> = { amount: 0, currency: "INR", type: "Grant", source: "", date: today(), round: "Not applicable" };
  const { f, setF, bind } = useForm(blank);
  if (mode === "mentor") return <Empty>Funding details are financial data and are not shown to mentors.</Empty>;

  const totalInr = s.funding.filter((x) => x.currency === "INR").reduce((a, x) => a + x.amount, 0);
  const byType = Object.entries(s.funding.reduce<Record<string, number>>((a, x) => ({ ...a, [x.type]: (a[x.type] ?? 0) + x.amount }), {}));
  const max = Math.max(1, ...byType.map(([, v]) => v));
  const lastDate = s.funding.map((x) => x.date).sort().at(-1);
  const stale = !lastDate || daysUntil(lastDate) < -90;

  return (
    <div className="grid gap-6">
      {stale && mode === "startup" && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Reminder: please update your funding details every quarter.</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total funding (INR)" value={inr(totalInr)} />
        <Stat label="Entries" value={s.funding.length} />
        <Stat label="Last update" value={fmtDate(lastDate)} />
      </div>
      <Card title="Funding by type">
        {byType.length === 0 ? <Empty>No funding recorded.</Empty> : byType.map(([k, v]) => (
          <div key={k} className="mb-2 flex items-center gap-3 text-sm">
            <span className="w-28 shrink-0">{k}</span>
            <div className="h-5 flex-1 rounded bg-slate-100"><div className="h-5 rounded bg-brand" style={{ width: `${(v / max) * 100}%` }} /></div>
            <span className="w-28 text-right font-medium">{inr(v)}</span>
          </div>
        ))}
      </Card>
      <Card title="Funding secured" action={<Button size="sm" onClick={() => { setF(blank); setOpen(true); }}>+ Add funding</Button>}>
        <Table head={["Date", "Source", "Type", "Round", "Amount", "Proof", ""]} rows={s.funding.map((x) => [
          fmtDate(x.date), x.source, x.type, x.round, `${x.currency === "INR" ? inr(x.amount) : "$" + x.amount.toLocaleString()}`, x.proof ?? "—",
          <button key="d" className="text-xs text-red-600" onClick={() => edit((y) => { y.funding = y.funding.filter((z) => z.id !== x.id); }, "Removed funding entry")}>Delete</button>,
        ])} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Add funding">
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); edit((y) => { y.funding.push({ ...f, id: uid(), amount: Number(f.amount) }); }, `Added funding ${f.source}`); setOpen(false); }}>
          <Field label="Amount"><input className="field" type="number" min={1} required {...bind("amount")} /></Field>
          <Field label="Currency"><select className="field" {...bind("currency")}><option>INR</option><option>USD</option></select></Field>
          <Field label="Type"><select className="field" {...bind("type")}>{["Grant", "Angel", "VC", "Debt", "CSR", "Bootstrapped"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Round"><select className="field" {...bind("round")}>{["Not applicable", "Pre-seed", "Seed", "Series A", "Series B+"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Investor / grant agency" className="sm:col-span-2"><input className="field" required {...bind("source")} /></Field>
          <Field label="Date received"><input className="field" type="date" required {...bind("date")} /></Field>
          <Field label="Proof (term sheet / grant letter)"><input type="file" accept="application/pdf" className="text-xs" onChange={(e) => setF({ ...f, proof: e.target.files?.[0]?.name })} /></Field>
          <Button type="submit" className="sm:col-span-2">Save</Button>
        </form>
      </Modal>
    </div>
  );
}

/* ───────────── 5. Awards & media ───────────── */
export function AwardsSection({ s, mode }: P) {
  const edit = useEdit(s);
  const [open, setOpen] = useState(false);
  const blank: Omit<Award, "id"> = { kind: "Award", title: "", org: "", year: String(new Date().getFullYear()), category: "", link: "" };
  const { f, setF, bind } = useForm(blank);
  const kinds: Award["kind"][] = ["Award", "Achievement", "Media", "Association"];
  const labels: Record<Award["kind"], string> = { Award: "Awards", Achievement: "Achievements", Media: "Media mentions", Association: "StartupTN / other incubator associations" };
  return (
    <div className="grid gap-6">
      {mode !== "mentor" && <div><Button onClick={() => { setF(blank); setOpen(true); }}>+ Add entry</Button></div>}
      {kinds.map((k) => (
        <Card key={k} title={labels[k]}>
          <Table head={["Title", "Organiser", "Year", "Category", "Link", ""]} rows={s.awards.filter((a) => a.kind === k).map((a) => [
            a.title, a.org, a.year, a.category, a.link ? <a key="l" className="text-brand underline" href={a.link} target="_blank" rel="noreferrer">Open</a> : "—",
            mode !== "mentor" ? <button key="d" className="text-xs text-red-600" onClick={() => edit((x) => { x.awards = x.awards.filter((y) => y.id !== a.id); })}>Delete</button> : null,
          ])} />
        </Card>
      ))}
      <Modal open={open} onClose={() => setOpen(false)} title="Add award, achievement or media">
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); edit((x) => { x.awards.push({ ...f, id: uid() }); }, `Added ${f.kind.toLowerCase()}`); setOpen(false); }}>
          <Field label="Kind"><select className="field" {...bind("kind")}>{kinds.map((k) => <option key={k}>{k}</option>)}</select></Field>
          <Field label="Title / name"><input className="field" required {...bind("title")} /></Field>
          <Field label="Organiser / outlet"><input className="field" {...bind("org")} /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="Year"><input className="field" {...bind("year")} /></Field><Field label="Category"><input className="field" placeholder="e.g. patent filed, clinical pilot" {...bind("category")} /></Field></div>
          <Field label="Link (media)"><input className="field" type="url" {...bind("link")} /></Field>
          <Button type="submit">Save</Button>
        </form>
      </Modal>
    </div>
  );
}

/* ───────────── 6. Progress & reviews ───────────── */
const QUARTERS = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026", "Q1 2027"];
const ANNUAL_DOCS = ["Annual progress report", "Audited financials", "Pitch deck (updated)", "Product roadmap"];

export function ProgressSection({ s, mode }: P) {
  const edit = useEdit(s);
  const { user } = useStore();
  const [open, setOpen] = useState(false);
  const { f, setF, bind } = useForm({ period: QUARTERS.find((q) => !s.reports.some((r) => r.period === q)) ?? QUARTERS[0], milestones: "", users: "0", revenue: "0", pilots: "0", partnerships: "0", challenges: "", support: "" });
  const year = String(new Date().getFullYear());
  const annual = s.annual.find((a) => a.year === year);
  const dup = s.reports.some((r) => r.period === f.period);

  return (
    <div className="grid gap-6">
      <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-800">Quarterly report due by the 10th after each quarter. Annual review documents due every year after onboarding ({fmtDate(s.onboardedOn)}).</p>
      <Card title="Quarterly progress reports" action={mode === "startup" && <Button size="sm" onClick={() => setOpen(true)}>+ Submit report</Button>}>
        <Table head={["Period", "Milestones", "Users", "Revenue", "Pilots", "Partners", "Support needed", ""]} rows={[...s.reports].reverse().map((r) => [
          <b key="p">{r.period}</b>, r.milestones, r.users, mode === "mentor" ? "—" : inr(r.revenue), r.pilots, r.partnerships, r.support,
          <a key="pdf" className="text-xs text-brand underline" href={`/print/quarterly?sid=${s.id}&rid=${r.id}`} target="_blank">PDF</a>,
        ])} />
      </Card>
      <Card title={`Yearly review ${year}`} action={<a className="text-sm text-brand underline" href={`/print/annual?sid=${s.id}&year=${year}`} target="_blank">Annual Review Summary PDF</a>}>
        <div className="grid gap-3 md:grid-cols-2">
          {ANNUAL_DOCS.map((t) => {
            const file = annual?.files.find((x) => x.type === t);
            const hidden = mode === "mentor" && t === "Audited financials";
            return (
              <div key={t} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm">
                <span>{t}<br /><span className="text-xs text-slate-500">{hidden ? "Hidden for mentors" : file ? `${file.name} · ${fmtDate(file.uploadedOn)}` : "Not uploaded"}</span></span>
                {mode === "startup" && (
                  <label className="cursor-pointer text-xs font-semibold text-brand underline">Upload<input type="file" accept="application/pdf" className="sr-only" onChange={(e) => {
                    const n = e.target.files?.[0]?.name;
                    if (!n) return;
                    edit((x) => {
                      let a = x.annual.find((y) => y.year === year);
                      if (!a) { a = { year, files: [] }; x.annual.push(a); }
                      a.files = a.files.filter((y) => y.type !== t).concat({ type: t, name: n, uploadedOn: today() });
                    }, `Uploaded ${t}`);
                  }} /></label>
                )}
              </div>
            );
          })}
        </div>
        <Scorecard s={s} mode={mode} year={year} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Quarterly progress report" wide>
        <form className="grid gap-3 md:grid-cols-4" onSubmit={(e) => {
          e.preventDefault();
          if (dup) return;
          edit((x) => { x.reports.push({ id: uid(), period: f.period, milestones: f.milestones, users: +f.users, revenue: +f.revenue, pilots: +f.pilots, partnerships: +f.partnerships, challenges: f.challenges, support: f.support, submittedOn: today(), submittedBy: user?.name ?? "" }); }, `Submitted ${f.period} report`);
          setOpen(false);
          setF({ ...f, milestones: "", challenges: "", support: "" });
        }}>
          <Field label="Period" className="md:col-span-4"><select className="field" {...bind("period")}>{QUARTERS.map((q) => <option key={q}>{q}</option>)}</select>{dup && <span className="text-xs text-red-600">Already submitted for this period.</span>}</Field>
          <Field label="Milestones achieved" className="md:col-span-4"><textarea className="field" required {...bind("milestones")} /></Field>
          <Field label="Users"><input className="field" type="number" min={0} {...bind("users")} /></Field>
          <Field label="Revenue (₹)"><input className="field" type="number" min={0} {...bind("revenue")} /></Field>
          <Field label="Pilots"><input className="field" type="number" min={0} {...bind("pilots")} /></Field>
          <Field label="Partnerships"><input className="field" type="number" min={0} {...bind("partnerships")} /></Field>
          <Field label="Challenges" className="md:col-span-2"><textarea className="field" {...bind("challenges")} /></Field>
          <Field label="Support required from SRIIF" className="md:col-span-2"><textarea className="field" {...bind("support")} /></Field>
          <Button type="submit" disabled={dup} className="md:col-span-4">Submit report</Button>
        </form>
      </Modal>
    </div>
  );
}

const RUBRIC = ["team", "product", "market", "execution", "compliance"] as const;

function Scorecard({ s, mode, year }: P & { year: string }) {
  const edit = useEdit(s);
  const { user } = useStore();
  const a = s.annual.find((x) => x.year === year);
  const [sc, setSc] = useState(a?.score ?? { team: 3, product: 3, market: 3, execution: 3, compliance: 3, note: "", by: "" });
  const [decision, setDecision] = useState(a?.decision ?? "Continue");
  const avg = (RUBRIC.reduce((t, k) => t + Number(sc[k]), 0) / RUBRIC.length).toFixed(1);

  if (mode !== "admin") {
    if (!a?.score) return <p className="mt-4 text-sm text-slate-500">Review scorecard: not yet reviewed by SRIIF.</p>;
    return (
      <div className="mt-4 rounded-lg bg-surface p-4 text-sm">
        <p className="font-semibold">SRIIF review scorecard · decision: <Badge tone="blue">{a.decision ?? "—"}</Badge></p>
        <p className="mt-1">{RUBRIC.map((k) => `${k[0].toUpperCase() + k.slice(1)} ${a.score![k]}/5`).join(" · ")}</p>
        {a.score.note && <p className="mt-1 text-slate-600">“{a.score.note}”</p>}
      </div>
    );
  }
  return (
    <div className="mt-6 rounded-lg border border-brand/20 bg-surface p-4">
      <p className="mb-3 font-semibold text-brand-dark">Review scorecard (admin) · average {avg}/5</p>
      <div className="grid gap-3 sm:grid-cols-5">
        {RUBRIC.map((k) => (
          <Field key={k} label={k[0].toUpperCase() + k.slice(1)}><select className="field" value={sc[k]} onChange={(e) => setSc({ ...sc, [k]: Number(e.target.value) })}>{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select></Field>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_200px]">
        <Field label="Comments"><textarea className="field" value={sc.note} onChange={(e) => setSc({ ...sc, note: e.target.value })} /></Field>
        <Field label="Decision"><select className="field" value={decision} onChange={(e) => setDecision(e.target.value as typeof decision)}>{["Continue", "Extend", "Graduate", "Exit"].map((d) => <option key={d}>{d}</option>)}</select></Field>
      </div>
      <Button className="mt-3" onClick={() => edit((x) => {
        let r = x.annual.find((y) => y.year === year);
        if (!r) { r = { year, files: [] }; x.annual.push(r); }
        r.score = { ...sc, by: user?.name ?? "" };
        r.decision = decision;
        if (decision === "Graduate") x.status = "Graduated";
        if (decision === "Exit") x.status = "Exited";
      }, `Saved ${year} review (${decision})`)}>Save review</Button>
    </div>
  );
}

/* ───────────── 7. Mentorship ───────────── */
export function MentorshipSection({ s, mode }: P) {
  const { db, user } = useStore();
  const edit = useEdit(s);
  const mentors = db.users.filter((u) => u.role === "mentor" && u.active);
  const assigned = mentors.filter((m) => s.mentorIds.includes(m.id));
  const [open, setOpen] = useState(false);
  const { f, bind } = useForm({ mentorId: assigned[0]?.id ?? "", date: "", time: "11:00", agenda: "" });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const meetings = mode === "mentor" ? s.meetings.filter((m) => m.mentorId === user?.id) : s.meetings;
  const name = (id: string) => db.users.find((u) => u.id === id)?.name ?? "—";

  return (
    <div className="grid gap-6">
      <Card title="Assigned mentors">
        {mode === "admin" ? (
          <div className="flex flex-wrap gap-2">
            {mentors.map((m) => {
              const on = s.mentorIds.includes(m.id);
              return <button key={m.id} onClick={() => edit((x) => { x.mentorIds = on ? x.mentorIds.filter((y) => y !== m.id) : [...x.mentorIds, m.id]; }, `${on ? "Unassigned" : "Assigned"} mentor ${m.name}`)} aria-pressed={on} className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm ring-1 transition-colors ${on ? "bg-brand text-white ring-brand" : "ring-slate-300 hover:bg-slate-50"}`}>{on ? <Check size={14} aria-hidden /> : <Plus size={14} aria-hidden />}{m.name}</button>;
            })}
          </div>
        ) : assigned.length === 0 ? <Empty>No mentor assigned yet. Raise a ticket under “Mentor request”.</Empty> : (
          <div className="grid gap-3 sm:grid-cols-2">{assigned.map((m) => <div key={m.id} className="rounded-lg bg-surface p-3 text-sm"><b>{m.name}</b><br />{m.designation}<br /><span className="text-xs text-slate-500">{m.expertise}</span></div>)}</div>
        )}
        {mode === "admin" && <p className="mt-2 text-xs text-slate-500">Only admins assign mentors.</p>}
      </Card>
      <Card title="Meetings" action={mode === "startup" && assigned.length > 0 && <Button size="sm" onClick={() => setOpen(true)}>+ Request meeting</Button>}>
        <Table head={["Date", "Mentor", "Agenda", "Status", "Notes / minutes", ""]} rows={[...meetings].sort((a, b) => b.date.localeCompare(a.date)).map((m) => [
          `${fmtDate(m.date)} ${m.time}`, name(m.mentorId), m.agenda, <Badge key="s">{m.status}</Badge>,
          mode === "mentor" && m.status !== "Cancelled" ? <textarea key="n" className="field min-w-48" defaultValue={m.notes} onChange={(e) => setNotes({ ...notes, [m.id]: e.target.value })} /> : (m.notes || "—"),
          <span key="a" className="flex flex-col gap-1">
            {mode === "mentor" && m.status === "Requested" && <Button size="sm" onClick={() => edit((x) => { x.meetings.find((y) => y.id === m.id)!.status = "Confirmed"; }, "Confirmed mentor meeting")}>Confirm</Button>}
            {mode === "mentor" && m.status !== "Cancelled" && <Button size="sm" variant="outline" onClick={() => edit((x) => { const y = x.meetings.find((z) => z.id === m.id)!; y.notes = notes[m.id] ?? y.notes; y.status = "Done"; }, "Saved meeting notes")}>Save notes & mark done</Button>}
            {mode === "startup" && m.status === "Requested" && <button className="text-xs text-red-600" onClick={() => edit((x) => { x.meetings.find((y) => y.id === m.id)!.status = "Cancelled"; })}>Cancel</button>}
          </span>,
        ])} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Request a mentor meeting">
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); edit((x) => { x.meetings.push({ id: uid(), mentorId: f.mentorId, date: f.date, time: f.time, agenda: f.agenda, status: "Requested", notes: "" }); }, "Requested mentor meeting"); setOpen(false); }}>
          <Field label="Mentor"><select className="field" {...bind("mentorId")}>{assigned.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="Date"><input className="field" type="date" min={today()} required {...bind("date")} /></Field><Field label="Time"><input className="field" type="time" required {...bind("time")} /></Field></div>
          <Field label="Agenda"><textarea className="field" required {...bind("agenda")} /></Field>
          <Button type="submit">Send request</Button>
        </form>
      </Modal>
    </div>
  );
}

/* ───────────── 8. Space & facilities ───────────── */
export function FacilitiesSection({ s, mode }: P) {
  const { db } = useStore();
  const edit = useEdit(s);
  const [open, setOpen] = useState(false);
  const { f, bind } = useForm({ facility: db.facilities[0], date: "", slot: "10:00–12:00", purpose: "" });
  const clash = s.bookings.some((b) => b.facility === f.facility && b.date === f.date && b.slot === f.slot && b.status !== "Rejected");
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Seat type" value={s.seat.type} />
        <Stat label="Seats" value={s.seat.count} />
        <Stat label="Access card" value={s.status === "Active" ? "Active" : "Revoked"} note="Issued by SRIIF office" />
      </div>
      <Card title="Facility bookings" action={mode === "startup" && <Button size="sm" onClick={() => setOpen(true)}>+ Book facility</Button>}>
        <Table head={["Date", "Facility", "Slot", "Purpose", "Status", ""]} rows={[...s.bookings].sort((a, b) => b.date.localeCompare(a.date)).map((b) => [
          fmtDate(b.date), b.facility, b.slot, b.purpose, <Badge key="s">{b.status}</Badge>,
          mode === "admin" && b.status === "Pending" ? <span key="a" className="flex gap-1"><Button size="sm" onClick={() => edit((x) => { x.bookings.find((y) => y.id === b.id)!.status = "Approved"; }, `Approved booking ${b.facility}`)}>Approve</Button><Button size="sm" variant="outline" onClick={() => edit((x) => { x.bookings.find((y) => y.id === b.id)!.status = "Rejected"; }, `Rejected booking ${b.facility}`)}>Reject</Button></span> : null,
        ])} />
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Book a facility">
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); if (clash) return; edit((x) => { x.bookings.push({ id: uid(), ...f, status: "Pending" }); }, `Requested booking ${f.facility}`); setOpen(false); }}>
          <Field label="Facility"><select className="field" {...bind("facility")}>{db.facilities.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input className="field" type="date" min={today()} required {...bind("date")} /></Field>
            <Field label="Slot"><select className="field" {...bind("slot")}>{["09:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–17:00", "Full day"].map((x) => <option key={x}>{x}</option>)}</select></Field>
          </div>
          <Field label="Purpose"><input className="field" required {...bind("purpose")} /></Field>
          {clash && <p className="text-sm text-red-600">You already have this slot booked.</p>}
          <Button type="submit" disabled={clash}>Request booking</Button>
          <p className="text-xs text-slate-500">SRIIF approves each booking. Lab usage is added to your monthly invoice.</p>
        </form>
      </Modal>
    </div>
  );
}

/* ───────────── Invoices ───────────── */
export function InvoicesSection({ s, mode }: P) {
  const edit = useEdit(s);
  const [pay, setPay] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [lines, setLines] = useState([{ label: `${s.seat.type} × ${s.seat.count}`, amount: s.seat.rate * s.seat.count }]);
  const [period, setPeriod] = useState(new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }));
  if (mode === "mentor") return <Empty>Not available for mentors.</Empty>;
  const shown = (i: Startup["invoices"][number]) => i.status === "Due" && i.utr ? "Pending" : i.status === "Due" && i.due < today() ? "Overdue" : i.status;
  const due = s.invoices.filter((i) => i.status === "Due").reduce((a, i) => a + invoiceTotals(i.lines, brand.gstRate).total, 0);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Outstanding" value={inr(due)} />
        <Stat label="Invoices" value={s.invoices.length} />
        <Stat label="Monthly rent" value={inr(s.seat.rate * s.seat.count)} note="+ 18% GST" />
      </div>
      <Card title="Monthly invoices" action={mode === "admin" && <Button size="sm" onClick={() => setNewOpen(true)}>+ Raise invoice</Button>}>
        <Table head={["Invoice", "Period", "Due", "Total (incl. GST)", "Status", "Documents", ""]} rows={[...s.invoices].reverse().map((i) => {
          const t = invoiceTotals(i.lines, brand.gstRate);
          const st = shown(i);
          return [
            i.no, i.period, fmtDate(i.due), inr(t.total), <Badge key="b">{st}</Badge>,
            <span key="d" className="flex flex-col text-xs">
              <a className="text-brand underline" href={`/print/invoice?sid=${s.id}&iid=${i.id}`} target="_blank">Invoice PDF</a>
              {i.status === "Paid" && <a className="text-brand underline" href={`/print/receipt?sid=${s.id}&iid=${i.id}`} target="_blank">Receipt PDF</a>}
            </span>,
            <span key="a">
              {mode === "startup" && i.status === "Due" && !i.utr && <Button size="sm" onClick={() => { setPay(i.id); setUtr(""); }}>Pay</Button>}
              {mode === "startup" && st === "Pending" && <span className="text-xs text-slate-500">Awaiting SRIIF verification</span>}
              {mode === "admin" && i.status === "Due" && (
                <span className="flex flex-col gap-1">
                  {i.utr && <span className="text-xs">UTR: {i.utr}</span>}
                  <Button size="sm" onClick={() => edit((x) => { const y = x.invoices.find((z) => z.id === i.id)!; y.status = "Paid"; y.paidOn = today(); y.receiptNo = "RCPT-" + y.no.split("/").pop(); }, `Marked ${i.no} paid`)}>Mark paid</Button>
                  <Button size="sm" variant="outline" onClick={() => edit((x) => { x.invoices.find((z) => z.id === i.id)!.status = "Waived"; }, `Waived ${i.no}`)}>Waive</Button>
                </span>
              )}
            </span>,
          ];
        })} />
      </Card>
      <Modal open={!!pay} onClose={() => setPay(null)} title="Pay invoice">
        <div className="grid gap-3 text-sm">
          <p>Pay by UPI or bank transfer to <b>SRIIF</b>, then enter the transaction reference (UTR). SRIIF verifies it and issues the receipt.</p>
          <div className="rounded-lg bg-surface p-3 text-xs">UPI: sriif@sbi · A/C 0000 0000 0000 · IFSC SBIN0000000 (demo)</div>
          <Field label="UTR / transaction reference"><input className="field" value={utr} onChange={(e) => setUtr(e.target.value)} /></Field>
          <Button disabled={utr.trim().length < 6} onClick={() => { edit((x) => { x.invoices.find((z) => z.id === pay)!.utr = utr.trim(); }, "Submitted payment reference"); setPay(null); }}>Submit payment reference</Button>
        </div>
      </Modal>
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Raise monthly invoice">
        <div className="grid gap-3">
          <Field label="Period"><input className="field" value={period} onChange={(e) => setPeriod(e.target.value)} /></Field>
          {lines.map((l, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_auto] gap-2">
              <input className="field" value={l.label} onChange={(e) => setLines(lines.map((y, j) => j === i ? { ...y, label: e.target.value } : y))} />
              <input className="field" type="number" value={l.amount} onChange={(e) => setLines(lines.map((y, j) => j === i ? { ...y, amount: Number(e.target.value) } : y))} />
              <button aria-label="Remove line" className="flex h-11 w-11 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" onClick={() => setLines(lines.filter((_, j) => j !== i))}><Trash2 size={16} aria-hidden /></button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setLines([...lines, { label: "Lab usage", amount: 0 }])}>+ Line</Button>
          <p className="text-sm">Total with GST: <b>{inr(invoiceTotals(lines, brand.gstRate).total)}</b></p>
          <Button onClick={() => {
            const n = String(Date.now()).slice(-4);
            const issued = today();
            const due = new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10);
            edit((x) => { x.invoices.push({ id: uid(), no: `SRIIF/${new Date().getFullYear()}/${n}`, period, issued, due, lines, status: "Due" }); }, `Raised invoice for ${period}`);
            setNewOpen(false);
          }}>Raise invoice</Button>
        </div>
      </Modal>
    </div>
  );
}

/* ───────────── Team (admin manages; startup read-only) ───────────── */
export function TeamSection({ s, mode }: P) {
  const { db, update } = useStore();
  const members = db.users.filter((u) => u.startupId === s.id);
  const [open, setOpen] = useState(false);
  const { f, setF, bind } = useForm({ name: "", email: "", phone: "", designation: "" });
  const emailTaken = db.users.some((u) => u.email.toLowerCase() === f.email.trim().toLowerCase());
  return (
    <Card title="Team members" action={mode === "admin" && <Button size="sm" onClick={() => setOpen(true)}>+ Add member</Button>}>
      {mode === "startup" && <ReadOnlyNote>Only SRIIF admins can add or remove team members. Need a change? Raise a support ticket.</ReadOnlyNote>}
      <Table head={["Name", "Designation", "Email", "Phone", "Login", ""]} rows={members.map((u) => [
        u.name, u.designation, u.email, u.phone, <Badge key="b" tone={u.active ? "green" : "slate"}>{u.active ? "Active" : "Disabled"}</Badge>,
        mode === "admin" ? <button key="t" className="text-xs text-brand underline" onClick={() => update((d) => { const x = d.users.find((y) => y.id === u.id)!; x.active = !x.active; }, `${u.active ? "Disabled" : "Enabled"} login for ${u.name}`)}>{u.active ? "Disable login" : "Enable login"}</button> : null,
      ])} />
      <Modal open={open} onClose={() => setOpen(false)} title={`Add member to ${s.name}`}>
        <form className="grid gap-3" onSubmit={(e) => {
          e.preventDefault();
          if (emailTaken) return;
          update((d) => { d.users.push({ id: uid(), ...f, email: f.email.trim(), role: "startup", startupId: s.id, active: true }); }, `Added ${f.name} to ${s.name}`);
          setF({ name: "", email: "", phone: "", designation: "" });
          setOpen(false);
        }}>
          <Field label="Name"><input className="field" required {...bind("name")} /></Field>
          <Field label="Designation"><input className="field" required {...bind("designation")} /></Field>
          <Field label="Email (login ID)"><input className="field" type="email" required {...bind("email")} />{emailTaken && <span className="text-xs text-red-600">This email already has an account.</span>}</Field>
          <Field label="Mobile"><input className="field" pattern="[6-9][0-9]{9}" required {...bind("phone")} /></Field>
          <Button type="submit" disabled={emailTaken}>Add & send login invite</Button>
        </form>
      </Modal>
    </Card>
  );
}

/* ───────────── Letters & reports (Excel "Home" sheet PDFs) ───────────── */
export function LettersSection({ s }: { s: Startup }) {
  const docs: [string, string, ReactNode][] = [
    ["Startup Profile", `/print/profile?sid=${s.id}`, "Auto-generated from your profile, for SRIIF records."],
    ["Incubation Offer Letter", `/print/offer?sid=${s.id}`, "Template-based offer letter."],
    ["Incubation Agreement Pack", `/print/agreement?sid=${s.id}`, "Agreement, NDA and annexures merged."],
    ["Quarterly Progress Report", `/print/quarterly?sid=${s.id}`, "Latest submitted quarter."],
    ["Annual Review Summary", `/print/annual?sid=${s.id}&year=${new Date().getFullYear()}`, "Yearly review and scorecard."],
    ["Graduation Certificate / Exit Letter", `/print/exit?sid=${s.id}`, s.status === "Active" ? "Available after graduation or exit." : "Ready."],
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {docs.map(([t, href, d]) => {
        const locked = t.startsWith("Graduation") && s.status === "Active";
        return (
          <div key={t} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div><p className="font-semibold">{t}</p><p className="text-xs text-slate-500">{d}</p></div>
            {locked ? <Badge>Locked</Badge> : <a className="shrink-0 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white" href={href} target="_blank">Open PDF</a>}
          </div>
        );
      })}
      <p className="text-xs text-slate-500 sm:col-span-2">Monthly invoices and payment receipts are under Invoices & payments.</p>
    </div>
  );
}
