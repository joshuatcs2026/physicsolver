# PhysicsSolver 1.2 — Phase 4

Phase 4 adds physics-aware validation and a conservative unit conversion layer on top of the Phase 3 general solver.

## Implemented
- Physical-value validation for common non-negative quantities while preserving signed quantities such as velocity.
- Candidate validation/ranking helpers.
- Explicit unit conversion for core SI units and common derived units.
- Dimensional compatibility checks before conversion.
- Regression tests for conversion and physical-result validation.

## Compatibility
Phase 4 is additive. Existing direct solvers and Phase 3 parsing/general solving remain available. Unsupported units fail explicitly rather than silently producing a number.

## Next hardening
The next pass should connect these helpers directly to every solver result, expand the unit registry instead of duplicating unit definitions, and add variable-specific bounds/assumptions from equation metadata.
