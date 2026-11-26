"use client";

// "What's happening at SRIIF": an entry pop-up on the home page and a side panel on every public page.
import { CalendarDays, Megaphone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { upcomingEvents, useStore } from "@/lib/store";
import { DateTile } from "./cms-blocks";
import { LinkButton } from "./ui";

const SEEN = "sriif-popup-seen";

export function WhatsOnPopup() {
  const { db, ready, day } = useStore();
  const p = db.cms.popup;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!ready || !p.enabled) return;
    // Show once per announcement version.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser storage after mount
    if (localStorage.getItem(SEEN) !== String(p.version)) setOpen(true);
  }, [ready, p.enabled, p.version]);
  const close = () => { localStorage.setItem(SEEN, String(p.version)); setOpen(false); };
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { localStorage.setItem(SEEN, String(p.version)); setOpen(false); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, p.version]);
  if (!open) return null;
  const next = upcomingEvents(db.cms.events, day).slice(0, 2);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={close}>
      <div role="dialog" aria-modal="true" aria-labelledby="whatson-h" className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-brand-dark px-6 pb-6 pt-8 text-white">
          <button onClick={close} aria-label="Close announcement" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"><X size={20} aria-hidden /></button>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"><Megaphone size={15} aria-hidden />What&apos;s happening at SRIIF</p>
          <h2 id="whatson-h" className="display mt-3 text-4xl">{p.title}</h2>
          <p className="mt-3 text-white/80">{p.body}</p>
        </div>
        {next.length > 0 && (
          <ul className="divide-y divide-slate-100 px-6">
            {next.map((e) => (
              <li key={e.id}><Link href={`/events/view?id=${e.id}`} onClick={close} className="flex items-center gap-4 py-3 hover:text-brand"><DateTile iso={e.date} /><span><span className="block font-semibold text-brand-dark">{e.title}</span><span className="text-sm text-slate-500">{e.place}</span></span></Link></li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 p-6">
          {p.ctaHref && <LinkButton href={p.ctaHref} variant="accent" className="min-h-11">{p.ctaLabel}</LinkButton>}
          <LinkButton href="/events" variant="outline" className="min-h-11">See all events</LinkButton>
        </div>
      </div>
    </div>
  );
}

/** Persistent side panel with upcoming events, opened from a tab on the right edge. */
export function WhatsOnRail() {
  const { db, day } = useStore();
  const [open, setOpen] = useState(false);
  const list = upcomingEvents(db.cms.events, day).slice(0, 5);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <>
      <button onClick={() => setOpen(true)} aria-expanded={open} aria-controls="whatson-panel"
        className="no-print fixed bottom-4 right-4 z-30 flex min-h-12 items-center gap-2 rounded-full bg-brand-dark px-4 text-xs font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-brand md:bottom-auto md:right-0 md:top-1/2 md:min-h-0 md:-translate-y-1/2 md:rounded-l-xl md:rounded-r-none md:px-2.5 md:py-4 md:[writing-mode:vertical-rl]">
        <CalendarDays size={16} className="text-accent md:rotate-90" aria-hidden />Upcoming events{list.length > 0 && <span className="rounded-full bg-accent px-1.5 py-0.5 text-brand-dark [writing-mode:horizontal-tb]">{list.length}</span>}
      </button>
      {open && <div className="fixed inset-0 z-40 bg-slate-900/40" onClick={() => setOpen(false)} aria-hidden />}
      <aside id="whatson-panel" aria-label="Upcoming events" aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-200 ${open ? "translate-x-0" : "invisible translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-slate-200 bg-brand-dark p-5 text-white">
          <p className="display text-2xl">What&apos;s <span className="text-accent">on</span></p>
          <button onClick={() => setOpen(false)} aria-label="Close upcoming events" className="flex h-11 w-11 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"><X size={20} aria-hidden /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {db.cms.popup.enabled && (
            <div className="mb-5 rounded-xl bg-accent/15 p-4 text-sm">
              <p className="font-semibold text-brand-dark">{db.cms.popup.title}</p>
              <p className="mt-1 text-slate-700">{db.cms.popup.body}</p>
              {db.cms.popup.ctaHref && <Link href={db.cms.popup.ctaHref} onClick={() => setOpen(false)} className="mt-2 inline-block font-semibold text-brand underline">{db.cms.popup.ctaLabel}</Link>}
            </div>
          )}
          <ul className="grid gap-3">
            {list.map((e) => (
              <li key={e.id}>
                <Link href={`/events/view?id=${e.id}`} onClick={() => setOpen(false)} className="flex gap-3 rounded-xl border border-slate-200 p-3 hover:border-brand">
                  <DateTile iso={e.date} />
                  <span className="min-w-0"><span className="text-[11px] font-semibold uppercase tracking-wider text-brand">{e.category}</span><span className="block font-semibold text-brand-dark">{e.title}</span><span className="text-xs text-slate-500">{e.time} · {e.place}</span></span>
                </Link>
              </li>
            ))}
            {list.length === 0 && <li className="text-sm text-slate-500">No upcoming events.</li>}
          </ul>
        </div>
        <div className="border-t border-slate-200 p-5"><LinkButton href="/events" className="w-full min-h-11">Open events calendar</LinkButton></div>
      </aside>
    </>
  );
}
