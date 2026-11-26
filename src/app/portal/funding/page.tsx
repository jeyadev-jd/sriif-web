"use client";

import { FundingSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Funding, grants & investors" sub="Update every quarter. Feeds SRIIF impact reports." />
      <FundingSection s={s} mode="startup" />
    </>
  );
}
