import { CtaBlock, FaqBlock } from "@/components/sections";
import { PageHero } from "@/components/site-chrome";

export const metadata = { title: "FAQs" };

export default function Faq() {
  return (
    <>
      <PageHero eyebrow="FAQs" title="Questions founders ask us" sub="Application timelines, cohort selection, fees and equity, IP policy and facility access." />
      <FaqBlock />
      <CtaBlock />
    </>
  );
}
