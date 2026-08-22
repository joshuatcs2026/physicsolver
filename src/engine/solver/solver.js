// Solver backbone.
// Future responsibilities:
// 1. Find equations with one unresolved variable.
// 2. Build dependency transitions.
// 3. Search bounded solution paths.
// 4. Preserve alternatives and diagnostics.
// 5. Never mutate the input problem.

export function analyzeSolveRequest(problem, equationIndex) {
  return {
    status: 'not-implemented',
    problem,
    equationIndexSize: equationIndex?.size ?? 0,
    candidates: [],
    diagnostics: []
  };
}
