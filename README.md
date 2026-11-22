# Coaching Centre Management Platform (Center)

A comprehensive, multi-tenant Coaching Centre Management SaaS and Student Self-Service Portal tailored for Nigerian tutorial and remedial colleges preparing students for JAMB UTME, WAEC SSCE, NECO, and Post-UTME.

## Architecture

- **Coaching Centre Portal (`coaching-centre-portal`)**: 
  - Administrative Dashboard: Student records, batch scheduling, roll-call attendance, multi-tiered tuition & fee invoicing, receipts, timetable management, and staff roles.
  - Student Portal: Responsive self-service portal for candidates to check attendance, fee balances, receipts, weekly timetable schedules, and centre announcements.
  - StudyMate SSO: Seamless 1-click Single Sign-On bridging coaching centres directly to the StudyMate CBT engine.
- **Backend / Database**: Next.js 16 App Router, Prisma ORM, SQLite database with tenant isolation.
- **UI / UX**: Mobile-first responsive navigation, floating mobile bottom bar, slide-out drawer, accessible color palette, and polished entrance animations.

## Getting Started

```bash
cd coaching-centre-portal
npm install
npm run dev
```

The portal runs on `http://localhost:3000`.
