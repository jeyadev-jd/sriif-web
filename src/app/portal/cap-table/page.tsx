"use client";

import { CapTableSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Shareholding, cap table & founders" sub="Required when SRIIF holds equity." />
      <CapTableSection s={s} mode="startup" />
    </>
  );
}
