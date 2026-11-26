// Data model for the SRIIF portal (demo, stored in the browser).
// Sections follow the "startup login" sheet of SRIIF_website_VR_AT.xlsx.

export type Role = "admin" | "startup" | "mentor";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  designation: string;
  startupId?: string; // startup team members only
  expertise?: string; // mentors only
  active: boolean;
};

export type DocFile = {
  id: string;
  type: string;
  name: string;
  version: number;
  uploadedOn: string;
  expiry?: string;
  financial: boolean; // mentors cannot see financial documents
};

export type Founder = { name: string; designation: string; equity: number; din: string };
export type Holding = { holder: string; category: "Founder" | "ESOP pool" | "Investor" | "SRIIF" | "Other"; pct: number };

export type FundingEntry = {
  id: string;
  amount: number;
  currency: "INR" | "USD";
  type: "Grant" | "Angel" | "VC" | "Debt" | "CSR" | "Bootstrapped";
  source: string;
  date: string;
  round: "Pre-seed" | "Seed" | "Series A" | "Series B+" | "Not applicable";
  proof?: string;
};

export type Award = {
  id: string;
  kind: "Award" | "Achievement" | "Media" | "Association";
  title: string;
  org: string;
  year: string;
  category: string;
  link?: string;
};

export type ProgressReport = {
  id: string;
  period: string; // e.g. "Q3 2026"
  milestones: string;
  users: number;
  revenue: number;
  pilots: number;
  partnerships: number;
  challenges: string;
  support: string;
  submittedOn: string;
  submittedBy: string;
};

export type Scorecard = { team: number; product: number; market: number; execution: number; compliance: number; note: string; by: string };

export type AnnualReview = {
  year: string;
  files: { type: string; name: string; uploadedOn: string }[];
  score?: Scorecard;
  decision?: "Continue" | "Extend" | "Graduate" | "Exit";
};

export type Meeting = {
  id: string;
  mentorId: string;
  date: string;
  time: string;
  agenda: string;
  status: "Requested" | "Confirmed" | "Done" | "Cancelled";
  notes: string;
};

export type Booking = {
  id: string;
  facility: string;
  date: string;
  slot: string;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type Invoice = {
  id: string;
  no: string;
  period: string;
  issued: string;
  due: string;
  lines: { label: string; amount: number }[];
  status: "Due" | "Paid" | "Waived";
  paidOn?: string;
  receiptNo?: string;
  utr?: string; // payment reference sent by startup, verified by admin
};

export type Startup = {
  id: string;
  // 1. Profile
  name: string;
  logo: string; // data URL or ""
  trl: number;
  sectors: string[];
  stage: "Idea" | "MVP" | "Revenue" | "Scaling";
  program: "Pre-Incubation" | "Resident Incubation" | "Virtual Incubation";
  cohort: string;
  onboardedOn: string;
  website: string;
  linkedin: string;
  regAddress: string;
  commAddress: string;
  email: string;
  phone: string;
  oneLiner: string;
  status: "Active" | "Graduated" | "Exited";
  mentorIds: string[];
  seat: { type: string; count: number; rate: number };
  equityTaken: boolean; // section 3 only when SRIIF takes equity
  // 2. Documents
  docs: DocFile[];
  // 3. Cap table
  founders: Founder[];
  holdings: Holding[];
  shareClasses: string;
  capTableFile?: string;
  // 4-8
  funding: FundingEntry[];
  awards: Award[];
  reports: ProgressReport[];
  annual: AnnualReview[];
  meetings: Meeting[];
  bookings: Booking[];
  invoices: Invoice[];
};

export type TicketMsg = { by: string; role: Role; text: string; at: string };

export type Ticket = {
  id: string;
  no: string;
  startupId: string;
  raisedBy: string;
  category: string;
  subject: string;
  priority: "Low" | "Normal" | "High";
  status: "Open" | "In progress" | "Resolved" | "Closed";
  created: string;
  messages: TicketMsg[];
};

// Onboarding requests that arrive by email or the Google form; admin logs and acts on them.
export type JoinRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  startupName: string;
  idea: string;
  stage: string;
  via: "Email" | "Google Form" | "Walk-in";
  receivedOn: string;
  status: "New" | "In review" | "Onboarded" | "Declined";
  note: string;
};

export type Notice = { id: string; title: string; body: string; date: string };
export type AuditEntry = { at: string; by: string; action: string };

export type DB = {
  users: User[];
  startups: Startup[];
  tickets: Ticket[];
  requests: JoinRequest[];
  notices: Notice[];
  audit: AuditEntry[];
  facilities: string[];
};
