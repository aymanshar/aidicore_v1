# VERSION LOG

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
