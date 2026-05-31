# AidiCore Roadmap

## V1.0 — Foundation
- React + TypeScript + Vite rebuild
- Firebase Auth service layer
- Firestore service layer
- Impact recording
- User dashboard
- Admin review foundation
- Audit logs foundation
- Arabic/English
- RTL/LTR
- Firebase Hosting configuration
- Local demo fallback mode

## V1.1 — Design System Upgrade ✅
- Premium Home hero
- Trust/privacy pills
- Guided impact category preview
- Improved Impact page explanation
- Improved About page principles
- Improved Admin summary cards
- Improved Navbar and Footer
- Safer `useEffect` data-loading patterns
- Added PROJECT_MEMORY and CHANGE_REQUESTS documentation

## V1.2 — Auth, Firestore & Admin Foundation ✅
- Real Firebase Auth UX polish
- Browser local session persistence
- Password reset flow
- Profile editing
- Admin Console tabs
- User management foundation
- Audit logs page
- Settings page foundation
- Firestore security rules hardening

## V1.3 — Impact Records Workflow ✅
- Better Record Impact form
- Duplicate/grouping feedback
- Optional proof attachment design
- Stronger sensitive-data warning
- Draft/success states
- My Impact filtering by status/category

## V1.4 — Live Data & Impact Credits Foundation ✅
- Removed demo homepage statistics.
- Added live Firestore statistics.
- Added Impact Credits foundation with small decimal values.
- Added guided impact recording and last-used city defaults.

## V1.4.2 — Content & Localization Cleanup ✅
- Cleaned Arabic/English product copy.
- Added French language foundation.
- Added French category names.
- Updated terminology to Impact Index / مؤشر الأثر.
- Added clearer custom-domain Google Auth error guidance.

## V1.5 — Impact Identity & Passport
- Pending / approved / rejected filters
- Better audit note editor
- Search and filtering for users
- Admin analytics cards
- Settings validation and safer defaults

## V1.6 — Trust & Quality
- Advanced moderation filters
- Duplicate detection
- Rate-limit design
- Safer legal pages
- Firestore security rules hardening

## V2.0 — Organizations
- School accounts
- NGO accounts
- CSR accounts
- Organization dashboards
- Organization impact reports

## V3.0 — Intelligence
- AI safe-text assistant
- AI category suggestions
- AI fraud review assistant
- Impact trend analytics

## V4.0 — Mobile
- Mobile app
- Push notifications
- Offline draft impact records
## Completed in V1.2.1
- Google Login foundation.
- Required email verification for password accounts.
- Cleaner production authentication UI.

## Completed in V1.2.2
- Fixed Firestore signup failure caused by unsupported `undefined` values.
- Normalized avatar URL handling for Email/Password and Google accounts.
- Added safer audit-log payload sanitization.

## Next: V1.3.0
- Real Admin Console backed by Firestore permissions.
- Admin role bootstrap process.
- Real impact review workflow.


## Completed in V1.3.0

- Live Community Impact metrics.
- Real impact record submission to Firestore.
- Safer form validation and sensitive-data warnings.
- Improved pending-review confirmation workflow.

## Next Planned — V1.4.0

- Harden Admin approval/rejection workflow.
- Add first-admin bootstrap documentation.
- Add notifications for approved/rejected impact records.
- Improve Firestore security rules for moderator/admin operations.


## Approved Future Roadmap Additions

### V1.5.0 - Impact Identity Layer
- Unique alias / nickname system.
- Non-personal avatar system.
- Growth stages: Seed, Sprout, Plant, Tree, Forest, Oasis.
- Impact Passport profile that is private by default.
- Share links that can expire or be viewed once.

### V1.6.0 - Trust & Endorsement Engine
- Registered-user confirmation for impact records.
- Confirmation increases trust/confidence, not raw impact credits.
- Anti-abuse limits for mutual confirmations.
- Trust score weighting based on user growth stage and review history.

### V1.7.0 - Smart Duplicate & Habit Engine
- Treat repeated same-day actions as grouped habits.
- Diminishing returns for repeated categories.
- Similarity detection for titles/descriptions.
- Possible duplicate records go to audit instead of generating extra credit.


## Completed in V1.4.2
- Persistent AR / EN / FR language switcher.
- Shortened navbar labels for Arabic, English, and French.
- Fixed desktop navbar wrapping and oversized buttons.
- Improved mobile language selection.
