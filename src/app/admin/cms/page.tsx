"use client";

// Website content manager: pop-up, impact numbers, events and brochures, gallery, testimonials, board, social links.
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GALLERY_CATS } from "@/components/gallery";
import { Badge, Button, Card, cx, Field, Modal, PageTitle, readFile, Table } from "@/components/ui";
import { fmtDate, uid, useStore } from "@/lib/store";
import type { Cms, EventCategory } from "@/lib/types";

const TABS = ["Hero slider", "Startup showcase", "Pop-up", "Impact numbers", "Events", "Gallery", "Testimonials", "Board", "Social links"] as const;
const EVENT_CATS: EventCategory[] = ["Demo Day", "Workshop", "Investor Connect", "Meetup", "Hackathon", "Clinic"];
const MAX_IMG = 800_000;
const MAX_PDF = 1_500_000;

type FieldDef = { key: string; label: string; type?: "text" | "textarea" | "date" | "select" | "image" | "pdf" | "checkbox"; options?: readonly string[]; required?: boolean; hint?: string; wide?: boolean };
type Row = { id: string } & Record<string, unknown>;

/** Generic add / edit / delete list for one CMS collection. */
function Editor({ title, rows, head, cells, fields, blank, onSave, onDelete, onMove, extra }: {
  title: string; rows: Row[]; head: string[]; cells: (r: Row) => React.ReactNode[]; fields: FieldDef[];
  blank: () => Row; onSave: (r: Row) => void; onDelete: (id: string) => void; onMove?: (id: string, dir: -1 | 1) => void; extra?: React.ReactNode;
}) {
  const [edit, setEdit] = useState<Row | null>(null);
  const [err, setErr] = useState("");
  const isNew = edit ? !rows.some((r) => r.id === edit.id) : false;
  const set = (k: string, v: unknown) => setEdit((e) => (e ? { ...e, [k]: v } : e));
  return (
    <Card title={title} action={<span className="flex flex-wrap gap-2">{extra}<Button size="sm" className="min-h-10" onClick={() => { setErr(""); setEdit(blank()); }}><Plus size={16} aria-hidden />Add</Button></span>}>
      <Table head={[...head, ""]} rows={rows.map((r) => [...cells(r),
        <span key="a" className="flex gap-1">
          {onMove && <><button aria-label="Move up" className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => onMove(r.id, -1)}><ArrowUp size={16} aria-hidden /></button><button aria-label="Move down" className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => onMove(r.id, 1)}><ArrowDown size={16} aria-hidden /></button></>}
          <button aria-label="Edit" className="flex h-10 w-10 items-center justify-center rounded-lg text-brand hover:bg-brand-50" onClick={() => { setErr(""); setEdit(structuredClone(r)); }}><Pencil size={16} aria-hidden /></button>
          <button aria-label="Delete" className="flex h-10 w-10 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" onClick={() => { if (window.confirm("Delete this item from the website?")) onDelete(r.id); }}><Trash2 size={16} aria-hidden /></button>
        </span>])} />
      <Modal wide open={!!edit} onClose={() => setEdit(null)} title={`${isNew ? "Add" : "Edit"} ${title.toLowerCase().replace(/s$/, "")}`}>
        {edit && (
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(edit); setEdit(null); }}>
            {fields.map((f) => {
              const v = edit[f.key];
              const cls = f.wide || f.type === "textarea" ? "sm:col-span-2" : undefined;
              if (f.type === "checkbox") return <label key={f.key} className="flex min-h-11 items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" className="h-5 w-5" checked={!!v} onChange={(e) => set(f.key, e.target.checked)} />{f.label}</label>;
              if (f.type === "textarea") return <Field key={f.key} label={f.label} hint={f.hint} className={cls}><textarea className="field min-h-24" required={f.required} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} /></Field>;
              if (f.type === "select") return <Field key={f.key} label={f.label} hint={f.hint} className={cls}><select className="field" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select></Field>;
              if (f.type === "image") return (
                <Field key={f.key} label={f.label} hint={f.hint ?? "PNG or JPG under 800 KB"} className="sm:col-span-2">
                  <span className="flex items-center gap-3">
                    {v ? <Image src={String(v)} alt="" width={96} height={64} className="h-16 w-24 rounded-lg object-cover" unoptimized /> : <span className="flex h-16 w-24 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">No image</span>}
                    <input type="file" accept="image/png,image/jpeg" className="text-xs" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; if (file.size > MAX_IMG) return setErr("Image must be under 800 KB."); setErr(""); set(f.key, await readFile(file)); }} />
                  </span>
                </Field>
              );
              if (f.type === "pdf") {
                const pdf = v as { name: string } | undefined;
                return (
                  <Field key={f.key} label={f.label} hint={f.hint} className="sm:col-span-2">
                    <span className="flex flex-wrap items-center gap-3">
                      <span className="text-sm">{pdf ? pdf.name : "None: a printable brochure is generated from the event details."}</span>
                      <input type="file" accept="application/pdf" className="text-xs" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; if (file.size > MAX_PDF) return setErr("Brochure must be under 1.5 MB in this demo."); setErr(""); set(f.key, { name: file.name, data: await readFile(file) }); }} />
                      {pdf && <button type="button" className="text-xs text-red-700 underline" onClick={() => set(f.key, undefined)}>Remove</button>}
                    </span>
                  </Field>
                );
              }
              return <Field key={f.key} label={f.label} hint={f.hint} className={cls}><input className="field" type={f.type === "date" ? "date" : "text"} required={f.required} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} /></Field>;
            })}
            {err && <p className="text-sm text-red-700 sm:col-span-2" role="alert">{err}</p>}
            <Button type="submit" className="sm:col-span-2 sm:justify-self-start">Save and publish</Button>
          </form>
        )}
      </Modal>
    </Card>
  );
}

export default function CmsPage() {
  const { db, update } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Hero slider");
  const cms = db.cms;
  type Coll = "kpis" | "events" | "gallery" | "testimonials" | "board" | "slides" | "showcase";
  const save = (coll: Coll, label: string) => (r: Row) => update((d) => {
    const list = d.cms[coll] as unknown as Row[];
    const i = list.findIndex((x) => x.id === r.id);
    if (i >= 0) list[i] = r; else list.push(r);
  }, `Website: saved ${label}`);
  const del = (coll: Coll, label: string) => (id: string) => update((d) => { (d.cms[coll] as unknown as Row[]).splice((d.cms[coll] as unknown as Row[]).findIndex((x) => x.id === id), 1); }, `Website: deleted ${label}`);
  const rows = <K extends Coll>(k: K) => cms[k] as unknown as Row[];
  const move = (coll: Coll) => (id: string, dir: -1 | 1) => update((d) => {
    const list = d.cms[coll] as unknown as Row[];
    const i = list.findIndex((x) => x.id === id), j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
  });
  const shown = (r: Row) => (r.show ? <Badge key="s" tone="green">Shown</Badge> : <Badge key="s">Hidden</Badge>);
  const notListed = db.startups.filter((s) => !cms.showcase.some((x) => x.name === s.name));
  const importStartups = () => update((d) => {
    notListed.forEach((s) => d.cms.showcase.push({ id: uid(), name: s.name, sector: s.sectors[0] ?? "", desc: s.oneLiner, stage: s.stage, year: s.onboardedOn.slice(0, 4), logo: s.logo, website: s.website, show: false }));
  }, `Website: imported ${notListed.length} portal startup(s) to showcase`);

  return (
    <>
      <PageTitle title="Website content" sub="Hero slider, startup showcase, events, gallery and more. Changes publish immediately." action={<Link href="/" target="_blank" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ExternalLink size={16} aria-hidden />View site</Link>} />
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200" role="tablist">
        {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx("min-h-11 whitespace-nowrap border-b-2 px-4 text-sm", tab === t ? "border-brand font-semibold text-brand" : "border-transparent text-slate-500 hover:text-slate-800")}>{t}</button>)}
      </div>

      {tab === "Hero slider" && (
        <Editor title="Hero slides" rows={rows("slides")} head={["Image", "Slide", "Button", "Status"]} onMove={move("slides")}
          cells={(r) => [r.img ? <Image key="i" src={String(r.img)} alt="" width={96} height={54} className="h-14 w-24 rounded object-cover" unoptimized /> : "—", <span key="t"><b>{String(r.title)}</b><span className="block max-w-sm text-xs text-slate-500">{String(r.sub)}</span></span>, `${String(r.ctaLabel)} → ${String(r.ctaHref)}`, shown(r)]}
          fields={[{ key: "title", label: "Headline", required: true, wide: true }, { key: "sub", label: "Sub-text", type: "textarea" }, { key: "ctaLabel", label: "Button label" }, { key: "ctaHref", label: "Button link", hint: "e.g. /apply or https://…" }, { key: "img", label: "Background image", type: "image", hint: "Wide photo, JPG under 800 KB" }, { key: "show", label: "Show this slide", type: "checkbox" }]}
          blank={() => ({ id: uid(), title: "", sub: "", ctaLabel: "Learn more", ctaHref: "/", img: "", show: true })} onSave={save("slides", "hero slide")} onDelete={del("slides", "hero slide")} />
      )}
      {tab === "Hero slider" && <p className="mt-3 text-sm text-slate-500">Slides rotate every 6 seconds on the home page, in this order. Visitors can pause them.</p>}

      {tab === "Startup showcase" && (
        <Editor title="Showcase startups" rows={rows("showcase")} head={["Startup", "Sector", "Website", "Home page"]} onMove={move("showcase")}
          extra={notListed.length > 0 && <Button size="sm" variant="outline" className="min-h-10" onClick={importStartups}>Import {notListed.length} from portal</Button>}
          cells={(r) => [<span key="n"><b>{String(r.name)}</b><span className="block text-xs text-slate-500">{String(r.desc)}</span></span>, String(r.sector), r.website ? <a key="w" className="text-brand underline" href={String(r.website)} target="_blank" rel="noreferrer">{String(r.website).replace(/^https?:\/\//, "")}</a> : <Badge key="w" tone="amber">No website</Badge>,
            <label key="s" className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5" checked={!!r.show} onChange={(e) => update((d) => { d.cms.showcase.find((x) => x.id === r.id)!.show = e.target.checked; }, `Website: ${e.target.checked ? "showing" : "hid"} ${String(r.name)}`)} />{r.show ? "Shown" : "Hidden"}</label>]}
          fields={[{ key: "name", label: "Startup name", required: true }, { key: "sector", label: "Sector", required: true }, { key: "stage", label: "Stage" }, { key: "year", label: "Year incubated" }, { key: "desc", label: "One-line description", required: true, wide: true }, { key: "website", label: "Website URL", hint: "Visitors who click the startup open this site", wide: true }, { key: "logo", label: "Logo", type: "image", hint: "Square PNG under 800 KB" }, { key: "show", label: "Show on home page", type: "checkbox" }]}
          blank={() => ({ id: uid(), name: "", sector: "", stage: "", year: "", desc: "", website: "https://", logo: "", show: true })} onSave={save("showcase", "showcase startup")} onDelete={del("showcase", "showcase startup")} />
      )}

      {tab === "Pop-up" && <PopupEditor key={cms.popup.version} />}

      {tab === "Impact numbers" && (
        <Editor title="Impact numbers" rows={rows("kpis")} head={["Value", "Label", "Note", "Source"]}
          cells={(r) => [<b key="v" className="text-lg">{String(r.auto ? "auto" : r.value)}</b>, String(r.label), String(r.note), r.auto ? <Badge key="a" tone="blue">Live: upcoming events</Badge> : <Badge key="m">Manual</Badge>]}
          fields={[{ key: "value", label: "Value (e.g. ₹15 Cr, 25+)", required: true, hint: "Ignored for live numbers" }, { key: "label", label: "Label", required: true }, { key: "note", label: "Note", wide: true }]}
          blank={() => ({ id: uid(), label: "", value: "", note: "" })} onSave={save("kpis", "impact number")} onDelete={del("kpis", "impact number")} />
      )}

      {tab === "Events" && (
        <Editor title="Events" rows={[...rows("events")].sort((a, b) => String(b.date).localeCompare(String(a.date)))} head={["Date", "Event", "Category", "Brochure"]}
          cells={(r) => [fmtDate(String(r.date)), <span key="t"><b>{String(r.title)}</b><span className="block text-xs text-slate-500">{String(r.place)}</span></span>, String(r.category), r.brochure ? <Badge key="b" tone="green">PDF uploaded</Badge> : <Badge key="b">Generated</Badge>]}
          fields={[
            { key: "title", label: "Title", required: true, wide: true }, { key: "date", label: "Date", type: "date", required: true }, { key: "time", label: "Time", required: true },
            { key: "place", label: "Venue", required: true }, { key: "category", label: "Category", type: "select", options: EVENT_CATS },
            { key: "summary", label: "One-line summary", required: true, wide: true }, { key: "details", label: "Details", type: "textarea" },
            { key: "registerUrl", label: "Registration link", hint: "Google Form or page URL; leave empty for no Register button", wide: true },
            { key: "brochure", label: "Event brochure (PDF)", type: "pdf" },
          ]}
          blank={() => ({ id: uid(), title: "", date: "", time: "10:00–13:00", place: "SRIIF Event Hall", category: "Workshop", summary: "", details: "", registerUrl: "" })}
          onSave={save("events", "event")} onDelete={del("events", "event")} />
      )}

      {tab === "Gallery" && (
        <Editor title="Gallery items" rows={rows("gallery")} head={["Photo", "Title", "Category", "Date"]}
          cells={(r) => [<Image key="i" src={String(r.img)} alt="" width={72} height={48} className="h-12 w-18 rounded object-cover" unoptimized />, String(r.title), String(r.category), fmtDate(String(r.date))]}
          fields={[{ key: "title", label: "Title", required: true }, { key: "category", label: "Category", type: "select", options: GALLERY_CATS }, { key: "date", label: "Date", type: "date", required: true }, { key: "link", label: "Press link (optional)" }, { key: "caption", label: "Caption", wide: true }, { key: "img", label: "Photo", type: "image" }]}
          blank={() => ({ id: uid(), title: "", category: "Workshops", date: "", caption: "", link: "", img: "" })} onSave={save("gallery", "gallery item")} onDelete={del("gallery", "gallery item")} />
      )}

      {tab === "Testimonials" && (
        <Editor title="Testimonials" rows={rows("testimonials")} head={["From", "Type", "Highlight", "Quote"]}
          cells={(r) => [<span key="n"><b>{String(r.name)}</b><span className="block text-xs text-slate-500">{String(r.role)}, {String(r.org)}</span></span>, String(r.kind), String(r.stat), <span key="q" className="line-clamp-2 max-w-md">{String(r.quote)}</span>]}
          fields={[{ key: "name", label: "Name", required: true }, { key: "kind", label: "Type", type: "select", options: ["Founder", "Partner"] }, { key: "role", label: "Role" }, { key: "org", label: "Startup / organisation", required: true }, { key: "stat", label: "Highlight (e.g. ₹4 Cr raised)" }, { key: "quote", label: "Quote", type: "textarea", required: true }]}
          blank={() => ({ id: uid(), name: "", kind: "Founder", role: "", org: "", stat: "", quote: "" })} onSave={save("testimonials", "testimonial")} onDelete={del("testimonials", "testimonial")} />
      )}

      {tab === "Board" && (
        <Editor title="Board members" rows={rows("board")} head={["Name", "Role", "Bio"]}
          cells={(r) => [String(r.name), String(r.role), String(r.bio)]}
          fields={[{ key: "name", label: "Name", required: true }, { key: "role", label: "Role", required: true }, { key: "bio", label: "Short bio", type: "textarea" }, { key: "img", label: "Photo", type: "image" }]}
          blank={() => ({ id: uid(), name: "", role: "", bio: "", img: "" })} onSave={save("board", "board member")} onDelete={del("board", "board member")} />
      )}

      {tab === "Social links" && <SocialEditor />}
    </>
  );
}

function PopupEditor() {
  const { db, update } = useStore();
  const [p, setP] = useState(db.cms.popup);
  const [saved, setSaved] = useState(false);
  return (
    <Card title="“What's happening at SRIIF” pop-up">
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => {
        e.preventDefault();
        update((d) => { d.cms.popup = { ...p, version: d.cms.popup.version + 1 }; }, "Website: updated pop-up announcement");
        setSaved(true);
      }}>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" className="h-5 w-5" checked={p.enabled} onChange={(e) => setP({ ...p, enabled: e.target.checked })} />Show the pop-up on the home page</label>
        <Field label="Title" className="sm:col-span-2"><input className="field" required value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /></Field>
        <Field label="Message" className="sm:col-span-2"><textarea className="field" required value={p.body} onChange={(e) => setP({ ...p, body: e.target.value })} /></Field>
        <Field label="Button label"><input className="field" value={p.ctaLabel} onChange={(e) => setP({ ...p, ctaLabel: e.target.value })} /></Field>
        <Field label="Button link" hint="e.g. /apply or /events"><input className="field" value={p.ctaHref} onChange={(e) => setP({ ...p, ctaHref: e.target.value })} /></Field>
        <div className="flex items-center gap-3 sm:col-span-2"><Button type="submit">Publish</Button>{saved && <span className="text-sm text-emerald-700" role="status">Published. Visitors see the new pop-up once.</span>}</div>
      </form>
    </Card>
  );
}

function SocialEditor() {
  const { db, update } = useStore();
  const [s, setS] = useState<Cms["social"]>(db.cms.social);
  const [saved, setSaved] = useState(false);
  const label = { linkedin: "LinkedIn", x: "X (Twitter)", instagram: "Instagram", youtube: "YouTube" } as const;
  return (
    <Card title="Official social media links">
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); update((d) => { d.cms.social = s; }, "Website: updated social links"); setSaved(true); }}>
        {(Object.keys(label) as (keyof typeof label)[]).map((k) => <Field key={k} label={label[k]} hint="Full URL, e.g. https://…"><input className="field" type="url" value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} /></Field>)}
        <div className="flex items-center gap-3 sm:col-span-2"><Button type="submit">Save</Button>{saved && <span className="text-sm text-emerald-700" role="status">Saved. Footer and Contact page badges now link here.</span>}</div>
      </form>
    </Card>
  );
}
