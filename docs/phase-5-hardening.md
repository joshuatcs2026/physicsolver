# Phase 5 — Debug, Test, Harden, and Improve

## Changes completed in order
1. Expanded the full test command so parser tests are no longer skipped.
2. Added integration coverage for direct and multi-step solving.
3. Added arithmetic guards for division by zero and invalid square roots.
4. Replaced the basic unit lookup with compound-unit parsing such as `km/h`, `m/s²`, and `kg*m/s`.
5. Added dimensional validation when user-entered units are normalized.
6. Added dimensional and answer sanity helpers.
7. Replaced order-based quantity assignment with conservative dimension-aware matching.
8. Fixed case-sensitive unit detection (`N`, `W`) and deterministic target extraction.
9. Preserved derived result units in solve traces.
10. Replaced raw JSON result rendering with readable solution steps.

## Regression scenarios
- 36 km/h converts to 10 m/s.
- `m/s²` resolves to acceleration dimensions.
- Seconds cannot be supplied as a mass unit.
- Division by zero stops with an explicit solver error.
- A two-step kinematics path solves displacement as 24 m from vi=5 m/s, a=2 m/s², t=3 s.
- `10 N` remains recognizable despite case-sensitive unit symbols.
- `Find acceleration` selects acceleration rather than the last arbitrary variable mention.

## Remaining limitations
- Equation coverage is still intentionally small; the engine is only as capable as its equation registry.
- Text extraction remains heuristic and must be reviewable by the user.
- Derived units currently use each variable's preferred common unit rather than a full symbolic unit algebra formatter.
- GitHub Pages deployment requires the repository Pages source to be set to GitHub Actions in repository settings.

## Debugging note
A local clone/test run was attempted from the execution environment, but that environment could not resolve GitHub's hostname. The repository therefore retains GitHub Actions as the authoritative automated execution path. The expanded test command is committed so every CI run exercises the complete current suite.
