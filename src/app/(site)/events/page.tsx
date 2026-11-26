import { CtaBlock, EventsBlock } from "@/components/sections";
import { PageHero } from "@/components/site-chrome";

export const metadata = { title: "Events" };

export default function Events() {
  return (
    <>
      <PageHero eyebrow="Events" title="Workshops, demo days and meetups" sub="Investors meet SRIIF startups at Demo Day and Investor Connect." img="/img/herohome.jpg" />
      <EventsBlock />
      <CtaBlock />
    </>
  );
}
