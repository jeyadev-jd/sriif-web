import { BoardBlock } from "@/components/board";
import { CtaBlock } from "@/components/sections";
import { PageHero } from "@/components/site-chrome";
import { about } from "@/lib/site";

export const metadata = { title: "Board & advisors" };

export default function Board() {
  return (
    <>
      <PageHero eyebrow="About us" title="Board & advisors" sub={about.governance} />
      <BoardBlock />
      <CtaBlock />
    </>
  );
}
