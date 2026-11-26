// Public website content. Copied from the Flutter prototype (lib/config.dart)
// and the SRIIF website sheet (SRIIF_website_VR_AT.xlsx, "Home").

/** Base path when hosted under a sub-path (GitHub Pages: /sriif-web). */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Prefix a file in /public with the base path (next/image and <video> do not add it). */
export const asset = (p: string) => (BASE && p.startsWith(BASE + "/") ? p : `${BASE}${p}`);

export const brand = {
  name: "SRIIF",
  fullName: "Sri Ramachandra Innovation Incubation Foundation",
  since: "Since 2022",
  tagline: "Where bold ideas become",
  subTagline:
    "Workspace, mentors, funding access and a community of founders – all in one place.",
  email: "events.sriic@gmail.com",
  phone: "+91 9344841820",
  address:
    "SRIIF, Dental Basement, Sri Ramachandra Institute of Higher Education and Research, Porur, Chennai – 600116",
  gstRate: 0.18,
  demoOtp: "123456",
};

// External links from the Excel sheet.
export const links = {
  aboutSriic: "https://sriramachandra.edu/sriher-research/about-sriic/",
  applyForm: "https://forms.gle/yMetAavL7EHAC9wH6",
  regulatoryForm: "https://forms.gle/TwVTDxqXuz9Rrr618",
  mentorForm: "https://forms.gle/3DCJBcpyzZ1iZeFY9",
  eventsRef: "https://www.venturecenter.co.in/events",
};

export type NavLink = { label: string; href: string; children?: { label: string; href: string }[] };

// Top navigation (institutional layout: About, Programs, Facilities, Events, Media, Contact).
export const nav: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "About SRIIF", href: "/about" },
      { label: "Our team", href: "/about/team" },
      { label: "Board & advisors", href: "/about/board" },
      { label: "Partners", href: "/services/partners" },
      { label: "Portfolio startups", href: "/startups" },
      { label: "Mentor network", href: "/services/mentors" },
    ],
  },
  {
    label: "Programs",
    href: "/incubation",
    children: [
      { label: "Pre-Incubation (3 months)", href: "/incubation/pre-incubation" },
      { label: "Resident Incubation (6 months)", href: "/incubation/resident" },
      { label: "Virtual Incubation (6 months)", href: "/incubation/virtual" },
      { label: "Funding support", href: "/funding" },
      { label: "Apply for Incubation", href: "/apply" },
    ],
  },
  {
    label: "Facilities",
    href: "/facilities",
    children: [
      { label: "All facilities", href: "/facilities" },
      { label: "Co-working space", href: "/services/co-working" },
      { label: "Lab & Research", href: "/services/labs" },
      { label: "Partnered services", href: "/services" },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "Media & Gallery", href: "/media" },
  { label: "Join Us", href: "/join" },
  { label: "Contact Us", href: "/contact" },
];

export const heroWords = ["scalable businesses", "deep-tech ventures", "social impact", "global brands"];

export const about = {
  intro:
    "SRIIF is the startup incubation centre of the university. We help students, faculty, alumni and outside founders turn ideas into sustainable ventures through space, mentoring, funding access and a strong peer community.",
  vision: "To be a leading university incubator that turns research and ideas into impactful ventures.",
  mission:
    "Provide space, mentoring, funding access and networks so founders can build sustainable startups.",
  governance:
    "An advisory board of academicians, industry leaders and investors guides us; the program team runs day-to-day operations.",
  points: [
    "Industry-grade co-working spaces and labs",
    "Structured mentoring from 100+ experts",
    "Access to grants, angel networks and VCs",
    "Compliance, legal and IP support",
  ],
  sectors:
    "Healthcare (devices, diagnostics, drug discovery, AI/ML, digital health, vaccines, AMR, One Health), assistive technology, sports science, climate change and sustainability.",
  recognition: ["Supported under BIRAC BioNEST", "Recognised by Startup TN"],
};

export const why = [
  { title: "Mentors", desc: "A panel of founders, investors and domain experts matched to your stage." },
  { title: "Money", desc: "Seed grants, angel introductions and investor connects." },
  { title: "Market", desc: "Pilots and introductions to corporate and government buyers." },
  { title: "Space", desc: "Desks, cabins, labs and meeting rooms with 24x7 access." },
  { title: "Talent", desc: "Interns, student teams and faculty experts from the campus." },
  { title: "Compliance", desc: "Help with incorporation, GST, DPIIT recognition, legal and IP." },
];

export type Program = {
  slug: string;
  title: string;
  duration: string;
  desc: string;
  img: string;
  stage: string;
  bullets: string[];
  eligibility: string[];
  deliverables: string[];
};

export const programs: Program[] = [
  {
    slug: "pre-incubation",
    title: "Pre-Incubation",
    duration: "3 months",
    desc: "Validate the idea, build a first prototype and shape the business model before you commit to full incubation.",
    img: `${BASE}/img/preincubation.jpg`,
    stage: "Idea stage",
    bullets: ["Idea validation workshops", "Prototype development support", "Business model structuring", "Mentor reviews"],
    eligibility: ["Students, faculty, alumni or outside founders", "An idea or early prototype (TRL 1–3)", "Company registration not needed yet"],
    deliverables: ["Validated problem statement", "Working prototype or proof of concept", "Business model canvas and pitch deck", "Go / no-go review for Resident or Virtual Incubation"],
  },
  {
    slug: "resident",
    title: "Resident Incubation",
    duration: "6 months",
    desc: "A seat on campus, lab infrastructure and intensive commercialization support while you build and launch.",
    img: `${BASE}/img/incubation.jpg`,
    stage: "Prototype to revenue",
    bullets: ["Dedicated seat or cabin", "Lab, instrument and hospital access", "Commercialization, legal, IP and GST support", "Investor demo days"],
    eligibility: ["Registered startup (Pvt Ltd or LLP)", "Working prototype (TRL 4 or above)", "At least one full-time founder on campus"],
    deliverables: ["Pilot or first paying customers", "IP filing plan and regulatory pathway", "Quarterly progress reviews with SRIIF", "Investor-ready pitch at Demo Day"],
  },
  {
    slug: "virtual",
    title: "Virtual Incubation",
    duration: "6 months",
    desc: "Remote access to the SRIIF ecosystem, compliance support and investor and network linkages, without a physical seat.",
    img: `${BASE}/img/accelaration.jpg`,
    stage: "Any stage",
    bullets: ["Remote mentor reviews", "Compliance and documentation support", "Investor and network linkages", "Pay-per-use labs and meeting rooms"],
    eligibility: ["Registered startup anywhere in India", "Product in development or in market", "Able to attend reviews online"],
    deliverables: ["Compliance checklist completed", "Investor introductions", "Quarterly progress reviews with SRIIF", "Access to SRIIF events and Demo Day"],
  },
];

export const journey = [
  { title: "Request", tag: "Step 1", desc: "Email SRIIF or fill the application form with your idea." },
  { title: "Screen", tag: "Step 2", desc: "Our team reviews and meets you." },
  { title: "Pitch", tag: "Step 3", desc: "Present to the selection panel." },
  { title: "Onboard", tag: "Step 4", desc: "SRIIF admin onboards your team and creates your portal login." },
  { title: "Build", tag: "Incubate", desc: "Use seats, labs and mentors; report progress in the portal." },
];

export const facilities = [
  { title: "Co-working Space", tag: "30 seats", desc: "Desks, cabins and cubicles with internet access.", img: `${BASE}/img/cowork1.jpg` },
  { title: "Instrument Facility", tag: "Wet lab", desc: "RT-PCR, -80 °C freezers and tools.", img: `${BASE}/img/lab.jpg` },
  { title: "Board Room", tag: "30 people", desc: "Bookable rooms with video-conferencing.", img: `${BASE}/img/cowork.jpg` },
  { title: "Hospital access", tag: "On request", desc: "1200-bed tertiary hospital; shared analytical instruments billed by usage.", img: `${BASE}/img/hospital.jpg` },
  { title: "Clinical", tag: "Testing lab", desc: "CDSCO-approved clinical trial facility for testing and trials.", img: `${BASE}/img/clinical.jpg` },
  { title: "Instrumentation lab", tag: "Shared", desc: "Instrumentation lab and GLP-accredited small animal facility.", img: `${BASE}/img/instrument.jpg` },
];

export const partners: { title: string; tag: string; desc: string; url: string }[] = [
  { title: "Startup TN", tag: "Government", desc: "Tamil Nadu startup mission: schemes, grants and recognition.", url: "https://startuptn.in" },
  { title: "BIRAC BioNEST", tag: "Government", desc: "Biotech incubation support from the DBT, Government of India.", url: "https://birac.nic.in" },
  { title: "DST – NIDHI", tag: "Government", desc: "National initiative for developing and harnessing innovations.", url: "https://nidhi.dst.gov.in" },
  { title: "Startup India", tag: "Government", desc: "DPIIT recognition and national startup programmes.", url: "https://www.startupindia.gov.in" },
  { title: "IIT Madras Research Park", tag: "Academic", desc: "Research collaboration and deep-tech networks.", url: "https://respark.iitm.ac.in" },
  { title: "Angel Network", tag: "Investor", desc: "Angel investors who attend SRIIF Demo Days.", url: "" },
  { title: "MedTech Council", tag: "Industry", desc: "Industry partners for pilots and clinical validation.", url: "" },
  { title: "Cloud & software partners", tag: "Technology", desc: "Cloud credits and discounted tools for incubatees.", url: "" },
];

export const partneredServices = [
  { title: "Legal & IP", desc: "Patent filing, trademarks, contracts and compliance through empanelled firms." },
  { title: "Accounting & GST", desc: "Bookkeeping, GST filing and ROC compliance at incubatee rates." },
  { title: "Regulatory Connect", desc: "CDSCO, ethics committee and biosafety guidance for health products." },
  { title: "Cloud & software credits", desc: "Cloud credits and discounted tools from partner companies." },
  { title: "Clinical samples & data", desc: "Access to clinical samples and data under institute approvals." },
  { title: "Pharma consultants", desc: "Advice from pharma and medtech industry consultants." },
];

export const team = [
  { name: "Dr. Vidya Ramkumar", role: "Faculty Incharge", desc: "Leads the incubation centre.", img: `${BASE}/img/vidya.jpg` },
  { name: "Mr. Ganesh Saravanan", role: "Manager", desc: "Manages the incubation centre.", img: "" },
  { name: "Mr. S. Venkat", role: "Head – Mentor Network", desc: "Connects startups with domain mentors.", img: "" },
  { name: "Ms. P. Harish", role: "Community Lead", desc: "Events, founder meetups and outreach.", img: "" },
];

export const mentors = [
  { name: "Dr. K. Pugalendhi", area: "Product & Strategy", role: "Ex-VP Product", desc: "Twenty years building products; helps founders find product-market fit.", tags: ["Product", "Strategy", "Roadmaps"] },
  { name: "Anita Rao", area: "Finance & Funding", role: "Venture Partner", desc: "Guides fundraising, valuation and investor conversations.", tags: ["Fundraising", "Valuation", "Cap tables"] },
  { name: "Imran Sheikh", area: "Legal / IP", role: "Patent Attorney", desc: "IP strategy, contracts and compliance.", tags: ["Patents", "Contracts", "Compliance"] },
  { name: "Divya Menon", area: "Marketing & Sales", role: "Growth Advisor", desc: "Helps with first customers and pricing.", tags: ["GTM", "Pricing", "Sales"] },
  { name: "Rahul Verma", area: "Deep-tech", role: "Research Scientist", desc: "Supports hardware and science-based ventures.", tags: ["R&D", "Prototyping", "Patents"] },
  { name: "Sunita Iyer", area: "HealthTech", role: "Physician & Founder", desc: "Advises on trials, regulation and clinical partnerships.", tags: ["Clinical", "Regulatory", "Hospitals"] },
];

export const publicStartups = [
  { name: "GreenLeaf Agritech", sector: "AgriTech", desc: "Soil-health IoT sensors for small farmers.", year: "2025", stage: "Early revenue" },
  { name: "Bails Sports", sector: "SportsTech", desc: "Marketplace for players and coaches.", year: "2024", stage: "Seed funded" },
  { name: "EduNext", sector: "EdTech", desc: "Adaptive learning platform for schools.", year: "2024", stage: "Growth" },
  { name: "AquaPure", sector: "CleanTech", desc: "Decentralised water purification units.", year: "2023", stage: "Pilot" },
  { name: "FinEase", sector: "FinTech", desc: "Micro-lending app for small merchants.", year: "2025", stage: "Seed funded" },
  { name: "RoboCart", sector: "Robotics", desc: "Warehouse automation robots.", year: "2023", stage: "Early revenue" },
  { name: "VoiceBridge", sector: "AI", desc: "Regional-language voice assistants.", year: "2026", stage: "Prototype" },
  { name: "BioHarvest", sector: "AgriTech", desc: "Bio-fertiliser from agri waste.", year: "2022", stage: "Graduated" },
  { name: "CareLoop", sector: "HealthTech", desc: "Remote patient monitoring platform.", year: "2026", stage: "Prototype" },
];

export const funding = [
  { title: "Seed grants", desc: "Early grants for proof of concept through BIRAC BioNEST and Startup TN schemes." },
  { title: "Angel & VC connects", desc: "Introductions to angel networks and seed funds at Demo Days and Investor Connect." },
  { title: "Government schemes desk", desc: "Help applying to DPIIT, Startup TN, BIRAC and DST programmes." },
  { title: "CSR & grants", desc: "CSR-funded challenges and grants for healthcare and sustainability ventures." },
];

export const faqCategories = ["Applications & timelines", "Cohort selection", "Fees & equity", "IP policy", "Facility access"] as const;

export const faqs: { cat: (typeof faqCategories)[number]; q: string; a: string }[] = [
  { cat: "Applications & timelines", q: "Who can apply?", a: "Students, faculty, alumni and outside founders with a scalable idea." },
  { cat: "Applications & timelines", q: "How do I join SRIIF?", a: "Email SRIIF or fill the application form. If selected, the SRIIF admin onboards your team and creates your portal login. There is no self sign-up." },
  { cat: "Applications & timelines", q: "When are applications open?", a: "Requests are accepted all year. Cohorts start in January and July; check the pop-up and Events page for the current deadline." },
  { cat: "Applications & timelines", q: "How long is each program?", a: "Pre-Incubation runs for 3 months, Resident and Virtual Incubation for 6 months each. Extensions are decided at the progress review." },
  { cat: "Cohort selection", q: "How are startups selected?", a: "The SRIIF team screens each request, meets the founders and invites shortlisted teams to pitch to a selection panel." },
  { cat: "Cohort selection", q: "What does the panel look for?", a: "A clear problem, a capable team, feasibility of the technology, market potential and fit with SRIIF focus sectors." },
  { cat: "Cohort selection", q: "Which track should I choose?", a: "Pre-Incubation for ideas, Resident for teams that need a seat and labs on campus, Virtual for registered startups that work remotely. The panel can suggest a different track." },
  { cat: "Fees & equity", q: "How is rent charged?", a: "Seats are billed monthly, with GST and the instrument usage tariff added. Invoices and receipts are available in the startup portal." },
  { cat: "Fees & equity", q: "Do you take equity?", a: "Terms are shared during onboarding; SRIIF management defines them." },
  { cat: "IP policy", q: "Who owns the IP I build at SRIIF?", a: "IP terms are part of the incubation agreement shared during onboarding. Founders get support for patent and trademark filing through partnered legal firms." },
  { cat: "IP policy", q: "Can faculty and students take institute IP into a startup?", a: "This follows the SRIHER IP and technology transfer policy. The SRIIF team guides you through the approval and licensing process." },
  { cat: "Facility access", q: "Can I use the labs without a seat?", a: "Yes. Instruments are available on a pay-per-use basis. Virtual incubatees book labs and meeting rooms from the portal." },
  { cat: "Facility access", q: "How do I book facilities?", a: "Incubated startups book rooms, labs and seats from the portal. SRIIF approves each booking and usage is added to the monthly invoice." },
];

export const maps = {
  query: "Sri Ramachandra Institute of Higher Education and Research, Porur, Chennai",
  embed: "https://www.google.com/maps?q=Sri+Ramachandra+Institute+of+Higher+Education+and+Research+Porur+Chennai&output=embed",
  open: "https://www.google.com/maps/search/?api=1&query=Sri+Ramachandra+Institute+of+Higher+Education+and+Research+Porur+Chennai",
  directions: "https://www.google.com/maps/dir/?api=1&destination=Sri+Ramachandra+Institute+of+Higher+Education+and+Research+Porur+Chennai",
};
