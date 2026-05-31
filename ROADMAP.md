## V1.7.3 - Verification Link Visibility & Dashboard Record Fix

- Added direct verification-link creation immediately after submitting an impact record.
- Kept per-record verification links visible in the user dashboard.
- Fixed user dashboard record loading by simplifying the owner query and adding email fallback for older/duplicate profile records.
- Added userEmail to new impact records for safer account/profile matching.
- Updated footer/app version to v1.7.3.


## V1.7.2 - User-Led Verification Links

- Moved verification link creation to the user dashboard so the impact owner sends it to the helped person or a witness.
- Verification can be completed by an existing user or by a new user after account creation.
- Self-verification remains blocked and recorded as a rejected trust event.
- Trusted verifiers receive a slightly higher internal verification weight while new accounts receive a lower weight.
- Admin console now monitors verification activity instead of generating verification links by default.
- Updated footer/app version to v1.7.2.

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

## V1.5 — Impact Identity & Passport ✅
- Unique alias and availability checks
- Friendly avatar library
- Privacy controls
- Growth stage and Impact Passport preview
- Passport UI polish and safe public identity

## V1.6 — Admin Review Center ✅
- Admin review dashboard
- Pending impact queue
- Approve/reject workflow
- Moderation notes
- Audit log integration
- Admin overview metrics including approved today

## V1.7 — Trust & Quality
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


## V1.5.x - Impact Passport Roadmap

- Finalize unique alias validation.
- Add private expiring share links.
- Add one-time-view share links.
- Add visual avatar themes based on growth stages.
- Keep Impact Passport private by default.


## V1.5.1 — Passport Polish & Data Safety ✅
- Unique alias validation and availability checker.
- Reserved alias protection.
- Alias suggestions.
- Friendly predefined avatar selection.
- Real-name visibility toggle.
- Passport readiness toggle.
- Hide contribution categories toggle.
- Impact Passport UI redesign.
- Central Growth Stage calculator.
- Firestore rules updated for passport fields.
- Basic input sanitization before impact record creation.

## V1.5.2 — Trustworthy Passport Experience
- Passport journey timeline.
- Contribution summary by category.
- Non-social contribution badges.
- Printable / PDF passport.
- Temporary passport preview link foundation.

### V1.5.1 Final Hotfix Notes

V1.5.1 now includes the final Passport permissions correction, improved Passport UI language, and additional contribution categories requested during testing:

- Food Support
- Disability Support
- Animal Welfare
- Family Support

These remain privacy-safe categories and do not require exposing personal data.


## V1.6.1 — Admin Control & Impact Credit Hotfix

- Standardized impact credits to 0.1 per approved record across all categories.
- Improved Admin Impact Records tab to show all records with filters for all/pending/approved/rejected.
- Added user profile delete action for super admins with audit logging.
- Added UID and impact index visibility in Admin Users for debugging duplicate user documents.
- Updated Firestore rules to allow super admin user profile deletion and alias cleanup.
- Clarified that deleting a user profile from Firestore does not delete the Firebase Auth account.


## V1.7.2 - Trust Verification Polish

- Polished verification link experience with clearer one-time-use and admin-review messaging.
- Added visible latest verification link panel in Admin after link generation.
- Added confirmed, pending, and flagged verification metrics in Admin overview.
- Improved verification activity log details: status, time, owner, verifier, weight, penalty, and risk flags.
- Updated Firestore rules so self-verification attempts are stored as rejected/flagged audit events instead of failing with a generic permissions error.
- Updated footer/app version to v1.7.2.
