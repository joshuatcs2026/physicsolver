import { EQUATIONS } from '../data/equations/registry.js';
import { VARIABLES, createVariableIndex } from '../data/variables/registry.js';
import { CONSTANTS, createConstantIndex } from '../data/constants/registry.js';
import { normalizeKnowns, findDirectCandidates, rankCandidates, solveDirect, buildSubstitution, checkDirectSolve } from '../engine/solver/direct-solver.js';
import { detectOneUnknownEquations } from '../engine/solver/one-unknown.js';
import { getRearrangement } from '../engine/solver/formula-catalog.js';
import { solveReachable, findReachableTargets } from '../engine/solver/reachable-solver.js';
import { runPhysicsTool, physicsTools } from '../engine/tools/physics-tools.js';

const variableIndex=createVariableIndex(VARIABLES);const constants=createConstantIndex(CONSTANTS);
export function analyzeDirectProblem({knowns:rawKnowns,target,text=''}){const knowns=normalizeKnowns(rawKnowns);const direct=rankCandidates(findDirectCandidates(target,EQUATIONS,knowns,constants),target,{text});const allOneUnknown=detectOneUnknownEquations(EQUATIONS,knowns,constants);if(!direct.length)return{status:'blocked',message:'No direct one-unknown equation currently solves the requested target.',knownCount:knowns.size,oneUnknown:allOneUnknown.map(x=>({equationId:x.equation.id,target:x.unknowns[0]}))};const candidate=direct[0];try{const result=solveDirect(candidate.equation,target,knowns,constants);const check=checkDirectSolve({equation:candidate.equation,target,knowns,result,variableIndex});return{status:check.ok?'solved':'warning',equationId:candidate.equation.id,equation:candidate.equation.expression,rearranged:getRearrangement(candidate.equation.id,target),substitution:buildSubstitution(candidate.equation,target,knowns,constants),result,check,alternatives:direct.slice(1).map(x=>x.equation.id),knownCount:knowns.size,oneUnknown:allOneUnknown.map(x=>({equationId:x.equation.id,target:x.unknowns[0]}))};}catch(error){return{status:'error',message:error.message,equationId:candidate.equation.id};}}

export function analyzeEquationSystem({knowns,target=null}){return solveReachable({knowns,target,constants});}
export function discoverSolvableQuantities({knowns}){return findReachableTargets({knowns,constants});}
export function usePhysicsTool(name,input){return runPhysicsTool(name,input);}
export function availablePhysicsTools(){return Object.keys(physicsTools);}
