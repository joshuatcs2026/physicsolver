# PhysicsSolver Architecture

## Goal

Build a static, offline-first physics workspace without coupling the user interface to the mathematical engine.

## Layers

```text
Views / Components
        ↓ actions
Application State / Orchestrator
        ↓ normalized requests
Parser ───────────── Diagnostics
        ↓                 ↓
Problem Model ───── Solver Graph
        ↓                 ↓
Equation / Variable / Unit / Constant Data
        ↓
Storage and Import/Export
```

## Boundaries

### UI
Responsible only for rendering, collecting user actions, accessibility, and displaying results. It must not independently calculate physics results.

### Application
Coordinates workflows and converts UI events into calls to pure engine functions.

### Parser
Turns raw language into candidate quantities, units, targets, keywords, domains, and ambiguity records. Detection results carry confidence and should never silently overwrite explicit user choices.

### Solver
Consumes normalized data. Candidate equations become graph transitions. Solver output contains the answer, path, alternatives, assumptions, warnings, and evidence.

### Diagnostics
Runs independently where possible so a warning cannot mutate a numerical result. Categories include dimensions, units, signs, roots, algebra, significant figures, and plausibility.

### Storage
Keeps persistence behind a small adapter interface so localStorage can later be replaced by IndexedDB without changing solver code.

## Solver graph model

Use two conceptual node types:

- Variable node: a known, unknown, or derived physical quantity.
- Equation application node: an equation solved for one target variable using dependencies.

Search state should contain a canonical sorted set of known variables, avoiding repeated exploration of equivalent states. Cycle detection uses a visited set for graph traversal and an active-state set when constructing dependency explanations.

Prefer breadth-first or uniform-cost search for shortest paths. Use weighted ranking when equation confidence, unit compatibility, domain confidence, and user preferences matter.

## Complexity labels

Labels are presentation metadata derived from path metrics, not solver logic:

- 1 equation: direct
- 2 equations: short chain
- 3 equations: multi-step
- 4+: deep chain
- unresolved: blocked
- repeated dependency: cyclic

## Data integrity rules

1. IDs are immutable.
2. Symbols are aliases, not primary keys.
3. Values always carry a unit or explicit dimensionless marker.
4. Parsed guesses remain distinguishable from user-confirmed values.
5. Solver output records assumptions and equation versions.
6. Imported data is validated before persistence.
7. Rendering uses textContent or equivalent safe DOM APIs for user content.
