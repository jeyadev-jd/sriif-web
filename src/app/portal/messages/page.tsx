"use client";

import { Thread } from "@/components/messages";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Messages" sub="Direct conversation between your team and SRIIF admins. For issues that need tracking, raise a support ticket." />
      <Thread startupId={s.id} mode="startup" />
    </>
  );
}
