# PhysicsSolver 1.2 — Phase 6

Phase 6 is the solver-intelligence layer. It is intentionally framework-like: planning is pure and catalog-agnostic so future equation packs, chemistry, user equations, UI modes, and alternative solvers can be added without rewriting the core.

## Features
- Dependency graph construction.
- Unknown counting.
- Equation ranking using target, solvability, domain, priority, and complexity.
- Shortest-path discovery with bounded depth.
- Alternative path discovery.
- Circular dependency detection.
- Unified solver modes: target, solve-all, principle, path, alternative.
- Structured plan summaries suitable for the browser UI.

## Design constraints
- No DOM dependencies in the intelligence engine.
- No `eval` or arbitrary code execution.
- No mutation of the equation catalog.
- Bounded graph searches to prevent runaway recursion.
- Existing direct/general solvers remain separate execution layers.
- Metadata is optional, allowing older equation records to continue working.

## Future extension points
Add equation confidence, unit-aware edge costs, user constraints, symbolic rearrangement, language-parser evidence, diagram evidence, and cached plans without changing the public planner API.
