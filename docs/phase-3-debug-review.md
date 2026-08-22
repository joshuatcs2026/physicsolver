# Phase 3 Debug Review

## Scope

The review covered data integrity, ESM loading, direct solving, dependency search, cycle handling, path execution, UI integration, static hosting, and automated regression coverage.

## Fixes applied

### 1. ESM test execution

The source uses `import` syntax. A plain Node test run would fail unless Node treats `.js` files as ES modules. `package.json` now sets `"type": "module"` and provides one `npm test` command.

### 2. Dependency ordering

The pathfinder expands dependencies before adding the equation that consumes them. The executor can therefore calculate intermediate values before the final target.

Example:

`vi, a, t -> vf -> Δx`

The generated path calculates `vf` first and then displacement.

### 3. Cycle detection

A variable already present in the current dependency trail is treated as a cycle. Cycles are reported as blocked diagnostics instead of causing infinite expansion.

### 4. Search bounds

Dependency search has both `maxDepth` and `maxPaths` limits. This prevents an expanding equation library from freezing the browser because of combinatorial path growth.

### 5. Path deduplication

Equivalent equation/target sequences are deduplicated with a stable signature before ranking.

### 6. Deterministic ranking

Paths are ranked by equation count and then deterministic equation IDs. Results therefore do not depend on accidental object iteration order.

### 7. Missing producer handling

A dependency with no equation capable of producing it is recorded as `no-producer`; it does not produce a fake solution.

### 8. Invalid arithmetic handling

Direct solve checks flag non-finite and NaN results. This catches common division-by-zero and invalid-square-root failures after calculation. Future diagnostics should add pre-operation domain guards.

### 9. Static path compatibility

Browser imports use relative paths such as `./src/...`, so the app is compatible with the repository subpath used by GitHub Pages.

### 10. GitHub Pages automation

A Pages workflow and a separate CI workflow were added. The repository still requires GitHub Pages to use the **GitHub Actions** source in repository settings if it is not automatically configured by the first deployment.

## Regression scenarios

Current tests cover:

1. Registry uniqueness and validation.
2. Alias lookup.
3. Length, time, and angle conversion.
4. Rejection of incompatible dimensions.
5. Direct kinematics solving.
6. Newton's second law.
7. Kinetic energy inversion.
8. Gravitational energy with a constant.
9. Substitution record creation.
10. One-unknown detection.
11. Two-equation dependency solving: `vi,a,t -> vf -> displacement`.
12. Shortest-path selection.
13. Cycle detection with `x -> y -> x`.

## Remaining known limitations

These are intentionally deferred rather than hidden:

- The calculation engine currently uses controlled handlers for registered equations, not a general symbolic algebra parser.
- Units entered in the UI are stored but are not yet normalized automatically before solving.
- Derived result units are not yet generated.
- Some symbols share context-dependent meanings across physics domains; the current variable registry will need domain-aware disambiguation as the equation library grows.
- Alternative paths are returned, but the UI currently displays raw structured output rather than a dedicated path visualizer.
- Browser-level smoke tests and accessibility automation should be added in a later hardening phase.

## Deployment checklist

1. Open repository Settings -> Pages.
2. Set Build and deployment source to **GitHub Actions**.
3. Wait for the `Deploy GitHub Pages` workflow to finish.
4. Open `https://joshuatcs2026.github.io/physicsolver/`.
5. If the site still shows 404, inspect the Pages workflow run and confirm the repository is public and the workflow has permission to deploy.
