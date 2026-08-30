/** Phase 6.2 — consistent solver modes. */
export const SOLVER_MODES = Object.freeze({TARGET:'target', SOLVE_ALL:'solve-all', PRINCIPLE:'principle', PATH:'path', ALTERNATIVE:'alternative'});

export function prepareMode(mode, context={}) {
  if (!Object.values(SOLVER_MODES).includes(mode)) return {mode:SOLVER_MODES.TARGET, warning:`Unknown mode '${mode}', using target mode.`};
  if (mode===SOLVER_MODES.TARGET && !context.target) return {mode, warning:'Target mode requires a target variable.'};
  return {mode, warning:null};
}

export function summarizePlan(plan) {
  return {
    direct:plan.directCandidates?.length ?? 0,
    alternatives:plan.alternativePaths?.length ?? 0,
    shortestSteps:plan.shortestPath?.steps?.length ?? null,
    cycles:plan.dependencyCycles?.length ?? 0,
    warnings:plan.warnings ?? []
  };
}
