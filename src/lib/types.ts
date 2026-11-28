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
  kyc?: KycDoc[]; // e-verification documents for startup team members
};

/** Team member e-verification (KYC). Only file names are kept in this demo. */
export type KycDoc = { type: string; name: string; uploadedOn: string; status: "Pending" | "Verified" | "Rejected" };

/** A startup proposes a team member; only a SRIIF admin can approve and create the login. */
export type MemberRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  kyc: KycDoc[];
  requestedBy: string;
  on: string;
  status: "Pending" | "Approved" | "Rejected";
  note: string;
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
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  byAdmin?: boolean; // allocated by SRIIF on the startup's behalf
};

/** Admin hold on a facility slot: maintenance, an external event or an internal block. */
export type FacilityBlock = { id: string; facility: string; date: string; slot: string; kind: "Blocked" | "External event" | "Maintenance"; reason: string };

/** amount = qty x rate (pre-tax). sac = GST service accounting code. */
export type InvoiceLine = { label: string; amount: number; sac?: string; qty?: number; rate?: number };

export type Invoice = {
  id: string;
  no: string;
  period: string;
  issued: string;
  due: string;
  lines: InvoiceLine[];
  status: "Due" | "Paid" | "Waived" | "Cancelled";
  /** Custom invoices: free-form title, discount and notes. */
  kind?: "Monthly" | "Custom";
  title?: string;
  discount?: number; // flat amount off the taxable value
  notes?: string;
  payments?: { id: string; amount: number; on: string; ref: string; mode: string }[];
  paidOn?: string;
  receiptNo?: string;
  utr?: string; // payment reference sent by startup, verified by admin
};

export type Startup = {
  id: string;
  // 1. Profile
  name: string;
  logo: string; // data URL or ""
  pitchDeck?: { name: string; version: number; uploadedOn: string; history: { name: string; version: number; uploadedOn: string }[] };
  gstin: string;
  trl: number;
  sectors: string[];
  stage: "Idea" | "MVP" | "Revenue" | "Scaling";
  program: "Pre-Incubation" | "Incubation";
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
  memberRequests: MemberRequest[];
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

/** Direct thread between one startup team and SRIIF admins. */
export type Message = { id: string; startupId: string; by: string; role: Role; text: string; at: string; read: boolean };

/** Website submissions: Contact Us form and Join Us (mentor / investor / partner interest). */
export type Inquiry = {
  id: string;
  kind: "Contact" | "Join Us";
  type: string; // inquiry type or supporter role
  name: string;
  email: string;
  phone: string;
  org: string;
  message: string;
  at: string;
  status: "New" | "Replied" | "Closed";
};

// ── Website content managed from Admin → Website content ──
export type EventCategory = "Demo Day" | "Workshop" | "Investor Connect" | "Meetup" | "Hackathon" | "Clinic";
export type SiteEvent = {
  id: string;
  title: string;
  date: string; // ISO
  time: string;
  place: string;
  category: EventCategory;
  summary: string;
  details: string;
  registerUrl: string;
  brochure?: { name: string; data: string }; // uploaded PDF (data URL); otherwise a printable brochure is generated
};
export type GalleryCategory = "Demo days" | "Workshops" | "MoU signings" | "Visitor delegations" | "Press";
export type GalleryItem = { id: string; title: string; date: string; category: GalleryCategory; img: string; caption: string; link: string };
export type Testimonial = { id: string; kind: "Founder" | "Partner"; name: string; role: string; org: string; quote: string; stat: string };
export type Kpi = { id: string; label: string; value: string; note: string; auto?: "events" | "startups" };
export type Popup = { enabled: boolean; title: string; body: string; ctaLabel: string; ctaHref: string; version: number };
export type Person = { id: string; name: string; role: string; bio: string; img: string };
export type Social = { linkedin: string; x: string; instagram: string; youtube: string };
export type Slide = { id: string; title: string; sub: string; img: string; ctaLabel: string; ctaHref: string; show: boolean };
/** Startup shown on the home page; clicking opens its own website. */
export type Showcase = { id: string; name: string; sector: string; desc: string; stage: string; year: string; logo: string; website: string; show: boolean };
export type Cms = { popup: Popup; kpis: Kpi[]; events: SiteEvent[]; gallery: GalleryItem[]; testimonials: Testimonial[]; board: Person[]; social: Social; slides: Slide[]; showcase: Showcase[] };
export type AuditEntry = { at: string; by: string; action: string };

export type DB = {
  users: User[];
  startups: Startup[];
  tickets: Ticket[];
  requests: JoinRequest[];
  notices: Notice[];
  audit: AuditEntry[];
  facilities: string[];
  blocks: FacilityBlock[];
  messages: Message[];
  inquiries: Inquiry[];
  cms: Cms;
};
