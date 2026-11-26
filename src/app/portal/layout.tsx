import { Suspense } from "react";
import { PortalShell } from "@/components/portal-shell";
import { startupNav } from "@/lib/nav";

export default function Layout({ children }: LayoutProps<"/portal">) {
  return (
    <Suspense fallback={<div className="p-10 text-slate-500">Loading…</div>}>
      <PortalShell role="startup" nav={startupNav}>{children}</PortalShell>
    </Suspense>
  );
}
