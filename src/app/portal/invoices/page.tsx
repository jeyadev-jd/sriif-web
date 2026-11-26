"use client";

import { InvoicesSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Invoices & payments" sub="Monthly invoices with 18% GST. Pay and submit your UTR." />
      <InvoicesSection s={s} mode="startup" />
    </>
  );
}
