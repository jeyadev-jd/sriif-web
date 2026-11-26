"use client";

import { ArrowLeft, CalendarDays, Clock, Download, MapPin } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { eventWhen, EventCard } from "@/components/cms-blocks";
import { Container } from "@/components/site-chrome";
import { Badge, LinkButton } from "@/components/ui";
import { fmtDate, upcomingEvents, useStore } from "@/lib/store";

export function EventDetail() {
  const id = useSearchParams().get("id");
  const { db, day } = useStore();
  const e = db.cms.events.find((x) => x.id === id);
  if (!e) return <Container><p>Event not found. <Link href="/events" className="text-brand underline">Back to events</Link></p></Container>;
  const when = eventWhen(e, day);
  const more = upcomingEvents(db.cms.events, day).filter((x) => x.id !== e.id).slice(0, 3);
  const external = e.registerUrl.startsWith("http");
  return (
    <>
      <section className="grid-paper border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <Link href="/events" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand"><ArrowLeft size={16} aria-hidden />All events</Link>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-brand">{e.category}<Badge tone={when === "Upcoming" ? "green" : "slate"}>{when}</Badge></p>
          <h1 className="display mt-3 max-w-4xl text-5xl text-brand-dark md:text-7xl">{e.title}</h1>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-slate-700">
            <li className="flex items-center gap-2"><CalendarDays size={18} className="text-brand" aria-hidden />{fmtDate(e.date)}</li>
            <li className="flex items-center gap-2"><Clock size={18} className="text-brand" aria-hidden />{e.time}</li>
            <li className="flex items-center gap-2"><MapPin size={18} className="text-brand" aria-hidden />{e.place}</li>
          </ul>
        </div>
      </section>
      <Container className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-xl text-slate-800">{e.summary}</p>
          <p className="mt-4 leading-relaxed text-slate-600">{e.details}</p>
        </div>
        <aside className="grid content-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {when === "Upcoming" && e.registerUrl && <LinkButton href={e.registerUrl} external={external} variant="accent" className="min-h-12 text-base">Register</LinkButton>}
          {e.brochure
            ? <a href={e.brochure.data} download={e.brochure.name} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"><Download size={18} aria-hidden />Download brochure (PDF)</a>
            : <LinkButton href={`/print/brochure?id=${e.id}`} variant="outline" className="min-h-12"><Download size={18} aria-hidden />Event brochure (PDF)</LinkButton>}
          <p className="text-xs text-slate-500">Questions? Write to <a className="text-brand underline" href="mailto:events.sriic@gmail.com">events.sriic@gmail.com</a>.</p>
        </aside>
      </Container>
      {more.length > 0 && (
        <Container className="pt-0">
          <h2 className="mb-4 text-xl font-bold text-brand-dark">More upcoming events</h2>
          <div className="grid gap-3 md:grid-cols-3">{more.map((x) => <EventCard key={x.id} e={x} />)}</div>
        </Container>
      )}
    </>
  );
}
