// Public website content. Copied from the Flutter prototype (lib/config.dart)
// and the SRIIF website sheet (SRIIF_website_VR_AT.xlsx, "Home").

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

// Top navigation as laid out in the Excel "Home" sheet.
export const nav: NavLink[] = [
  {
    label: "Home",
    href: "/",
    children: [
      { label: "About", href: "/about" },
      { label: "Facilities", href: "/facilities" },
      { label: "Funding", href: "/funding" },
    ],
  },
  {
    label: "Incubation",
    href: "/incubation",
    children: [
      { label: "Resident", href: "/incubation/resident" },
      { label: "Pre-Incubation", href: "/incubation/pre-incubation" },
      { label: "Virtual Incubation", href: "/incubation/virtual" },
      { label: "Apply for Incubation", href: "/apply" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Mentors", href: "/services/mentors" },
      { label: "Partnered services", href: "/services/partners" },
      { label: "Co-working space", href: "/services/co-working" },
      { label: "Lab & Research", href: "/services/labs" },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "Startups", href: "/startups" },
  { label: "Contact", href: "/contact" },
];

export const heroWords = ["scalable businesses", "deep-tech ventures", "social impact", "global brands"];

export const heroCards = [
  { title: "Next cohort: Jan 2027", sub: "Applications close 10 Dec" },
  { title: "100+ mentors", sub: "Book a 1:1 session" },
  { title: "Grants & angel access", sub: "Pitch at every Demo Day" },
];

export const stats = [
  { prefix: "", value: 10, suffix: "+", label: "Startups incubated" },
  { prefix: "₹", value: 15, suffix: " Cr", label: "Funding raised" },
  { prefix: "", value: 100, suffix: "+", label: "Mentors & experts" },
  { prefix: "", value: 10000, suffix: "", label: "Sq. ft. facilities" },
];

export const impact = [
  { value: "10+", label: "Startups incubated", note: "Since 2018" },
  { value: "₹15 Cr", label: "Funding raised", note: "By our portfolio" },
  { value: "350+", label: "Jobs created", note: "Across Tamil Nadu" },
  { value: "100+", label: "Mentors on panel", note: "Across 12 domains" },
  { value: "12", label: "Patents filed", note: "By incubated teams" },
  { value: "10,000", label: "Sq. ft. of facilities", note: "Labs, co-working, halls" },
];

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
};

export const programs: Program[] = [
  {
    slug: "pre-incubation",
    title: "Pre-Incubation",
    duration: "3 months",
    desc: "Validate your idea with mentors and a small seed grant before you build.",
    img: "/img/preincubation.jpg",
    stage: "Idea stage",
    bullets: ["Idea validation workshops", "Seed grant support", "Mentor matching"],
  },
  {
    slug: "resident",
    title: "Resident Incubation",
    duration: "24 months",
    desc: "A seat, mentoring, compliance help and investor access while you build and launch on campus.",
    img: "/img/incubation.jpg",
    stage: "Prototype to revenue",
    bullets: ["Dedicated seat or cabin", "Lab & instrument access", "Legal, IP and GST support", "Investor demo days"],
  },
  {
    slug: "virtual",
    title: "Virtual Incubation",
    duration: "12 months",
    desc: "Mentoring, lab access on demand and the SRIIF network without a permanent seat.",
    img: "/img/accelaration.jpg",
    stage: "Any stage",
    bullets: ["Mentor sessions", "Pay-per-use labs", "Fundraising prep", "Go-to-market mentors"],
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
  { title: "Co-working Space", tag: "30 seats", desc: "Desks, cabins and cubicles with internet access.", img: "/img/cowork1.jpg" },
  { title: "Instrument Facility", tag: "Wet lab", desc: "RT-PCR, -80 °C freezers and tools.", img: "/img/lab.jpg" },
  { title: "Board Room", tag: "30 people", desc: "Bookable rooms with video-conferencing.", img: "/img/cowork.jpg" },
  { title: "Hospital access", tag: "On request", desc: "1200-bed tertiary hospital; shared analytical instruments billed by usage.", img: "/img/hospital.jpg" },
  { title: "Clinical", tag: "Testing lab", desc: "CDSCO-approved clinical trial facility for testing and trials.", img: "/img/clinical.jpg" },
  { title: "Instrumentation lab", tag: "Shared", desc: "Instrumentation lab and GLP-accredited small animal facility.", img: "/img/instrument.jpg" },
];

export const partners = [
  { title: "Startup TN", tag: "Government" },
  { title: "BIRAC BioNEST", tag: "Government" },
  { title: "DST – NIDHI", tag: "Government" },
  { title: "IIT Madras Research Park", tag: "Academic" },
  { title: "Angel Network", tag: "Investor" },
  { title: "MedTech Council", tag: "Industry" },
  { title: "Legal Aid Foundation", tag: "Support" },
  { title: "Global Alumni Fund", tag: "Alumni" },
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
  { name: "Dr. Vidya Ramkumar", role: "Faculty Incharge", desc: "Leads the incubation centre.", img: "/img/vidya.jpg" },
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

export const stories = [
  { startup: "GreenLeaf Agritech", sector: "AgriTech", quote: "SRIIF gave us a lab, mentors and our first pilot farms. We went from a campus prototype to 2,000 farmers in two years.", stat: "₹1.8 Cr ARR", name: "Priya Raman", role: "Founder & CEO" },
  { startup: "MediSense Labs", sector: "HealthTech", quote: "The clinical mentors and investor demo day shaved a year off our funding journey.", stat: "₹4 Cr raised", name: "Arjun Das", role: "Co-founder" },
  { startup: "EduNext", sector: "EdTech", quote: "Our first ten schools came from SRIIF introductions. Today we serve forty.", stat: "40 schools", name: "Rahul S", role: "Founder" },
];

export const events = [
  { title: "Demo Day 2027", date: "15 Jan 2027", desc: "Startups pitch to investors and corporates.", place: "SRIIF Event Hall" },
  { title: "IP & Legal Clinic", date: "10 Dec 2026", desc: "One-to-one sessions with IP attorneys.", place: "Meeting Room 2" },
  { title: "Investor Connect", date: "28 Feb 2027", desc: "Meet angel networks and seed funds.", place: "Online" },
  { title: "Founders Meetup", date: "Monthly", desc: "Peer learning and networking evening.", place: "Cafeteria & Lounge" },
];

export const news = [
  { title: "SRIIF startup closes seed round", date: "Nov 2026", desc: "GreenLeaf Agritech raises seed funding." },
  { title: "New partnership announced", date: "Oct 2026", desc: "SRIIF joins hands with Startup TN." },
];

export const funding = [
  { title: "Seed grants", desc: "Early grants for proof of concept through BIRAC BioNEST and Startup TN schemes." },
  { title: "Angel & VC connects", desc: "Introductions to angel networks and seed funds at Demo Days and Investor Connect." },
  { title: "Government schemes desk", desc: "Help applying to DPIIT, Startup TN, BIRAC and DST programmes." },
  { title: "CSR & grants", desc: "CSR-funded challenges and grants for healthcare and sustainability ventures." },
];

export const faqs = [
  { q: "Who can apply?", a: "Students, faculty, alumni and outside founders with a scalable idea." },
  { q: "How do I join SRIIF?", a: "Email SRIIF or fill the application form. If selected, the SRIIF admin onboards your team and creates your portal login. There is no self sign-up." },
  { q: "How is rent charged?", a: "Seats are billed monthly, with GST and the instrument usage tariff added." },
  { q: "How long is incubation?", a: "Typically 24 months, extendable on review. Incubatees present an extension case every 12 months after the first 18 months." },
  { q: "Do you take equity?", a: "Terms are shared during onboarding; SRIIF management defines them." },
  { q: "Can I use the labs without a seat?", a: "Yes. Instruments are available on a pay-per-use basis." },
];
