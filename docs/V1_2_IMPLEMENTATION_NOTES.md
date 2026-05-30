# V1.2.0 Implementation Notes

## Goal

Move AidiCore from a visual/prototype foundation into a stronger product foundation with authentication, profile, admin, audit, settings, and Firestore rule hardening.

## Files Added

- `src/services/auditService.ts`
- `src/services/settingsService.ts`
- `src/services/userService.ts`
- `docs/V1_2_IMPLEMENTATION_NOTES.md`

## Files Updated

- `src/App.tsx`
- `src/hooks/useAuth.tsx`
- `src/services/authService.ts`
- `src/services/impactService.ts`
- `src/types.ts`
- `src/components/Layout.tsx`
- `firestore.rules`
- `package.json`
- `README.md`
- `VERSION_LOG.md`
- `ROADMAP.md`
- `docs/FIREBASE_SCHEMA.md`
- `docs/PROJECT_MEMORY.md`
- `docs/CHANGE_REQUESTS.md`

## Risks

- Real Firebase admin bootstrapping requires manual role update in Firestore.
- Client-side impact-score updates are acceptable for MVP but should move to Cloud Functions before production abuse-sensitive launch.
- Firestore composite indexes may be required for queries that combine `where` and `orderBy`.

## Rollback Strategy

Revert to the V1.1.0 GitHub release/tag if V1.2.0 Firebase integration behaves unexpectedly.
