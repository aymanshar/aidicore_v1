# AidiCore Change Requests

This file tracks user-requested changes and decisions so future work can continue without losing context.

## 2026-05-30 — Project should be rebuilt like DEEP

### Requested By
Ayman

### Request
Rebuild AidiCore from the beginning using the same implementation style and quality level as the DEEP Card Game project.

### Decision
Approved.

### Implementation Direction
React + TypeScript + Vite + Firebase-first architecture.

### Status
Implemented in V1.0.0 foundation.

---

## 2026-05-30 — Use Firebase-first architecture

### Requested By
Ayman

### Request
Use Firebase fully like DEEP for the first version.

### Decision
Approved.

### Status
Implemented in V1.0.0 / V1.0.1.

---

## 2026-05-30 — Improve idea before implementation

### Requested By
Ayman

### Request
Evaluate and improve the idea before building.

### Decision
Approved.

### Product Decisions
- Position AidiCore as a Privacy-First Community Impact Platform.
- Use Impact Records instead of Deeds.
- Keep impact symbolic and non-financial.
- Avoid leaderboards and social-media competition.
- Anonymous public visibility should be default.
- Admin review and trust workflow are essential.

### Status
Captured in product architecture and Project Memory.

---

## 2026-05-30 — Logo can be redesigned

### Requested By
Ayman

### Request
The current logo is optional; the assistant can design a better one if needed.

### Decision
Approved.

### Status
Pending final brand sprint. Current project keeps logo concept and uploaded assets.

---

## 2026-05-30 — Add running documentation/version memory

### Requested By
Ayman

### Request
With every version or change, update README and maintain versioning as a reference so future changes are easier to understand without searching through all files.

### Decision
Approved.

### Implementation
- README now includes a current version summary and versioned changes.
- VERSION_LOG remains the detailed release history.
- PROJECT_MEMORY was added as the permanent product decision reference.
- CHANGE_REQUESTS was added as the user-request tracking file.

### Status
Implemented in V1.1.0.

---

## 2026-05-30 — Start V1.2 foundation hardening

### Requested By
Ayman

### Request
Start the next project step after V1.1.0, focusing on the real product foundation instead of only adding visual features.

### Decision
Approved.

### Implementation
- Added stronger authentication UX and password reset.
- Added Profile page editing.
- Added Admin Console tabs.
- Added user management foundation.
- Added audit logs and settings services.
- Hardened Firestore rules.

### Status
Implemented in V1.2.0.
## 2026-05-30 - Authentication Hardening

### Requested By
Ayman

### Request
Add Google Login and require email verification to prevent fake accounts and reduce abuse.

### Decision
Approved for V1.2.1.

### Implementation
- Added Google popup sign-in.
- Sent verification email after password signup.
- Blocked unverified password users from signing in.
- Removed demo auth text.
---

## 2026-05-30 - Signup Firestore Hotfix

### Requested By
Ayman

### Issue
Real Email/Password signup failed because Firestore rejected `avatarUrl: undefined` in `users/{uid}`.

### Decision
Approved as V1.2.2 hotfix.

### Implementation
- Changed missing avatar URLs from `undefined` to `null`.
- Updated `AppUser.avatarUrl` type.
- Sanitized audit log payloads before writing to Firestore.

### Status
Implemented in V1.2.2.



---

## 2026-05-31 — Build real Impact Submission

### Requested By
Ayman

### Request
Proceed to the next real project step after deployment and authentication: make AidiCore record real community impact, not just show a landing page.

### Decision
Approved.

### Implementation
- Added real impact submission workflow connected to Firestore.
- Added live community metrics.
- Added form-level sensitive-data warning and safer validation.

### Status
Implemented in V1.3.0.


## 2026-05-31 - Remove Demo Data and Approve Impact Economy

### Requested by
Ayman

### Decision
Remove static demo data from public pages and switch the interface to live Firestore data. Approve the Impact Credits, duplicate prevention, alias/profile, Impact Passport, growth stages, and endorsement concepts for upcoming versions.

### Reason
AidiCore is now live and connected to Firebase, so demo numbers and fake examples should no longer appear. The product should encourage authentic, diverse, non-repetitive impact instead of point farming.

### Status
Approved and partially implemented in V1.4.0.


---

## 2026-05-31 - Content Cleanup and French Localization

### Requested By
Ayman

### Request
Replace prototype-style text across the site with product-appropriate copy, keep Arabic and English in mind, and add French if possible.

### Decision
Approved for V1.4.1.

### Implementation
- Added French to `Language` and dictionary.
- Added French category labels.
- Rewrote key public-page copy for About, Rules, Impact, Actions, footer, and placeholders.
- Updated user-facing terminology from reward-like balance wording to Impact Index / مؤشر الأثر.
- Added clearer Firebase custom-domain Google Login error guidance.

### Status
Implemented in V1.4.1.

## 2026-05-31 - Fix Language Switcher and Navbar Layout

### Requested By
Ayman

### Issue
After adding French, the language button became confusing and the navbar buttons became too large or wrapped onto multiple lines.

### Decision
Approved as V1.4.2.

### Implementation
- Replaced the cycle-only language toggle with a persistent AR / EN / FR switcher.
- Added active-language highlighting.
- Shortened navigation labels in Arabic, English, and French.
- Added no-wrap button and responsive navbar spacing styles.

### Status
Implemented in V1.4.2.


## V1.5.0 - Impact Passport Profile Cleanup

Requested by: Ayman

Decision:
- Fix the profile page that exposed avatarUrl as a raw technical field.
- Merge the fix with the next product step: Impact Passport foundation.

Status: Implemented
