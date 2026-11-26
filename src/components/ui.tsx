"use client";

import { X, type LucideIcon } from "lucide-react";

import Link from "next/link";
import { useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "accent" | "ghost" | "danger" | "outline"; size?: "sm" | "md" };

const btnBase = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";
const btnVariants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  accent: "bg-accent text-brand-dark hover:brightness-95",
  ghost: "text-brand hover:bg-brand/5",
  outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const btnSizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };

export function Button({ variant = "primary", size = "md", className, ...p }: BtnProps) {
  return <button {...p} className={cx(btnBase, btnVariants[variant], btnSizes[size], className)} />;
}

export function LinkButton({ href, variant = "primary", size = "md", className, children, external }: { href: string; variant?: BtnProps["variant"]; size?: BtnProps["size"]; className?: string; children: ReactNode; external?: boolean }) {
  const cls = cx(btnBase, btnVariants[variant ?? "primary"], btnSizes[size ?? "md"], className);
  if (external) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>;
  return <Link href={href} className={cls}>{children}</Link>;
}

export function Card({ children, className, title, action }: { children: ReactNode; className?: string; title?: ReactNode; action?: ReactNode }) {
  return (
    <section className={cx("min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const badgeTones: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

const statusTone: Record<string, keyof typeof badgeTones> = {
  Paid: "green", Approved: "green", Resolved: "green", Done: "green", Active: "green", Onboarded: "green", Confirmed: "green", Closed: "slate", Graduated: "blue",
  Due: "amber", Pending: "amber", Open: "amber", Requested: "amber", New: "amber", "In review": "blue", "In progress": "blue",
  Replied: "blue", Verified: "green", Missing: "red",
  Overdue: "red", Rejected: "red", Declined: "red", Cancelled: "slate", Exited: "slate", Waived: "slate", High: "red", Normal: "slate", Low: "slate",
};

export function Badge({ children, tone }: { children: ReactNode; tone?: keyof typeof badgeTones }) {
  const t = tone ?? (typeof children === "string" ? statusTone[children] : undefined) ?? "slate";
  return <span className={cx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", badgeTones[t])}>{children}</span>;
}

export function Field({ label, children, hint, className }: { label: string; children: ReactNode; hint?: string; className?: string }) {
  return (
    <label className={cx("block text-sm", className)}>
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, note, icon: I, tone = "brand" }: { label: string; value: ReactNode; note?: string; icon?: LucideIcon; tone?: "brand" | "amber" | "red" | "green" }) {
  const tones = { brand: "bg-brand-50 text-brand", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700", green: "bg-emerald-50 text-emerald-700" };
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {I && <span className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tones[tone])}><I size={22} aria-hidden /></span>}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 truncate text-2xl font-bold tabular-nums text-slate-900">{value}</p>
        {note && <p className="mt-0.5 text-xs text-slate-500">{note}</p>}
      </div>
    </div>
  );
}

export function Progress({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="font-medium text-slate-700">{label}</span><span className="font-semibold tabular-nums text-brand">{v}%</span></div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className={cx("h-full rounded-full transition-all duration-500", v === 100 ? "bg-emerald-500" : "bg-brand")} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function Table({ head, rows, empty = "Nothing here yet." }: { head: ReactNode[]; rows: ReactNode[][]; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>{head.map((h, i) => <th key={i} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr><td colSpan={head.length} className="px-3 py-6 text-center text-slate-500">{empty}</td></tr>
          ) : (
            rows.map((r, i) => <tr key={i} className="hover:bg-slate-50/60">{r.map((c, j) => <td key={j} className="px-3 py-2 align-top">{c}</td>)}</tr>)
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 pt-16" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className={cx("w-full rounded-2xl bg-white p-6 shadow-2xl", wide ? "max-w-3xl" : "max-w-lg")} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"><X size={20} aria-hidden /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center text-sm text-slate-500">{children}</div>;
}

export function ReadOnlyNote({ children }: { children: ReactNode }) {
  return <p className="mb-4 rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-800">{children}</p>;
}

/** Reads a picked file as a data URL (logo preview) – demo only. */
export function readFile(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
