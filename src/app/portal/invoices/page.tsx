"use client";

import { InvoicesSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Invoices & billing" sub="Itemised tax invoices (CGST + SGST), payment status and PDF receipts." />
      <InvoicesSection s={s} mode="startup" />
    </>
  );
}
