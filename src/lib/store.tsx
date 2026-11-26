"use client";

// Demo data store. Everything lives in the browser (localStorage) until a real backend exists.
//
// It is an external store read with useSyncExternalStore: while React hydrates prerendered HTML
// (including Suspense boundaries that hydrate late), components get the server snapshot (seed
// data, no user, no date), so the markup always matches; afterwards they switch to browser data.
import { useSyncExternalStore, type ReactNode } from "react";
import { seed } from "./seed";
import type { DB, Role, Startup } from "./types";

const KEY = "sriif-demo-v2"; // bump when the data shape changes
const SESSION = "sriif-session-v1";

type State = {
  ready: boolean;
  /** Today's ISO date, or "" during prerender (dates must not be read while prerendering). */
  day: string;
  db: DB;
  userId: string | null;
};

const SERVER: State = { ready: false, day: "", db: seed, userId: null };
let state: State = SERVER;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  let db = seed;
  let userId: string | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<DB>;
      db = { ...seed, ...saved, cms: { ...seed.cms, ...saved.cms } };
    }
    userId = localStorage.getItem(SESSION);
  } catch {
    /* corrupted storage: keep seed */
  }
  state = { ready: true, day: today(), db, userId };
}

function set(next: Partial<State>) {
  const prevDb = state.db;
  state = { ...state, ...next };
  if (state.db !== prevDb) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.db));
    } catch {
      console.warn("Browser storage is full: large uploads are not saved in this demo.");
    }
  }
  listeners.forEach((l) => l());
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
}

function login(email: string) {
  const u = state.db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.active) ?? null;
  if (u) {
    localStorage.setItem(SESSION, u.id);
    set({ userId: u.id });
  }
  return u;
}

function logout() {
  localStorage.removeItem(SESSION);
  set({ userId: null });
}

const reset = () => set({ db: structuredClone(seed) });

/** Kept so the layout tree stays unchanged; the store itself is module-level. */
export function StoreProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useStore() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = s.db.users.find((u) => u.id === s.userId && u.active) ?? null;
  return { ready: s.ready, day: s.day, db: s.db, user, login, logout, update, reset };
}

/** The startup a page should show. Startup users are locked to their own startup. */
export function useStartup(id?: string): Startup | null {
  const { db, user } = useStore();
  const sid = user?.role === "startup" ? user.startupId : id;
  return db.startups.find((s) => s.id === sid) ?? null;
}

export function homeFor(role: Role) {
  return role === "admin" ? "/admin" : role === "mentor" ? "/mentor" : "/portal";
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => new Date().toISOString().slice(0, 10);
export function nowStamp() {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;
}

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
export function invoiceTotals(lines: { amount: number }[], gstRate = 0.18) {
  const sub = lines.reduce((a, l) => a + l.amount, 0);
  const cgst = Math.round((sub * gstRate) / 2);
  const sgst = cgst;
  const gst = cgst + sgst;
  return { sub, cgst, sgst, gst, total: sub + gst };
}

/** Events on or after today, soonest first. */
export function upcomingEvents<T extends { date: string }>(events: T[], day: string) {
  return events.filter((e) => e.date >= day).sort((a, b) => a.date.localeCompare(b.date));
}
