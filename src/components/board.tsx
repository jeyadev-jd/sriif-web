"use client";

import Image from "next/image";
import { useStore } from "@/lib/store";
import { Container } from "./site-chrome";

export function BoardBlock() {
  const { db } = useStore();
  return (
    <Container>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {db.cms.board.map((p) => (
          <li key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="relative h-56 bg-mist">
              {p.img ? <Image src={p.img} alt={p.name} fill className="object-cover" sizes="25vw" unoptimized={p.img.startsWith("data:")} />
                : <span className="display flex h-full items-center justify-center text-6xl text-brand-dark/30" aria-hidden>SRIIF</span>}
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">{p.role}</p>
              <p className="mt-1 text-lg font-bold text-brand-dark">{p.name}</p>
              <p className="mt-1 text-sm text-slate-600">{p.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
