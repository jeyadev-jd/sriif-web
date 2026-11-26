"use client";

import { Tickets } from "@/components/tickets";
import { PageTitle } from "@/components/ui";

export default function Page() {
  return (
    <>
      <PageTitle title="Support tickets" sub="Raise issues to SRIIF admins: facilities, billing, mentors, documents, team changes." />
      <Tickets mode="startup" />
    </>
  );
}
