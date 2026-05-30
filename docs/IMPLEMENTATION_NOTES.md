# Implementation Notes

## What changed from the old AidiCore

The project was rebuilt as a Firebase-first TypeScript app because the requested direction was to follow the DEEP implementation style.

## Why not migrate FastAPI directly?

The legacy backend is useful for domain understanding, but it conflicts with the desired frontend-first TypeScript/Firebase approach. Keeping it would preserve old complexity and reduce maintainability.

## Current limitation

This release provides the full project foundation and working service layer, but Firebase credentials and Firestore indexes must be configured in the target Firebase project before production deployment.
