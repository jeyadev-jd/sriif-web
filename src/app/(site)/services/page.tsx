import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CtaBlock } from "@/components/sections";
import { Container, PageHero } from "@/components/site-chrome";

export const metadata = { title: "Services" };

const items = [
  { href: "/services/mentors", title: "Mentors", desc: "100+ founders, clinicians, investors and domain experts." },
  { href: "/services/partners", title: "Partnered services", desc: "Legal, IP, accounting, regulatory and cloud credits." },
  { href: "/services/co-working", title: "Co-working space", desc: "Desks, cabins and meeting rooms on campus." },
  { href: "/services/labs", title: "Lab & Research", desc: "Wet lab, instrumentation, clinical and hospital access." },
];

export default function Services() {
  return (
    <>
      <PageHero eyebrow="Services" title="Support for every stage" sub="What SRIIF startups get beyond a desk." img="/img/cowork1.webp" />
      <Container>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand hover:shadow-md">
              <p className="flex items-center gap-2 text-xl font-bold text-brand-dark">{i.title} <ArrowRight size={20} className="transition group-hover:translate-x-1" aria-hidden /></p>
              <p className="mt-1 text-slate-600">{i.desc}</p>
            </Link>
          ))}
        </div>
      </Container>
      <CtaBlock />
    </>
  );
}
