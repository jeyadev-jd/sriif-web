"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { fmtDate, MONTHS_LONG, upcomingEvents, useStore } from "@/lib/store";
import { EventCard, eventWhen } from "./cms-blocks";
import { Container } from "./site-chrome";
import { cx } from "./ui";

const FILTERS = ["Upcoming", "Recent", "Past", "All"] as const;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Clickable month calendar + Upcoming / Recent / Past filter + upcoming sidebar. */
export function EventsExplorer() {
  const { db, day: t } = useStore();
  const events = db.cms.events;
  const [picked, setYm] = useState<{ y: number; m: number } | null>(null);
  // Until the browser date is known (prerender), show the month of the first event.
  const base = t || events[0]?.date || "2026-01-01";
  const ym = picked ?? { y: Number(base.slice(0, 4)), m: Number(base.slice(5, 7)) - 1 };
  const [day, setDay] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Upcoming");

  const byDate = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of events) m.set(e.date, (m.get(e.date) ?? 0) + 1);
    return m;
  }, [events]);

  const first = new Date(ym.y, ym.m, 1).getDay();
  const days = new Date(ym.y, ym.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const monthLabel = `${MONTHS_LONG[ym.m]} ${ym.y}`;
  const shift = (d: number) => { const n = new Date(ym.y, ym.m + d, 1); setYm({ y: n.getFullYear(), m: n.getMonth() }); };

  const list = events
    .filter((e) => (day ? e.date === day : filter === "All" || eventWhen(e, t) === filter))
    .sort((a, b) => (filter === "Upcoming" && !day ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  const upcoming = upcomingEvents(events, t).slice(0, 4);

  return (
    <Container className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Show events">
          {FILTERS.map((f) => (
            <button key={f} aria-pressed={!day && filter === f} onClick={() => { setFilter(f); setDay(null); }} className={cx("min-h-10 rounded-full px-4 text-sm font-medium", !day && filter === f ? "bg-brand-dark text-white" : "bg-surface text-slate-700 hover:text-brand-dark")}>
              {f}{f !== "All" && <span className="ml-1.5 tabular-nums opacity-70">{events.filter((e) => eventWhen(e, t) === f).length}</span>}
            </button>
          ))}
          {day && <button onClick={() => setDay(null)} className="min-h-10 rounded-full bg-accent px-4 text-sm font-semibold text-brand-dark">{fmtDate(day)} · clear</button>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
          {list.map((e) => <EventCard key={e.id} e={e} />)}
          {list.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 sm:col-span-2">No events {day ? "on this date" : `in ${filter.toLowerCase()}`}.</p>}
        </div>
      </div>

      <aside className="grid content-start gap-6">
        <section aria-label="Event calendar" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <button onClick={() => shift(-1)} aria-label="Previous month" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100"><ChevronLeft size={18} aria-hidden /></button>
            <p className="font-semibold text-brand-dark" aria-live="polite">{monthLabel}</p>
            <button onClick={() => shift(1)} aria-label="Next month" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100"><ChevronRight size={18} aria-hidden /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-slate-500" aria-hidden>{DOW.map((d) => <span key={d}>{d}</span>)}</div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, k) => {
              if (!d) return <span key={k} />;
              const key = iso(ym.y, ym.m, d);
              const n = byDate.get(key) ?? 0;
              const sel = day === key;
              return (
                <button key={k} disabled={!n} onClick={() => setDay(sel ? null : key)} aria-pressed={sel}
                  aria-label={`${d} ${monthLabel}${n ? `, ${n} event${n > 1 ? "s" : ""}` : ""}`}
                  className={cx("relative flex aspect-square items-center justify-center rounded-lg text-sm tabular-nums",
                    sel ? "bg-brand-dark font-bold text-white" : n ? "bg-accent/20 font-bold text-brand-dark hover:bg-accent/40" : "cursor-default text-slate-400",
                    key === t && !sel && "ring-2 ring-brand")}>
                  {d}{n > 0 && !sel && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-brand-dark" aria-hidden />}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">Highlighted dates have events. Select one to filter.</p>
        </section>
        <section aria-label="Coming up" className="rounded-2xl bg-brand-dark p-5 text-white">
          <p className="display text-2xl">Coming <span className="text-accent">up</span></p>
          <ul className="mt-3 divide-y divide-white/10">
            {upcoming.map((e) => (
              <li key={e.id} className="py-3"><button onClick={() => { setDay(e.date); setYm({ y: Number(e.date.slice(0, 4)), m: Number(e.date.slice(5, 7)) - 1 }); }} className="block w-full text-left hover:text-accent">
                <span className="text-xs text-white/60">{fmtDate(e.date, false)} · {e.place}</span><span className="block font-semibold">{e.title}</span></button></li>
            ))}
          </ul>
        </section>
      </aside>
    </Container>
  );
}
