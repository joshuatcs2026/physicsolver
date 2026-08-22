# PhysicsSolver

An offline-first physics problem-solving and study system designed to run as a static website, including GitHub Pages.

## Current stage

This repository is intentionally starting with the **backbone**, not the full solver. The goal is to establish stable architecture, data contracts, UI boundaries, and testing structure before adding the large equation database and advanced solving features.

## Planned capabilities

- Physics equation library with variables, meanings, purposes, units, and explanations
- Problem input and known/unknown detection
- Equation ranking and one-unknown detection
- Recursive dependency solving
- Shortest and alternative solution paths
- Circular dependency detection
- Unit conversion and dimensional analysis
- Formula rearrangement and algebra checking
- Significant-figure and scientific-notation helpers
- Problem-type, keyword, context, and unit-variable detection
- Sign-convention and coordinate helpers
- Dependency maps and solve-complexity indicators
- Answer sanity checks and reverse solving
- Interactive diagrams, graphs, and pluggable visual tools
- Constants and solution libraries
- Study modes, mastery tracking, and review queues
- Local persistence plus import/export backups

## Architecture principle

The app is split conceptually into layers:

```text
UI
 ↓
Application / orchestration
 ↓
Parser ─ Problem model ─ Diagnostics
 ↓
Solver graph ─ Equation library ─ Unit system
 ↓
Storage / import-export
```

No UI module should directly contain physics-solving logic. Physics data should be declarative where possible, and solver algorithms should operate on normalized equation metadata.

## Planned directory structure

```text
physicsolver/
├── index.html                    # Static entry point and initial shell
├── README.md                     # Project overview and roadmap
├── LICENSE                       # License placeholder
├── .gitignore
├── src/
│   ├── app/
│   │   ├── bootstrap.js          # Planned startup/orchestration
│   │   ├── state.js              # Central application state contract
│   │   └── events.js             # Event/message boundaries
│   ├── data/
│   │   ├── equations/            # Physics equation datasets
│   │   ├── variables/            # Variable definitions
│   │   ├── constants/            # Physical constants
│   │   ├── units/                # Unit definitions/conversions
│   │   └── schemas/              # JSON/data contracts
│   ├── engine/
│   │   ├── parser/               # Problem/language parsing
│   │   ├── solver/               # Dependency/path solving
│   │   ├── algebra/               # Rearrangement/substitution checks
│   │   ├── units/                # Conversion/dimensional analysis
│   │   ├── diagnostics/          # Mistake/sanity/significant-figure checks
│   │   └── graph/                # Dependency and cycle algorithms
│   ├── features/
│   │   ├── problem-input/
│   │   ├── equation-library/
│   │   ├── solution-workspace/
│   │   ├── diagrams/
│   │   ├── graphing/
│   │   ├── study/
│   │   └── storage/
│   ├── ui/
│   │   ├── components/
│   │   ├── views/
│   │   └── styles/
│   └── utils/
│       ├── math.js
│       ├── validation.js
│       └── ids.js
├── docs/
│   ├── architecture.md
│   ├── data-model.md
│   ├── solver-design.md
│   ├── roadmap.md
│   └── bug-risk-review.md
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── fixtures/
│   └── manual/
├── examples/
│   └── sample-problem.json
└── .github/
    └── workflows/
        └── ci.yml
```

## Core data contracts

### Equation

```js
{
  id: 'kinematics.vf',
  name: 'Final velocity',
  domain: 'mechanics.kinematics',
  expression: 'v_f = v_i + a*t',
  variables: ['v_f', 'v_i', 'a', 't'],
  solveFor: ['v_f', 'v_i', 'a', 't'],
  assumptions: [],
  dimensions: {},
  keywords: [],
  prerequisites: [],
  explanations: {},
  enabled: true
}
```

### Variable

```js
{
  id: 'v_f',
  symbol: 'v_f',
  name: 'final velocity',
  meaning: 'Velocity at the end of the selected interval.',
  purpose: 'Represents the target or intermediate motion state.',
  dimensions: { L: 1, T: -1 },
  commonUnits: ['m/s', 'km/h'],
  aliases: ['final speed']
}
```

### Problem

```js
{
  id: 'problem-id',
  rawText: '',
  knowns: {},
  targets: [],
  assumptions: [],
  coordinateSystem: null,
  signConvention: null,
  detectedDomains: [],
  diagnostics: []
}
```

### Solve graph

Nodes represent variables or intermediate values. Directed edges represent equation applications. Each candidate path records dependency depth, equation count, unresolved variables, confidence, warnings, and numerical validity.

## Solver strategy

1. Normalize symbols, units, and aliases.
2. Detect known quantities and requested targets.
3. Filter equations by domain, keywords, dimensions, and available variables.
4. Immediately identify equations with exactly one unresolved variable.
5. Build a dependency graph for remaining candidates.
6. Detect cycles before recursive expansion.
7. Use a bounded graph search to rank shortest valid paths.
8. Keep alternative paths instead of discarding them.
9. Validate each computed result numerically and dimensionally.
10. Generate a human-readable substitution path separately from the numerical engine.

The initial implementation should prefer iterative graph traversal over deep JavaScript recursion.

## Dependency complexity

Initial UI categories:

- Direct: 1 equation
- Short chain: 2 equations
- Multi-step: 3 equations
- Deep chain: 4+ equations
- Blocked: insufficient information
- Cyclic: dependency loop

Colors are a UI layer only; solver ranking must use numeric metadata rather than color values.

## Storage

The initial frame uses no remote database. Planned persistence order:

1. Memory state
2. Browser localStorage for small settings and lightweight state
3. IndexedDB when larger solution/study collections are implemented
4. JSON export/import for user-controlled backups

No problem text needs to leave the browser for the core offline version.

## Development phases

### Phase 0 — Backbone
Current stage: folder structure, shell, contracts, docs, sample fixture, and CI placeholder.

### Phase 1 — Reliable foundations
Variables, units, constants, equation schema, validation, basic UI state.

### Phase 2 — Direct solving
One-unknown detector, substitution builder, formula rearrangement, unit conversion, dimensional checks.

### Phase 3 — Dependency engine
Graph construction, iterative dependency solving, shortest path, alternatives, cycle detection, ranking.

### Phase 4 — Problem understanding
Keyword/context detection, unit-variable extraction, problem classification, ambiguity warnings.

### Phase 5 — Diagnostics
Sign conventions, significant figures, scientific notation, algebra checks, common mistakes, answer sanity checks.

### Phase 6 — Visual workspace
Coordinate helper, graphs, diagrams, vector tools, pluggable visual components.

### Phase 7 — Study system
Mastery tracking, equation checklists, flashcards, review queues, solution library.

### Phase 8 — Hardening
Comprehensive fixtures, regression tests, accessibility review, storage migration testing, performance profiling.

## Planned efficiency protections

- Index equations by variable and domain instead of repeatedly scanning the entire library.
- Cache normalized units and parsed expressions.
- Use immutable IDs rather than array positions as references.
- Cap graph search depth and visited states.
- Deduplicate equivalent solve states.
- Separate pure solver functions from DOM code for cheap testing.
- Lazily initialize heavy visual tools.
- Debounce text parsing instead of parsing every keystroke.
- Use event delegation where repeated UI elements are expected.
- Store compact normalized records rather than rendered HTML.

## Bug/risk review checkpoints

Every feature should be checked against:

1. Missing or ambiguous variables
2. Duplicate symbols with different meanings
3. Division by zero and invalid roots
4. Unit incompatibility
5. Cyclic dependencies
6. Multiple mathematically valid roots
7. Sign-convention ambiguity
8. Rounding and significant-figure errors
9. Storage quota and corrupted imports
10. DOM injection through imported/user text
11. Broken relative paths on GitHub Pages
12. Keyboard-only accessibility
13. Small-screen layout
14. Browser API fallback behavior
15. Regression tests for previously solved fixtures

## Running locally

Because the first frame is static, open `index.html` directly for the initial shell. Once ES modules or fetch-based datasets are introduced, use a local static server for development.

## GitHub Pages

This repository is designed to remain compatible with GitHub Pages. Keep deployable paths relative, avoid server-only APIs, and ensure `index.html` remains the site entry point.

## Status

**Framework created. Advanced solver features are intentionally planned, not yet implemented.**
