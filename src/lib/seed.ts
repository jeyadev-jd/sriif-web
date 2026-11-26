import type { DB, Startup } from "./types";

export const DOC_TYPES: { type: string; mandatory: boolean; financial: boolean }[] = [
  { type: "Certificate of Incorporation / Registration", mandatory: true, financial: false },
  { type: "MOA", mandatory: true, financial: false },
  { type: "AOA", mandatory: true, financial: false },
  { type: "PAN", mandatory: false, financial: true },
  { type: "GST Certificate", mandatory: false, financial: true },
  { type: "Founder ID proof", mandatory: false, financial: false },
  { type: "Board resolution / authorization letter", mandatory: false, financial: false },
  { type: "Startup India / DPIIT certificate", mandatory: true, financial: false },
  { type: "NDA / Incubation Agreement (signed)", mandatory: true, financial: false },
  { type: "IP document (patent / trademark)", mandatory: false, financial: false },
  { type: "Regulatory approval", mandatory: false, financial: false },
];

export const SECTORS = ["HealthTech", "MedTech", "BioTech", "EdTech", "AgriTech", "CleanTech", "SportsTech", "AssistiveTech", "AI/ML", "Other"];

export const TICKET_CATEGORIES = ["Mentor request", "Facilities", "Billing", "Technical / IT", "Legal / IP", "Funding", "Documents", "Other"];

const careloop: Startup = {
  id: "s1",
  name: "CareLoop Health Pvt Ltd",
  logo: "",
  trl: 5,
  sectors: ["HealthTech", "AI/ML"],
  stage: "MVP",
  program: "Resident Incubation",
  cohort: "Cohort 2026-A",
  onboardedOn: "2026-02-10",
  website: "https://careloop.example.in",
  linkedin: "https://linkedin.com/company/careloop",
  regAddress: "12, Gandhi Road, Porur, Chennai 600116",
  commAddress: "SRIIF, Dental Basement, SRIHER, Porur, Chennai 600116",
  email: "hello@careloop.example.in",
  phone: "9876543210",
  oneLiner: "Remote patient monitoring platform for post-discharge cardiac care.",
  status: "Active",
  mentorIds: ["u-m1"],
  seat: { type: "Dedicated desk", count: 3, rate: 3000 },
  equityTaken: true,
  docs: [
    { id: "d1", type: "Certificate of Incorporation / Registration", name: "COI_CareLoop.pdf", version: 1, uploadedOn: "2026-02-10", financial: false },
    { id: "d2", type: "MOA", name: "MOA_CareLoop.pdf", version: 1, uploadedOn: "2026-02-10", financial: false },
    { id: "d3", type: "AOA", name: "AOA_CareLoop.pdf", version: 1, uploadedOn: "2026-02-10", financial: false },
    { id: "d4", type: "GST Certificate", name: "GST_CareLoop_v2.pdf", version: 2, uploadedOn: "2026-06-01", expiry: "2026-12-15", financial: true },
    { id: "d5", type: "NDA / Incubation Agreement (signed)", name: "Agreement_signed.pdf", version: 1, uploadedOn: "2026-02-12", financial: false },
  ],
  founders: [
    { name: "Priya Raman", designation: "CEO & Co-founder", equity: 45, din: "09876543" },
    { name: "Arjun Das", designation: "CTO & Co-founder", equity: 35, din: "09876544" },
  ],
  holdings: [
    { holder: "Priya Raman", category: "Founder", pct: 45 },
    { holder: "Arjun Das", category: "Founder", pct: 35 },
    { holder: "ESOP pool", category: "ESOP pool", pct: 10 },
    { holder: "SRIIF", category: "SRIIF", pct: 3 },
    { holder: "Chennai Angels", category: "Investor", pct: 7 },
  ],
  shareClasses: "Equity shares of ₹10 each. No preference shares.",
  funding: [
    { id: "f1", amount: 1000000, currency: "INR", type: "Grant", source: "BIRAC BIG", date: "2026-04-15", round: "Not applicable" },
    { id: "f2", amount: 5000000, currency: "INR", type: "Angel", source: "Chennai Angels", date: "2026-08-20", round: "Pre-seed" },
  ],
  awards: [
    { id: "a1", kind: "Award", title: "Best HealthTech Startup", org: "Startup TN", year: "2026", category: "Healthcare" },
    { id: "a2", kind: "Achievement", title: "Clinical pilot at SRMC cardiology", org: "SRIHER", year: "2026", category: "Clinical pilot" },
    { id: "a3", kind: "Media", title: "Featured in The Hindu", org: "The Hindu", year: "2026", category: "Press", link: "https://thehindu.com" },
    { id: "a4", kind: "Association", title: "StartupTN registered", org: "Startup TN", year: "2026", category: "Association" },
  ],
  reports: [
    { id: "r1", period: "Q2 2026", milestones: "MVP built; ethics approval received.", users: 40, revenue: 0, pilots: 1, partnerships: 1, challenges: "Hospital IT integration slow.", support: "Intro to hospital IT head.", submittedOn: "2026-07-05", submittedBy: "Priya Raman" },
    { id: "r2", period: "Q3 2026", milestones: "Pilot with 120 patients live.", users: 120, revenue: 150000, pilots: 2, partnerships: 2, challenges: "Device supply delays.", support: "Vendor connects for wearables.", submittedOn: "2026-10-06", submittedBy: "Priya Raman" },
  ],
  annual: [],
  meetings: [
    { id: "m1", mentorId: "u-m1", date: "2026-11-05", time: "11:00", agenda: "Clinical validation plan", status: "Done", notes: "Add 2nd site; define endpoints with cardiology." },
    { id: "m2", mentorId: "u-m1", date: "2026-12-03", time: "15:00", agenda: "Regulatory pathway (CDSCO)", status: "Confirmed", notes: "" },
  ],
  bookings: [
    { id: "b1", facility: "Board Room", date: "2026-12-02", slot: "10:00–12:00", purpose: "Investor meeting", status: "Approved" },
    { id: "b2", facility: "Instrument Facility (wet lab)", date: "2026-12-08", slot: "14:00–17:00", purpose: "Sensor calibration", status: "Pending" },
  ],
  invoices: [
    { id: "i1", no: "SRIIF/2026/0101", period: "Oct 2026", issued: "2026-10-01", due: "2026-10-10", lines: [{ label: "Dedicated desk × 3", amount: 9000 }, { label: "Lab usage (6 hrs)", amount: 1800 }], status: "Paid", paidOn: "2026-10-08", receiptNo: "RCPT-0101", utr: "UTR88213" },
    { id: "i2", no: "SRIIF/2026/0134", period: "Nov 2026", issued: "2026-11-01", due: "2026-11-10", lines: [{ label: "Dedicated desk × 3", amount: 9000 }], status: "Due" },
  ],
};

const greenleaf: Startup = {
  ...careloop,
  id: "s2",
  name: "GreenLeaf Agritech LLP",
  sectors: ["AgriTech"],
  stage: "Revenue",
  trl: 8,
  program: "Virtual Incubation",
  cohort: "Cohort 2025-B",
  onboardedOn: "2025-08-01",
  website: "https://greenleaf.example.in",
  email: "team@greenleaf.example.in",
  phone: "9845012345",
  oneLiner: "Soil-health IoT sensors for small farmers.",
  mentorIds: ["u-m1"],
  seat: { type: "Virtual membership", count: 1, rate: 2000 },
  equityTaken: false,
  docs: [{ id: "d9", type: "Certificate of Incorporation / Registration", name: "LLP_cert.pdf", version: 1, uploadedOn: "2025-08-01", financial: false }],
  founders: [{ name: "Karthik N", designation: "Founder", equity: 100, din: "" }],
  holdings: [],
  funding: [{ id: "f9", amount: 2500000, currency: "INR", type: "CSR", source: "Tech Corp India CSR", date: "2026-01-10", round: "Not applicable" }],
  awards: [],
  reports: [],
  meetings: [],
  bookings: [],
  invoices: [{ id: "i9", no: "SRIIF/2026/0135", period: "Nov 2026", issued: "2026-11-01", due: "2026-11-10", lines: [{ label: "Virtual membership", amount: 2000 }], status: "Due" }],
};

const voice: Startup = {
  ...greenleaf,
  id: "s3",
  name: "VoiceBridge AI",
  sectors: ["AI/ML", "AssistiveTech"],
  stage: "Idea",
  trl: 2,
  program: "Pre-Incubation",
  cohort: "Cohort 2026-B",
  onboardedOn: "2026-09-01",
  oneLiner: "Regional-language voice assistants for people with low vision.",
  email: "founders@voicebridge.example.in",
  mentorIds: [],
  seat: { type: "Hot desk", count: 2, rate: 1500 },
  docs: [],
  founders: [{ name: "Meena S", designation: "Founder (student)", equity: 100, din: "" }],
  funding: [],
  invoices: [],
};

export const seed: DB = {
  users: [
    { id: "u-a1", name: "Lakshmi", email: "admin@sriif.in", phone: "9000000001", role: "admin", designation: "SRIIF Admin", active: true },
    { id: "u-s1", name: "Priya Raman", email: "priya@careloop.example.in", phone: "9876543210", role: "startup", designation: "CEO & Co-founder", startupId: "s1", active: true },
    { id: "u-s2", name: "Arjun Das", email: "arjun@careloop.example.in", phone: "9876500000", role: "startup", designation: "CTO & Co-founder", startupId: "s1", active: true },
    { id: "u-s3", name: "Karthik N", email: "karthik@greenleaf.example.in", phone: "9845012345", role: "startup", designation: "Founder", startupId: "s2", active: true },
    { id: "u-s4", name: "Meena S", email: "meena@voicebridge.example.in", phone: "9845099999", role: "startup", designation: "Founder", startupId: "s3", active: true },
    { id: "u-m1", name: "Dr. Sunita Iyer", email: "mentor@sriif.in", phone: "9000000002", role: "mentor", designation: "Physician & Founder", expertise: "HealthTech, Clinical, Regulatory", active: true },
    { id: "u-m2", name: "Anita Rao", email: "anita@mentor.example.in", phone: "9000000003", role: "mentor", designation: "Venture Partner", expertise: "Fundraising, Valuation", active: true },
  ],
  startups: [careloop, greenleaf, voice],
  tickets: [
    {
      id: "t1", no: "TCK-1001", startupId: "s1", raisedBy: "Priya Raman", category: "Facilities", subject: "AC not working in cabin 3", priority: "Normal", status: "In progress", created: "2026-11-18",
      messages: [
        { by: "Priya Raman", role: "startup", text: "AC in cabin 3 stopped working since morning.", at: "2026-11-18 10:12" },
        { by: "Lakshmi", role: "admin", text: "Raised with estate team. Technician visiting tomorrow.", at: "2026-11-18 12:40" },
      ],
    },
    {
      id: "t2", no: "TCK-1002", startupId: "s2", raisedBy: "Karthik N", category: "Billing", subject: "GST number missing on invoice", priority: "Low", status: "Open", created: "2026-11-21",
      messages: [{ by: "Karthik N", role: "startup", text: "Please add our GSTIN to the Nov invoice.", at: "2026-11-21 09:30" }],
    },
  ],
  requests: [
    { id: "q1", name: "Dr. Ravi Kumar", email: "ravi@example.com", phone: "9811122233", startupName: "OrthoPrint", idea: "3D-printed patient-specific orthopaedic implants.", stage: "Prototype", via: "Email", receivedOn: "2026-11-20", status: "New", note: "" },
    { id: "q2", name: "Sneha P", email: "sneha@example.com", phone: "9811122244", startupName: "FitMind", idea: "Sports science app for injury prevention in athletes.", stage: "Idea", via: "Google Form", receivedOn: "2026-11-15", status: "In review", note: "Pitch on 2 Dec" },
  ],
  notices: [
    { id: "n1", title: "Demo Day 2027 – registrations open", body: "Startups wanting to pitch on 15 Jan 2027 must register by 20 Dec.", date: "2026-11-20" },
    { id: "n2", title: "Q4 progress report due", body: "Submit your Q4 2026 progress report by 10 Jan 2027.", date: "2026-11-15" },
  ],
  audit: [{ at: "2026-11-20 10:00", by: "Lakshmi", action: "Logged onboarding request from OrthoPrint" }],
  facilities: ["Co-working Space", "Board Room", "Instrument Facility (wet lab)", "Clinical testing lab", "Instrumentation lab", "Hospital access (on request)"],
};
