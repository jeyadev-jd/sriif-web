"use client";

import { DocumentsSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Incorporation & legal documents" sub="PDF only, versioned, with expiry reminders. Only you and SRIIF admin see this vault." />
      <DocumentsSection s={s} mode="startup" />
    </>
  );
}
