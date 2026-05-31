# IMPROVEMENT PLAN

## Critical
- Build clean React + TypeScript foundation.
- Add Firebase Auth and Firestore service layer.
- Add bilingual RTL/LTR support.
- Protect admin area by role.
- Keep privacy-first language throughout the product.

## High
- Add impact record creation and review workflow.
- Add fraud score foundation.
- Add audit logs.
- Add responsive navigation and mobile hamburger.

## Medium
- Add user management admin screen.
- Add app settings screen.
- Add impact analytics charts.
- Add enhanced legal pages.

## Low
- Add advanced badges.
- Add organization accounts.
- Add AI review assistant.
- Add downloadable impact reports.

## Rollback Strategy

This is a new TypeScript implementation, so rollback is simple: keep the legacy AidiCore zip untouched and deploy the new app under a separate Firebase preview/project until validated.


## V1.4.1 Update

Content and localization cleanup completed. Public copy is no longer treated as placeholder/prototype text. French localization foundation was added, and the next implementation priority remains Impact Passport / Alias System followed by Trust Engine hardening.
