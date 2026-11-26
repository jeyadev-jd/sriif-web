"use client";

import {
  Award, Building2, CalendarDays, ChartColumn, ClipboardCheck, Coins, DoorOpen, FileText, FolderLock, History, House, Inbox, LifeBuoy,
  Globe, LogOut, Mail, Megaphone, Menu, MessagesSquare, ShieldCheck, PieChart, Receipt, UserPlus, Users, UsersRound, X, type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { asset } from "@/lib/site";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { NavItem } from "@/lib/nav";
import { homeFor, today, useStore } from "@/lib/store";
import type { DB, Role, User } from "@/lib/types";
import { cx } from "./ui";

const ICONS: Record<string, LucideIcon> = {
  home: House, building: Building2, folder: FolderLock, pie: PieChart, coins: Coins, award: Award, chart: ChartColumn, mentor: UsersRound,
  door: DoorOpen, receipt: Receipt, file: FileText, users: Users, help: LifeBuoy, inbox: Inbox, userplus: UserPlus, clipboard: ClipboardCheck,
  calendar: CalendarDays, megaphone: Megaphone, history: History, message: MessagesSquare, shield: ShieldCheck, globe: Globe, mail: Mail,
};

/** Pending-work counts shown as badges next to sidebar items. */
function badges(db: DB, user: User): Record<string, number> {
  if (user.role === "admin") {
    const all = db.startups;
    return {
      "/admin/requests": db.requests.filter((r) => r.status === "New").length,
      "/admin/tickets": db.tickets.filter((t) => t.status === "Open").length,
      "/admin/bookings": all.flatMap((s) => s.bookings).filter((b) => b.status === "Pending").length,
      "/admin/billing": all.flatMap((s) => s.invoices).filter((i) => i.status === "Due" && i.utr).length,
      "/admin/messages": db.messages.filter((m) => m.role === "startup" && !m.read).length,
      "/admin/inbox": db.inquiries.filter((q) => q.status === "New").length,
      "/admin/verification": all.flatMap((s) => s.memberRequests).filter((r) => r.status === "Pending").length + db.users.flatMap((u) => u.kyc ?? []).filter((k) => k.status === "Pending").length,
    };
  }
  if (user.role === "startup") {
    const s = db.startups.find((x) => x.id === user.startupId);
    if (!s) return {};
    return {
      // tickets where SRIIF replied last and the startup hasn't closed them
      "/portal/tickets": db.tickets.filter((t) => t.startupId === s.id && t.status !== "Closed" && t.messages.at(-1)?.role === "admin").length,
      "/portal/invoices": s.invoices.filter((i) => i.status === "Due" && !i.utr).length,
      "/portal/messages": db.messages.filter((m) => m.startupId === s.id && m.role === "admin" && !m.read).length,
    };
  }
  return {
    "/mentor/meetings": db.startups.flatMap((s) => s.meetings).filter((m) => m.mentorId === user.id && m.status === "Requested" && m.date >= today()).length,
  };
}

const ROLE_LABEL: Record<Role, string> = { admin: "Admin console", startup: "Startup portal", mentor: "Mentor workspace" };

export function PortalShell({ role, nav, children }: { role: Role; nav: NavItem[]; children: ReactNode }) {
  const { ready, user, logout, db } = useStore();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const allowed = ready && user && user.role === role;
  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (user.role !== role) router.replace(homeFor(user.role));
  }, [ready, user, role, router]);

  if (!allowed) {
    return (
      <div className="flex flex-1 items-center justify-center p-10" role="status" aria-live="polite">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-brand/20 border-t-brand" aria-hidden />
        <span className="sr-only">Loading portal</span>
      </div>
    );
  }

  const startup = user.startupId ? db.startups.find((s) => s.id === user.startupId) : null;
  const groups = Array.from(new Set(nav.map((n) => n.group ?? "")));
  const isActive = (href: string) => path === href || (href !== nav[0].href && path.startsWith(href + "/"));
  const counts = badges(db, user);
  const initials = user.name.replace(/^(Dr\.|Mr\.|Ms\.)\s*/, "").split(" ").map((x) => x[0]).slice(0, 2).join("");

  return (
    <div className="flex min-h-screen flex-1 bg-slate-50">
      <aside className={cx("no-print fixed inset-y-0 left-0 z-40 flex w-68 flex-col bg-brand-dark transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src={asset("/img/logo.png")} alt="SRIIF home" width={38} height={38} className="rounded-full bg-white" />
            <span className="text-white"><span className="block font-bold leading-tight">SRIIF</span><span className="text-xs text-white/60">{ROLE_LABEL[role]}</span></span>
          </Link>
          <button className="flex h-11 w-11 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X size={20} aria-hidden /></button>
        </div>
        <nav aria-label="Portal" className="flex-1 overflow-y-auto p-3 text-sm">
          {groups.map((g) => (
            <div key={g} className="mb-4">
              {g && <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/45">{g}</p>}
              {nav.filter((n) => (n.group ?? "") === g).map((n) => {
                const I = ICONS[n.icon] ?? House;
                const active = isActive(n.href);
                const c = counts[n.href] ?? 0;
                return (
                  <Link key={n.href} href={n.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
                    className={cx("relative flex min-h-10 items-center gap-3 rounded-lg px-3 transition-colors", active ? "bg-white/12 font-semibold text-white before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r before:bg-accent" : "text-white/70 hover:bg-white/8 hover:text-white")}>
                    <I size={18} className={active ? "text-accent" : "text-white/55"} aria-hidden />
                    <span className="flex-1">{n.label}</span>
                    {c > 0 && <span className="min-w-5 rounded-full bg-accent px-1.5 text-center text-[11px] font-bold leading-5 text-brand-dark" aria-label={`${c} pending`}>{c}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-brand-dark" aria-hidden>{initials}</span>
            <span className="min-w-0 flex-1 text-white"><span className="block truncate text-sm font-semibold">{user.name}</span><span className="block truncate text-xs text-white/55">{user.designation}</span></span>
            <button onClick={() => { logout(); router.push("/login"); }} aria-label="Log out" title="Log out" className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"><LogOut size={18} aria-hidden /></button>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
          <button className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100 lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={22} aria-hidden /></button>
          <p className="min-w-0 flex-1 truncate text-sm text-slate-500">
            {startup ? <><b className="text-slate-900">{startup.name}</b><span className="hidden sm:inline"> · {startup.program} · {startup.cohort}</span></> : ROLE_LABEL[role]}
          </p>
          <Link href="/" className="hidden text-sm font-medium text-slate-600 hover:text-brand sm:block">Public site</Link>
        </header>
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
