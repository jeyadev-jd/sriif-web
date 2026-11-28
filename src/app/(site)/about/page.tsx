import { AboutBlock, CtaBlock, ImpactBlock, PartnersBlock, TeamBlock } from "@/components/sections";
import { Container, PageHero, SectionHead } from "@/components/site-chrome";
import { LinkButton } from "@/components/ui";
import { about, links } from "@/lib/site";

export const metadata = { title: "About" };

export default function About() {
  return (
    <>
      <PageHero eyebrow="About SRIIF" title="A university incubator for healthcare and deep-tech founders" sub={about.intro} img="/img/sriif2.webp">
        <LinkButton href={links.aboutSriic} external variant="accent">About SRIIC on sriramachandra.edu</LinkButton>
      </PageHero>
      <AboutBlock />
      <Container className="pt-0">
        <SectionHead label="Focus sectors" title="Where we help most" sub={about.sectors} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-surface p-5"><p className="font-semibold text-brand">Governance</p><p className="mt-1 text-sm text-slate-600">{about.governance}</p></div>
          <div className="rounded-xl bg-surface p-5"><p className="font-semibold text-brand">Recognition</p><ul className="mt-1 text-sm text-slate-600">{about.recognition.map((r) => <li key={r}>• {r}</li>)}</ul></div>
        </div>
      </Container>
      <ImpactBlock />
      <TeamBlock />
      <PartnersBlock />
      <CtaBlock />
    </>
  );
}
