# Phase 8 — Advanced Solver Intelligence

Phase 8 completes the engine-oriented work before Phase 9 UI integration.

## Added engines
- Vector/component decomposition, addition, resultant magnitude and direction, dot products, and perpendicular checks.
- Coordinate displacement, midpoint, slope, and line helpers.
- Explicit sign-convention objects and interpretation warnings.
- Numeric algebra equality checks and deterministic substitution plans.
- Significant-figure counting/rounding, scientific notation, and precision recommendations.
- Diagram/visual-tool requirement detection.
- Alternative path ranking and reverse requirement inspection.
- A plug-in registry for future interactive visual tools without coupling the solver to the UI.

## Design
These modules are pure and browser-independent. Phase 9 can import them into the website without moving solver logic into DOM code.

## Limits
Vector logic is two-dimensional in this phase. Natural-language diagram detection is heuristic. Algebra checking is numeric rather than symbolic. These boundaries are deliberate to keep the offline static application deterministic and testable.
