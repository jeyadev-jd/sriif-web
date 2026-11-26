"use client";

import { ProfileSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Profile & pitch deck" sub="Brand assets, pitch deck, company details and GSTIN." />
      <ProfileSection s={s} mode="startup" />
    </>
  );
}
