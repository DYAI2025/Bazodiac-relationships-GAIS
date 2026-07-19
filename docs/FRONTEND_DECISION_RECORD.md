# Frontend Decision Record — GAIS Prototype Role

**Date:** 2026-07-19  
**Jira:** BAZ-55  
**Status:** Accepted for consolidation work

## Decision

The GAIS repository remains a reference and interaction-donor repository. It is not the canonical foundation for the production Bazodiac Relationships application.

The React/TypeScript landing-page implementation is the preferred production foundation and is committed to `DYAI2025/Bazodiac_Relationship` under `apps/web`.

## Why

The GAIS prototype has broader demo functionality, but it contains two competing frontend models: a minimal React/Vite redirect shell and a large static HTML/CSS/JavaScript application. The production build does not include the actual prototype path. The renderer and sample-content contracts are also inconsistent.

The React/TypeScript implementation has clearer component boundaries, a coherent build output and a lower migration cost for typed report contracts, authentication, consent, BFF integration and tests.

## Preserve from this repository

- multi-sample walkthrough concept;
- evidence-focus and source-highlighting ideas;
- convergence and timing visualisation concepts;
- accessibility checklist structure;
- static validation ideas;
- useful explanatory copy after claim-safety review.

## Do not port unchanged

- monolithic `app.js` and `styles.css`;
- unsafe or role-fixing sample language;
- remote-font dependency;
- Gemini/AI Studio setup that is unrelated to the current product path;
- ad-hoc data structures without a typed `RelationshipReport` contract.

## Product invariants

- no compatibility score;
- no diagnosis or prediction;
- shared relationship dynamic is the primary object;
- Person A and Person B remain symmetrical;
- shadow and opportunity are conditional expressions of one mechanism;
- every visible production dynamic requires evidence and mapping provenance;
- LLM output may phrase approved structures but may not invent rules or evidence.
