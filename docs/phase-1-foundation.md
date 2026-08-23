# PhysicsSolver 1.2 — Phase 1 Foundation

## Purpose
Phase 1 builds a broad, structured physics knowledge base without replacing the existing production solver. The current solver remains authoritative for equations it already solves; this catalog is the expandable source for later equation ranking, pathfinding, rearrangement, explanations, parsing, and UI features.

## Added modules
- `src/data/equations/phase1-catalog.js`: structured equation catalog.
- `src/data/variables/library.js`: canonical variable descriptions and default units.
- `src/data/constants/library.js`: named physical constants.
- `src/data/schemas/phase1-validation.js`: catalog integrity checks.
- `tests/unit/phase1-catalog.test.js`: minimum breadth and integrity regression tests.

## Catalog domains
Mechanics, kinematics, vectors, projectiles, dynamics, energy, momentum, gravitation, rotation, fluids, thermodynamics, waves, sound, electricity, circuits, magnetism, optics, modern physics, relativity, and nuclear physics.

## Equation model
Every catalog record has an immutable ID, domain, readable name, expression, variable list, keywords, and assumptions. Assumptions are intentionally preserved because an equation can be algebraically correct but physically inappropriate for a problem.

## Safety and correctness rules
1. The catalog is not automatically executed as arbitrary JavaScript.
2. Later symbolic/evaluation stages must use whitelisted operations.
3. Context-dependent symbols such as `I`, `V`, `T`, `L`, and `A` must be disambiguated by domain and equation metadata.
4. Approximate formulas must retain their assumptions.
5. Sign-convention-sensitive formulas must request or infer a convention before solving.
6. A catalog hit is a candidate, not proof that the equation applies.

## Integration gate
Before wiring Phase 1 directly into the live solver:
- import and syntax checks pass;
- all catalog IDs are unique;
- existing direct-solver regression tests remain unchanged;
- equation metadata is validated;
- new solver adapters are tested separately before replacing legacy paths.

## Next steps
Phase 1.1 integrates catalog search into Explore/Study. Phase 1.2 adds normalized symbols and aliases. Later stages attach solve maps, safe rearrangements, unit dimensions, dependency graphs, and explanation templates.
