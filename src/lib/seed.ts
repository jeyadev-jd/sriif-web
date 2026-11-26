import type { Cms, DB, Startup } from "./types";
import { BASE } from "./site";

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

export const TICKET_CATEGORIES = ["Technical / IT", "Facility maintenance", "Compliance", "Admin query", "Billing", "Legal / IP", "Documents", "Other"];

export const KYC_TYPES = ["Aadhaar / government photo ID", "PAN card", "Passport-size photo", "Address proof"];
export const MANDATORY_KYC = ["Aadhaar / government photo ID", "PAN card"];

export const SLOTS = ["09:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–17:00", "Full day"];

type Program = Startup["program"];
const ALL: Program[] = ["Pre-Incubation", "Resident Incubation", "Virtual Incubation"];
/** Which incubation tiers may book each facility. Virtual startups have no physical seat. */
export const FACILITY_RULES: Record<string, Program[]> = {
  "Co-working Space": ["Pre-Incubation", "Resident Incubation"],
  "Board Room": ALL,
  "Meeting Room 2": ALL,
  "Instrument Facility (wet lab)": ALL,
  "Clinical testing lab": ["Resident Incubation", "Virtual Incubation"],
  "Instrumentation lab": ALL,
  "Hospital access (on request)": ["Resident Incubation", "Virtual Incubation"],
};

export const INQUIRY_TYPES: { type: string; desk: string }[] = [
  { type: "Startup application", desk: "Incubation desk" },
  { type: "Corporate partnership", desk: "Partnerships team" },
  { type: "Facility inquiry", desk: "Facilities office" },
  { type: "General", desk: "SRIIF office" },
];

export const JOIN_ROLES = [
  { role: "Mentor", desc: "Share domain expertise with founders through 1:1 sessions and reviews." },
  { role: "Investor", desc: "Meet SRIIF startups at Demo Day and Investor Connect." },
  { role: "Corporate partner", desc: "Run pilots, innovation challenges or CSR programmes with startups." },
  { role: "Technology provider", desc: "Offer cloud credits, tools or lab equipment to incubatees." },
  { role: "Ecosystem enabler", desc: "Government bodies, academia and associations that support founders." },
];

const careloop: Startup = {
  id: "s1",
  name: "CareLoop Health Pvt Ltd",
  logo: "",
  pitchDeck: { name: "CareLoop_Pitch_v3.pdf", version: 3, uploadedOn: "2026-10-12", history: [{ name: "CareLoop_Pitch_v2.pdf", version: 2, uploadedOn: "2026-06-02" }, { name: "CareLoop_Pitch.pdf", version: 1, uploadedOn: "2026-02-10" }] },
  gstin: "33AABCC1234D1Z5",
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
    { id: "i1", no: "SRIIF/2026/0101", period: "Oct 2026", issued: "2026-10-01", due: "2026-10-10", lines: [{ label: "Dedicated desk", sac: "997212", qty: 3, rate: 3000, amount: 9000 }, { label: "Lab usage (hours)", sac: "998346", qty: 6, rate: 300, amount: 1800 }], status: "Paid", paidOn: "2026-10-08", receiptNo: "RCPT-0101", utr: "UTR88213" },
    { id: "i2", no: "SRIIF/2026/0134", period: "Nov 2026", issued: "2026-11-01", due: "2026-11-10", lines: [{ label: "Dedicated desk", sac: "997212", qty: 3, rate: 3000, amount: 9000 }], status: "Due" },
  ],
  memberRequests: [
    {
      id: "mr1", name: "Nisha Varghese", email: "nisha@careloop.example.in", phone: "9876511111", designation: "Clinical Lead", requestedBy: "Priya Raman", on: "2026-11-22", status: "Pending", note: "",
      kyc: [
        { type: "Aadhaar / government photo ID", name: "Nisha_Aadhaar.pdf", uploadedOn: "2026-11-22", status: "Pending" },
        { type: "PAN card", name: "Nisha_PAN.pdf", uploadedOn: "2026-11-22", status: "Pending" },
      ],
    },
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
  pitchDeck: undefined,
  gstin: "",
  reports: [
    { id: "r5", period: "Q1 2026", milestones: "Sensors installed at 600 farms.", users: 600, revenue: 900000, pilots: 3, partnerships: 2, challenges: "Monsoon logistics.", support: "FPO introductions.", submittedOn: "2026-04-06", submittedBy: "Karthik N" },
    { id: "r6", period: "Q2 2026", milestones: "1,400 farms; state agri dept pilot.", users: 1400, revenue: 1600000, pilots: 4, partnerships: 3, challenges: "Working capital.", support: "Debt funding connects.", submittedOn: "2026-07-04", submittedBy: "Karthik N" },
    { id: "r7", period: "Q3 2026", milestones: "2,000 farms; break-even month.", users: 2000, revenue: 2100000, pilots: 4, partnerships: 4, challenges: "Hiring field staff.", support: "Intern pipeline.", submittedOn: "2026-10-03", submittedBy: "Karthik N" },
  ],
  meetings: [],
  bookings: [{ id: "b9", facility: "Instrumentation lab", date: "2026-12-02", slot: "14:00–17:00", purpose: "Sensor casing tests", status: "Pending" }],
  invoices: [{ id: "i9", no: "SRIIF/2026/0135", period: "Nov 2026", issued: "2026-11-01", due: "2026-11-10", lines: [{ label: "Virtual membership", sac: "998599", qty: 1, rate: 2000, amount: 2000 }], status: "Due" }],
  memberRequests: [],
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
  reports: [{ id: "r9", period: "Q3 2026", milestones: "Prototype voice model in Tamil.", users: 15, revenue: 0, pilots: 0, partnerships: 1, challenges: "Speech data collection.", support: "Ethics approval guidance.", submittedOn: "2026-10-08", submittedBy: "Meena S" }],
  bookings: [],
  invoices: [],
};


const img = (f: string) => `${BASE}/img/${f}`;

const cms: Cms = {
  popup: {
    enabled: true,
    title: "Applications open: Cohort 2027-A",
    body: "Pre-Incubation, Resident and Virtual tracks. Send your request by 10 December 2026. Demo Day 2027 is on 15 January.",
    ctaLabel: "Apply for incubation",
    ctaHref: "/apply",
    version: 1,
  },
  kpis: [
    { id: "k1", label: "Startups supported", value: "10+", note: "Across healthcare and deep tech" },
    { id: "k2", label: "Revenue generated", value: "₹15 Cr", note: "By portfolio startups" },
    { id: "k3", label: "Partnerships", value: "25+", note: "Industry, government and academia" },
    { id: "k4", label: "Active events", value: "4", note: "Upcoming on the calendar", auto: "events" },
  ],
  events: [
    { id: "e1", title: "Demo Day 2027", date: "2027-01-15", time: "10:00–17:00", place: "SRIIF Event Hall", category: "Demo Day", summary: "Startups pitch to investors and corporates.", details: "Ten SRIIF startups present to angel networks, seed funds and corporate innovation teams. Investors and partners can register to attend; startups register from their portal notice.", registerUrl: "/contact" },
    { id: "e2", title: "IP & Legal Clinic", date: "2026-12-10", time: "14:00–17:00", place: "Meeting Room 2", category: "Clinic", summary: "One-to-one sessions with IP attorneys.", details: "Book a 30-minute slot with an empanelled patent attorney: patentability, trademarks, contracts and licensing.", registerUrl: "/contact" },
    { id: "e3", title: "Investor Connect", date: "2027-02-28", time: "11:00–13:00", place: "Online", category: "Investor Connect", summary: "Meet angel networks and seed funds.", details: "Closed-door session where selected startups meet angel networks and seed funds.", registerUrl: "/contact" },
    { id: "e4", title: "Founders Meetup – December", date: "2026-12-18", time: "17:30–19:30", place: "Cafeteria & Lounge", category: "Meetup", summary: "Peer learning and networking evening.", details: "Monthly evening for founders, mentors and students. Short talks followed by networking.", registerUrl: "/contact" },
    { id: "e5", title: "HealthTech Hackathon", date: "2026-11-08", time: "09:00 (36 hrs)", place: "SRIHER Campus", category: "Hackathon", summary: "36-hour hackathon on hospital workflow problems.", details: "Students and early teams built solutions for problems shared by SRMC clinicians. Winners joined Pre-Incubation.", registerUrl: "" },
    { id: "e6", title: "Regulatory Pathways Workshop", date: "2026-10-17", time: "10:00–13:00", place: "Board Room", category: "Workshop", summary: "CDSCO, ethics and biosafety approvals for medtech.", details: "Hands-on workshop on CDSCO medical device rules, ethics committee submissions and biosafety approvals.", registerUrl: "" },
    { id: "e7", title: "Demo Day 2026", date: "2026-01-20", time: "10:00–17:00", place: "SRIIF Event Hall", category: "Demo Day", summary: "Cohort 2025 startups pitched to investors.", details: "Eight startups pitched; three closed follow-on meetings with investors.", registerUrl: "" },
  ],
  gallery: [
    { id: "g1", title: "Demo Day 2026", date: "2026-01-20", category: "Demo days", img: img("herohome.jpg"), caption: "Cohort 2025 startups pitch to investors.", link: "" },
    { id: "g2", title: "Regulatory Pathways Workshop", date: "2026-10-17", category: "Workshops", img: img("cowork.jpg"), caption: "CDSCO and ethics approvals workshop.", link: "" },
    { id: "g3", title: "MoU with Startup TN", date: "2026-10-05", category: "MoU signings", img: img("sriif1.png"), caption: "SRIIF and Startup TN sign an ecosystem MoU.", link: "" },
    { id: "g4", title: "Delegation visit to the labs", date: "2026-09-12", category: "Visitor delegations", img: img("lab.jpg"), caption: "Visiting delegation tours the instrument facility.", link: "" },
    { id: "g5", title: "HealthTech Hackathon", date: "2026-11-08", category: "Workshops", img: img("cowork1.jpg"), caption: "Teams at work during the 36-hour hackathon.", link: "" },
    { id: "g6", title: "Clinical facility tour", date: "2026-08-22", category: "Visitor delegations", img: img("clinical.jpg"), caption: "Industry partners visit the clinical trial facility.", link: "" },
    { id: "g7", title: "GreenLeaf seed round in the news", date: "2026-11-02", category: "Press", img: img("incubation.jpg"), caption: "Press coverage of GreenLeaf Agritech's seed round.", link: "" },
    { id: "g8", title: "Instrumentation lab opening", date: "2026-07-01", category: "MoU signings", img: img("instrument.jpg"), caption: "New shared instrumentation lab opened for incubatees.", link: "" },
  ],
  testimonials: [
    { id: "ts1", kind: "Founder", name: "Karthik N", role: "Founder", org: "GreenLeaf Agritech", quote: "SRIIF gave us a lab, mentors and our first pilot farms. We went from a campus prototype to 2,000 farmers in two years.", stat: "2,000 farms" },
    { id: "ts2", kind: "Founder", name: "Priya Raman", role: "CEO & Co-founder", org: "CareLoop Health", quote: "Hospital access and clinical mentors let us run a real pilot within months of joining.", stat: "120-patient pilot" },
    { id: "ts3", kind: "Founder", name: "Meena S", role: "Founder", org: "VoiceBridge AI", quote: "As a student founder, Pre-Incubation helped me validate the idea before writing any code.", stat: "TRL 2 to prototype" },
    { id: "ts4", kind: "Partner", name: "Partnerships team", role: "Ecosystem partner", org: "MedTech Council", quote: "SRIIF startups come to us with clinical evidence and clean compliance records, which makes pilots easy to start.", stat: "6 pilots" },
  ],
  board: [
    { id: "bd1", name: "To be announced", role: "Chairperson, Board of Directors", bio: "Senior SRIHER leadership.", img: "" },
    { id: "bd2", name: "To be announced", role: "Academic advisor", bio: "Faculty representative from SRIHER research.", img: "" },
    { id: "bd3", name: "To be announced", role: "Industry advisor", bio: "Healthcare and medtech industry leader.", img: "" },
    { id: "bd4", name: "To be announced", role: "Investment advisor", bio: "Angel and venture investment expertise.", img: "" },
  ],
  social: { linkedin: "", x: "", instagram: "", youtube: "" },
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
      id: "t1", no: "TCK-1001", startupId: "s1", raisedBy: "Priya Raman", category: "Facility maintenance", subject: "AC not working in cabin 3", priority: "Normal", status: "In progress", created: "2026-11-18",
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
  facilities: Object.keys(FACILITY_RULES),
  blocks: [
    { id: "bl1", facility: "Board Room", date: "2026-12-04", slot: "Full day", kind: "External event", reason: "SRIHER research council meeting" },
    { id: "bl2", facility: "Instrument Facility (wet lab)", date: "2026-12-01", slot: "Full day", kind: "Maintenance", reason: "Annual freezer servicing" },
  ],
  messages: [
    { id: "msg1", startupId: "s1", by: "Lakshmi", role: "admin", text: "Hi Priya, please share the signed hospital pilot MoU when ready so we can add it to your records.", at: "2026-11-21 11:05", read: true },
    { id: "msg2", startupId: "s1", by: "Priya Raman", role: "startup", text: "Sure, the legal team is reviewing it. Expect it by next Friday.", at: "2026-11-21 15:40", read: true },
    { id: "msg3", startupId: "s1", by: "Lakshmi", role: "admin", text: "Thanks. Also, your Demo Day slot is confirmed for 15 Jan.", at: "2026-11-24 10:12", read: false },
    { id: "msg4", startupId: "s2", by: "Karthik N", role: "startup", text: "Can we use the event hall for a farmer workshop in January?", at: "2026-11-25 09:20", read: false },
  ],
  inquiries: [
    { id: "iq1", kind: "Contact", type: "Corporate partnership", name: "Ramesh K", email: "ramesh@medcorp.example.com", phone: "", org: "MedCorp India", message: "We would like to run a diagnostics innovation challenge with SRIIF startups.", at: "2026-11-23 16:02", status: "New" },
    { id: "iq2", kind: "Join Us", type: "Mentor", name: "Dr. Farah Ali", email: "farah@example.com", phone: "", org: "Independent", message: "20 years in medical device regulation. Happy to mentor on CDSCO pathways.", at: "2026-11-19 12:30", status: "Replied" },
  ],
  cms,
};
