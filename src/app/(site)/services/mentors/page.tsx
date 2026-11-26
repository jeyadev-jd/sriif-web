import { CtaBlock, MentorsBlock } from "@/components/sections";
import { PageHero } from "@/components/site-chrome";
import { LinkButton } from "@/components/ui";
import { links } from "@/lib/site";

export const metadata = { title: "Mentors" };

export default function Mentors() {
  return (
    <>
      <PageHero eyebrow="Services · Mentors" title="Mentors matched to your stage" sub="SRIIF assigns mentors to each incubated startup. Startups book sessions from the portal." img="/img/cowork.jpg">
        <LinkButton href={links.mentorForm} external variant="accent">Become a mentor</LinkButton>
      </PageHero>
      <MentorsBlock />
      <CtaBlock />
    </>
  );
}
