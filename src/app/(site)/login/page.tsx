"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field } from "@/components/ui";
import { brand } from "@/lib/site";
import { homeFor, useStore } from "@/lib/store";

const demo = [
  ["SRIIF Admin", "admin@sriif.in"],
  ["Startup founder (CareLoop)", "priya@careloop.example.in"],
  ["Startup member (CareLoop)", "arjun@careloop.example.in"],
];

export default function Login() {
  const { login, db } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [err, setErr] = useState("");

  const sendOtp = () => {
    setErr("");
    const u = db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u) return setErr("This email is not registered. Only teams onboarded by SRIIF can log in.");
    if (!u.active) return setErr("This account is disabled. Contact SRIIF admin.");
    setStep("otp");
  };
  const verify = () => {
    if (otp !== brand.demoOtp) return setErr("Wrong OTP.");
    const u = login(email);
    if (u) router.push(homeFor(u.role));
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-brand-dark">Portal login</h1>
        <p className="mt-1 text-sm text-slate-500">For onboarded startups and SRIIF staff.</p>
        <form className="mt-6 grid gap-4" onSubmit={(e) => { e.preventDefault(); if (step === "email") sendOtp(); else verify(); }}>
          <Field label="Registered email"><input className="field" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setStep("email"); }} required autoComplete="email" /></Field>
          {step === "otp" && (
            <Field label="OTP sent to your email" hint={`Demo OTP: ${brand.demoOtp}`}><input className="field tracking-[0.4em]" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} autoFocus /></Field>
          )}
          {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
          <Button type="submit">{step === "email" ? "Send OTP" : "Verify & log in"}</Button>
        </form>
        <p className="mt-6 text-xs text-slate-500">No account? There is no self sign-up. <Link className="text-brand underline" href="/apply">Request incubation</Link> and SRIIF admin will onboard your team.</p>
      </div>
      <div className="rounded-2xl bg-surface p-8">
        <h2 className="font-semibold text-brand-dark">Demo accounts</h2>
        <p className="mt-1 text-sm text-slate-500">Click to fill, then use OTP {brand.demoOtp}.</p>
        <div className="mt-4 grid gap-2">
          {demo.map(([l, e]) => (
            <button key={e} onClick={() => { setEmail(e); setStep("otp"); setErr(""); }} className="rounded-lg bg-white p-3 text-left text-sm shadow-sm hover:ring-2 hover:ring-brand/30">
              <span className="font-medium">{l}</span><br /><span className="text-slate-500">{e}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
