import { Suspense } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<div className="h-[69px] border-b border-slate-200" />}>
        <SiteHeader />
      </Suspense>
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
