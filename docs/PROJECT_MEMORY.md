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

V1.4.1 — Content & Localization Cleanup

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


## V1.4.1 Localization Decision

- AidiCore officially supports Arabic and English and now has a French localization foundation.
- Language switcher cycles AR → EN → FR.
- French should be expanded gradually; critical public pages and category names are prioritized first.
- Public wording should avoid reward/finance language. Use Impact Index / مؤشر الأثر instead of balance/points language.
- The product should no longer show prototype/demo text on public pages.

## Custom Domain Auth Decision

- Google Login on aidicore.com requires adding both `aidicore.com` and `www.aidicore.com` to Firebase Authentication Authorized Domains.
- If not configured, Firebase returns `auth/unauthorized-domain`.

## V1.4.2 Navigation Decision

- The language selector must always show all supported languages: AR, EN, and FR.
- The active language should be visually highlighted instead of cycling through one hidden next language.
- Navbar labels should be short and product-like to avoid layout breaks, especially in French.
- Long product terms such as “Impact Dashboard” and “Enregistrer un impact” can be shortened in navigation while fuller wording can remain inside page content.


## Decision - Impact Passport Foundation

The profile page is no longer treated as a technical account form. It is now the beginning of the Impact Passport concept. Users should not edit technical avatar URLs, roles, statuses, or emails. They may control safe public-facing identity fields such as display name, symbolic alias, and future sharing preferences. Impact Passport remains private by default until explicit private share links are implemented.


## V1.5.1 Passport Decision

The old Profile concept is now replaced by Impact Passport as the primary identity model. The passport must remain privacy-first and alias-first.

Approved implementation decisions:

- User-uploaded public avatars are not part of V1.5.1. Use `avatarId` from a predefined avatar registry.
- Alias must be normalized to lowercase letters, numbers, and underscores only.
- Reserved aliases such as `admin`, `support`, `system`, `aidicore`, `official`, and `moderator` are blocked.
- Real name is optional and controlled by `realNameVisible`.
- Growth Stage is calculated from sustained contribution, not manually assigned.
- Impact Passport is symbolic and must not become a popularity profile.

Current Growth Stages:

- Seed
- Sprout
- Plant
- Tree
- Forest
- Oasis

## V1.5.1 Hotfix Decision

The alias availability checker must use the public-safe `aliases` registry rather than querying the `users` collection. User documents remain private to the owner and moderators. Alias documents are minimal and contain only alias ownership metadata.

The Impact Passport settings page must not display the user's email address. It should show a safe verified-account message instead.

Aliases should always render as `@alias` with left-to-right direction even in Arabic layouts.

## V1.5.1 Final Hotfix Memory

A remaining Firestore permission error appeared during Impact Passport save. The cause was a rules mismatch for self-owned user updates where some existing user documents may not include all legacy immutable fields expected by the rule. The final fix keeps normal users restricted to safe profile/passport fields through `affectedKeys().hasOnly(...)` and removes the fragile direct equality check for `role/status` in the self-update branch.

Additional contribution categories were added: food support, disability support, animal welfare, and family support. Passport copy was polished to avoid unclear Arabic labels and technical alias suggestions.

## V1.5.4 Note
The remaining Passport save issue was caused by Firestore permissions around the new alias index and user passport fields. The app now uses the alias index when rules are deployed, and falls back to saving the user passport document with a clear rules-deployment message if the backend rules are outdated.


## V1.6 Admin Review Center Decision

AidiCore now treats admin review as a core product workflow. New impact records remain pending until reviewed. Only approved public records should appear in public impact pages. Admin review includes moderation notes and audit log tracking.

Passport UX should remain alias-first, privacy-first, and non-social. Alias availability is checked automatically while typing; no separate manual check button is needed.


## V1.7.1 - Trust Verification Polish

- Polished verification link experience with clearer one-time-use and admin-review messaging.
- Added visible latest verification link panel in Admin after link generation.
- Added confirmed, pending, and flagged verification metrics in Admin overview.
- Improved verification activity log details: status, time, owner, verifier, weight, penalty, and risk flags.
- Updated Firestore rules so self-verification attempts are stored as rejected/flagged audit events instead of failing with a generic permissions error.
- Updated footer/app version to v1.7.1.
