# AidiCore 2.0

**Privacy-First Community Impact Platform**  
**Make Good Visible — خلّي الخير ظاهر**

AidiCore is rebuilt from scratch as a React + TypeScript + Firebase product, using the DEEP Card Game project as the engineering-quality reference, not as business logic.

## Current Version

**V1.1.0 — Design System Upgrade**

This version stabilizes the product identity and user-facing design foundation before deeper Firebase/Admin work.

## Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Firebase Authentication
- Firestore
- Firebase Hosting
- Local demo fallback mode when Firebase env values are missing

## Main Features

### V1.0.0 Foundation

- Arabic / English UI
- RTL / LTR switching
- Premium dark responsive design
- Firebase authentication service layer
- Firestore service layer
- Record Impact workflow
- Public anonymous community impact feed
- User dashboard
- Admin review queue foundation
- Fraud score foundation
- Audit log foundation
- Privacy-first visibility levels

### V1.0.1 Local Preview Fix

- Prevented blank local preview when Firebase environment variables are missing
- Added demo-safe Firebase fallback values
- Added localStorage demo mode for auth and impact records

### V1.1.0 Design System Upgrade

- Improved Home hero section with stronger product positioning
- Added trust/privacy pills to the hero section
- Added guided impact categories preview on the Home page
- Improved Community Impact page with privacy/trust explanation cards
- Improved About page with product principle cards
- Improved Admin Console summary cards
- Replaced unsafe render-time data loading with `useEffect` in public feed, my records, and admin review queue
- Improved Navbar with clearer Record Impact CTA
- Improved Footer with platform/legal sections
- Added `PROJECT_MEMORY.md` as the long-term project decision reference
- Added `CHANGE_REQUESTS.md` as the running change-request register
- Updated documentation and package version to `1.1.0`

## Install

```bash
npm install
cp .env.example .env.local
npm run dev
```

If you do not configure Firebase, the app still opens in local demo mode.

## Firebase Setup

Fill `.env.local` with your Firebase web app values:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Demo Admin Access

In local demo mode, login with any email containing `admin`, for example:

```text
admin@aidicore.local
```

## Firestore Collections

- `users`
- `impact_records`
- `audit_logs`
- `impact_scores` planned
- `settings` planned

## Admin Access

A user becomes admin when their `users/{uid}.role` is one of:

- `moderator`
- `admin`
- `super_admin`

## Important Product Rule

Impact score is symbolic and motivational only. It is not money, investment, token value, or financial promise.

## Project Memory Workflow

Every future change must update at least one of these files:

- `README.md` — current product/version summary
- `VERSION_LOG.md` — exact release changes
- `ROADMAP.md` — planned future releases
- `docs/PROJECT_MEMORY.md` — permanent product decisions
- `docs/CHANGE_REQUESTS.md` — requested changes and decisions
