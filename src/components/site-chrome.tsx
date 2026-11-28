"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { siInstagram, siX, siYoutube } from "simple-icons";
import { asset, brand, links, nav } from "@/lib/site";
import { homeFor, useStore } from "@/lib/store";
import { cx, LinkButton } from "./ui";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image src={asset("/img/logo-sm.png")} alt="SRIIF logo" width={44} height={44} className="rounded-full bg-white" priority />
      <span className="leading-tight">
        <span className={cx("block text-lg font-extrabold tracking-wide", light ? "text-white" : "text-brand")}>{brand.name}</span>
        <span className={cx("hidden text-[11px] sm:block", light ? "text-white/70" : "text-slate-500 xl:hidden 2xl:block")}>{brand.fullName}</span>
      </span>
    </Link>
  );
}

function AuthButton() {
  const { user, ready } = useStore();
  if (ready && user) return <LinkButton href={homeFor(user.role)} variant="outline" size="sm">My portal</LinkButton>;
  return <LinkButton href="/login" variant="outline" size="sm">Portal Login</LinkButton>;
}

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={cx("sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow", scrolled ? "border-slate-200 shadow-sm" : "border-transparent")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {nav.map((n) => (
            <div key={n.label} className="group relative">
              <Link href={n.href} className={cx("flex min-h-11 items-center gap-1 whitespace-nowrap rounded-md px-2.5 text-sm font-medium transition-colors hover:bg-slate-100", (path === n.href || (n.href !== "/" && path.startsWith(n.href))) ? "text-brand" : "text-slate-700")}>
                {n.label}{n.children && <ChevronDown size={14} className="transition group-hover:rotate-180" aria-hidden />}
              </Link>
              {n.children && (
                <div className="invisible absolute left-0 top-full min-w-56 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {n.children.map((c) => (
                    <Link key={c.href} href={c.href} className="block rounded-md px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand">{c.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="hidden items-center gap-2 xl:flex">
          <AuthButton />
          <LinkButton href="/apply" variant="accent" size="sm">Apply for Incubation</LinkButton>
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100 xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}</button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 xl:hidden">
          {nav.map((n) => (
            <div key={n.label} className="py-1">
              <Link href={n.href} onClick={() => setOpen(false)} className="block py-2 font-semibold text-slate-800">{n.label}</Link>
              {n.children?.map((c) => (
                <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="block py-1.5 pl-4 text-sm text-slate-600">{c.label}</Link>
              ))}
            </div>
          ))}
          <div className="mt-3 flex gap-2"><AuthButton /><LinkButton href="/apply" variant="accent" size="sm">Apply for Incubation</LinkButton></div>
        </div>
      )}
    </header>
  );
}

const LINKEDIN = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const SOCIAL = [
  { key: "linkedin", label: "LinkedIn", path: LINKEDIN },
  { key: "x", label: "X (Twitter)", path: siX.path },
  { key: "instagram", label: "Instagram", path: siInstagram.path },
  { key: "youtube", label: "YouTube", path: siYoutube.path },
] as const;

/** Official social media badges. Links are set in Admin → Website content. */
export function SocialBadges({ dark }: { dark?: boolean }) {
  const { db } = useStore();
  return (
    <ul className="flex flex-wrap gap-2" aria-label="SRIIF on social media">
      {SOCIAL.map((x) => {
        const href = db.cms.social[x.key];
        const cls = cx("flex h-11 w-11 items-center justify-center rounded-full transition", dark ? "bg-white/10 text-white hover:bg-accent hover:text-brand-dark" : "bg-brand-50 text-brand hover:bg-brand hover:text-white");
        const icon = <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden><path d={x.path} /></svg>;
        return (
          <li key={x.key}>
            {href ? <a href={href} target="_blank" rel="noreferrer" aria-label={`SRIIF on ${x.label}`} className={cls}>{icon}</a>
              : <span role="img" aria-label={`${x.label} (link coming soon)`} title={`${x.label}: link coming soon`} className={cx(cls, "opacity-50")}>{icon}</span>}
          </li>
        );
      })}
    </ul>
  );
}

const FOOT: [string, [string, string][]][] = [
  ["About", [["About SRIIF", "/about"], ["Our team", "/about/team"], ["Board & advisors", "/about/board"], ["Partners", "/services/partners"], ["Portfolio startups", "/startups"], ["FAQs", "/faq"]]],
  ["Programs", [["Pre-Incubation", "/incubation/pre-incubation"], ["Incubation", "/incubation/incubation"], ["Facilities", "/facilities"], ["Funding support", "/funding"], ["Apply for Incubation", "/apply"]]],
  ["Get involved", [["Events calendar", "/events"], ["Media & Gallery", "/media"], ["Join Us", "/join"], ["Contact Us", "/contact"], ["Portal login", "/login"]]],
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm">{brand.address}</p>
          <p className="mt-3 text-sm">
            <a className="hover:text-white" href={`mailto:${brand.email}`}>{brand.email}</a><br /><a className="hover:text-white" href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a>
          </p>
          <div className="mt-5"><SocialBadges dark /></div>
          <p className="mt-4 text-xs text-white/60">Supported under BIRAC BioNEST and Startup TN.</p>
        </div>
        {FOOT.map(([h, items]) => (
          <div key={h}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{h}</h4>
            {items.map(([l, href]) => <Link key={href} href={href} className="block py-1.5 text-sm hover:text-white">{l}</Link>)}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-white/60">
          <span>© {brand.fullName}</span>
          <a href={links.aboutSriic} target="_blank" rel="noreferrer" className="hover:text-white">SRIHER – About SRIIC</a>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, sub, img, children }: { eyebrow?: string; title: string; sub?: string; img?: string; children?: ReactNode }) {
  return (
    <section className="grid-paper border-b border-slate-200">
      <div className={cx("mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:py-20", img && "lg:grid-cols-[1.2fr_1fr]")}>
        <div>
          {eyebrow && <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden />{eyebrow}</p>}
          <h1 className="display mt-5 max-w-3xl text-5xl text-brand-dark md:text-6xl lg:text-7xl">{title}</h1>
          {sub && <p className="mt-5 max-w-2xl text-lg text-slate-600">{sub}</p>}
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
        {img && (
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 shadow-xl shadow-brand/10 lg:block">
            <Image src={asset(img)} alt="" fill className="object-cover" sizes="40vw" priority />
          </div>
        )}
      </div>
    </section>
  );
}

/** Editorial section heading: Anton title with an optional amber-marked word. */
export function SectionHead({ label, title, mark, after, sub, center }: { label: string; title: string; mark?: string; after?: string; sub?: string; center?: boolean }) {
  return (
    <div className={cx("mb-12", center && "text-center")}>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand"><span className="h-0.5 w-6 bg-accent" aria-hidden />{label}</p>
      <h2 className="display mt-3 text-4xl text-brand-dark md:text-6xl">
        {title}{mark && <> <span className="mark">{mark}</span></>}{after && <> {after}</>}
      </h2>
      {sub && <p className={cx("mt-4 max-w-2xl text-slate-600", center && "mx-auto")}>{sub}</p>}
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto max-w-7xl px-4 py-16", className)}>{children}</div>;
}
