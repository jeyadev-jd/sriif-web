"use client";

import { FacilitiesSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Space, facilities & access" sub="Seats, access card and facility bookings." />
      <FacilitiesSection s={s} mode="startup" />
    </>
  );
}
