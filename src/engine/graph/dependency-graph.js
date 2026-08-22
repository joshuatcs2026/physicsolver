export function buildDependencyGraph(equations) {
  const producers = new Map();
  for (const equation of equations) for (const [target, dependencies] of Object.entries(equation.targetMap || {})) {
    if (!producers.has(target)) producers.set(target, []);
    producers.get(target).push({ equationId: equation.id, target, dependencies: [...dependencies] });
  }
  for (const options of producers.values()) options.sort((a,b)=>a.equationId.localeCompare(b.equationId));
  return { producers };
}
export const detectPathCycle = (pathVariables, nextVariable) => pathVariables.includes(nextVariable);
export const pathKey = (knownSet, target) => `${target}|${[...knownSet].sort().join(',')}`;
