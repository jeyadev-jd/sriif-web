"use client";

import { Tickets } from "@/components/tickets";
import { PageTitle } from "@/components/ui";

export default function Page() {
  return (
    <>
      <PageTitle title="Tickets" sub="Tickets raised by every startup. Reply, resolve or close." />
      <Tickets mode="admin" />
    </>
  );
}
