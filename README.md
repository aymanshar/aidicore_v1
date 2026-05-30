# AidiCore 2.0

**Privacy-First Community Impact Platform**  
**Make Good Visible — خلّي الخير ظاهر**

AidiCore is rebuilt from scratch as a React + TypeScript + Firebase product, using the DEEP project as the engineering-quality reference, not as business logic.

## Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Firebase Authentication
- Firestore
- Firebase Hosting

## Main Features in V1

- Arabic / English UI
- RTL / LTR switching
- Premium dark responsive design
- Firebase authentication
- Record Impact workflow
- Public anonymous community impact feed
- User dashboard
- Admin review queue
- Fraud score foundation
- Audit log foundation
- Privacy-first visibility levels

## Install

```bash
npm install
cp .env.example .env
npm run dev
```

## Firebase Setup

Fill `.env` with your Firebase web app values:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
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
