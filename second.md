# PhysicsSolver 2.0 — Post-Debug Upgrade Plan

## Status gate

PhysicsSolver 2.0 does **not** start until the current release passes this gate:

1. `npm test` passes locally and in both GitHub Actions workflows.
2. The Pages workflow reaches `deploy` instead of being skipped.
3. The deployed site returns the application, not GitHub's 404 page.
4. A browser smoke test verifies page load, Analyze, Solve, mode switching, explorer filtering, and local study storage.
5. The release has a reproducible failure report if any gate fails.

No 2.0 feature work should weaken, delete, or bypass these checks.

---

# 1. Goals

PhysicsSolver 2.0 turns the existing static solver into a more systematic physics problem-solving platform while preserving:

- static GitHub Pages deployment;
- offline-first core behavior;
- no required account;
- no backend dependency;
- centralized equation/variable/unit metadata;
- deterministic solver paths;
- explainable reasoning;
- progressive enhancement for advanced tools.

The main change is architectural: equations should no longer require a growing hand-written switch statement as the only route to solving them.

---

# 2. Proposed 2.0 architecture

```text
src/
  app/
    bootstrap.js
    state/
      store.js
      problem-session.js
    controllers/
      problem-controller.js
      solver-controller.js
      study-controller.js
      visual-controller.js
    render/
      result-renderer.js
      explanation-renderer.js
      explorer-renderer.js
      diagnostics-renderer.js
    components/
      equation-card.js
      variable-row.js
      diagram-host.js
  data/
    equations/
      mechanics.js
      energy.js
      momentum.js
      rotation.js
      fluids.js
      thermal.js
      electricity.js
      waves.js
      registry.js
    variables/
      mechanics.js
      electricity.js
      thermal.js
      waves.js
      registry.js
    units/
      registry.js
      parser.js
    constants/
      registry.js
  engine/
    parser/
      tokenize.js
      quantities.js
      entities.js
      context.js
      target-detector.js
      model-detector.js
    equations/
      dependency-graph.js
      equation-ranker.js
      pathfinder.js
      cycle-detector.js
      rearranger.js
      evaluator.js
    solver/
      direct-solver.js
      symbolic-solver.js
      multi-step-solver.js
      alternative-solver.js
      reverse-solver.js
    validation/
      dimensions.js
      units.js
      numeric.js
      sanity.js
      significant-figures.js
    explanation/
      planner.js
      steps.js
      hints.js
      mistake-warnings.js
    study/
      mastery.js
      scheduler.js
      practice-generator.js
    visuals/
      vectors.js
      projectile.js
      free-body.js
      coordinate.js
      plugin-registry.js
  tests/
    unit/
    integration/
    e2e/
    fixtures/
```

Existing modules should be migrated incrementally behind stable public APIs rather than rewritten all at once.

---

# 3. Phase A — Debug and release hardening

## A1. Reproduce failures

- Capture the exact GitHub Actions job log for the failing `npm test` step.
- Add a test command that prints the name of each test before execution.
- Avoid one long shell chain that hides which test failed.
- Record the Node version and commit SHA in CI output.

## A2. Test runner improvement

Replace the opaque chained script with a small Node test runner that:

- executes each test file independently;
- prints PASS/FAIL with timing;
- exits nonzero on failure;
- preserves the first failure stack;
- optionally supports a single-test filter.

## A3. Pages reliability

Add a deployment preflight that verifies:

- root `index.html` exists;
- all local module paths referenced by `index.html` exist;
- no root-relative paths break project-site deployment;
- no generated development-only files are required.

After deployment, add a separate smoke-check workflow/job if supported by the static deployment environment. It should verify that the deployed URL responds and contains a known application marker.

## Acceptance criteria

- CI green on a clean commit.
- Pages deployment green.
- Live site loads.
- A failed test identifies itself directly in logs.

---

# 4. Phase B — Equation library 2.0

Expand by domain, but every equation must have all of the following:

```text
id
name
domain
expression
variables
target map
keywords
assumptions
complexity
unit/dimension expectations
solver strategy or evaluator metadata
tests
```

## B1. Kinematics and projectiles

Add and support:

- `d = vt`
- full constant-acceleration forms;
- horizontal/vertical projectile components;
- component recombination;
- range, maximum-height, and flight-time cases when assumptions are explicit.

## B2. Forces

Add:

- weight `Fg = mg`;
- static/kinetic friction distinctions;
- force components on inclines;
- centripetal force;
- explicit net-force composition support.

## B3. Energy and momentum

Add:

- conservation templates;
- mechanical-energy accounting;
- impulse/change-in-momentum;
- one-dimensional collision families.

## B4. Rotation and circular motion

Add:

- `v = rω`;
- angular kinematics;
- centripetal acceleration;
- torque;
- angular momentum;
- rotational kinetic energy.

## B5. Fluids, thermal, electricity, and waves

Add:

- density;
- pressure;
- hydrostatic pressure;
- buoyancy;
- continuity;
- specific heat;
- phase-change heat;
- first-law bookkeeping;
- Ohm's law;
- electrical power forms;
- charge/current/time;
- Coulomb force;
- wave speed, period/frequency, angular frequency.

## Rule

An equation is not considered implemented until it can be discovered, selected, solved or explicitly marked unsupported, explained, dimension-checked, and tested.

---

# 5. Phase C — Data-driven solving

The current explicit equation switch remains as a compatibility layer during migration.

Introduce equation evaluator metadata so common operations can be represented structurally:

```text
operation tree
  add
  subtract
  multiply
  divide
  power
  root
  trig
```

The evaluator should operate on expression trees, not raw string replacement.

Benefits:

- fewer hand-written cases;
- consistent rearrangement;
- easier equation expansion;
- safer algebra;
- better substitution explanations.

## Safety boundary

Do not use `eval`, `Function`, or arbitrary executable equation strings.

---

# 6. Phase D — Dependency graph intelligence

Upgrade the current pathfinder into a directed hypergraph-like equation dependency system.

Features:

- unknown counter;
- direct/one-step classification;
- shortest dependency path;
- alternative paths;
- cycle detection;
- recursion depth limits;
- duplicate-state prevention;
- equation ranking;
- domain/context scoring.

Difficulty labels:

```text
1 equation       green
2 equations      yellow
3–4 equations    orange
5+ equations     red
```

Ranking should be deterministic and explain why one path won.

---

# 7. Phase E — Symbolic rearrangement and algebra checking

Create a restricted symbolic layer.

Supported operations initially:

- addition/subtraction;
- multiplication/division;
- integer powers;
- square roots;
- selected trig inverses.

For each rearrangement:

1. verify target uniqueness;
2. record transformation steps;
3. reject division by expressions known to be zero;
4. detect multiple mathematical branches where relevant;
5. keep physically valid branches only when assumptions justify doing so.

Every rearrangement needs round-trip tests where practical.

---

# 8. Phase F — Problem understanding 2.0

Replace primarily keyword-based interpretation with staged parsing:

```text
text
  ↓
tokens and quantities
  ↓
unit detection
  ↓
entity/quantity binding
  ↓
constraints and qualifiers
  ↓
target candidates
  ↓
physics-model candidates
  ↓
ambiguity report
```

Detect context such as:

- starts from rest;
- constant acceleration;
- frictionless;
- horizontal;
- vertical;
- collision;
- conserved;
- equilibrium;
- circular motion.

The parser must expose confidence and ambiguity instead of silently inventing assumptions.

---

# 9. Phase G — Explanation engine

Produce structured solution plans:

1. identify target;
2. list knowns and converted units;
3. state assumptions;
4. explain equation selection;
5. show dependency path;
6. substitute;
7. solve;
8. check dimensions;
9. check significant figures;
10. perform a sanity check.

Modes remain distinct:

- Solve: concise final solution;
- Explain: full reasoning;
- Principle: concepts before calculation;
- Study: hide final answer;
- Practice: guided attempt;
- Check: validate user work;
- Reverse: identify required inputs;
- Alternative: compare valid paths.

---

# 10. Phase H — Interactive visual tools

Build visuals as isolated plugins with a common contract:

```text
id
name
canHandle(problem)
mount(container, state)
update(state)
destroy()
```

Initial tools:

- vector component workspace;
- projectile visualizer;
- free-body diagram builder;
- coordinate/vector helper.

Plugins must not be required for core solving and must clean up listeners on destruction.

---

# 11. Phase I — Study intelligence 2.0

Keep data local by default.

Track:

- equation mastery;
- topic mastery;
- attempt count;
- correctness;
- hints used;
- common mistake tags;
- time when voluntarily recorded.

Add:

- spaced review;
- weak-area queue;
- mixed-topic practice;
- prerequisite recommendations;
- progress export/import as JSON.

Do not collect or transmit study data without an explicit future feature that requires it.

---

# 12. Phase J — Reliability, accessibility, and performance

## Reliability

Add:

- integration tests for parser → pathfinder → solver;
- end-to-end fixtures for representative problems;
- import/module smoke tests;
- registry coverage tests;
- deployment preflight;
- live-site smoke check.

## Accessibility

- keyboard navigation;
- visible focus states;
- semantic labels;
- live regions for solver status;
- diagrams with text alternatives;
- color is never the only difficulty indicator.

## Performance

- build indexes once;
- avoid repeated full-registry scans during typing;
- debounce expensive parsing;
- cache immutable lookup structures;
- lazy-load visual tools;
- bound recursive search;
- avoid storing large transient analysis objects in localStorage.

---

# 13. Migration strategy

1. Freeze and test the current public module contracts.
2. Add new modules beside existing modules.
3. Route one domain at a time through the new engine.
4. Keep compatibility adapters while old and new paths coexist.
5. Remove an adapter only after regression and integration coverage exists.

No full rewrite branch should replace the working main branch in one change.

---

# 14. Release sequence

```text
0. Debug current CI + deploy
1. Release stable 1.x hotfix
2. Data/equation architecture
3. Dependency graph
4. Symbolic algebra
5. Problem understanding
6. Explanation engine
7. Visual plugins
8. Study intelligence
9. Reliability dashboard + release candidate
10. PhysicsSolver 2.0
```

Each phase must satisfy:

- unit tests;
- integration tests where applicable;
- no regression in existing modes;
- static-site compatibility;
- performance review;
- documented acceptance criteria.

---

# 15. Final 2.0 acceptance checklist

- [ ] Current GitHub Actions failure root cause documented and fixed.
- [ ] `npm test` reports individual failures clearly.
- [ ] GitHub Pages deploy succeeds.
- [ ] Live-site smoke check passes.
- [ ] Expanded equation library has solver and test coverage.
- [ ] Dependency cycles cannot hang the solver.
- [ ] Rearrangement does not use arbitrary code execution.
- [ ] Parser reports ambiguity and assumptions.
- [ ] All eight modes still work.
- [ ] Visual plugins are optional and isolated.
- [ ] Study data remains local by default.
- [ ] Accessibility checks pass.
- [ ] Performance remains suitable for a static GitHub Pages site.
- [ ] Release notes and migration notes are complete.

## Definition of done

PhysicsSolver 2.0 is complete only when the new capabilities are integrated, tested, explainable, deployable on GitHub Pages, and usable without requiring a server or external account.
