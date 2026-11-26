import { Suspense } from "react";
import { PageHero } from "@/components/site-chrome";
import { JoinUs } from "./join-us";

export const metadata = { title: "Join Us" };

export default function Join() {
  return (
    <>
      <PageHero eyebrow="Join Us" title="Support SRIIF founders" sub="Mentors, investors, corporate partners, technology providers and ecosystem enablers can express interest here. This is separate from the startup portal: the SRIIF team reviews each request and follows up." />
      <Suspense><JoinUs /></Suspense>
    </>
  );
}
