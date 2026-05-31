# AidiCore Version Log

## V1.5.1 - Passport Polish & Data Safety

### Added
- Added `passportService` as a central Impact Passport identity layer.
- Added unique alias validation with normalization, reserved-name protection, availability checks, and suggestions.
- Added predefined friendly avatar library using safe `avatarId` values instead of public user-uploaded images.
- Added Passport privacy controls: real-name visibility, private passport readiness, and hide contribution categories.
- Added automatic Growth Stage calculation from approved actions / Impact Index.
- Added input sanitization for impact record text fields before saving.
- Added Firestore rule support for alias/passport fields and allowed avatar IDs.

### Changed
- Updated Profile screen into a stronger Impact Passport experience.
- Updated Dashboard greeting and impact submissions to prefer safe alias display.
- Updated admin user cards to avoid exposing real names as the primary identity.
- Updated package version to `1.5.1`.

### Security & Privacy
- Alias is now lowercase, URL-safe, 3-20 characters, and checked against reserved system names.
- Public identity now defaults toward alias-first display.
- Firestore rules now restrict user-editable passport fields and validate avatar IDs.

### Build Verification
- `npm install` completed successfully.
- `npm run build` completed successfully.
- Vite reported only the existing large bundle warning; no TypeScript errors.


## V1.4.1 - Content & Localization Cleanup

### Added
- Added French language support foundation (`fr`) in the language model and dictionary.
- Added French names for all impact categories.
- Added clearer French copy for key public pages where supported.

### Changed
- Rewrote Arabic and English public-page copy to sound like a real product instead of prototype text.
- Renamed wording from "رصيد الأثر / Impact Credits" in the user-facing interface toward "مؤشر الأثر / Impact Index" to avoid a financial or reward-like feeling.
- Updated About, Rules, Impact, Actions, Footer, and legal placeholder copy.
- Updated language switcher from two-language toggle to AR/EN/FR cycle.
- Updated footer version label to V1.4.1.

### Fixed
- Added user-facing explanation for `auth/unauthorized-domain` so custom-domain Google Login issues are clearer.

### Notes
- Firebase Authentication still requires adding `aidicore.com` and `www.aidicore.com` to Authorized Domains for Google Login on the custom domain.
- This release is a content/localization cleanup before building Impact Passport and Trust Engine features.

## V1.4.0 - Live Data & Impact Credits Foundation

### Added
- Live homepage statistics from Firestore instead of demo marketing numbers.
- Impact Credits foundation using small decimal values such as 0.1, 0.2, 0.3, and 0.5.
- Duplicate-aware scoring fields: duplicateLevel, confidenceScore, and impactCredits.
- User trust fields prepared for the next stages: trustScore, alias, and growthStage.
- Guided impact recording flow with category cards and safe templates to reduce manual typing.
- City/country default persistence using the last selected city and country.
- Location suggestion button that keeps privacy at city-level only.

### Changed
- Removed static demo statistics from the homepage.
- Removed fake public feed example from the homepage and replaced it with live status messaging.
- Replaced large score increments with small Impact Credit increments.
- Record Impact form now starts from guided templates rather than blank manual fields.
- Dashboard wording now uses Impact Credits / رصيد الأثر instead of large score framing.

### Security & Product Decisions
- No leaderboard.
- No large points economy.
- Duplicate records should not create repeated credit.
- Same action should be treated as a habit/group, not repeated individual achievements.
- Impact Passport, alias, avatar, growth stages, one-time share links, and endorsement engine are approved for later versions.

# VERSION LOG

## V1.3.0 — Impact Engine

### Added
- Added live Community Impact statistics from Firestore records.
- Added public approved-impact feed metrics.
- Added stronger real impact submission workflow connected to `impact_records`.
- Added safer form validation for title, details, city, and country code.
- Added sensitive-data warning for phone numbers, IDs, precise addresses, and similar risky text.
- Added post-submit confirmation flow with record ID and navigation back to Dashboard.

### Changed
- Updated Community Impact page to use real data instead of static placeholder statistics.
- Improved Record Impact page wording to clarify that records are pending until admin review.
- Updated package version to `1.3.0`.
- Updated Footer version label to `1.3.0 Impact Engine`.

### Fixed
- Reduced risk of users submitting sensitive personal data by blocking suspicious details at the form level.
- Improved empty states for public impact records.

### Notes
- V1.3.0 is the first release focused on AidiCore's actual product core: recording impact.
- Admin approval/rejection already exists as a foundation but will be hardened further in V1.4.0.
- Some Firebase queries may require indexes as real data grows; create indexes from Firebase console links if prompted.

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

## V1.4.2 - Navigation & Language Switch Fix

### Added
- Added a persistent AR / EN / FR language switcher that shows all supported languages at once.
- Added active-language highlighting for desktop and mobile navigation.

### Changed
- Shortened navigation labels to avoid oversized buttons, especially in French.
- Reworked desktop navbar spacing so the logo, page links, language selector, dashboard, record, and logout actions remain on one line on large screens.
- Improved mobile menu language selection with the same AR / EN / FR options.
- Updated footer version label to V1.4.2.

### Fixed
- Fixed confusing single-language toggle behavior.
- Fixed French navbar wrapping where long labels like “À propos d’AidiCore” and “Enregistrer un impact” broke button layout.
- Added no-wrap navbar button styles and responsive spacing rules.

### Notes
- This release keeps the three-language foundation while prioritizing a stable product navigation experience.

## V1.5.0 - Impact Passport Foundation

### Added
- Introduced the first Impact Passport profile experience.
- Added symbolic alias editing for users.
- Added growth-stage preview using Seed / Sprout / Plant / Tree / Forest / Oasis.
- Added privacy choices for future Impact Passport sharing.

### Changed
- Removed technical avatar URL input from the profile page.
- Reframed the profile page as a privacy-first Impact Passport rather than a generic user profile.
- Profile now shows user-facing impact indicators instead of technical fields.

### Notes
- Share links and one-time view links are planned for the next Impact Passport phase.
- Alias uniqueness enforcement will be added before public passport sharing is enabled.
