"use client";

import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, ExternalLink, Pause, Play, Building2, CheckCircle2, FlaskConical, GraduationCap, HandCoins, Handshake, Lightbulb, Rocket, Scale, Store, UserRoundCheck, Users, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { about, asset, brand, facilities, journey, mentors, programs, team, why } from "@/lib/site";
import { useStore } from "@/lib/store";
import type { Showcase } from "@/lib/types";

export { EventsBlock, FaqBlock, ImpactBlock, JoinBlock, PartnersBlock, TestimonialsBlock } from "./cms-blocks";
import { Container, SectionHead } from "./site-chrome";
import { cx, LinkButton } from "./ui";

/** Auto-rotating hero banner. Slides are managed in Admin → Website → Hero slider. */
export function Hero() {
  const { db } = useStore();
  const slides = db.cms.slides.filter((x) => x.show);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const cur = n ? i % n : 0;
  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((v) => v + 1), 6000);
    return () => clearTimeout(t);
  }, [i, paused, n]);
  if (!n) return null;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  return (
    <section aria-roledescription="carousel" aria-label="Highlights" className="relative isolate overflow-hidden bg-brand-dark text-white"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="relative min-h-[34rem] md:min-h-[38rem]">
        {slides.map((s, k) => (
          <div key={s.id} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} inert={k !== cur}
            className={cx("absolute inset-0 transition-opacity duration-700", k === cur ? "opacity-100" : "pointer-events-none opacity-0")}>
            {s.img && <Image src={s.img} alt="" fill priority={k === 0} loading={k === 0 ? undefined : "lazy"} sizes="100vw" className="-z-10 object-cover" />}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-brand-dark/20" aria-hidden />
            <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-20">
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-accent backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />SRIIF · SRIHER, Chennai
              </p>
              {k === 0 ? <h1 className="display mt-5 max-w-3xl text-5xl sm:text-6xl lg:text-7xl">{s.title}</h1> : <h2 className="display mt-5 max-w-3xl text-5xl sm:text-6xl lg:text-7xl">{s.title}</h2>}
              <p className="mt-5 max-w-xl text-lg text-white/85">{s.sub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {s.ctaHref && <LinkButton href={s.ctaHref} variant="accent" className="min-h-12 px-6 text-base uppercase tracking-wide">{s.ctaLabel}</LinkButton>}
                <LinkButton href="/login" variant="outline" className="min-h-12 border-white/40 bg-transparent px-6 text-base text-white hover:bg-white/10">Portal login</LinkButton>
              </div>
            </div>
          </div>
        ))}
      </div>
      {n > 1 && (
        <div className="absolute inset-x-0 bottom-5 mx-auto flex max-w-7xl items-center gap-3 px-4">
          <button onClick={() => go(-1)} aria-label="Previous slide" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><ChevronLeft size={20} aria-hidden /></button>
          <div className="flex gap-2">
            {slides.map((s, k) => <button key={s.id} onClick={() => setI(k)} aria-label={`Go to slide ${k + 1}`} aria-current={k === cur} className="flex h-11 items-center"><span className={cx("block h-1.5 rounded-full transition-all", k === cur ? "w-10 bg-accent" : "w-5 bg-white/40")} /></button>)}
          </div>
          <button onClick={() => go(1)} aria-label="Next slide" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><ChevronRight size={20} aria-hidden /></button>
          <button onClick={() => setPaused((v) => !v)} aria-label={paused ? "Play slides" : "Pause slides"} className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">{paused ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}</button>
        </div>
      )}
    </section>
  );
}

export function AboutBlock() {
  return (
    <Container>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <Image src={asset("/img/sriif1.webp")} alt="SRIIF incubation centre" width={720} height={520} className="rounded-2xl object-cover shadow-lg" />
          <span className="absolute -bottom-4 left-6 rounded-full bg-accent px-4 py-2 text-sm font-bold text-brand-dark shadow">{brand.since}</span>
        </div>
        <div>
          <SectionHead label="About us" title="Building the next generation of founders" sub={about.intro} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {about.points.map((p) => <li key={p} className="flex gap-2 text-sm text-slate-700"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />{p}</li>)}
          </ul>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-surface p-4"><p className="font-semibold text-brand">Vision</p><p className="mt-1 text-sm text-slate-600">{about.vision}</p></div>
            <div className="rounded-xl bg-surface p-4"><p className="font-semibold text-brand">Mission</p><p className="mt-1 text-sm text-slate-600">{about.mission}</p></div>
          </div>
        </div>
      </div>
    </Container>
  );
}

const WHY_ICONS = [Users, HandCoins, Store, Building2, GraduationCap, Scale];

function WhyTile({ w, i, className, dark, gold }: { w: (typeof why)[number]; i: number; className?: string; dark?: boolean; gold?: boolean }) {
  const I = WHY_ICONS[i];
  return (
    <div className={cx("group flex flex-col justify-between rounded-2xl border p-7 transition duration-200 hover:-translate-y-0.5", dark ? "border-brand-dark bg-brand-dark text-white" : gold ? "border-mist bg-mist text-brand-dark" : "border-slate-200 bg-white hover:shadow-md", className)}>
      <span className={cx("flex h-12 w-12 items-center justify-center rounded-xl", dark ? "bg-white/10 text-accent" : gold ? "bg-white/60 text-brand" : "bg-brand-50 text-brand")}><I size={24} aria-hidden /></span>
      <div className="mt-10">
        <h3 className="display text-3xl">{w.title}</h3>
        <p className={cx("mt-2 text-sm", dark ? "text-white/75" : gold ? "text-brand-dark/80" : "text-slate-600")}>{w.desc}</p>
      </div>
    </div>
  );
}


export function WhyBlock() {
  const [mentorsW, money, market, space, talent, compliance] = why;
  return (
    <Container>
      <SectionHead label="Why SRIIF" title="Built for" mark="founders" sub="Six things every startup asks for. We bring them together on one campus." />
      <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
        <WhyTile w={mentorsW} i={0} className="md:col-span-2" />
        <WhyTile w={money} i={1} dark className="md:row-span-2" />
        <WhyTile w={market} i={2} gold />
        <WhyTile w={space} i={3} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <WhyTile w={talent} i={4} />
        <WhyTile w={compliance} i={5} />
      </div>
    </Container>
  );
}


export function ProgramsBlock() {
  const [sel, setSel] = useState(0);
  const p = programs[sel];
  return (
    <Container>
      <SectionHead label="Programs" title="Find the right program for your stage" sub="Pick a track to see what you get and how to apply." />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col">
          {programs.map((x, i) => (
            <button key={x.slug} onClick={() => setSel(i)} className={cx("rounded-xl border px-4 py-3 text-left", i === sel ? "border-brand bg-brand text-white" : "border-slate-200 bg-white hover:border-brand")}>
              <p className="font-semibold">{x.title}</p>
              <p className={cx("text-xs", i === sel ? "text-white/70" : "text-slate-500")}>{x.duration} · {x.stage}</p>
            </button>
          ))}
        </div>
        <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-2">
          <div className="relative min-h-56"><Image src={p.img} alt={p.title} fill className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" /></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-brand-dark">{p.title}</h3>
            <p className="mt-2 text-slate-600">{p.desc}</p>
            <ul className="mt-4 space-y-2">{p.bullets.map((b) => <li key={b} className="flex gap-2 text-sm"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />{b}</li>)}</ul>
            <div className="mt-6 flex gap-2">
              <LinkButton href={`/incubation/${p.slug}`} variant="outline" size="sm">Details</LinkButton>
              <LinkButton href="/apply" size="sm">Apply</LinkButton>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export function JourneyBlock() {
  return (
    <section className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The journey</p>
          <h2 className="display mt-3 text-6xl md:text-7xl">How it<br />works</h2>
          <p className="mt-4 max-w-sm text-white/70">Joining SRIIF is by selection. Our team reviews every request and onboards selected teams on the portal.</p>
        </div>
        <ol className="grid gap-8">
          {journey.map((j, i) => (
            <li key={j.title} className="flex gap-6 border-b border-white/10 pb-8 last:border-0 last:pb-0">
              <span className="display outline-num w-20 shrink-0 text-6xl">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="display text-2xl">{j.title}</h3>
                <p className="mt-1 text-white/70">{j.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FacilitiesBlock({ all }: { all?: boolean }) {
  const list = all ? facilities : facilities.slice(0, 5);
  return (
    <Container>
      <SectionHead label="Facilities" title="Spaces built for making things" sub="Co-working, labs, meeting rooms, clinical facilities and shared equipment." />
      <div className="grid auto-rows-[15rem] gap-4 md:grid-cols-3">
        {list.map((f, i) => (
          <div key={f.title} className={cx("group relative overflow-hidden rounded-2xl", i === 0 && "md:col-span-2 md:row-span-2")}>
            <Image src={f.img} alt={f.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 768px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 to-transparent" />
            <div className="absolute bottom-0 p-5 text-white">
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-brand-dark">{f.tag}</span>
              <h3 className="mt-2 text-lg font-bold">{f.title}</h3>
              <p className="text-sm text-white/80">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}


function Initials({ name }: { name: string }) {
  const i = name.replace(/^(Dr\.|Mr\.|Ms\.)\s*/, "").split(" ").map((x) => x[0]).slice(0, 2).join("");
  return <div className="display flex h-full w-full items-center justify-center bg-mist text-6xl text-brand-dark/70">{i}</div>;
}

export function TeamBlock() {
  return (
    <Container>
      <SectionHead label="Our team" title="The people behind SRIIF" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((t) => (
          <div key={t.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="relative h-56">{t.img ? <Image src={t.img} alt={t.name} fill className="object-cover" sizes="25vw" /> : <Initials name={t.name} />}</div>
            <div className="p-4">
              <p className="font-semibold text-brand-dark">{t.name}</p>
              <p className="text-sm font-medium text-brand">{t.role}</p>
              <p className="mt-1 text-sm text-slate-600">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export function MentorsBlock() {
  return (
    <Container>
      <SectionHead label="Mentors" title="Learn from people who have done it" sub="Domain experts who review SRIIF startups and guide founders." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.map((m) => (
          <div key={m.name} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-lg font-semibold text-brand-dark">{m.name}</p>
            <p className="text-sm font-medium text-brand">{m.area} · <span className="font-normal text-slate-500">{m.role}</span></p>
            <p className="mt-2 text-sm text-slate-600">{m.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1">{m.tags.map((t) => <span key={t} className="rounded-full bg-surface px-2 py-0.5 text-xs text-brand">{t}</span>)}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl bg-surface p-5 text-sm text-slate-700">
        Want to mentor SRIIF startups? <Link className="font-semibold text-brand underline" href="/join?role=Mentor">Express interest on the Join Us page</Link>.
      </div>
    </Container>
  );
}

function Logo({ s, size = 48 }: { s: Showcase; size?: number }) {
  return s.logo
    ? <Image src={s.logo} alt="" width={size} height={size} unoptimized className="shrink-0 rounded-lg bg-white object-contain" style={{ width: size, height: size }} />
    : <span className="display flex shrink-0 items-center justify-center rounded-lg bg-mist text-xl text-brand-dark" style={{ width: size, height: size }} aria-hidden>{s.name[0]}</span>;
}

/** Startups chosen by admin (Website → Startup showcase). Each card opens the startup's own website. */
export function StartupsBlock({ limit }: { limit?: number }) {
  const { db } = useStore();
  const shown = db.cms.showcase.filter((s) => s.show);
  const sectors = ["All", ...Array.from(new Set(shown.map((s) => s.sector)))];
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const list = shown.filter((s) => (f === "All" || s.sector === f) && s.name.toLowerCase().includes(q.toLowerCase()));
  const Card = ({ s }: { s: Showcase }) => (
    <a href={s.website || undefined} target="_blank" rel="noopener noreferrer" className="group flex h-full gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand">
      <Logo s={s} />
      <span className="min-w-0">
        <span className="flex items-center gap-1 font-semibold text-brand-dark group-hover:text-brand">{s.name}{s.website && <ExternalLink size={14} aria-hidden />}</span>
        <span className="block text-sm text-slate-600">{s.desc}</span>
        <span className="mt-1 block text-xs text-slate-500">{s.sector} · {s.stage} · {s.year}</span>
        {s.website && <span className="sr-only">(opens website in new tab)</span>}
      </span>
    </a>
  );
  if (limit) {
    // Home page: continuous auto-scrolling strip (pauses on hover; static when reduced motion is on).
    const loop = [...shown, ...shown];
    return (
      <Container>
        <SectionHead label="Our startups" title="Startups incubated at SRIIF" sub="Click a startup to visit its website." />
        <div className="marquee group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
          <ul className="marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]" style={{ animationDuration: `${Math.max(20, shown.length * 6)}s` }}>
            {loop.map((s, k) => <li key={s.id + k} className="w-80 shrink-0" aria-hidden={k >= shown.length}><Card s={s} /></li>)}
          </ul>
        </div>
        <div className="mt-6"><LinkButton href="/startups" variant="outline">See all startups</LinkButton></div>
      </Container>
    );
  }
  return (
    <Container>
      <SectionHead label="Our startups" title="Startups incubated at SRIIF" sub="Only public details are shown. Click a startup to visit its website." />
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <input className="field max-w-xs" placeholder="Search startups" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search startups" />
        {sectors.map((s) => <button key={s} onClick={() => setF(s)} className={cx("min-h-10 rounded-full px-3 text-sm", f === s ? "bg-brand text-white" : "bg-surface text-slate-700")}>{s}</button>)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => <Card key={s.id} s={s} />)}
      </div>
      {list.length === 0 && <p className="text-sm text-slate-500">No startups match.</p>}
    </Container>
  );
}

export function CtaBlock() {
  return (
    <section className="relative overflow-hidden bg-accent text-brand-dark">
      <span className="display pointer-events-none absolute -left-4 top-2 select-none text-[9rem] text-brand-dark/10 md:text-[14rem]" aria-hidden>SRIIF</span>
      <span className="display pointer-events-none absolute -bottom-10 -right-4 select-none text-[9rem] text-brand-dark/10 md:text-[14rem]" aria-hidden>SRIIF</span>
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
        <h2 className="display text-5xl md:text-7xl">Ready to turn your idea into a company?</h2>
        <p className="mx-auto mt-5 max-w-xl text-brand-dark/80">Send us your idea. Our team replies and, if selected, onboards your whole team on the SRIIF portal.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/apply" className="min-h-12 bg-brand-dark px-6 text-base uppercase tracking-wide hover:bg-brand">Apply for incubation</LinkButton>
          <LinkButton href="/contact" variant="outline" className="min-h-12 border-brand-dark/40 px-6 text-base text-brand-dark hover:bg-brand-dark/5">Talk to us</LinkButton>
        </div>
      </div>
    </section>
  );
}

const PATHS = [
  { icon: Rocket, who: "I am a founder", desc: "Incubation, seats, labs and mentors for your startup.", href: "/apply", cta: "Apply for incubation" },
  { icon: Lightbulb, who: "I am a student or faculty", desc: "Turn research or a campus idea into a venture with Pre-Incubation.", href: "/incubation/pre-incubation", cta: "See Pre-Incubation" },
  { icon: UserRoundCheck, who: "I want to mentor", desc: "Guide healthcare and deep-tech founders in your domain.", href: "/join?role=Mentor", cta: "Become a mentor" },
  { icon: Handshake, who: "I represent a partner", desc: "Labs, hospital pilots, CSR challenges and services.", href: "/join?role=Corporate%20partner", cta: "Partner with SRIIF" },
];

/** Enterprise-gateway path selection: one clear entry per audience. */
export function GatewayBlock() {
  return (
    <Container className="py-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PATHS.map(({ icon: I, who, desc, href, cta }) => (
          <Link key={who} href={href} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand transition group-hover:bg-brand group-hover:text-white"><I size={24} aria-hidden /></span>
            <p className="mt-4 text-lg font-bold text-brand-dark">{who}</p>
            <p className="mt-1 flex-1 text-sm text-slate-600">{desc}</p>
            <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand">{cta}<ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden /></span>
          </Link>
        ))}
      </div>
    </Container>
  );
}

const TRUST = [
  { icon: BadgeCheck, label: "BIRAC BioNEST supported" },
  { icon: BadgeCheck, label: "Startup TN recognised" },
  { icon: Building2, label: "1200-bed tertiary hospital" },
  { icon: FlaskConical, label: "GLP & CDSCO-approved facilities" },
];

export function TrustStrip() {
  return (
    <div className="border-b border-slate-200 bg-surface">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-sm font-medium text-slate-700">
        {TRUST.map(({ icon: I, label }) => <li key={label} className="flex items-center gap-2"><I size={18} className="text-brand" aria-hidden />{label}</li>)}
      </ul>
    </div>
  );
}

const OLD_WAY = [
  { t: "Building alone", d: "No lab, no clinical access, no one to test the idea with." },
  { t: "Compliance maze", d: "Incorporation, GST, DPIIT, IP and ethics approvals figured out by trial and error." },
  { t: "Cold investor emails", d: "Pitching without warm introductions or a track record." },
];
const SRIIF_WAY = [
  { t: "Labs & hospital on campus", d: "Wet lab, instrumentation, GLP animal facility and a 1200-bed hospital." },
  { t: "Compliance desk", d: "Legal, IP, GST and regulatory help through partnered services." },
  { t: "Demo Days & grants", d: "BIRAC BioNEST, Startup TN and investor connects every cohort." },
];

/** Editorial "old way vs SRIIF way" comparison. */
export function CompareBlock() {
  return (
    <section className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 md:grid-cols-2">
        <div className="p-2 md:p-6">
          <h2 className="display text-4xl text-white/40 md:text-5xl">Without an incubator</h2>
          <ul className="mt-8 grid gap-6">
            {OLD_WAY.map((x) => (
              <li key={x.t} className="flex gap-3"><XCircle size={22} className="mt-0.5 shrink-0 text-red-400/80" aria-hidden /><div><p className="font-semibold text-white/80">{x.t}</p><p className="text-sm text-white/50">{x.d}</p></div></li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="display border-l-4 border-accent pl-4 text-4xl md:text-5xl">The SRIIF way</h2>
          <ul className="mt-8 grid gap-6">
            {SRIIF_WAY.map((x) => (
              <li key={x.t} className="flex gap-3"><CheckCircle2 size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden /><div><p className="font-semibold">{x.t}</p><p className="text-sm text-white/65">{x.d}</p></div></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
