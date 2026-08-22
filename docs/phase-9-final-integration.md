# Phase 9 — Final Website Integration

Phase 9 connects the previously separate PhysicsSolver engines into a static browser application.

## Main sections

- **Solve**: problem text, known values, target selection, parser interpretation, solver modes, dependency/direct results, and local practice recording.
- **Explore**: searchable equation explorer and variable encyclopedia sourced directly from the registries.
- **Study**: weak-area and recommendation data from the Phase 7 study engine.
- **Tools**: a capability map for vector, coordinate, sign-convention, and visual-plugin systems.

## Modes exposed

`solve`, `explain`, `principle`, `study`, `practice`, `check`, `reverse`, and `alternative` are selectable from the solver interface. Study/practice presentation hides final numeric answers while retaining the solution structure.

## Persistence

Study state is stored under `physicsolver-study` in browser localStorage. The solver itself remains offline/static and does not require an account or backend.

## Architecture

`index.html` contains semantic page structure, `src/app/styles.css` contains responsive styling, and `src/app/ui-controller.js` is the integration boundary between the DOM and solver engines.

## Validation boundary

The page validates registries at startup and displays the result. Problem parsing remains heuristic; extracted quantities, assumptions, units, and sign conventions should be reviewed by the user.

## Release checks

- static relative module paths
- responsive layout breakpoints
- no framework/runtime dependency
- localStorage failure fallback
- escaped registry/problem-derived output
- hidden-tab navigation without page reloads
