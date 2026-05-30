# AidiCore Project Memory

This file is the long-term memory for AidiCore. It preserves the decisions that should guide future development without needing to search through old chats or many code files.

## Official Product Name

AidiCore

## Official Product Direction

Privacy-First Community Impact Platform

AidiCore is not just a good-deeds website. It is intended to become a scalable community impact registry for individuals, schools, universities, NGOs, CSR programs, and future organizations.

## Official Taglines

English:

- Make Good Visible
- Small Actions. Lasting Impact.

Arabic:

- خلّي الخير ظاهر
- كل فعل خير يصنع أثرًا

## Core Product Decisions

- Build AidiCore from scratch using React + TypeScript + Firebase, similar to the DEEP Card Game implementation style.
- Use the old AidiCore files only to understand the concept and requirements.
- Do not merge AidiCore with DEEP.
- DEEP is only the engineering quality benchmark.
- Prefer Firebase-first architecture for V1.
- Keep Railway/PostgreSQL as a possible later integration, not part of the V1 TypeScript rebuild.
- Replace old “Deeds” language with “Impact Records”.
- Replace points-first thinking with impact-first thinking.
- Impact score is symbolic and motivational only.
- No financial promise, no investment wording, no token-value promise.
- No leaderboard.
- No social-media-style competition.
- Anonymous public visibility is the default public mode.
- Admin review is core, not optional.
- Trust and privacy are more important than public recognition.

## Privacy Model

AidiCore should avoid collecting or displaying:

- Precise addresses
- Sensitive personal data
- Public phone numbers
- Raw IP addresses
- Unnecessary identity details

Preferred location granularity:

- Country
- City

## Visibility Levels

- Private
- Anonymous Public
- Public Profile

## User Roles

- Guest
- User
- Moderator
- Admin
- Super Admin

## Current Technical Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Firebase Authentication
- Firestore
- Firebase Hosting
- LocalStorage demo fallback when Firebase env values are missing

## Current Design Direction

Visual inspiration:

- Linear
- Vercel
- Stripe
- Notion

Avoid:

- Traditional charity websites
- WordPress-looking templates
- Government-heavy style
- Social-media feed style

## Brand Direction

Logo direction is flexible. The current recommended direction is:

- A + Heart + Ripple
- Action → Impact → Community

The existing uploaded logo can be used as reference, but the product is not required to stay locked to it.

## Color System

- Deep Navy: `#0F172A`
- Trust Blue: `#2563EB`
- Emerald: `#10B981`
- Gold: `#F59E0B`
- Background: `#020617`
- Surface: `#111827`

## Documentation Rule

Every release must update:

- `README.md`
- `VERSION_LOG.md`

When product decisions or user requests change, also update:

- `docs/PROJECT_MEMORY.md`
- `docs/CHANGE_REQUESTS.md`

## Current Version

V1.1.0 — Design System Upgrade
