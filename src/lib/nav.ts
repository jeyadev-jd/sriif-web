// Sidebar menus for each portal role.
/** icon = lucide icon key mapped in portal-shell (strings so layouts can stay server components). */
export type NavItem = { label: string; href: string; group?: string; icon: string };

export const startupNav: NavItem[] = [
  { label: "Dashboard", href: "/portal", icon: "home" },
  { label: "Startup profile", href: "/portal/profile", group: "My startup", icon: "building" },
  { label: "Documents vault", href: "/portal/documents", group: "My startup", icon: "folder" },
  { label: "Cap table & founders", href: "/portal/cap-table", group: "My startup", icon: "pie" },
  { label: "Funding & grants", href: "/portal/funding", group: "My startup", icon: "coins" },
  { label: "Awards & media", href: "/portal/awards", group: "My startup", icon: "award" },
  { label: "Progress & reviews", href: "/portal/progress", group: "My startup", icon: "chart" },
  { label: "Mentorship", href: "/portal/mentorship", group: "Operations", icon: "mentor" },
  { label: "Space & facilities", href: "/portal/facilities", group: "Operations", icon: "door" },
  { label: "Invoices & payments", href: "/portal/invoices", group: "Operations", icon: "receipt" },
  { label: "Letters & reports (PDF)", href: "/portal/letters", group: "Operations", icon: "file" },
  { label: "Team", href: "/portal/team", group: "Help", icon: "users" },
  { label: "Support tickets", href: "/portal/tickets", group: "Help", icon: "help" },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "home" },
  { label: "Onboarding requests", href: "/admin/requests", group: "Onboarding", icon: "inbox" },
  { label: "Onboard a startup", href: "/admin/onboard", group: "Onboarding", icon: "userplus" },
  { label: "All startups", href: "/admin/startups", group: "Startups", icon: "building" },
  { label: "Tickets", href: "/admin/tickets", group: "Startups", icon: "help" },
  { label: "Reviews & scorecards", href: "/admin/reviews", group: "Startups", icon: "clipboard" },
  { label: "Invoices & billing", href: "/admin/billing", group: "Operations", icon: "receipt" },
  { label: "Facility bookings", href: "/admin/bookings", group: "Operations", icon: "calendar" },
  { label: "Mentors", href: "/admin/mentors", group: "Operations", icon: "mentor" },
  { label: "Notices", href: "/admin/notices", group: "Operations", icon: "megaphone" },
  { label: "Impact reports", href: "/admin/reports", group: "Reports", icon: "chart" },
  { label: "Audit log", href: "/admin/audit", group: "Reports", icon: "history" },
];

export const mentorNav: NavItem[] = [
  { label: "My startups", href: "/mentor", icon: "building" },
  { label: "Meetings", href: "/mentor/meetings", icon: "calendar" },
];
