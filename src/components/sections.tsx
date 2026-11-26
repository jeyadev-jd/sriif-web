"use client";

import { ArrowRight, BadgeCheck, Building2, Calendar, CheckCircle2, FlaskConical, GraduationCap, HandCoins, Handshake, Lightbulb, MapPin, Rocket, Scale, Store, UserRoundCheck, Users, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { about, asset, brand, events, facilities, faqs, heroWords, impact, journey, links, mentors, news, partners, programs, publicStartups, stats, stories, team, why } from "@/lib/site";
import { Container, SectionHead } from "./site-chrome";
import { cx, LinkButton } from "./ui";

function Typewriter() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const word = heroWords[i % heroWords.length];
  useEffect(() => {
    const t = setTimeout(() => {
      if (n < word.length) setN(n + 1);
      else { setN(0); setI(i + 1); }
    }, n < word.length ? 80 : 1600);
    return () => clearTimeout(t);
  }, [n, i, word.length]);
  return <span aria-live="off">{word.slice(0, n)}<span className="animate-pulse text-accent" aria-hidden>|</span></span>;
}

function CountUp({ to, prefix, suffix }: { to: number; prefix: string; suffix: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{prefix}{v.toLocaleString("en-IN")}{suffix}</>;
}

export function Hero() {
  return (
    <section className="grid-paper relative overflow-hidden border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 text-center md:pt-20">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand shadow-sm">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />Next cohort · Jan 2027 · applications open
        </p>
        <h1 className="display mx-auto mt-6 max-w-5xl text-5xl text-brand-dark sm:text-7xl lg:text-8xl">
          <span className="sr-only">{brand.tagline} scalable businesses, deep-tech ventures, social impact and global brands</span><span aria-hidden>{brand.tagline}<br /><span className="mark inline-block min-h-[1em]"><Typewriter /></span></span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">{brand.subTagline} At SRIHER, Chennai, beside a 1200-bed hospital.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/apply" variant="accent" className="min-h-12 px-6 text-base uppercase tracking-wide">Apply for incubation</LinkButton>
          <LinkButton href="/login" variant="outline" className="min-h-12 bg-white px-6 text-base">Startup login</LinkButton>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-t-2xl border border-b-0 border-slate-200 bg-white shadow-[0_-20px_60px_-30px_rgb(11_60_111/0.35)]">
          <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs text-slate-400">SRIIF · Sri Ramachandra campus, Porur</span>
          </div>
          <div className="relative aspect-[3/4] bg-brand-dark sm:aspect-[16/9] md:aspect-[16/7]">
            <video className="absolute inset-0 h-full w-full object-cover" src={asset("/img/home.mp4")} poster={asset("/img/herohome.jpg")} autoPlay muted loop playsInline aria-label="Life at the SRIIF incubation centre" />
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-px bg-white/10 backdrop-blur md:grid-cols-4">
              {stats.map((x) => (
                <div key={x.label} className="bg-brand-dark/80 px-5 py-4 text-left text-white">
                  <p className="display text-3xl text-accent md:text-4xl"><CountUp to={x.value} prefix={x.prefix} suffix={x.suffix} /></p>
                  <p className="text-xs text-white/75 md:text-sm">{x.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutBlock() {
  return (
    <Container>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <Image src={asset("/img/sriif1.png")} alt="SRIIF incubation centre" width={720} height={520} className="rounded-2xl object-cover shadow-lg" />
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

export function ImpactBlock() {
  return (
    <div className="border-y border-slate-200 bg-surface">
      <Container>
        <SectionHead label="Our impact" title="Numbers that" mark="speak" sub="What SRIIF founders have built so far." />
        <div className="grid grid-cols-2 divide-slate-200 border-t border-slate-200 md:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          {impact.map((x) => (
            <div key={x.label} className="py-6 lg:px-5 lg:first:pl-0">
              <p className="display text-5xl tabular-nums text-brand-dark">{x.value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{x.label}</p>
              <p className="text-xs text-slate-500">{x.note}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
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

export function PartnersBlock() {
  return (
    <div className="bg-surface">
      <Container>
        <SectionHead center label="Partners" title="Backed by industry, government and academia" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {partners.map((p) => (
            <div key={p.title} className="rounded-xl bg-white p-5 text-center shadow-sm">
              <p className="font-semibold text-brand-dark">{p.title}</p>
              <p className="text-xs text-slate-500">{p.tag}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
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
      <SectionHead label="Mentors" title="Learn from people who have done it" sub="Incubated startups book mentor sessions from their portal." />
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
        Want to mentor SRIIF startups? <a className="font-semibold text-brand underline" href={links.mentorForm} target="_blank" rel="noreferrer">Fill the mentor form</a>.
      </div>
    </Container>
  );
}

export function StartupsBlock({ limit }: { limit?: number }) {
  const sectors = ["All", ...Array.from(new Set(publicStartups.map((s) => s.sector)))];
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const list = publicStartups.filter((s) => (f === "All" || s.sector === f) && s.name.toLowerCase().includes(q.toLowerCase())).slice(0, limit);
  return (
    <Container>
      <SectionHead label="Our startups" title="Startups incubated at SRIIF" sub="Only public details are shown here." />
      {!limit && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <input className="field max-w-xs" placeholder="Search startups" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search startups" />
          {sectors.map((s) => <button key={s} onClick={() => setF(s)} className={cx("rounded-full px-3 py-1 text-sm", f === s ? "bg-brand text-white" : "bg-surface text-slate-700")}>{s}</button>)}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <div key={s.name} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="display flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-mist text-xl text-brand-dark">{s.name[0]}</div>
            <div>
              <p className="font-semibold text-brand-dark">{s.name}</p>
              <p className="text-sm text-slate-600">{s.desc}</p>
              <p className="mt-1 text-xs text-slate-500">{s.sector} · {s.stage} · {s.year}</p>
            </div>
          </div>
        ))}
      </div>
      {limit && <div className="mt-6"><LinkButton href="/startups" variant="outline">See all startups</LinkButton></div>}
    </Container>
  );
}

export function StoriesBlock() {
  return (
    <Container>
      <SectionHead label="Success stories" title="Don't take our" mark="word" after="for it" />
      <div className="grid gap-5 md:grid-cols-3">
        {stories.map((x, i) => (
          <figure key={x.startup} className={cx("flex flex-col rounded-2xl border p-7", i === 1 ? "border-brand-dark bg-brand-dark text-white md:-translate-y-3" : "border-slate-200 bg-white")}>
            <p className={cx("display text-4xl", i === 1 ? "text-accent" : "text-brand-dark")}>{x.stat}</p>
            <blockquote className={cx("mt-4 flex-1", i === 1 ? "text-white/85" : "text-slate-700")}>“{x.quote}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className={cx("flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold", i === 1 ? "bg-accent text-brand-dark" : "bg-brand text-white")} aria-hidden>{x.name.split(" ").map((n) => n[0]).join("")}</span>
              <span className="text-sm"><b className="block">{x.name}</b><span className={i === 1 ? "text-white/60" : "text-slate-500"}>{x.role}, {x.startup}</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  );
}

export function EventsBlock() {
  return (
    <Container>
      <SectionHead label="Events & news" title="What is happening at SRIIF" />
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((e) => (
            <div key={e.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-brand"><Calendar size={15} aria-hidden />{e.date}</p>
              <p className="mt-1 text-lg font-semibold text-brand-dark">{e.title}</p>
              <p className="text-sm text-slate-600">{e.desc}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={14} aria-hidden /> {e.place}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-surface p-5">
          <p className="mb-3 font-semibold text-brand-dark">Latest news</p>
          {news.map((n) => (
            <div key={n.title} className="border-b border-slate-200 py-3 last:border-0">
              <p className="text-xs text-slate-500">{n.date}</p>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-slate-600">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

export function FaqBlock() {
  return (
    <div className="bg-surface">
      <Container className="max-w-3xl">
        <SectionHead center label="FAQs" title="Quick answers" />
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl bg-white p-4 shadow-sm">
              <summary className="cursor-pointer list-none font-semibold text-brand-dark">{f.q}<span className="float-right transition group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </div>
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
  { icon: UserRoundCheck, who: "I want to mentor", desc: "Guide healthcare and deep-tech founders in your domain.", href: "/services/mentors", cta: "Become a mentor" },
  { icon: Handshake, who: "I represent a partner", desc: "Labs, hospital pilots, CSR challenges and services.", href: "/contact", cta: "Talk to SRIIF" },
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
