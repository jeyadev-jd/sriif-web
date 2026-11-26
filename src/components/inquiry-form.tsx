"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { INQUIRY_TYPES } from "@/lib/seed";
import { brand } from "@/lib/site";
import { nowStamp, uid, useStore } from "@/lib/store";
import type { Inquiry } from "@/lib/types";
import { Button, Field } from "./ui";

/** Contact Us and Join Us form. Submissions land in Admin → Website inbox (demo: stored in this browser). */
export function InquiryForm({ kind, types, initialType }: { kind: Inquiry["kind"]; types: string[]; initialType?: string }) {
  const { update } = useStore();
  const blank = { name: "", email: "", phone: "", org: "", type: initialType && types.includes(initialType) ? initialType : types[0], message: "" };
  const [f, setF] = useState(blank);
  const [done, setDone] = useState<string | null>(null);
  const bind = (k: keyof typeof f) => ({ value: f[k], onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }) });
  const desk = kind === "Contact" ? INQUIRY_TYPES.find((t) => t.type === f.type)?.desk ?? "SRIIF office" : "Partnerships team";

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6" role="status">
        <p className="flex items-center gap-2 font-semibold text-emerald-800"><CheckCircle2 size={20} aria-hidden />Thank you. Your message was sent to the {done}.</p>
        <p className="mt-2 text-sm text-emerald-900/80">The SRIIF team usually replies within two working days at the email you gave.</p>
        <Button variant="outline" size="sm" className="mt-4 min-h-10" onClick={() => { setF(blank); setDone(null); }}>Send another message</Button>
      </div>
    );
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => {
      e.preventDefault();
      update((d) => { d.inquiries.unshift({ id: uid(), kind, ...f, name: f.name.trim(), email: f.email.trim(), at: nowStamp(), status: "New" }); });
      setDone(desk);
    }}>
      <Field label={kind === "Contact" ? "Inquiry type" : "I want to join as"} className="sm:col-span-2">
        <select className="field" {...bind("type")}>{types.map((t) => <option key={t}>{t}</option>)}</select>
      </Field>
      <Field label="Full name *"><input className="field" required autoComplete="name" {...bind("name")} /></Field>
      <Field label="Email *"><input className="field" type="email" required autoComplete="email" {...bind("email")} /></Field>
      <Field label="Phone (optional)"><input className="field" type="tel" autoComplete="tel" {...bind("phone")} /></Field>
      <Field label={kind === "Contact" ? "Organisation (optional)" : "Organisation *"}><input className="field" autoComplete="organization" required={kind === "Join Us"} {...bind("org")} /></Field>
      <Field label={kind === "Contact" ? "Message *" : "Expertise and how you would like to help *"} className="sm:col-span-2"><textarea className="field min-h-32" required {...bind("message")} /></Field>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="submit" className="min-h-12 px-6 text-base"><Send size={18} aria-hidden />Send message</Button>
        <span className="text-xs text-slate-500">Goes to the {desk}. Prefer email? Write to <a className="text-brand underline" href={`mailto:${brand.email}`}>{brand.email}</a>.</span>
      </div>
    </form>
  );
}
