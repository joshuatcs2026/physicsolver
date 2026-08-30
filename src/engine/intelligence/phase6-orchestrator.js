/** Phase 6.2 — unified orchestration layer.
 * Keeps planning separate from execution so future solver modes can plug in without rewriting the planner.
 */
import { makeSolvePlan } from './solve-planner.js';

export const SOLVER_MODES = Object.freeze({TARGET:'target',SOLVE_ALL:'solve-all',PRINCIPLE:'principle',PATH:'path',ALTERNATIVE:'alternative'});

export function createSolverContext({equations=[],knowns={},target=null,domain=null,mode=SOLVER_MODES.TARGET,limits={}}={}){
  const plan=target?makeSolvePlan({equations,knowns,target,domain,maxDepth:limits.maxDepth??12}):null;
  return Object.freeze({equations,knowns,target,domain,mode,limits:{maxDepth:limits.maxDepth??12,maxPaths:limits.maxPaths??8,maxResults:limits.maxResults??100},plan});
}

export function selectPlan(context,{alternativeIndex=0}={}){
  if(!context?.plan)return null;
  if(context.mode===SOLVER_MODES.ALTERNATIVE)return context.plan.alternativePaths[alternativeIndex]??null;
  return context.plan.shortestPath;
}

export function summarizePlan(context){
  const p=context?.plan;if(!p)return{status:'no-target'};
  return {status:p.status,target:p.target,directCandidateCount:p.directCandidates.length,shortestPathLength:p.shortestPath?.steps.length??null,alternativeCount:p.alternativePaths.length,cycleCount:p.dependencyCycles.length,warnings:p.warnings};
}
