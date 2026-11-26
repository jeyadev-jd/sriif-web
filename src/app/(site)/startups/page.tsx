import { CtaBlock, StartupsBlock, StoriesBlock } from "@/components/sections";
import { PageHero } from "@/components/site-chrome";

export const metadata = { title: "Startups" };

export default function Startups() {
  return (
    <>
      <PageHero eyebrow="Portfolio" title="Startups incubated at SRIIF" sub="Search or filter by sector." img="/img/incubation.jpg" />
      <StartupsBlock />
      <StoriesBlock />
      <CtaBlock />
    </>
  );
}
