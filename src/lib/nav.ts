// Sidebar menus for each portal role.
/** icon = lucide icon key mapped in portal-shell (strings so layouts can stay server components). */
export type NavItem = { label: string; href: string; group?: string; icon: string };

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

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "home" },
  { label: "Onboarding requests", href: "/admin/requests", group: "Onboarding", icon: "inbox" },
  { label: "Onboard a startup", href: "/admin/onboard", group: "Onboarding", icon: "userplus" },
  { label: "Team e-verification", href: "/admin/verification", group: "Onboarding", icon: "shield" },
  { label: "All startups", href: "/admin/startups", group: "Startups", icon: "building" },
  { label: "Progress reviews", href: "/admin/reviews", group: "Startups", icon: "clipboard" },
  { label: "Helpdesk tickets", href: "/admin/tickets", group: "Startups", icon: "help" },
  { label: "Messages", href: "/admin/messages", group: "Startups", icon: "message" },
  { label: "Facility control", href: "/admin/bookings", group: "Operations", icon: "calendar" },
  { label: "Invoices & billing", href: "/admin/billing", group: "Operations", icon: "receipt" },
  { label: "Mentors", href: "/admin/mentors", group: "Operations", icon: "mentor" },
  { label: "Announcements", href: "/admin/notices", group: "Operations", icon: "megaphone" },
  { label: "Website content", href: "/admin/cms", group: "Website", icon: "globe" },
  { label: "Website inbox", href: "/admin/inbox", group: "Website", icon: "mail" },
  { label: "Impact reports", href: "/admin/reports", group: "Reports", icon: "chart" },
  { label: "Audit log", href: "/admin/audit", group: "Reports", icon: "history" },
];

export const mentorNav: NavItem[] = [
  { label: "My startups", href: "/mentor", icon: "building" },
  { label: "Meetings", href: "/mentor/meetings", icon: "calendar" },
];
