# Bazodiac Relationships GAIS Prototype

This repository preserves the first rich interaction prototype for Bazodiac Relationships.

## Repository role

**Status: reference prototype, not the canonical production frontend.**

The repository is retained because it contains useful interaction and documentation material:

- a multi-page static landing-page prototype;
- relationship-dynamic filters and sample archetypes;
- evidence, conditions, opportunity/shadow and walkthrough concepts;
- accessibility and prototype documentation.

The canonical application frontend is being developed in `DYAI2025/Bazodiac_Relationship` under `apps/web`.

## Important limitations

- The React/Vite root currently acts as a redirect shell around the static prototype.
- The normal Vite build does not package the full static prototype path.
- Some sample-content structures do not match the JavaScript renderer contract.
- Some sample wording is too deterministic or blame-oriented for production use.
- The static CSS imports remote fonts and is therefore not fully offline.

Do not merge this code wholesale into the canonical application. Port only reviewed interaction concepts as typed React/TypeScript modules.

## Run the static prototype

Open `prototype/landing/index.html` directly in a browser.

## Related documentation

- [Frontend decision record](docs/FRONTEND_DECISION_RECORD.md)
- [Comparative gap analysis](docs/FRONTEND_GAP_ANALYSIS.md)
- Jira: `BAZ-55`
- Canonical repository: https://github.com/DYAI2025/Bazodiac_Relationship
