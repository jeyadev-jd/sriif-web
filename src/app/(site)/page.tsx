import { AboutBlock, CompareBlock, CtaBlock, EventsBlock, FacilitiesBlock, FaqBlock, GatewayBlock, Hero, ImpactBlock, JourneyBlock, MentorsBlock, PartnersBlock, ProgramsBlock, StartupsBlock, StoriesBlock, TeamBlock, TrustStrip, WhyBlock } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <GatewayBlock />
      <AboutBlock />
      <CompareBlock />
      <WhyBlock />
      <ImpactBlock />
      <ProgramsBlock />
      <JourneyBlock />
      <FacilitiesBlock />
      <PartnersBlock />
      <TeamBlock />
      <MentorsBlock />
      <StartupsBlock limit={6} />
      <StoriesBlock />
      <EventsBlock />
      <FaqBlock />
      <CtaBlock />
    </>
  );
}
