"use client";

import { ProfileSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Startup profile" sub="Name, TRL, sectors, stage, cohort, addresses and contact." />
      <ProfileSection s={s} mode="startup" />
    </>
  );
}
