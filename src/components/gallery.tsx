"use client";

import Image from "next/image";
import { useState } from "react";
import { fmtDate, useStore } from "@/lib/store";
import type { GalleryCategory, GalleryItem } from "@/lib/types";
import { Container } from "./site-chrome";
import { cx, Modal } from "./ui";

export const GALLERY_CATS: GalleryCategory[] = ["Demo days", "Workshops", "MoU signings", "Visitor delegations", "Press"];

/** Categorised photo and press archive with a lightbox. */
export function Gallery() {
  const { db } = useStore();
  const [cat, setCat] = useState<GalleryCategory | "All">("All");
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const items = [...db.cms.gallery].sort((a, b) => b.date.localeCompare(a.date)).filter((g) => cat === "All" || g.category === cat);
  return (
    <Container>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Gallery categories">
        {(["All", ...GALLERY_CATS] as const).map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={cx("min-h-10 rounded-full px-4 text-sm font-medium", cat === c ? "bg-brand-dark text-white" : "bg-surface text-slate-700 hover:text-brand-dark")}>
            {c}<span className="ml-1.5 tabular-nums opacity-70">{c === "All" ? db.cms.gallery.length : db.cms.gallery.filter((g) => g.category === c).length}</span>
          </button>
        ))}
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <li key={g.id}>
            <button onClick={() => setOpen(g)} className="group block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:shadow-lg">
              <span className="relative block aspect-[4/3] overflow-hidden bg-mist">
                <Image src={g.img} alt={g.title} fill className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" unoptimized={g.img.startsWith("data:")} />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-dark">{g.category}</span>
              </span>
              <span className="block p-4"><span className="text-xs text-slate-500">{fmtDate(g.date)}</span><span className="block font-semibold text-brand-dark">{g.title}</span><span className="mt-1 block text-sm text-slate-600">{g.caption}</span></span>
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="text-sm text-slate-500">Nothing in this category yet.</p>}
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title ?? ""} wide>
        {open && (
          <figure>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-mist"><Image src={open.img} alt={open.title} fill className="object-contain" sizes="768px" unoptimized={open.img.startsWith("data:")} /></div>
            <figcaption className="mt-3 text-sm text-slate-600">{open.caption} · {fmtDate(open.date)}{open.link && <> · <a href={open.link} target="_blank" rel="noreferrer" className="text-brand underline">Read more</a></>}</figcaption>
          </figure>
        )}
      </Modal>
    </Container>
  );
}
