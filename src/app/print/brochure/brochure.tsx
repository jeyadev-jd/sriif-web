"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { asset, brand } from "@/lib/site";
import { fmtDate, useStore } from "@/lib/store";

/** Printable one-page brochure, used when admins have not uploaded a PDF. Save as PDF from the print dialog. */
export function Brochure() {
  const id = useSearchParams().get("id");
  const { db } = useStore();
  const e = db.cms.events.find((x) => x.id === id);
  if (!e) return <p className="p-10">Event not found.</p>;
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="no-print mb-4 flex justify-end"><Button onClick={() => window.print()}>Save as PDF</Button></div>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <header className="bg-brand-dark p-10 text-white">
          <div className="flex items-center gap-3"><Image src={asset("/img/logo.png")} alt="" width={44} height={44} className="rounded-full bg-white" /><span className="text-sm">{brand.fullName}</span></div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{e.category}</p>
          <h1 className="display mt-2 text-6xl">{e.title}</h1>
          <p className="mt-4 text-lg text-white/85">{e.summary}</p>
        </header>
        <div className="grid gap-6 p-10 sm:grid-cols-3">
          <div><p className="text-xs font-semibold uppercase text-slate-500">Date</p><p className="font-semibold">{fmtDate(e.date)}</p></div>
          <div><p className="text-xs font-semibold uppercase text-slate-500">Time</p><p className="font-semibold">{e.time}</p></div>
          <div><p className="text-xs font-semibold uppercase text-slate-500">Venue</p><p className="font-semibold">{e.place}</p></div>
          <p className="leading-relaxed text-slate-700 sm:col-span-3">{e.details}</p>
        </div>
        <footer className="border-t border-slate-200 bg-surface p-6 text-sm text-slate-600">{brand.address} · {brand.email} · {brand.phone}</footer>
      </article>
    </div>
  );
}
