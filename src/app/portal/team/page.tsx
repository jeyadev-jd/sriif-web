"use client";

import { TeamSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Team" sub="Your team members and their logins." />
      <TeamSection s={s} mode="startup" />
    </>
  );
}
