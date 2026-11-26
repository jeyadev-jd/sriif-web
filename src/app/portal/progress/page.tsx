"use client";

import { ProgressSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Progress review" sub="Submit KPIs, revenue and growth updates each quarter. SRIIF admins review every submission." />
      <ProgressSection s={s} mode="startup" />
    </>
  );
}
