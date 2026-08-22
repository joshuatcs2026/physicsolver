# Bug and Risk Review

This document is a design-time checklist. The backbone was reviewed in multiple passes before feature implementation.

## Pass 1 — Logic and solver risks

- Symbol collisions: use immutable variable IDs and aliases.
- Missing information: represent blocked paths instead of inventing values.
- Circular dependencies: track visited states and active dependencies.
- Deep dependency chains: use bounded iterative traversal instead of unrestricted recursion.
- Invalid arithmetic: reject divide-by-zero, non-finite results, and invalid real roots unless the domain explicitly allows them.
- Multiple roots: preserve candidates and require physical constraints to rank them.

## Pass 2 — Data integrity risks

- Imported JSON can be malformed: validate before storing.
- Schema changes can break old saved work: version persisted records.
- Equation edits can invalidate saved paths: store equation IDs and versions.
- Units can be silently mixed: preserve unit metadata through every intermediate result.
- User guesses and confirmed facts must remain separate.

## Pass 3 — UI and accessibility risks

- Keyboard navigation must reach every control.
- Dynamic status should use an appropriate live region.
- Color must not be the only representation of dependency complexity.
- Dense equation displays need responsive wrapping and readable zoom behavior.
- Long solution paths should be collapsible without deleting information.

## Pass 4 — Security and privacy risks

- Never insert user/imported text through unsafe HTML APIs.
- Keep core solving local; no network dependency is required.
- Export explicitly rather than silently uploading data.
- Treat imported data as untrusted.

## Pass 5 — Static hosting risks

- Use relative paths compatible with project GitHub Pages URLs.
- Avoid server-only routes unless a fallback strategy is added.
- Do not rely on environment secrets for core functionality.
- Keep the root index.html deployable as the entry point.

## Pass 6 — Performance and efficiency patches

- Pre-index equations by variable/domain.
- Cache parsed equation metadata.
- Debounce language parsing.
- Deduplicate graph states.
- Bound path depth and alternative count.
- Lazily initialize visual modules.
- Avoid storing rendered DOM or duplicate solution text in persistence.

## Current shell review

The current `index.html` intentionally contains no solver arithmetic, remote calls, dynamic HTML insertion, deep recursion, or persistent data writes. The main remaining risks are future feature integration and GitHub Pages configuration, which are deferred to implementation phases.
