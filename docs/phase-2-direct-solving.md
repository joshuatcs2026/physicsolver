# Phase 2 — Direct Solving

Phase 2 solves problems that can be completed with one equation once known values and built-in constants are available.

## Pipeline

1. Normalize known values.
2. Count unresolved variables per equation.
3. Identify equations with exactly one unresolved variable.
4. Filter candidates for the requested target.
5. Rank candidates deterministically and preserve alternatives.
6. Apply a target-specific rearrangement.
7. Build a substitution record.
8. Compute the numerical result.
9. Reject non-finite results and return warnings.

## Deliberate limitation

The solver uses explicit equation handlers rather than evaluating arbitrary expression strings. This avoids executing user input and keeps the foundation easy to debug.

## Edge cases for later stages

- Division by zero
- Negative radicands for real-valued solves
- Multiple roots
- Signed quantities
- Unit normalization
- Ambiguous aliases
- Physically impossible but mathematically valid results
- Alternative equations with different assumptions
