import { CtaBlock, FacilitiesBlock } from "@/components/sections";
import { PageHero } from "@/components/site-chrome";
import { LinkButton } from "@/components/ui";
import { links } from "@/lib/site";

export const metadata = { title: "Lab & Research" };

export default function Labs() {
  return (
    <>
      <PageHero eyebrow="Services · Lab & Research" title="Research-grade labs and clinical access" sub="Wet lab, instrumentation lab, GLP animal facility, CDSCO-approved clinical trial facility and access to a 1200-bed hospital. Outside users pay per use." img="/img/lab.webp">
        <LinkButton href={links.regulatoryForm} external variant="accent">Regulatory Connect</LinkButton>
      </PageHero>
      <FacilitiesBlock all />
      <CtaBlock />
    </>
  );
}
