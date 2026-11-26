"use client";

import { LettersSection } from "@/components/startup-sections";
import { PageTitle } from "@/components/ui";
import { useStartup } from "@/lib/store";

export default function Page() {
  const s = useStartup();
  if (!s) return null;
  return (
    <>
      <PageTitle title="Letters & reports" sub="Auto-generated PDFs. Open, then use Print → Save as PDF." />
      <LettersSection s={s} />
    </>
  );
}
