"use client";

// Demo data store. Everything lives in the browser (localStorage) until a real backend exists.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seed } from "./seed";
import type { DB, Role, Startup, User } from "./types";

const KEY = "sriif-demo-v1";
const SESSION = "sriif-session-v1";

type Ctx = {
  ready: boolean;
  db: DB;
  user: User | null;
  login: (email: string) => User | null;
  logout: () => void;
  update: (fn: (d: DB) => void, auditAction?: string) => void;
  reset: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(seed);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // Hydrating from browser storage after mount is intentional (no SSR access to localStorage).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDb(JSON.parse(raw));
      setUserId(localStorage.getItem(SESSION));
    } catch {
      /* corrupted storage: keep seed */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(db));
  }, [db, ready]);

  const user = useMemo(() => db.users.find((u) => u.id === userId && u.active) ?? null, [db.users, userId]);

  const update = useCallback(
    (fn: (d: DB) => void, auditAction?: string) => {
      setDb((prev) => {
        const next = structuredClone(prev);
        fn(next);
        if (auditAction) {
          const by = prev.users.find((u) => u.id === userId)?.name ?? "system";
          next.audit.unshift({ at: nowStamp(), by, action: auditAction });
        }
        return next;
      });
    },
    [userId],
  );

  const login = useCallback(
    (email: string) => {
      const u = db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.active) ?? null;
      if (u) {
        setUserId(u.id);
        localStorage.setItem(SESSION, u.id);
      }
      return u;
    },
    [db.users],
  );

  const logout = useCallback(() => {
    setUserId(null);
    localStorage.removeItem(SESSION);
  }, []);

  const reset = useCallback(() => {
    setDb(structuredClone(seed));
  }, []);

  return <StoreCtx.Provider value={{ ready, db, user, login, logout, update, reset }}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside StoreProvider");
  return c;
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

export function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function invoiceTotals(lines: { amount: number }[], gstRate = 0.18) {
  const sub = lines.reduce((a, l) => a + l.amount, 0);
  const gst = Math.round(sub * gstRate);
  return { sub, gst, total: sub + gst };
}
