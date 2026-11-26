import { EventsExplorer } from "@/components/events-explorer";
import { CtaBlock } from "@/components/sections";
import { PageHero } from "@/components/site-chrome";

export const metadata = { title: "Events" };

export default function Events() {
  return (
    <>
      <PageHero eyebrow="What's happening at SRIIF" title="Events calendar" sub="Workshops, clinics, demo days and investor connects. Pick a date on the calendar or browse upcoming, recent and past events." />
      <EventsExplorer />
      <CtaBlock />
    </>
  );
}
