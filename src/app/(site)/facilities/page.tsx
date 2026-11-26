import { CtaBlock, FacilitiesBlock } from "@/components/sections";
import { PageHero } from "@/components/site-chrome";

export const metadata = { title: "Facilities" };

export default function Facilities() {
  return (
    <>
      <PageHero eyebrow="Facilities" title="Labs, hospital access and co-working on one campus" sub="1200-bed tertiary hospital, clinical trial division, GLP-accredited small animal facility, instrumentation lab, ethics and biosafety committees. Incubated startups book facilities from their portal." img="/img/lab.jpg" />
      <FacilitiesBlock all />
      <CtaBlock />
    </>
  );
}
