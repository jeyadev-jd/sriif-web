"use client";

import { Tickets } from "@/components/tickets";
import { PageTitle } from "@/components/ui";

export default function Page() {
  return (
    <>
      <PageTitle title="Support tickets" sub="Raise and track issues: IT, facility maintenance, compliance and admin queries." />
      <Tickets mode="startup" />
    </>
  );
}
