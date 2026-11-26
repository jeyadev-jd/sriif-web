"use client";

import { AwardsSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Awards, achievements & media" sub="Patents filed, clinical pilots, launches, press." />
      <AwardsSection s={s} mode="startup" />
    </>
  );
}
