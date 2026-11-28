"use client";

import { Trash2 } from "lucide-react";
import { brand } from "@/lib/site";
import { inr, invoiceTotals } from "@/lib/store";
import type { InvoiceLine } from "@/lib/types";
import { Button } from "./ui";

export const SAC = [
  { code: "997212", label: "Rental of office / seat space" },
  { code: "998346", label: "Lab and instrument usage" },
  { code: "998599", label: "Incubation / support services" },
  { code: "997331", label: "Meeting room / event hall" },
];

/** Line items with SAC code, quantity and rate. Amount = qty × rate. */
export function LineEditor({ lines, onChange, discount = 0 }: { lines: InvoiceLine[]; onChange: (l: InvoiceLine[]) => void; discount?: number }) {
  const set = (i: number, patch: Partial<InvoiceLine>) => onChange(lines.map((l, j) => {
    if (j !== i) return l;
    const n = { ...l, ...patch };
    return { ...n, amount: (n.qty ?? 1) * (n.rate ?? n.amount) };
  }));
  const t = invoiceTotals(lines, brand.gstRate, discount);
  return (
    <div className="grid gap-2">
      <div className="hidden grid-cols-[1fr_120px_64px_96px_44px] gap-2 text-xs font-semibold uppercase text-slate-500 sm:grid"><span>Description</span><span>SAC</span><span>Qty</span><span>Rate</span><span /></div>
      {lines.map((l, i) => (
        <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_120px_64px_96px_44px]">
          <input aria-label="Description" className="field col-span-2 sm:col-span-1" value={l.label} onChange={(e) => set(i, { label: e.target.value })} />
          <select aria-label="SAC code" className="field" value={l.sac ?? ""} onChange={(e) => set(i, { sac: e.target.value })}>
            <option value="">SAC</option>{SAC.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
          </select>
          <input aria-label="Quantity" className="field" type="number" min={0} value={l.qty ?? 1} onChange={(e) => set(i, { qty: Number(e.target.value) })} />
          <input aria-label="Rate" className="field" type="number" min={0} value={l.rate ?? l.amount} onChange={(e) => set(i, { rate: Number(e.target.value) })} />
          <button type="button" aria-label="Remove line" className="flex h-11 w-11 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" onClick={() => onChange(lines.filter((_, j) => j !== i))}><Trash2 size={16} aria-hidden /></button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" className="justify-self-start" onClick={() => onChange([...lines, { label: "Lab usage (hours)", sac: "998346", qty: 1, rate: 300, amount: 300 }])}>+ Line</Button>
      <dl className="ml-auto grid w-64 grid-cols-2 gap-y-1 text-sm">
        {t.discount > 0 && <><dt className="text-slate-500">Discount</dt><dd className="text-right tabular-nums">−{inr(t.discount)}</dd></>}
        <dt className="text-slate-500">Taxable value</dt><dd className="text-right tabular-nums">{inr(t.sub)}</dd>
        <dt className="text-slate-500">CGST @ {brand.gstRate * 50}%</dt><dd className="text-right tabular-nums">{inr(t.cgst)}</dd>
        <dt className="text-slate-500">SGST @ {brand.gstRate * 50}%</dt><dd className="text-right tabular-nums">{inr(t.sgst)}</dd>
        <dt className="font-semibold">Total</dt><dd className="text-right font-bold tabular-nums">{inr(t.total)}</dd>
      </dl>
    </div>
  );
}

export function LineTable({ lines, discount = 0 }: { lines: InvoiceLine[]; discount?: number }) {
  const t = invoiceTotals(lines, brand.gstRate, discount);
  return (
    <table className="w-full text-sm">
      <thead className="border-b text-left text-xs uppercase text-slate-500"><tr><th className="py-1.5">Description</th><th>SAC</th><th className="text-right">Qty</th><th className="text-right">Rate</th><th className="text-right">Amount</th></tr></thead>
      <tbody>
        {lines.map((l, k) => <tr key={k} className="border-b border-slate-100"><td className="py-1.5">{l.label}</td><td>{l.sac ?? "—"}</td><td className="text-right tabular-nums">{l.qty ?? 1}</td><td className="text-right tabular-nums">{inr(l.rate ?? l.amount)}</td><td className="text-right tabular-nums">{inr(l.amount)}</td></tr>)}
      </tbody>
      <tfoot className="tabular-nums">
        {t.discount > 0 && <tr><td colSpan={4} className="pt-2 text-right text-slate-500">Less: discount</td><td className="pt-2 text-right">−{inr(t.discount)}</td></tr>}
        <tr><td colSpan={4} className="pt-2 text-right text-slate-500">Taxable value</td><td className="pt-2 text-right">{inr(t.sub)}</td></tr>
        <tr><td colSpan={4} className="text-right text-slate-500">CGST @ {brand.gstRate * 50}%</td><td className="text-right">{inr(t.cgst)}</td></tr>
        <tr><td colSpan={4} className="text-right text-slate-500">SGST @ {brand.gstRate * 50}%</td><td className="text-right">{inr(t.sgst)}</td></tr>
        <tr className="font-bold"><td colSpan={4} className="text-right">Total</td><td className="text-right">{inr(t.total)}</td></tr>
      </tfoot>
    </table>
  );
}
