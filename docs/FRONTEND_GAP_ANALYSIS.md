# Bazodiac Relationships — Comparative Software Gap Analysis

**Date:** 2026-07-19  
**Jira:** BAZ-55  
**Evidence class:** uploaded repository snapshots, source inspection and local baseline checks

## Decision

The React/TypeScript landing-page implementation has the higher potential as the canonical foundation for the full Bazodiac Relationships application. This GAIS repository remains a reference prototype and interaction donor.

## Aggregate rubric

| Dimension | GAIS prototype | React/TypeScript frontend |
|---|---:|---:|
| One-shot target fit | 67.6% | 70.3% |
| Full-app readiness | 23.6% | 37.7% |
| Overall rubric | 51.5% | 58.3% |

These values are rubric scores, not production telemetry.

## GAIS strengths

- richer static multi-page click dummy;
- broader sample interactions and walkthrough concepts;
- substantial prototype and accessibility documentation;
- locally runnable static HTML path.

## GAIS critical gaps

- Vite build does not package the actual static prototype path;
- React shell and static application form two competing frontend architectures;
- renderer and sample-content shapes are inconsistent;
- some sample language is too deterministic or blame-oriented;
- remote fonts contradict the offline claim;
- monolithic JavaScript and CSS increase migration risk.

## React/TypeScript frontend strengths

- coherent componentised application model;
- build artifact contains the real application;
- clearer boundaries between pages, sections, data and authentication prototype;
- closer alignment with the approved ivory/gold/cinnabar visual direction;
- lower migration cost for typed contracts, BFF integration and tests.

## React/TypeScript frontend critical gaps

- still a marketing and interaction prototype, not a complete relationship application;
- no RelationshipReport types or runtime schema validation;
- no BFF client, report-job lifecycle, dual consent or deletion flow;
- no repository-owned automated test and CI suite;
- prototype routing and unresolved dependency audit findings.

## Consolidation rule

Do not merge the GAIS codebase wholesale. Reimplement only reviewed capabilities as typed modules in the canonical frontend:

- multi-sample walkthrough;
- richer evidence focus;
- convergence and timing visualisation concepts;
- accessibility checklist and validation ideas;
- safe explanatory copy.

## Verification boundary

Locally verified: dependency installation, type checks, builds, static validation and selected DOM interactions. Real browser E2E, visual regressions, production authentication, BFF integration and live report calculation remain unverified or absent.