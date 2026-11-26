"use client";

import { FacilitiesSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Facility booking" sub="Book meeting rooms, labs and seats available to your incubation tier." />
      <FacilitiesSection s={s} mode="startup" />
    </>
  );
}
