# AidiCore Project Memory

This file is the long-term memory for AidiCore. It preserves the decisions that should guide future development without needing to search through old chats or many code files.

## Official Product Name

AidiCore

## Official Product Direction

Privacy-First Community Impact Platform

AidiCore is not just a good-deeds website. It is intended to become a scalable community impact registry for individuals, schools, universities, NGOs, CSR programs, and future organizations.

## Official Taglines

English:

- Make Good Visible
- Small Actions. Lasting Impact.

Arabic:

- خلّي الخير ظاهر
- كل فعل خير يصنع أثرًا

## Core Product Decisions

- Build AidiCore from scratch using React + TypeScript + Firebase, similar to the DEEP Card Game implementation style.
- Use the old AidiCore files only to understand the concept and requirements.
- Do not merge AidiCore with DEEP.
- DEEP is only the engineering quality benchmark.
- Prefer Firebase-first architecture for V1.
- Keep Railway/PostgreSQL as a possible later integration, not part of the V1 TypeScript rebuild.
- Replace old “Deeds” language with “Impact Records”.
- Replace points-first thinking with impact-first thinking.
- Impact score is symbolic and motivational only.
- No financial promise, no investment wording, no token-value promise.
- No leaderboard.
- No social-media-style competition.
- Anonymous public visibility is the default public mode.
- Admin review is core, not optional.
- Trust and privacy are more important than public recognition.

## Privacy Model

AidiCore should avoid collecting or displaying:

- Precise addresses
- Sensitive personal data
- Public phone numbers
- Raw IP addresses
- Unnecessary identity details

Preferred location granularity:

- Country
- City

## Visibility Levels

- Private
- Anonymous Public
- Public Profile

## User Roles

- Guest
- User
- Moderator
- Admin
- Super Admin

## Current Technical Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Firebase Authentication
- Firestore
- Firebase Hosting
- LocalStorage demo fallback when Firebase env values are missing

## Current Design Direction

Visual inspiration:

- Linear
- Vercel
- Stripe
- Notion

Avoid:

- Traditional charity websites
- WordPress-looking templates
- Government-heavy style
- Social-media feed style

## Brand Direction

Logo direction is flexible. The current recommended direction is:

- A + Heart + Ripple
- Action → Impact → Community

The existing uploaded logo can be used as reference, but the product is not required to stay locked to it.

## Color System

- Deep Navy: `#0F172A`
- Trust Blue: `#2563EB`
- Emerald: `#10B981`
- Gold: `#F59E0B`
- Background: `#020617`
- Surface: `#111827`

## Documentation Rule

Every release must update:

- `README.md`
- `VERSION_LOG.md`

When product decisions or user requests change, also update:

- `docs/PROJECT_MEMORY.md`
- `docs/CHANGE_REQUESTS.md`

## Current Version

V1.2.2 — Signup Firestore Hotfix

## Latest Implementation Decisions

- V1.2.0 added the first real admin-console structure with Overview, Impact Records, Users, Audit Logs, and Settings tabs.
- Password reset is supported when Firebase is configured.
- Profile editing supports display name and avatar URL first; real file upload can come later.
- First real Firebase admin must be bootstrapped manually by changing `users/{uid}.role` in Firestore.
- User self-updates are intentionally limited in Firestore rules to prevent role/status self-escalation.
- Impact approval currently updates user impact score from the client in MVP mode; future production hardening should move scoring/ledger logic into Cloud Functions.
## V1.2.1 Auth Decision
- Google sign-in is enabled and preferred.
- Email/Password remains available, but users must verify their email before access.
- Demo-mode login text was removed from the production UI.
- User documents are created automatically in Firestore under `users/{uid}`.

## V1.2.2 Hotfix Decision
- Firestore must never receive `undefined` values.
- Optional user fields that may not exist, such as avatar URL, should use `null` or be omitted intentionally.
- For AidiCore user profiles, `avatarUrl` is now allowed as `string | null`.
- Audit log payloads are sanitized before Firestore writes to prevent hidden optional-field errors.



## V1.3.0 Product State

AidiCore now has its first real product engine: users can submit Impact Records to Firestore, records start as pending, and the Community Impact page reads live statistics. The product is no longer only auth/hosting; it now has the core impact-submission workflow.

Important rule: keep sensitive-data prevention close to the form and later add server-side/Cloud Function validation if the product becomes public at scale.


## Approved Decisions - Impact Economy

- AidiCore uses small decimal Impact Credits instead of large points.
- Repeating the same help multiple times should not create multiple credits.
- Example: feeding several cats in the same situation should be grouped under Animal/Community care rather than counted as many separate achievements.
- Endorsements/tazkiya should increase confidence/trust, not directly inflate Impact Credits.
- No leaderboard or competitive ranking.
- Public identity must be alias/avatar based, not real-name based by default.
- Impact Passport is approved as a future private/shareable achievement report.

## Approved Future Product Concepts

- User profile link similar to a private achievement certificate.
- Share links should be generated by the user and can be one-time or expiring.
- User may choose whether to show a public alias/name, but real identity should remain protected.
- Growth should be psychologically meaningful: Seed → Sprout → Plant → Tree → Forest → Oasis.
- Trust increases with approved records, low duplicate behavior, and trusted confirmations.
