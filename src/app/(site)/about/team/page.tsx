import { CtaBlock, MentorsBlock, TeamBlock } from "@/components/sections";
import { PageHero } from "@/components/site-chrome";

export const metadata = { title: "Our team" };

export default function Team() {
  return (
    <>
      <PageHero eyebrow="About us" title="Our team" sub="The program team that runs SRIIF day to day, and the mentors who guide our founders." />
      <TeamBlock />
      <MentorsBlock />
      <CtaBlock />
    </>
  );
}
