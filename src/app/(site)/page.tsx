import { WhatsOnPopup } from "@/components/whats-on";
import { AboutBlock, CtaBlock, EventsBlock, FacilitiesBlock, FaqBlock, GatewayBlock, Hero, ImpactBlock, JoinBlock, JourneyBlock, PartnersBlock, ProgramsBlock, StartupsBlock, TeamBlock, TestimonialsBlock, TrustStrip, WhyBlock } from "@/components/sections";

export default function Home() {
  return (
    <>
      <WhatsOnPopup />
      <Hero />
      <ImpactBlock />
      <TrustStrip />
      <GatewayBlock />
      <AboutBlock />
      <ProgramsBlock />
      <WhyBlock />
      <JourneyBlock />
      <FacilitiesBlock />
      <EventsBlock />
      <PartnersBlock />
      <StartupsBlock limit={6} />
      <TeamBlock />
      <TestimonialsBlock />
      <JoinBlock />
      <FaqBlock preview />
      <CtaBlock />
    </>
  );
}
