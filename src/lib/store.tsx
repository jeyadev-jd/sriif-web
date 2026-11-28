"use client";

// Demo data store. Everything lives in the browser (localStorage) until a real backend exists.
//
// It is an external store read with useSyncExternalStore: while React hydrates prerendered HTML
// (including Suspense boundaries that hydrate late), components get the server snapshot (seed
// data, no user, no date), so the markup always matches; afterwards they switch to browser data.
import { useSyncExternalStore, type ReactNode } from "react";
import { seed } from "./seed";
import { nowStamp } from "./store-utils";
import type { DB, Role, Startup, User } from "./types";

const KEY = "sriif-demo-v3"; // bump when the data shape changes
const SESSION = "sriif-session-v1";
/** NEXT_PUBLIC_API=1: data comes from the Postgres-backed API instead of browser storage. */
export const API = process.env.NEXT_PUBLIC_API === "1";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type State = {
  ready: boolean;
  /** Today's ISO date, or "" during prerender (dates must not be read while prerendering). */
  day: string;
  db: DB;
  userId: string | null;
  /** Last save error from the server, shown in the portal. */
  error: string;
};

const SERVER: State = { ready: false, day: "", db: seed, userId: null, error: "" };
let state: State = SERVER;
let loaded = false;
const listeners = new Set<() => void>();

/** Fill fields that older saved data may lack. */
const withDefaults = (saved: Partial<DB>): DB => ({ ...seed, ...saved, cms: { ...seed.cms, ...saved.cms } });

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  if (API) { void refresh(); return; }
  let db = seed;
  let userId: string | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) db = withDefaults(JSON.parse(raw) as Partial<DB>);
    userId = localStorage.getItem(SESSION);
  } catch {
    /* corrupted storage: keep seed */
  }
  state = { ...state, ready: true, day: today(), db, userId };
}

function set(next: Partial<State>) {
  const prevDb = state.db;
  state = { ...state, ...next };
  if (!API && state.db !== prevDb) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.db));
    } catch {
      console.warn("Browser storage is full: large uploads are not saved in this demo.");
    }
  }
  listeners.forEach((l) => l());
}

// ── API mode: the server keeps the data; the browser holds the last state it received (base). ──
let base: DB = seed;
let dirty = false;
let flushing = false;

async function api<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`${BASE_PATH}/api/${path}`, body === undefined ? { cache: "no-store" } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j as { error?: string }).error ?? `Request failed (${r.status})`);
  return j as T;
}

async function refresh() {
  try {
    const r = await api<{ userId: string | null; db: DB }>("state");
    base = withDefaults(r.db);
    set({ ready: true, day: today(), db: base, userId: r.userId, error: "" });
  } catch (e) {
    set({ ready: true, day: today(), error: (e as Error).message });
  }
}

/** Send local edits; while a save is running, further edits are batched into the next one. */
async function flush() {
  if (flushing) return;
  flushing = true;
  while (dirty) {
    dirty = false;
    try {
      const r = await api<{ userId: string | null; db: DB }>("state", { base, next: state.db });
      base = withDefaults(r.db);
      if (!dirty) set({ db: base, userId: r.userId, error: "" });
    } catch (e) {
      set({ db: base, error: (e as Error).message }); // roll back to the last saved state
    }
  }
  flushing = false;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => SERVER;

function update(fn: (d: DB) => void, auditAction?: string) {
  const next = structuredClone(state.db);
  fn(next);
  if (auditAction) {
    const by = state.db.users.find((u) => u.id === state.userId)?.name ?? "system";
    next.audit.unshift({ at: nowStamp(), by, action: auditAction });
  }
  set({ db: next });
  if (API) { dirty = true; void flush(); }
}

/** Step 1 of login. Returns an error message, or "" when the OTP was sent. */
async function sendOtp(email: string): Promise<string> {
  if (API) {
    try { await api("auth/otp", { email }); return ""; } catch (e) { return (e as Error).message; }
  }
  const u = state.db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  if (!u || u.role === "mentor") return "This email is not registered. Only teams onboarded by SRIIF can log in.";
  if (!u.active) return "This account is disabled. Contact SRIIF admin.";
  return "";
}

/** Step 2 of login. Returns the user, or an error message. */
async function verifyOtp(email: string, otp: string, demoOtp: string): Promise<User | string> {
  if (API) {
    try { await api("auth/verify", { email, otp }); } catch (e) { return (e as Error).message; }
    await refresh();
    return state.db.users.find((u) => u.id === state.userId) ?? "Login failed.";
  }
  if (otp !== demoOtp) return "Wrong OTP.";
  return login(email) ?? "Login failed.";
}

function login(email: string) {
  const u = state.db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.active && x.role !== "mentor") ?? null;
  if (u) {
    localStorage.setItem(SESSION, u.id);
    set({ userId: u.id });
  }
  return u;
}

function logout() {
  if (API) { void api("auth/logout", {}).finally(refresh); set({ userId: null }); return; }
  localStorage.removeItem(SESSION);
  set({ userId: null });
}

const reset = () => { if (!API) set({ db: structuredClone(seed) }); };
const clearError = () => set({ error: "" });

/** Kept so the layout tree stays unchanged; the store itself is module-level. */
export function StoreProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useStore() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = s.db.users.find((u) => u.id === s.userId && u.active && u.role !== "mentor") ?? null;
  return { ready: s.ready, day: s.day, db: s.db, user, error: s.error, login, logout, update, reset, sendOtp, verifyOtp, clearError };
}

/** The startup a page should show. Startup users are locked to their own startup. */
export function useStartup(id?: string): Startup | null {
  const { db, user } = useStore();
  const sid = user?.role === "startup" ? user.startupId : id;
  return db.startups.find((s) => s.id === sid) ?? null;
}

export function homeFor(role: Role) {
  return role === "admin" ? "/admin" : "/portal";
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => new Date().toISOString().slice(0, 10);
export { nowStamp };

/** Days from now until the given ISO date (negative = past). */
export function daysUntil(iso: string) {
  return (new Date(iso).getTime() - Date.now()) / 864e5;
}

export function inr(v: number) {
  return "₹" + Math.round(v).toLocaleString("en-IN");
}

// Fixed month names: Intl output differs between Node and browsers (e.g. "Sept" vs "Sep"),
// which would break hydration of prerendered pages.
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-12-10" → "10 Dec 2026" (year optional). Reads the ISO string directly, so no timezone shift. */
export function fmtDate(iso?: string, withYear = true) {
  if (!iso) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]}${withYear ? ` ${m[1]}` : ""}`;
}

/** Intra-state supply (Tamil Nadu): GST split equally into CGST and SGST. */
export function invoiceTotals(lines: { amount: number }[], gstRate = 0.18, discount = 0) {
  const gross = lines.reduce((a, l) => a + l.amount, 0);
  const sub = Math.max(0, gross - (discount || 0));
  const cgst = Math.round((sub * gstRate) / 2);
  const sgst = cgst;
  const gst = cgst + sgst;
  return { gross, discount: gross - sub, sub, cgst, sgst, gst, total: sub + gst };
}

/** Events on or after today, soonest first. */
export function upcomingEvents<T extends { date: string }>(events: T[], day: string) {
  return events.filter((e) => e.date >= day).sort((a, b) => a.date.localeCompare(b.date));
}
