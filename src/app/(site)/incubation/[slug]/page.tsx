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
      <Container className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-brand-dark">What you get</h2>
          <ul className="mt-4 space-y-2">{p.bullets.map((b) => <li key={b} className="flex gap-2"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brand" aria-hidden />{b}</li>)}</ul>
        </div>
        <div className="rounded-xl bg-surface p-6 text-sm text-slate-700">
          <h2 className="text-lg font-bold text-brand-dark">Who can apply</h2>
          <p className="mt-2">Students, faculty, alumni and outside founders with a scalable idea in healthcare, assistive technology, sports science, climate or sustainability.</p>
          <h2 className="mt-4 text-lg font-bold text-brand-dark">Fees & equity</h2>
          <p className="mt-2">Seat and lab charges are billed monthly with GST. Equity terms, if any, are shared during onboarding.</p>
        </div>
      </Container>
      <JourneyBlock />
      <CtaBlock />
    </>
  );
}
