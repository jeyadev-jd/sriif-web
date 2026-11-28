import { CtaBlock } from "@/components/sections";
import { Container, PageHero, SectionHead } from "@/components/site-chrome";
import { funding } from "@/lib/site";

export const metadata = { title: "Funding" };

export default function Funding() {
  return (
    <>
      <PageHero eyebrow="Funding" title="Grants, angels and government schemes" sub="SRIIF connects incubated startups to grants and investors. Investors meet startups through SRIIF events, not through the portal." img="/img/herohome.webp" />
      <Container>
        <SectionHead label="Support" title="How we help you raise" />
        <div className="grid gap-5 md:grid-cols-2">
          {funding.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-lg font-semibold text-brand-dark">{f.title}</p>
              <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </Container>
      <CtaBlock />
    </>
  );
}
