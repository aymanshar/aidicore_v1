# VERSION LOG

## V1.2.2 — Signup Firestore Hotfix

### Fixed
- Fixed Firestore signup failure caused by `avatarUrl` being written as `undefined`.
- Updated `AppUser.avatarUrl` typing to support `string | null`.
- Normalized user profile writes to use `null` instead of `undefined` for missing avatar URLs.
- Removed `undefined` values from audit log payloads before writing to Firestore.
- Normalized optional demo audit notes to empty strings to avoid future Firestore payload issues.

### Changed
- Updated package version to `1.2.2`.
- Updated Footer version label to `1.2.2`.

### Notes
- This is a hotfix release for the first real Firebase signup test after V1.2.1.
- Build was verified successfully with `npm run build`.

## V1.2.0 — Authentication, Firestore & Admin Foundation

### Added
- Added Firebase Auth browser local persistence for more stable sessions.
- Added password-reset flow from the Login screen.
- Added real Profile page with display-name and avatar URL editing.
- Added `services/userService.ts` for admin user listing, role updates, and status updates.
- Added `services/auditService.ts` for audit log creation/listing in demo and Firebase modes.
- Added `services/settingsService.ts` for app settings read/write flow.
- Added Admin Console tabs: Overview, Impact Records, Users, Audit Logs, and Settings.
- Added demo and Firestore duplicate same-day impact detection using `groupingKey`.
- Added impact score and approved-action updates when an impact record is approved.

### Changed
- Updated package version to `1.2.0`.
- Upgraded Dashboard metrics to use the user's actual impact records.
- Expanded Admin from a simple pending queue into a multi-tab console.
- Updated Footer version label to `1.2.0`.
- Updated Firestore schema documentation to include settings and expanded audit logs.

### Fixed
- Hardened Firestore rules to reduce user self-escalation risk.
- Restricted user self-updates to safe profile/session fields.
- Added safer audit log create/read separation.
- Added settings write protection for admin roles only.

### Notes
- Real Firebase admin bootstrapping still requires manually setting the first admin user in Firestore after signup.
- Production-grade points/ledger logic should later move to Cloud Functions to avoid client-side authority.

## V1.1.0 — Design System Upgrade

### Added
- Added stronger Home hero with privacy-first positioning.
- Added trust/privacy pills in the Hero section.
- Added guided impact category preview cards on the Home page.
- Added Community Impact explanation cards for anonymous visibility, review workflow, and no-leaderboard philosophy.
- Added Product Principles section to About.
- Added Admin Console summary metrics for pending records, audit-required records, and review mode.
- Added improved Footer with platform and legal/contact links.
- Added `docs/PROJECT_MEMORY.md` to preserve long-term product decisions.
- Added `docs/CHANGE_REQUESTS.md` to track user-requested changes and sprint decisions.

### Changed
- Updated package version to `1.1.0`.
- Improved Navbar by adding a stronger `Record Impact` CTA for logged-in users.
- Improved mobile navigation handling and logout behavior.
- Improved Home page from a basic landing page into a more premium product landing experience.
- Updated README to include versioned change history and the new documentation workflow.

### Fixed
- Replaced render-time async loading patterns with `useEffect` in:
  - Public impact feed
  - My impact records
  - Admin review queue
- Reduced risk of repeated state updates during render.
- Added safer loading/empty states for records.

### Notes
- This version focuses on visual/product foundation, documentation discipline, and safe React patterns.
- Firebase/Firestore production rules and deeper admin CRUD remain planned for upcoming releases.

## V1.0.1 — Local Preview Fix

### Fixed
- Prevented blank local preview when Firebase environment variables are not configured.
- Added demo-safe Firebase fallback values.
- Added localStorage demo mode for auth and impact records so the UI can be reviewed before real Firebase setup.

### Notes
- Real Firebase mode activates automatically after adding `.env.local` with `VITE_FIREBASE_*` values.

## V1.0.0 — AidiCore TypeScript Foundation

### Added
- New React + TypeScript + Vite implementation.
- Firebase Auth and Firestore service layer.
- Arabic/English localization.
- RTL/LTR layout support.
- Premium dark UI design system.
- Impact Records replacing old Deeds terminology.
- Admin review queue foundation.
- Fraud score foundation.
- Audit logs foundation.
- Privacy-first visibility levels.

### Changed
- Product direction changed from a simple good-deeds website to a privacy-first community impact platform.
- Points-first concept replaced by impact-first concept.

### Fixed
- Avoided legacy FastAPI/Jinja route duplication by rebuilding the frontend as a clean TypeScript app.

### Future Improvements
- Organization accounts.
- AI-assisted safe text review.
- Advanced Firestore rules.
- Public analytics dashboard.
## V1.2.1 - Authentication Hardening

### Added
- Google sign-in button for Login and Signup.
- Email verification after Email/Password signup.
- Automatic Firestore user document creation for Google and Email accounts.

### Changed
- Removed Demo Mode messaging from the production auth screen.
- Email/Password users must verify their email before accessing the dashboard.
- Improved authentication notices and error messages in Arabic and English.

### Security Notes
- Google authentication is now the preferred sign-in method.
- Email verification reduces fake-account creation and improves account recovery trust.
