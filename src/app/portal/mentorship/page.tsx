"use client";

import { MentorshipSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Mentorship & meetings" sub="Book sessions with mentors SRIIF assigned to you." />
      <MentorshipSection s={s} mode="startup" />
    </>
  );
}
