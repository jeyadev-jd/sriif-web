"use client";

import { ProgressSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Progress & yearly review" sub="Quarterly progress forms and annual review documents." />
      <ProgressSection s={s} mode="startup" />
    </>
  );
}
