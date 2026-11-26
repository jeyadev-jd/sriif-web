"use client";

// Public-site blocks whose content is managed from Admin → Website content (db.cms).
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Quote } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { JOIN_ROLES } from "@/lib/seed";
import { faqCategories, faqs, partners } from "@/lib/site";
import { fmtDate, MONTHS, upcomingEvents, useStore } from "@/lib/store";
import type { SiteEvent } from "@/lib/types";
import { Container, SectionHead } from "./site-chrome";
import { cx, LinkButton } from "./ui";

/** KPIs with auto-computed values filled in. */
export function useKpis() {
  const { db, day } = useStore();
  const upcoming = upcomingEvents(db.cms.events, day).length;
  return db.cms.kpis.map((k) => (k.auto === "events" ? { ...k, value: String(upcoming) } : k));
}

/** Upcoming = today or later; Recent = last 90 days; Past = older. */
export function eventWhen(e: SiteEvent, t: string): "Upcoming" | "Recent" | "Past" {
  if (!t || e.date >= t) return "Upcoming";
  const days = (new Date(t).getTime() - new Date(e.date).getTime()) / 864e5;
  return days <= 90 ? "Recent" : "Past";
}

export function DateTile({ iso, dark }: { iso: string; dark?: boolean }) {
  return (
    <span className={cx("flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl", dark ? "bg-white/10 text-white" : "bg-brand-dark text-white")}>
      <span className="display text-2xl leading-none">{Number(iso.slice(8, 10))}</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{MONTHS[Number(iso.slice(5, 7)) - 1]}</span>
    </span>
  );
}

/** Single high-impact KPI banner. */
export function ImpactBlock() {
  const kpis = useKpis();
  return (
    <section aria-labelledby="impact-h" className="relative overflow-hidden bg-brand-dark text-white">
      <span className="display pointer-events-none absolute -right-6 -top-8 select-none text-[10rem] text-white/[0.04] md:text-[16rem]" aria-hidden>IMPACT</span>
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="impact-h" className="display text-3xl md:text-5xl">Ecosystem <span className="text-accent">impact</span></h2>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" aria-hidden />Updated by SRIIF</p>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-y-8 border-t border-white/15 pt-8 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
          {kpis.map((k) => (
            <div key={k.id} className="flex flex-col lg:px-8 lg:first:pl-0">
              <dt className="order-2 mt-2 text-sm font-semibold text-white">{k.label}</dt>
              <dd className="display order-1 text-5xl tabular-nums text-accent md:text-6xl">{k.value}</dd>
              <dd className="order-3 text-xs text-white/60">{k.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function PartnersBlock() {
  return (
    <div className="bg-surface">
      <Container>
        <SectionHead label="Partners & integrations" title="Backed by industry, government and" mark="academia" sub="Corporate partners, technology providers and ecosystem enablers who work with SRIIF startups." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((p) => {
            const body = (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{p.tag}</span>
                <span className="mt-1 flex items-start justify-between gap-2 text-lg font-bold text-brand-dark">{p.title}{p.url && <ArrowUpRight size={18} className="mt-1 shrink-0 text-brand transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />}</span>
                <span className="mt-1 text-sm text-slate-600">{p.desc}</span>
              </>
            );
            return p.url ? (
              <a key={p.title} href={p.url} target="_blank" rel="noreferrer" className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-md">
                {body}<span className="sr-only"> (opens partner website)</span>
              </a>
            ) : (
              <div key={p.title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">{body}</div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

/** Testimonials: one featured quote with previous / next controls and a filter. */
export function TestimonialsBlock() {
  const { db } = useStore();
  const [kind, setKind] = useState<"All" | "Founder" | "Partner">("All");
  const [i, setI] = useState(0);
  const list = db.cms.testimonials.filter((t) => kind === "All" || t.kind === kind);
  if (list.length === 0) return null;
  const cur = list[i % list.length];
  const go = (d: number) => setI((i + d + list.length) % list.length);
  return (
    <Container>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHead label="Testimonials" title="Don't take our" mark="word" after="for it" />
        <div className="mb-12 flex gap-1 rounded-full bg-surface p-1" role="group" aria-label="Filter testimonials">
          {(["All", "Founder", "Partner"] as const).map((k) => (
            <button key={k} onClick={() => { setKind(k); setI(0); }} aria-pressed={kind === k} className={cx("min-h-10 rounded-full px-4 text-sm font-medium", kind === k ? "bg-brand-dark text-white" : "text-slate-600 hover:text-brand-dark")}>{k === "All" ? "All" : k + "s"}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <figure className="relative flex flex-col rounded-2xl bg-brand-dark p-8 text-white md:p-10" aria-live="polite">
          <Quote size={40} className="text-accent" aria-hidden />
          <p className="display mt-4 text-4xl text-accent">{cur.stat}</p>
          <blockquote className="mt-4 flex-1 text-xl leading-relaxed text-white/90">“{cur.quote}”</blockquote>
          <figcaption className="mt-8 flex items-center justify-between gap-4">
            <span className="text-sm"><b className="block text-base">{cur.name}</b><span className="text-white/60">{cur.role}, {cur.org}</span></span>
            <span className="flex gap-2">
              <button onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 hover:bg-white/10"><ChevronLeft size={20} aria-hidden /></button>
              <button onClick={() => go(1)} aria-label="Next testimonial" className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-brand-dark hover:brightness-95"><ChevronRight size={20} aria-hidden /></button>
            </span>
          </figcaption>
        </figure>
        <ul className="grid content-start gap-3">
          {list.map((t, k) => (
            <li key={t.id}>
              <button onClick={() => setI(k)} aria-current={k === i % list.length} className={cx("w-full rounded-xl border p-4 text-left transition", k === i % list.length ? "border-brand bg-brand-50" : "border-slate-200 bg-white hover:border-brand")}>
                <span className="flex items-center justify-between gap-2 text-sm"><b className="text-brand-dark">{t.org}</b><span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">{t.kind}</span></span>
                <span className="mt-1 line-clamp-2 block text-sm text-slate-600">{t.quote}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

export function EventCard({ e }: { e: SiteEvent }) {
  return (
    <Link href={`/events/view?id=${e.id}`} className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand hover:shadow-md">
      <DateTile iso={e.date} />
      <span className="min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">{e.category}</span>
        <span className="block text-lg font-bold leading-snug text-brand-dark group-hover:underline">{e.title}</span>
        <span className="mt-1 flex flex-wrap gap-x-3 text-xs text-slate-500"><span className="flex items-center gap-1"><Clock size={13} aria-hidden />{e.time}</span><span className="flex items-center gap-1"><MapPin size={13} aria-hidden />{e.place}</span></span>
      </span>
    </Link>
  );
}

/** Home: upcoming events and recent highlights. */
export function EventsBlock() {
  const { db, day } = useStore();
  const up = upcomingEvents(db.cms.events, day).slice(0, 4);
  const recent = db.cms.events.filter((e) => eventWhen(e, day) !== "Upcoming").sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <Container>
      <SectionHead label="What's happening at SRIIF" title="Events &" mark="calendar" sub="Workshops, clinics, demo days and investor connects." />
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="grid content-start gap-3 sm:grid-cols-2">
          {up.map((e) => <EventCard key={e.id} e={e} />)}
          {up.length === 0 && <p className="text-sm text-slate-500">No upcoming events. Check back soon.</p>}
        </div>
        <div className="rounded-2xl bg-surface p-5">
          <p className="font-semibold text-brand-dark">Recent highlights</p>
          <ul className="mt-2 divide-y divide-slate-200">
            {recent.map((e) => (
              <li key={e.id}><Link href={`/events/view?id=${e.id}`} className="block py-3 hover:text-brand"><span className="text-xs text-slate-500">{fmtDate(e.date)}</span><span className="block font-medium">{e.title}</span></Link></li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton href="/events" size="sm"><CalendarDays size={16} aria-hidden />Full calendar</LinkButton>
            <LinkButton href="/media" size="sm" variant="outline">Gallery</LinkButton>
          </div>
        </div>
      </div>
    </Container>
  );
}

/** Categorised FAQ accordion. `preview` shows two per category with a link to the full page. */
export function FaqBlock({ preview }: { preview?: boolean }) {
  const [cat, setCat] = useState<string>(faqCategories[0]);
  const list = faqs.filter((f) => f.cat === cat).slice(0, preview ? 3 : undefined);
  return (
    <div className="bg-surface">
      <Container className="max-w-4xl">
        <SectionHead center label="FAQs" title="Quick answers" />
        <div className="mb-6 flex flex-wrap justify-center gap-2" role="tablist" aria-label="FAQ categories">
          {faqCategories.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={cx("min-h-10 rounded-full px-4 text-sm font-medium", cat === c ? "bg-brand-dark text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-brand")}>{c}</button>
          ))}
        </div>
        <div className="space-y-3" role="tabpanel" aria-label={cat}>
          {list.map((f) => (
            <details key={f.q} className="group rounded-xl bg-white p-4 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-dark">{f.q}<span className="text-xl leading-none transition group-open:rotate-45" aria-hidden>+</span></summary>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        {preview && <p className="mt-6 text-center"><Link href="/faq" className="inline-flex items-center gap-1 font-semibold text-brand underline">All FAQs<ArrowRight size={16} aria-hidden /></Link></p>}
      </Container>
    </div>
  );
}

/** Join Us: ecosystem supporters (kept separate from the startup portal). */
export function JoinBlock() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <Container>
        <SectionHead label="Join us" title="Support SRIIF" mark="founders" sub="Industry experts, investors and partners can express interest. The SRIIF team follows up with you." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {JOIN_ROLES.map((r) => (
            <Link key={r.role} href={`/join?role=${encodeURIComponent(r.role)}`} className="group flex flex-col rounded-xl border border-slate-200 p-5 transition hover:border-brand hover:shadow-md">
              <span className="font-bold text-brand-dark">{r.role}</span>
              <span className="mt-1 flex-1 text-sm text-slate-600">{r.desc}</span>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand">Express interest<ArrowRight size={15} className="transition group-hover:translate-x-1" aria-hidden /></span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
