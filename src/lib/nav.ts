// Sidebar menus for each portal role.
/** icon = lucide icon key mapped in portal-shell (strings so layouts can stay server components). */
export type Tab = { label: string; href: string };
export type NavItem = { label: string; href: string; group?: string; icon: string; tabs?: Tab[] };

export const startupNav: NavItem[] = [
  { label: "Dashboard", href: "/portal", icon: "home" },
  { label: "Progress review", href: "/portal/progress", group: "Priority", icon: "chart" },
  { label: "Profile & pitch deck", href: "/portal/profile", group: "My startup", icon: "building" },
  { label: "Documents vault", href: "/portal/documents", group: "My startup", icon: "folder" },
  { label: "Team & e-verification", href: "/portal/team", group: "My startup", icon: "users" },
  { label: "Facility booking", href: "/portal/facilities", group: "Operations", icon: "door" },
  { label: "Invoices & billing", href: "/portal/invoices", group: "Operations", icon: "receipt" },
  { label: "Support tickets", href: "/portal/tickets", group: "Support", icon: "help" },
  { label: "Messages", href: "/portal/messages", group: "Support", icon: "message" },
  { label: "Cap table & founders", href: "/portal/cap-table", group: "Records", icon: "pie" },
  { label: "Funding & grants", href: "/portal/funding", group: "Records", icon: "coins" },
  { label: "Awards & media", href: "/portal/awards", group: "Records", icon: "award" },
  { label: "Letters & reports (PDF)", href: "/portal/letters", group: "Records", icon: "file" },
];

/** Six top-level areas; each shows its pages as tabs at the top. */
export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "home", tabs: [
    { label: "Analytics", href: "/admin" }, { label: "All insights", href: "/admin/insights" }, { label: "Impact reports", href: "/admin/reports" }, { label: "Audit log", href: "/admin/audit" },
  ] },
  { label: "Startups", href: "/admin/startups", icon: "building", tabs: [
    { label: "All startups", href: "/admin/startups" }, { label: "Onboarding requests", href: "/admin/requests" }, { label: "Onboard", href: "/admin/onboard" },
    { label: "E-verification", href: "/admin/verification" }, { label: "Progress reviews", href: "/admin/reviews" }, { label: "Mentors", href: "/admin/mentors" },
  ] },
  { label: "Facilities", href: "/admin/bookings", icon: "calendar" },
  { label: "Billing", href: "/admin/billing", icon: "receipt" },
  { label: "Helpdesk", href: "/admin/tickets", icon: "help", tabs: [
    { label: "Tickets", href: "/admin/tickets" }, { label: "Messages", href: "/admin/messages" }, { label: "Website inbox", href: "/admin/inbox" }, { label: "Announcements", href: "/admin/notices" },
  ] },
  { label: "Website", href: "/admin/cms", icon: "globe" },
];
