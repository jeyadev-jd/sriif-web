import Image from "next/image";
import { CtaBlock, FaqBlock, JourneyBlock } from "@/components/sections";
import { Container, PageHero, SectionHead } from "@/components/site-chrome";
import { LinkButton } from "@/components/ui";
import { programs } from "@/lib/site";

export const metadata = { title: "Programs" };

export default function Incubation() {
  return (
    <>
      <PageHero eyebrow="Programs & cohorts" title="Three ways to incubate with SRIIF" sub="Pre-Incubation (3 months), Resident Incubation (6 months) and Virtual Incubation (6 months). Each has clear eligibility, deliverables and a review at the end." img="/img/incubation.jpg">
        <LinkButton href="/apply" variant="accent">Apply for Incubation</LinkButton>
      </PageHero>
      <Container>
        <SectionHead label="Programs" title="Choose your track" />
        <div className="grid gap-6 md:grid-cols-3">
          {programs.map((p) => (
            <div key={p.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="relative h-44"><Image src={p.img} alt={p.title} fill className="object-cover" sizes="33vw" /></div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{p.duration} · {p.stage}</p>
                <h3 className="mt-1 text-xl font-bold text-brand-dark">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
                <LinkButton href={`/incubation/${p.slug}`} size="sm" className="mt-4">View details</LinkButton>
              </div>
            </div>
          ))}
        </div>
      </Container>
      <JourneyBlock />
      <FaqBlock preview />
      <CtaBlock />
    </>
  );
}
