import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/site-chrome";

export const metadata = { title: "Media & Gallery" };

export default function Media() {
  return (
    <>
      <PageHero eyebrow="Media & Gallery" title="Life at SRIIF" sub="Demo days, workshops, MoU signings, visitor delegations and press coverage." />
      <Gallery />
    </>
  );
}
