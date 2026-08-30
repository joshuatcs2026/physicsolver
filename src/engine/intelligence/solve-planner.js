/** Phase 6.1 — solver intelligence/orchestration.
 * Pure planning utilities: no DOM, no eval, and no mutation of the equation catalog.
 * Equation shape supported: {id, expression, variables:[...], domain?, priority?}.
 */

const unique = a => [...new Set(a)];

export function normalizeEquation(eq, index=0) {
  const variables = unique(Array.isArray(eq.variables) ? eq.variables : []);
  return {
    ...eq,
    id: eq.id ?? `equation-${index}`,
    variables,
    priority: Number.isFinite(eq.priority) ? eq.priority : 0,
  };
}

export function buildDependencyGraph(equations=[]) {
  const graph = new Map();
  for (const raw of equations) {
    const eq = normalizeEquation(raw);
    for (const target of eq.variables) {
      if (!graph.has(target)) graph.set(target, new Set());
      for (const dependency of eq.variables) if (dependency !== target) graph.get(target).add(dependency);
    }
  }
  return graph;
}

export function countUnknowns(equation, knowns={}) {
  const known = new Set(Object.keys(knowns));
  return unique((equation.variables ?? []).filter(v => !known.has(v))).length;
}

export function rankEquations(equations=[], {knowns={}, target=null, domain=null}={}) {
  return equations.map((raw, index) => {
    const eq = normalizeEquation(raw, index);
    const unknownCount = countUnknowns(eq, knowns);
    let score = eq.priority;
    if (target && eq.variables.includes(target)) score += 100;
    if (unknownCount === 1) score += 60;
    else if (unknownCount === 2) score += 20;
    else if (unknownCount > 2) score -= unknownCount * 10;
    if (domain && eq.domain === domain) score += 25;
    if (domain && Array.isArray(eq.domains) && eq.domains.includes(domain)) score += 20;
    score -= Math.max(0, eq.variables.length - 2) * 2;
    return { equation: eq, score, unknownCount };
  }).sort((a,b) => b.score-a.score);
}

export function detectCircularDependencies(equations=[]) {
  const graph = buildDependencyGraph(equations);
  const state = new Map(), cycles=[];
  const walk = (node, stack=[]) => {
    state.set(node,'active');
    const next = graph.get(node) ?? [];
    for (const child of next) {
      if (state.get(child)==='active') {
        const start=stack.indexOf(child);
        cycles.push([...stack.slice(start), child]);
      } else if (state.get(child)!=='done') walk(child,[...stack,node]);
    }
    state.set(node,'done');
  };
  for (const node of graph.keys()) if (!state.has(node)) walk(node,[]);
  return {hasCycle:cycles.length>0, cycles};
}

export function findShortestSolvePaths(equations=[], knowns={}, target, {maxDepth=12,maxPaths=8}={}) {
  const known = new Set(Object.keys(knowns));
  const normalized = equations.map(normalizeEquation);
  const queue=[{value:target, steps:[], seen:new Set([target])}], results=[];
  while(queue.length && results.length<maxPaths){
    const current=queue.shift();
    if (known.has(current.value)) { results.push(current); continue; }
    if (current.steps.length>=maxDepth) continue;
    const candidates=normalized.filter(eq=>eq.variables.includes(current.value));
    for(const eq of candidates){
      const deps=eq.variables.filter(v=>v!==current.value && !known.has(v));
      if(deps.some(v=>current.seen.has(v))) continue;
      const seen=new Set(current.seen); deps.forEach(v=>seen.add(v));
      queue.push({value:deps[0] ?? current.value, pending:deps.slice(1), steps:[...current.steps,eq],seen});
    }
  }
  return results.sort((a,b)=>a.steps.length-b.steps.length).slice(0,maxPaths);
}

export function makeSolvePlan({equations=[],knowns={},target,domain=null,maxDepth=12}={}) {
  if (!target) return {status:'invalid', reason:'Target is required'};
  const normalized=equations.map(normalizeEquation);
  const cycleInfo=detectCircularDependencies(normalized);
  const ranked=rankEquations(normalized,{knowns,target,domain});
  const direct=ranked.filter(x=>x.equation.variables.includes(target)&&x.unknownCount===1);
  const paths=findShortestSolvePaths(normalized,knowns,target,{maxDepth});
  return {
    status:'ready', target,
    unknownCount: normalized.filter(eq=>eq.variables.includes(target)).length ? countUnknowns({variables:[target]},knowns) : 1,
    directCandidates:direct,
    shortestPath:paths[0] ?? null,
    alternativePaths:paths.slice(1),
    equationRanking:ranked,
    dependencyCycles:cycleInfo.cycles,
    warnings: cycleInfo.hasCycle ? ['The equation graph contains circular dependencies; path search will avoid revisiting variables.'] : [],
  };
}
