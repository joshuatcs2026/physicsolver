# Phase 6 continuation — Solver Intelligence

This layer adds a stable orchestration API around the existing dependency planner. It intentionally separates planning from execution so future symbolic solving, language parsing, diagram evidence, unit costs, and chemistry packs can plug in without changing the planner contract.

## Modes
- `target`: shortest available plan to one target.
- `solve-all`: reserved orchestration mode for reachable-value expansion.
- `principle`: reserved for principle explanations.
- `path`: expose the selected dependency path.
- `alternative`: select a non-primary path when available.

## Limits
Every context has bounded max depth, max paths, and max results. This prevents accidental runaway graph traversal as the equation catalog grows.

## Compatibility
The existing Phase 1–6 planner remains the source of dependency truth. This layer does not execute equations or mutate the catalog.
