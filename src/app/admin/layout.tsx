import { Suspense } from "react";
import { PortalShell } from "@/components/portal-shell";
import { adminNav } from "@/lib/nav";

export default function Layout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="p-10 text-slate-500">Loading…</div>}>
      <PortalShell role="admin" nav={adminNav}>{children}</PortalShell>
    </Suspense>
  );
}
