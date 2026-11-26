import { Suspense } from "react";
import { PortalShell } from "@/components/portal-shell";
import { mentorNav } from "@/lib/nav";

export default function Layout({ children }: LayoutProps<"/mentor">) {
  return (
    <Suspense fallback={<div className="p-10 text-slate-500">Loading…</div>}>
      <PortalShell role="mentor" nav={mentorNav}>{children}</PortalShell>
    </Suspense>
  );
}
