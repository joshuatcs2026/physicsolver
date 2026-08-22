import { unresolvedVariables } from './direct-solver.js';

export function countUnknowns(equation, knowns, constants = new Map()) {
  return unresolvedVariables(equation, knowns, constants).length;
}

export function detectOneUnknownEquations(equations, knowns, constants = new Map()) {
  return equations
    .map(equation => ({equation, unknowns:unresolvedVariables(equation, knowns, constants)}))
    .filter(item => item.unknowns.length === 1)
    .sort((a,b) => (a.equation.complexity || 1) - (b.equation.complexity || 1) || a.equation.id.localeCompare(b.equation.id));
}

export function summarizeEquationAvailability(equations, knowns, constants = new Map()) {
  return equations.map(equation => ({
    equationId:equation.id,
    unknownCount:countUnknowns(equation,knowns,constants),
    solvableNow:countUnknowns(equation,knowns,constants)===1
  }));
}
