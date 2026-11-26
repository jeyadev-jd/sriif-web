import { CtaBlock, PartnersBlock } from "@/components/sections";
import { Container, PageHero, SectionHead } from "@/components/site-chrome";
import { LinkButton } from "@/components/ui";
import { links, partneredServices } from "@/lib/site";

export const metadata = { title: "Partnered services" };

export default function Partnered() {
  return (
    <>
      <PageHero eyebrow="Services · Partners" title="Partnered services" sub="Discounted professional services for incubated startups." img="/img/hospital.jpg">
        <LinkButton href={links.regulatoryForm} external variant="accent">Regulatory Connect form</LinkButton>
      </PageHero>
      <Container>
        <SectionHead label="What is included" title="Services through our partners" />
        <div className="grid gap-5 md:grid-cols-3">
          {partneredServices.map((s) => (
            <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="font-semibold text-brand-dark">{s.title}</p>
              <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
      <PartnersBlock />
      <CtaBlock />
    </>
  );
}
