"use client";

import { TeamSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Team & e-verification" sub="Your team, their KYC status and requests for new members." />
      <TeamSection s={s} mode="startup" />
    </>
  );
}
