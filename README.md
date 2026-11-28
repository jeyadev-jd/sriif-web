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

## GitHub Pages

Live demo: https://jeyadev-jd.github.io/sriif-web/

Every push to `main` builds a static export (`GITHUB_PAGES=1 npm run build` → `./out`, served under `/sriif-web`) and deploys it with `.github/workflows/pages.yml`.

## What is inside

**Public website** (institutional layout inspired by iTNT Hub)

- Navigation: Home, About Us (team, board & advisors, partners, portfolio, mentors), Programs, Facilities, Events, Media & Gallery, Join Us, Contact Us, Portal Login.
- Programs: Pre-Incubation (3 months), Resident Incubation (6 months) and Virtual Incubation (6 months), each with eligibility, deliverables and an apply button.
- Ecosystem impact banner: startups supported, revenue generated, partnerships, active events. "Active events" is counted live from the calendar.
- Partners with links to their websites, a testimonials carousel (founders and partners), and a Join Us page for mentors, investors and partners (no investor login).
- "What's happening at SRIIF": a pop-up on the home page and an upcoming-events side panel on every page.
- Events: a clickable calendar with Upcoming / Recent / Past filters, event detail pages, registration links and brochure PDFs.
- Media & Gallery by category: demo days, workshops, MoU signings, visitor delegations, press.
- FAQs grouped by category: applications, cohort selection, fees & equity, IP policy, facility access.
- Contact form routed by inquiry type, an embedded map, and "Get directions" / "Open in Google Maps".
- Footer with social media badges.

**Startup portal** (`/portal`)

- Progress review (top priority).
- Profile with logo, a replaceable pitch deck (version history) and GSTIN.
- Documents vault.
- Team & e-verification: request a member and upload their KYC; SRIIF approves.
- Facility booking: limited to the startup's tier, with slot availability.
- Itemised GST invoices (SAC, CGST + SGST) with PDF receipts.
- Support tickets and direct messages with SRIIF.
- Records: cap table, funding, awards, letters.
- Mentor scheduling is not part of the startup portal in this phase.

**Admin console** (`/admin`)

- Executive dashboard: cohort distribution, survival and graduation rates, cumulative revenue, partnerships, active events.
- Startup deep-dive and onboarding.
- Team e-verification queue.
- Facility control: weekly master schedule, approve, block, override, allocate, seating.
- Billing: generate monthly invoices, edit, reconcile UTR payments.
- Helpdesk tickets, a messaging console with broadcast announcements, and a website inbox.
- Website content (CMS): pop-up, impact numbers, events and brochures, gallery, testimonials, board, social links.
- Impact reports and audit log.

**Mentor workspace** (`/mentor`): assigned startups (non-financial view) and meetings.

## Access rules

- No self sign-up. Founders request incubation by email or form; only SRIIF admins onboard a startup.
- Startups can *request* a team member and upload KYC, but only an admin verifies the documents, approves the member and creates the login. Only admins disable logins.
- A startup sees only its own data, tickets and messages. Admins see every startup.
- Mentors see only their assigned startups and no financial data.
- There is no investor login. Investors and partners express interest on Join Us.

## Demo logins

OTP for every account: `123456`

| Role | Email |
|------|-------|
| Admin | admin@sriif.in |
| Startup founder | priya@careloop.example.in |
| Startup member | arjun@careloop.example.in |
| Mentor | mentor@sriif.in |

Reset demo data from **Admin → Audit log → Reset demo data**. Website form submissions and CMS edits are stored in the visitor's own browser in this demo.

## Project layout

```
src/app/(site)      public website pages
src/app/portal      startup portal
src/app/admin       admin console (startup detail: /admin/startups/view?id=…)
src/app/mentor      mentor workspace
src/app/print       printable documents (offer letter, agreement, invoice, receipt, reports, certificate)
src/components      shared UI, portal sections, tickets
src/lib             site content, data model, demo store, seed data, navigation
```

## Run with the database (local)

The public demo on GitHub Pages keeps data in the browser. Locally the app can run against PostgreSQL through Prisma, with real logins and access rules enforced on the server.

Needs Node 22+ and Docker.

```bash
cp .env.example .env          # then set SESSION_SECRET (openssl rand -hex 32)
npm install                   # also generates the Prisma client
npm run setup                 # starts Postgres in Docker, creates tables, loads demo data
npm run dev                   # http://localhost:3000
```

Log in with a demo email (admin@sriif.in, priya@careloop.example.in). There is no mail service yet: the OTP is printed in the `npm run dev` terminal, or is `DEV_OTP` from `.env` (123456 by default). Leave `DEV_OTP` empty to get random codes.

Useful commands:

| Command | What it does |
| --- | --- |
| `npm run db:studio` | Browse and edit tables in Prisma Studio |
| `npx prisma migrate dev --name <change>` | After editing `prisma/schema.prisma` |
| `npx prisma migrate reset` | Wipe the local database and reseed (asks first) |
| `docker compose down` | Stop Postgres (data is kept in the `pgdata` volume) |

How it fits together:

- `prisma/schema.prisma`: tables mirror `src/lib/types.ts` (startups with documents, funding, reports, bookings and invoices in their own tables; users; tickets; messages; website content as settings).
- `src/app/api/*/route.api.ts`: login by email OTP (signed, http-only cookie), and `/api/state` to read and save. The `.api.ts` name keeps these routes out of the static GitHub Pages export.
- `src/server/sync.ts`: access rules. Each role only receives its own data (a startup sees its own startup; other startups appear only as anonymous facility bookings). Saves send the state the browser last received plus its edits; the server applies only what that role may change: startups cannot approve bookings, change invoices beyond adding a payment reference, set KYC status or edit program, status, seat or mentors. Visitors can only send Contact and Join Us forms (rate limited).
- `NEXT_PUBLIC_API=1` in `.env` switches the browser store from local storage to the API.

Not done yet: sending OTP emails (needs an SMTP or email API account), file storage outside the database (uploads are stored as data in Postgres for now), and hosting.
