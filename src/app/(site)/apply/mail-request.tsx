"use client";

import { useState } from "react";
import { Button, Field } from "@/components/ui";
import { brand } from "@/lib/site";

export function MailRequest() {
  const [f, setF] = useState({ name: "", startup: "", email: "", stage: "Idea", program: "Incubation", idea: "" });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const valid = f.name.trim() && f.startup.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()) && f.idea.trim().length > 20;
  const send = () => {
    const subject = `Incubation request – ${f.startup}`;
    const body = `Dear SRIIF team,\n\nI would like to apply for ${f.program}.\n\nFounder: ${f.name}\nStartup / idea: ${f.startup}\nEmail: ${f.email}\nStage: ${f.stage}\n\nIdea:\n${f.idea}\n\nRegards,\n${f.name}`;
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form className="mt-4 grid gap-3" onSubmit={(e) => { e.preventDefault(); if (valid) send(); }}>
      <Field label="Founder name"><input className="field" value={f.name} onChange={set("name")} required /></Field>
      <Field label="Startup / idea name"><input className="field" value={f.startup} onChange={set("startup")} required /></Field>
      <Field label="Your email" hint="SRIIF will reply to this address"><input className="field" type="email" autoComplete="email" value={f.email} onChange={set("email")} required /></Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Stage"><select className="field" value={f.stage} onChange={set("stage")}>{["Idea", "MVP", "Revenue", "Scaling"].map((s) => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Program"><select className="field" value={f.program} onChange={set("program")}>{["Incubation", "Pre-Incubation"].map((s) => <option key={s}>{s}</option>)}</select></Field>
      </div>
      <Field label="Your idea in a few lines" hint="At least 20 characters"><textarea className="field min-h-28" value={f.idea} onChange={set("idea")} required /></Field>
      <Button type="submit" disabled={!valid}>Write email to SRIIF</Button>
    </form>
  );
}
