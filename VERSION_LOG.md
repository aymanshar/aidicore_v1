# VERSION LOG

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

## V1.0.1 - Local Preview Fix

### Fixed
- Prevented blank local preview when Firebase environment variables are not configured.
- Added demo-safe Firebase fallback values.
- Added localStorage demo mode for auth and impact records so the UI can be reviewed before real Firebase setup.

### Notes
- Real Firebase mode activates automatically after adding `.env.local` with `VITE_FIREBASE_*` values.
