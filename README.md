# SRIIF Web

Website and incubation portal UI for **Sri Ramachandra Innovation Incubation Foundation (SRIIF)**, SRIHER, Chennai.

Built with Next.js 16, React 19, Tailwind CSS 4 and Lucide icons.

> Status: UI prototype. All portal data is demo data stored in the browser (localStorage). There is no backend yet.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## What is inside

**Public site** – Home, About, Facilities, Funding, Incubation (Resident, Pre-Incubation, Virtual), Services (Mentors, Partnered services, Co-working, Lab & Research), Events, Startups, Contact, Apply for Incubation.

**Startup portal** (`/portal`) – profile, documents vault (versioned, expiry reminders), cap table, funding, awards & media, quarterly progress and yearly review, mentorship, facility bookings, invoices & payments, generated PDFs, team (read-only) and support tickets.

**Admin console** (`/admin`) – onboarding requests, onboard a startup and its team, all startups, tickets, review scorecards, billing, facility bookings, mentors, notices, impact reports (CSV / PDF) and audit log.

**Mentor workspace** (`/mentor`) – assigned startups (non-financial view) and meetings.

## Access rules

- No self sign-up. Founders request incubation by email or form; only SRIIF admins onboard a startup and add or remove its team members.
- A startup sees only its own data. Admins see every startup.
- Mentors see only their assigned startups and no financial data.
- Startups raise support tickets; only admins answer them.
- There is no investor login.

## Demo logins

OTP for every account: `123456`

| Role | Email |
|------|-------|
| Admin | admin@sriif.in |
| Startup founder | priya@careloop.example.in |
| Startup member | arjun@careloop.example.in |
| Mentor | mentor@sriif.in |

Reset demo data from **Admin → Audit log → Reset demo data**.

## Project layout

```
src/app/(site)      public website pages
src/app/portal      startup portal
src/app/admin       admin console
src/app/mentor      mentor workspace
src/app/print       printable documents (offer letter, agreement, invoice, receipt, reports, certificate)
src/components      shared UI, portal sections, tickets
src/lib             site content, data model, demo store, seed data, navigation
```
