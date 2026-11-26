"use client";

import { MessageConsole } from "@/components/messages";
import { PageTitle } from "@/components/ui";

export default function Page() {
  return (
    <>
      <PageTitle title="Messages" sub="Message individual startups or broadcast an announcement to all of them." />
      <MessageConsole />
    </>
  );
}
