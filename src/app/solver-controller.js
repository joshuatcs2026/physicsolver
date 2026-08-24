import { EQUATIONS } from '../data/equations/registry.js';
import { VARIABLES, createVariableIndex } from '../data/variables/registry.js';
import { CONSTANTS, createConstantIndex } from '../data/constants/registry.js';
import { normalizeKnowns, findDirectCandidates, rankCandidates } from '../engine/solver/direct-solver.js';
import { findSolvePaths, selectShortestPath, alternativePaths } from '../engine/solver/pathfinder.js';
import { executeSolvePath } from '../engine/solver/path-executor.js';
import { solveKnownSystem, listSupportedEvaluators } from '../engine/solver/equation-system.js';
const variableIndex=createVariableIndex(VARIABLES),constants=createConstantIndex(CONSTANTS);
export function analyzeProblem({knowns:rawKnowns,target,text='',domains=[],maxDepth=8}){
 const knowns=normalizeKnowns(rawKnowns,variableIndex);
 if(knowns.has(target))return{status:'solved',message:'Target is already supplied as a known value.',result:knowns.get(target).value,unit:knowns.get(target).unit,trace:[]};
 const generic=solveKnownSystem({knowns:Object.fromEntries([...knowns].map(([id,x])=>[id,x.value])),target});
 if(generic.targetReached){const step=generic.steps.at(-1);const unit=variableIndex.byId.get(target)?.commonUnits?.[0]||null;return{status:'solved',result:generic.values[target],unit,trace:generic.steps.map(s=>({...s,targetName:variableIndex.byId.get(s.target)?.name||s.target,expression:EQUATIONS.find(e=>e.id===s.equationId)?.expression||''})),mode:'iterative',path:{steps:generic.steps,equationCount:generic.steps.length,dependencyDepth:Math.max(1,...generic.steps.map(s=>s.pass+1))},alternatives:[]};}
 const direct=rankCandidates(findDirectCandidates(target,EQUATIONS,knowns,constants),target,{text,domains});
 if(direct.length){try{const path={steps:[{equationId:direct[0].equation.id,target,dependencies:direct[0].equation.targetMap[target]}],equationCount:1,dependencyDepth:1};const execution=executeSolvePath({path,equations:EQUATIONS,knowns,constants,variableIndex});return{...execution,mode:'direct',path,alternatives:direct.slice(1).map(x=>x.equation.id)};}catch(error){return{status:'blocked',message:`Candidate equation exists but its evaluator is not implemented yet: ${error.message}`,supportedEvaluators:listSupportedEvaluators()}}}
 const search=findSolvePaths({target,equations:EQUATIONS,knownIds:new Set(knowns.keys()),maxDepth});const shortest=selectShortestPath(search);if(!shortest)return{status:'blocked',message:'No valid dependency path reaches the requested target.',blocked:search.blocked,alternatives:[]};try{const execution=executeSolvePath({path:shortest,equations:EQUATIONS,knowns,constants,variableIndex});return{...execution,mode:'dependency',path:shortest,alternatives:alternativePaths(search),blocked:search.blocked};}catch(error){return{status:'blocked',message:`A dependency path was found, but one or more equation evaluators are not implemented: ${error.message}`,path:shortest,alternatives:alternativePaths(search),blocked:search.blocked};}
}
