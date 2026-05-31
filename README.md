# AidiCore 2.0

**Privacy-First Community Impact Platform**  
**Make Good Visible — خلّي الخير ظاهر**

AidiCore is rebuilt from scratch as a React + TypeScript + Firebase product, using the DEEP Card Game project as the engineering-quality reference, not as business logic.

## Current Version

**V1.5.1 — Passport Polish & Data Safety**

This version fixes the first real Firebase signup issue found after enabling Google Login and Email Verification. User documents now avoid unsupported `undefined` values in Firestore, especially for missing avatar URLs.

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
- Replaced unsafe render-time data loading with `useEffect`
- Improved Navbar with clearer Record Impact CTA
- Improved Footer with platform/legal sections
- Added `PROJECT_MEMORY.md` as the long-term project decision reference
- Added `CHANGE_REQUESTS.md` as the running change-request register

### V1.2.0 Authentication, Firestore & Admin Foundation

- Added stronger Firebase Auth session persistence using browser local persistence
- Added password reset flow in Login
- Added Profile page with display-name and avatar URL editing
- Added reusable admin services for users, settings, and audit logs
- Added Admin Console tabs: Overview, Impact Records, Users, Audit Logs, Settings
- Added user role/status management foundation
- Added app settings management foundation
- Added audit logging for auth, profile, impact, review, user, and settings actions
- Added duplicate same-day impact detection in demo and Firestore modes
- Added impact score/approved-action update after approval
- Hardened Firestore security rules for users, impact records, audit logs, and settings
- Updated package version to `1.2.0`


### V1.2.2 Signup Firestore Hotfix

- Fixed Firestore signup failure caused by `avatarUrl: undefined`
- Updated `AppUser.avatarUrl` to support `string | null`
- Normalized user profile writes to use `null` for missing avatar URLs
- Sanitized audit log payloads before writing to Firestore
- Updated package version to `1.2.2`

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

For moderator demo mode, use any email containing `mod`.

## Firestore Collections

- `users`
- `impact_records`
- `audit_logs`
- `settings`
- `impact_scores` planned for later analytics/ledger separation

## Admin Access

A user becomes admin/moderator when their `users/{uid}.role` is one of:

- `moderator`
- `admin`
- `super_admin`

For a real Firebase project, create the first admin manually in Firestore by updating the user document role after signup.

## Important Product Rule

Impact score is symbolic and motivational only. It is not money, investment, token value, or financial promise.

## Project Memory Workflow

Every future change must update at least one of these files:

- `README.md` — current product/version summary
- `VERSION_LOG.md` — exact release changes
- `ROADMAP.md` — planned future releases
- `docs/PROJECT_MEMORY.md` — permanent product decisions
- `docs/CHANGE_REQUESTS.md` — requested changes and decisions
## V1.2.1 Authentication Update

AidiCore now supports Google sign-in and Email/Password with required email verification.

Recommended production providers:
- Google: enabled and preferred.
- Email/Password: enabled, verification required before access.

After creating an email account, users must confirm the verification email before signing in.


## V1.4.0 Notes

AidiCore now removes homepage demo statistics and uses live Firestore-driven community metrics. The impact economy has moved toward small decimal Impact Credits and duplicate-aware scoring fields. The Record Impact flow is now guided with category cards and safe templates to reduce manual user input.


## V1.4.2 Notes

This release cleans up public product wording and introduces French localization foundation.

### Included
- Arabic/English copy cleanup for product pages.
- French language support added to the language model and category names.
- Public wording now uses Impact Index / مؤشر الأثر instead of reward-like wording.
- Footer and documentation updated to V1.4.2.
- Google Login custom-domain error now provides a clearer instruction.

### Firebase Reminder
For Google Login on the custom domain, add these to Firebase Authentication → Settings → Authorized Domains:

- aidicore.com
- www.aidicore.com


## V1.5.0 Update

This release introduces the first Impact Passport foundation and fixes the profile page so users no longer see or edit raw technical fields such as `avatarUrl`. The profile experience now focuses on safe identity: display name, symbolic alias, growth stage, and future private sharing preferences.


## Current Version

**V1.5.1 — Passport Polish & Data Safety**

This version converts the previous profile foundation into a stronger privacy-first Impact Passport experience. It adds alias validation, reserved-name protection, alias availability checking, avatar selection from a safe predefined library, privacy controls, and automatic Growth Stage calculation.

### V1.5.1 Highlights

- Impact Passport replaces Profile as the user-facing identity concept.
- Alias-first identity with unique `aliasNormalized` support.
- Friendly `avatarId` selection instead of public user-uploaded avatar URLs.
- Real-name visibility toggle.
- Passport readiness toggle.
- Hide contribution categories toggle.
- Growth Stage calculator: Seed, Sprout, Plant, Tree, Forest, Oasis.
- Firestore rules updated for Passport safety.


## Current Release

V1.6.0 — Admin Review Center + Passport Stable Polish.

- Impact Passport alias UX is automatic and privacy-first.
- Admins/moderators can review pending impact records, approve/reject, add moderation notes, and inspect audit logs.


## V1.6.1 — Admin Control & Impact Credit Hotfix

- Standardized impact credits to 0.1 per approved record across all categories.
- Improved Admin Impact Records tab to show all records with filters for all/pending/approved/rejected.
- Added user profile delete action for super admins with audit logging.
- Added UID and impact index visibility in Admin Users for debugging duplicate user documents.
- Updated Firestore rules to allow super admin user profile deletion and alias cleanup.
- Clarified that deleting a user profile from Firestore does not delete the Firebase Auth account.


## V1.7.0 Trust Verification Foundation

- Added admin-side impact record delete and manual status control.
- Added verification link foundation for impact confirmation.
- Added anti-collusion rules: self-verification is blocked, repeated verifier-owner patterns are flagged, and suspicious confirmations can apply negative trust penalties.
- Added admin visibility for verification risk flags and duplicate-email warning.
- Kept public ranking disabled; trust/risk indicators remain internal/admin-oriented.
