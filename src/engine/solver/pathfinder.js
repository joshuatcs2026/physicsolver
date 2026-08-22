import { buildDependencyGraph, detectPathCycle } from '../graph/dependency-graph.js';

export function findSolvePaths({target, equations, knownIds, maxDepth=8, maxPaths=20}) {
  const byId = new Map(equations.map(eq=>[eq.id,eq]));
  const graph = buildDependencyGraph(equations);
  const results=[]; const seen=new Set(); const blocked=[];
  function expand(variable, trail, depth) {
    if (knownIds.has(variable)) return [{steps:[], required:new Set()}];
    if (depth>maxDepth) { blocked.push({variable,reason:'depth-limit'}); return []; }
    if (detectPathCycle(trail,variable)) { blocked.push({variable,reason:'cycle',trail:[...trail,variable]}); return []; }
    const options=graph.producers.get(variable)||[];
    if (!options.length) { blocked.push({variable,reason:'no-producer'}); return []; }
    const branches=[];
    for (const option of options) {
      const nextTrail=[...trail,variable];
      let combinations=[{steps:[],required:new Set()}];
      for (const dependency of option.dependencies) {
        const dependencyPaths=expand(dependency,nextTrail,depth+1);
        if (!dependencyPaths.length) { combinations=[]; break; }
        const merged=[];
        for (const base of combinations) for (const child of dependencyPaths) {
          const required=new Set([...base.required,...child.required]);
          merged.push({steps:[...base.steps,...child.steps],required});
          if (merged.length>=maxPaths) break;
        }
        combinations=merged.slice(0,maxPaths);
      }
      for (const combination of combinations) {
        const equation=byId.get(option.equationId);
        branches.push({steps:[...combination.steps,{equationId:equation.id,target:variable,dependencies:[...option.dependencies]}],required:combination.required});
        if (branches.length>=maxPaths) break;
      }
      if (branches.length>=maxPaths) break;
    }
    return branches;
  }
  for (const path of expand(target,[],0)) {
    const signature=path.steps.map(s=>`${s.equationId}:${s.target}`).join('>');
    if (!seen.has(signature)) { seen.add(signature); results.push({...path,equationCount:path.steps.length,dependencyDepth:path.steps.length}); }
    if (results.length>=maxPaths) break;
  }
  results.sort((a,b)=>a.equationCount-b.equationCount || a.dependencyDepth-b.dependencyDepth || a.steps.map(x=>x.equationId).join().localeCompare(b.steps.map(x=>x.equationId).join()));
  return {paths:results.slice(0,maxPaths), blocked, graph};
}

export function selectShortestPath(result) { return result.paths[0] || null; }
export function alternativePaths(result) { return result.paths.slice(1); }
