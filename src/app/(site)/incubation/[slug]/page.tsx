import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { CtaBlock, JourneyBlock } from "@/components/sections";
import { Container, PageHero } from "@/components/site-chrome";
import { LinkButton } from "@/components/ui";
import { programs } from "@/lib/site";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/incubation/[slug]">) {
  const { slug } = await props.params;
  return { title: programs.find((p) => p.slug === slug)?.title ?? "Program" };
}

export default async function Program(props: PageProps<"/incubation/[slug]">) {
  const { slug } = await props.params;
  const p = programs.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow={`${p.duration} · ${p.stage}`} title={p.title} sub={p.desc} img={p.img}>
        <LinkButton href="/apply" variant="accent">Apply for {p.title}</LinkButton>
      </PageHero>
      <Container className="grid gap-6 md:grid-cols-3">
        {([["What you get", p.bullets], ["Eligibility", p.eligibility], ["Deliverables", p.deliverables]] as const).map(([h, items], k) => (
          <section key={h} className={k === 1 ? "rounded-2xl bg-brand-dark p-6 text-white" : "rounded-2xl border border-slate-200 bg-white p-6"}>
            <h2 className={k === 1 ? "display text-2xl text-accent" : "display text-2xl text-brand-dark"}>{h}</h2>
            <ul className="mt-4 space-y-2.5">{items.map((b) => <li key={b} className="flex gap-2 text-sm"><CheckCircle2 size={18} className={k === 1 ? "mt-0.5 shrink-0 text-accent" : "mt-0.5 shrink-0 text-brand"} aria-hidden />{b}</li>)}</ul>
          </section>
        ))}
        <div className="rounded-2xl bg-surface p-6 text-sm text-slate-700 md:col-span-3">
          <h2 className="font-bold text-brand-dark">Fees & equity</h2>
          <p className="mt-1">Seat and lab charges are billed monthly with GST. Equity terms, if any, are shared during onboarding. Program length: {p.duration}; extensions are decided at the progress review.</p>
        </div>
      </Container>
      <JourneyBlock />
      <CtaBlock />
    </>
  );
}
